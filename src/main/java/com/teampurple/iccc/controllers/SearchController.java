package com.teampurple.iccc.controllers;

import com.teampurple.iccc.models.*;
import com.teampurple.iccc.repositories.ContentBaseRepository;
import com.teampurple.iccc.repositories.GeneralBaseRepository;
import com.teampurple.iccc.repositories.SketchRepository;
import com.teampurple.iccc.repositories.UserRepository;
import com.teampurple.iccc.utils.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.TextCriteria;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
public class SearchController {

    @Autowired
    private GeneralBaseRepository generalBaseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ContentBaseRepository contentBaseRepository;

    @Autowired
    private SketchRepository sketchRepository;

    @Autowired
    private Authentication authentication;

    /**
     * Description:
     *   - search for users/content according to a given category
     *   - will only return "visible" results, i.e. public author profiles, public content, and, if the user is logged
     *     in, content belonging to that user
     *
     * Request params:
     *   - type: String (the type of content you want to see; either "User", "Series", "Episode", "Frame", or
     *           null for all content (note this would not include users),
     *   - creator: String (User ID of the content creator that must be the author of the content returned; null
     *              if there is no restriction on who created the content),
     *   - searchText: String (the text to appear in the title/description of the content returned, or the
     *                 name/bio of the users returned)
     *
     * Returns:
     *   - status: String ('OK' or 'error')
     *   - content (if status is 'OK'):
     *       {
     *           users: [
     *             {
     *                 type: String ("User"),
     *                 generalBase:
     *                   {
     *                       id: String (GeneralBase ID of this GeneralBase),
     *                       typeRef: String (User ID of the User for this GeneralBase),
     *                       type: String ("User"),
     *                       sketch: String (Sketch ID of the Sketch for this GeneralBase),
     *                       title: String (username of this user),
     *                       description: String (bio of this user),
     *                       dateCreated: String (ISO 8601 datetime of when this user was created),
     *                       dateLastEdited: String (ISO 8601 datetime of when this user was last edited),
     *                       children: [ array of ContentBase IDs for this user's series ],
     *                       likers: [ array of User IDs of users who have liked this user ],
     *                       comments: [ array of Comment IDs of this user's comments ]
     *                   },
     *                 contentBase: null,
     *                 user:
     *                   {
     *                       id: String (User ID of this User),
     *                       generalBaseRef: String (GeneralBase ID of this user),
     *                       email: String (email of this user),
     *                       password: String (hashed password of this user),
     *                       liked: [ array of GeneralBase IDs of things this user has liked ],
     *                       userCategories: [ array of Category IDs for categories on this user's profile page ],
     *                       homeCategories: [ array of Category IDs for categories on this user's home page ]
     *                   },
     *                 sketch:
     *                   {
     *                       id: String (Sketch ID of this user's sketch),
     *                       thumbnail: String (base 64 encoded image data of this user's sketch),
     *                       data: String (JSON stringified image data for this user's sketch)
     *                   }
     *             }, ...
     *           ],
     *           series: [
     *             {
     *                 type: String ("Series"),
     *                 generalBase:
     *                   {
     *                       id: String (GeneralBase ID of this GeneralBase),
     *                       typeRef: String (ContentBase ID of the ContentBase for this GeneralBase),
     *                       type: String ("ContentBase"),
     *                       sketch: String (Sketch ID of the Sketch for this GeneralBase),
     *                       title: String (title of this series),
     *                       description: String (description of this series),
     *                       dateCreated: String (ISO 8601 datetime of when this series was created),
     *                       dateLastEdited: String (ISO 8601 datetime of when this series was last edited,
     *                       children: [ array of ContentBase IDs for this series' episodes ],
     *                       likers: [ array of User IDs of users who have liked this series ],
     *                       comments: [ array of Comment IDs of this series' comments ]
     *                   },
     *                 contentBase:
     *                   {
     *                       id: String (ContentBase ID of this ContentBase),
     *                       generalBaseRef: String (GeneralBase ID of the GeneralBase for this ContentBase),
     *                       author: String (User ID of the author of this series),
     *                       type: String ("Series"),
     *                       contributable: Boolean (whether users other than the author can add episodes to this series),
     *                       public: Boolean (whether users other than the author can view this series),
     *                       parents:
     *                         {
     *                             user: String (User ID of the author of this series),
     *                             series: null,
     *                             episode: null,
     *                             frame: null
     *                         },
     *                       dateMadeContributable: String (ISO 8601 datetime of when this series was made contributable),
     *                       dateMadePublic: String (ISO 8601 datetime of when this series was made public)
     *                   },
     *                 user: null,
     *                 sketch:
     *                   {
     *                       id: String (Sketch ID of this series' sketch),
     *                       thumbnail: String (base 64 encoded image data of this series' sketch),
     *                       data: String (JSON stringified image data for this series' sketch)
     *                   }
     *             }
     *           ],
     *           episodes: [ array of objects like in series, but for episodes ],
     *           frames: [ array of objects like in series, but for frames ]
     *       }
     */
    @PostMapping("/search")
    public Response search(@RequestBody Category category) {
        // determine if the current user is logged in
        User currentUser = authentication.getCurrentUser();
        boolean loggedIn = true;
        if (currentUser == null) {
            loggedIn = false;
        }

        if (category.getType() == null && category.getCreator() == null) {
            // for now this means a general search from the search bar is being performed, e.g. not from a category
            String searchText = category.getSearchText().trim();
            if (searchText.length() == 0) {
                return new Response(Response.ERROR, "Can't search for empty string");
            }
            TextCriteria criteria = TextCriteria.forDefaultLanguage().matchingAny(searchText);

            // get all the GeneralBases that match the search
            List<GeneralBase> allGeneralBases = generalBaseRepository.findAllBy(criteria);

            // create the empty search result to populate and return
            List<AggregateInfo> users = new ArrayList<>();
            List<AggregateInfo> series = new ArrayList<>();
            List<AggregateInfo> episodes = new ArrayList<>();
            List<AggregateInfo> frames = new ArrayList<>();
            SearchResult searchResult = new SearchResult();
            searchResult.setUsers(users);
            searchResult.setSeries(series);
            searchResult.setEpisodes(episodes);
            searchResult.setFrames(frames);

            // create the AggregateInfo items for each search result
            List<AggregateInfo> aggregateInfoItems = new ArrayList<>();
            for (GeneralBase generalBase : allGeneralBases) {
                AggregateInfo aggregateInfo = new AggregateInfo();
                aggregateInfo.setGeneralBase(generalBase);
                aggregateInfoItems.add(aggregateInfo);
            }
            for (AggregateInfo aggregateInfo : aggregateInfoItems) {
                GeneralBase generalBase = aggregateInfo.getGeneralBase();
                if (generalBase == null) {
                    return new Response(Response.ERROR, "Found AggregateInfo with no GeneralBase");
                }

                // collect the Sketch for this GeneralBase
                Optional<Sketch> sketchOptional = sketchRepository.findById(generalBase.getSketch());
                if (!sketchOptional.isPresent()) {
                    return new Response(Response.ERROR, "Could not find Sketch for GeneralBase");
                }
                Sketch sketch = sketchOptional.get();
                aggregateInfo.setSketch(sketch);

                // collect the User or ContentBase for this GeneralBase
                String aggregateInfoType = generalBase.getType();
                if (aggregateInfoType.equals(GeneralBase.USER_TYPE)) {
                    // collect the User for this GeneralBase
                    Optional<User> userOptional = userRepository.findById(generalBase.getTypeRef());
                    if (!userOptional.isPresent()) {
                        return new Response(Response.ERROR, "Could not find User for GeneralBase");
                    }
                    User user = userOptional.get();
                    aggregateInfo.setUser(user);
                    aggregateInfo.setType(GeneralBase.USER_TYPE);
                } else if (aggregateInfoType.equals(GeneralBase.CONTENT_BASE_TYPE)) {
                    // collect the ContentBase for this GeneralBase
                    Optional<ContentBase> contentBaseOptional = contentBaseRepository.findById(generalBase.getTypeRef());
                    if (!contentBaseOptional.isPresent()) {
                        return new Response(Response.ERROR, "Could not find ContentBase for GeneralBase");
                    }
                    ContentBase contentBase = contentBaseOptional.get();
                    aggregateInfo.setContentBase(contentBase);
                    aggregateInfo.setType(contentBase.getType());
                }

                // split the AggregateInfo into User, Series, Episode, or Frame and filter out any content that is not
                // "visible" to the current user
                switch (aggregateInfo.getType()) {
                    case GeneralBase.USER_TYPE:
                        users.add(aggregateInfo);
                        break;
                    case ContentBase.SERIES:
                        if (aggregateInfo.getContentBase().getPublic() ||
                                (loggedIn && aggregateInfo.getContentBase().getAuthor().equals(currentUser.getId()))) {
                            series.add(aggregateInfo);
                        }
                        break;
                    case ContentBase.EPISODE:
                        if (aggregateInfo.getContentBase().getPublic() ||
                                (loggedIn && aggregateInfo.getContentBase().getAuthor().equals(currentUser.getId()))) {
                            episodes.add(aggregateInfo);
                        }
                        break;
                    case ContentBase.FRAME:
                        if (aggregateInfo.getContentBase().getPublic() ||
                                (loggedIn && aggregateInfo.getContentBase().getAuthor().equals(currentUser.getId()))) {
                            frames.add(aggregateInfo);
                        }
                        break;
                    default:
                        return new Response(Response.ERROR, "Found invalid AggregateInfo type: " + aggregateInfo.getType());
                }
            }

            return new Response(Response.OK, searchResult);
        }


        return new Response(Response.ERROR);   // dummy return
    }

}
