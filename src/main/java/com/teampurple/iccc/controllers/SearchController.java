package com.teampurple.iccc.controllers;

import com.teampurple.iccc.models.*;
import com.teampurple.iccc.repositories.ContentBaseRepository;
import com.teampurple.iccc.repositories.GeneralBaseRepository;
import com.teampurple.iccc.repositories.SketchRepository;
import com.teampurple.iccc.repositories.UserRepository;
import com.teampurple.iccc.utils.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
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
    private MongoTemplate mongoTemplate;

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
     *   - in terms of categories, this endpoint could currently support queries such as "frames that I created with the
     *     word 'school' in their title/description"
     *   - DOES NOT return sketch data (aside from Sketch ID) for performance reasons
     *
     * Request params:
     *   - type: String (the type of content you want to see; either "User", "Series", "Episode", "Frame", "Content" for
     *           all content (note this would not include users), or "All" for everything (including users)
     *   - creator: String (User ID of the content creator that must be the author of the content returned; null
     *              if there is no restriction on who created the content),
     *   - searchText: String (the text to appear in the title/description of the content returned, or the
     *                 name/bio of the users returned)
     *   - likedBy: String (User ID of user that must have liked the returned users/content; null if it doesn't matter)
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
     *                       thumbnail: null,
     *                       data: null
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
     *                       thumbnail: null,
     *                       data: null
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

        // get the search criteria
        String type = category.getType();
        if (type == null) {
            return new Response(Response.ERROR, "Must specify type for search");
        }
        String creatorUserId = category.getCreator();
        String searchText = category.getSearchText();
        if (searchText != null) {
            searchText = searchText.trim();
        }
        String likedBy = category.getLikedBy();

        List<ContentBase> allContentBases = new ArrayList<>();
        List<GeneralBase> allGeneralBases = new ArrayList<>();

        // convenience lists
        List<String> allContentBaseIds = new ArrayList<>();
        List<String> allGeneralBaseIds = new ArrayList<>();

        // find the GeneralBases that match the search text/likedBy criteria
        if (searchText == null || searchText.length() == 0) {
            if (likedBy == null) {
                // match all GeneralBases
                allGeneralBases = generalBaseRepository.findAll();
            } else {
                // match GeneralBases based solely on likedBy criteria
                allGeneralBases = generalBaseRepository.findAllByLiked(likedBy);
            }
        } else {
            if (likedBy == null) {
                // only match GeneralBases that contain the given search text
                TextCriteria criteria = TextCriteria.forDefaultLanguage().matchingAny(searchText);
                allGeneralBases = generalBaseRepository.findAllBy(criteria);
            } else {
                // match GeneralBases based on both search text and liked by criteria
                TextCriteria textCriteria = TextCriteria.forDefaultLanguage().matchingAny(searchText);
                Query query = Query.query(Criteria.where("likers").is(likedBy)).addCriteria(textCriteria);
                allGeneralBases = mongoTemplate.find(query, GeneralBase.class);
            }
        }

        // find the ContentBases that match the query
        switch (type) {
            case ContentBase.SERIES:
            case ContentBase.EPISODE:
            case ContentBase.FRAME:
                if (creatorUserId != null) {
                    // search for content by a specific user

                    // get all the public content of the specified type from the specified user
                    allContentBases = contentBaseRepository.findByPublicAndTypeAndAuthor(true, type, creatorUserId);
                    if (loggedIn && currentUser.getId().equals(creatorUserId)) {
                        // if user is logged in and they request to see their own content then they get to see
                        // their own private content as well
                        allContentBases.addAll(contentBaseRepository.findByPublicAndTypeAndAuthor(false, type, creatorUserId));
                    }
                } else {
                    // search for content regardless of who created it

                    // get all the public content of the specified type from all users
                    allContentBases = contentBaseRepository.findByPublicAndType(true, type);
                    if (loggedIn) {
                        // if user is logged in then they get to see their own private content as well
                        allContentBases.addAll(contentBaseRepository.findByPublicAndTypeAndAuthor(false, type, currentUser.getId()));
                    }
                }
                break;
            case NewCategoryItem.CONTENT_TYPE:
            case NewCategoryItem.ALL_TYPE:
                // search for all types of content (but not users)
                if (creatorUserId != null) {
                    // get all the public content from the specified user
                    allContentBases = contentBaseRepository.findByPublicAndAuthor(true, creatorUserId);
                    if (loggedIn && currentUser.getId().equals(creatorUserId)) {
                        // if the creator is the current logged in user, then even their private content is "visible"
                        allContentBases.addAll(contentBaseRepository.findByPublicAndAuthor(false, creatorUserId));
                    }
                } else {
                    // look for all content regardless of who created it
                    allContentBases = contentBaseRepository.findByPublic(true);
                    if (loggedIn) {
                        // if user is logged in then they get to see their own private content as well
                        allContentBases.addAll(contentBaseRepository.findByPublicAndAuthor(false, currentUser.getId()));
                    }
                }
                break;
            case GeneralBase.USER_TYPE:
                break;
            default:
                return new Response(Response.ERROR, "Invalid search type: " + type);
        }

        // populate the convenience lists
        for (GeneralBase generalBase : allGeneralBases) {
            allGeneralBaseIds.add(generalBase.getId());
        }
        for (ContentBase contentBase : allContentBases) {
            allContentBaseIds.add(contentBase.getId());
        }

        // now that we have all the GeneralBases and all the ContentBases, filter out only the pairs that we actually want
        switch (type) {
            case ContentBase.SERIES:
            case ContentBase.EPISODE:
            case ContentBase.FRAME:
            case NewCategoryItem.CONTENT_TYPE:
                // in the case that we're just searching for content, we just want all ContentBases that have a
                // matching GeneralBase
                List<ContentBase> contentBaseTmp = new ArrayList<>();
                for (ContentBase contentBase : allContentBases) {
                    if (allGeneralBaseIds.contains(contentBase.getGeneralBaseRef())) {
                        contentBaseTmp.add(contentBase);
                    }
                }
                allContentBases = contentBaseTmp;

                // recalculate the convenience list for ContentBase IDs
                allContentBaseIds.clear();
                for (ContentBase contentBase : allContentBases) {
                    allContentBaseIds.add(contentBase.getId());
                }

                // filter out any GeneralBases that don't have a matching ContentBase
                List<GeneralBase> generalBaseTmp = new ArrayList<>();
                for (GeneralBase generalBase : allGeneralBases) {
                    if (allContentBaseIds.contains(generalBase.getTypeRef())) {
                        generalBaseTmp.add(generalBase);
                    }
                }
                allGeneralBases = generalBaseTmp;
                break;
            case GeneralBase.USER_TYPE:
                // in the case that we're searching just for users, we can get rid of all GeneralBases that don't
                // correspond to users
                generalBaseTmp = new ArrayList<>();
                for (GeneralBase generalBase : allGeneralBases) {
                    if (generalBase.getType().equals(GeneralBase.USER_TYPE)) {
                        generalBaseTmp.add(generalBase);
                    }
                }
                allGeneralBases = generalBaseTmp;
                break;
            case NewCategoryItem.ALL_TYPE:
                // in the case that we're searching for everything (users and content), we still need to filter out
                // the ContentBases that don't have matching GeneralBases, but we can keep GeneralBases even if they
                // don't have a matching ContentBase as long as they are for users
                contentBaseTmp = new ArrayList<>();
                for (ContentBase contentBase : allContentBases) {
                    if (allGeneralBaseIds.contains(contentBase.getGeneralBaseRef())) {
                        contentBaseTmp.add(contentBase);
                    }
                }
                allContentBases = contentBaseTmp;

                // recalculate the convenience list for ContentBase Ids
                allContentBaseIds.clear();
                for (ContentBase contentBase : allContentBases) {
                    allContentBaseIds.add(contentBase.getId());
                }

                // filter out GeneralBases that don't have matching ContentBases or are not for users
                generalBaseTmp = new ArrayList<>();
                for (GeneralBase generalBase : allGeneralBases) {
                    if (generalBase.getType().equals(GeneralBase.USER_TYPE) || allContentBaseIds.contains(generalBase.getTypeRef())) {
                        generalBaseTmp.add(generalBase);
                    }
                }
                allGeneralBases = generalBaseTmp;
                break;
            default:
                return new Response(Response.ERROR, "Invalid search type: " + type);
        }

        // populate the full AggregateInfo items and filter them into the appropriate type of content
        List<AggregateInfo> aggregateInfoItems = new ArrayList<>();
        for (GeneralBase generalBase : allGeneralBases) {
            AggregateInfo aggregateInfoItem = new AggregateInfo();
            aggregateInfoItem.setGeneralBase(generalBase);
            aggregateInfoItems.add(aggregateInfoItem);
        }
        for (AggregateInfo aggregateInfo : aggregateInfoItems) {
            GeneralBase generalBase = aggregateInfo.getGeneralBase();
            if (generalBase == null) {
                return new Response(Response.ERROR, "Found AggregateInfo with no GeneralBase");
            }

            // collect the Sketch for this GeneralBase
            Optional<Sketch> sketchOptional = sketchRepository.findByIdAndExcludeAllData(generalBase.getSketch());
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

        // return the results that were found
        return new Response(Response.OK, searchResult);
    }

}
