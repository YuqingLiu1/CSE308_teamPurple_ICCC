package com.teampurple.iccc.controllers;

import com.teampurple.iccc.models.*;
import com.teampurple.iccc.repositories.ContentBaseRepository;
import com.teampurple.iccc.repositories.GeneralBaseRepository;
import com.teampurple.iccc.repositories.SketchRepository;
import com.teampurple.iccc.repositories.UserRepository;
import com.teampurple.iccc.utils.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
public class LikeController {
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
     *   - determine if the current logged in user likes a specified GeneralBase
     *   - must be logged in
     *
     * Request Params:
     *   - id: String (GeneralBase ID of specified GeneralBase)
     *
     * Returns:
     *   - status: String ('OK' or 'error')
     *   - content (if status is 'OK'):
     *       {
     *           generalBaseId: String (GeneralBase ID of the specified GeneralBase),
     *           liked: Boolean (true if the current logged in user likes the specified GeneralBase, false otherwise)
     *       }
     */
    @GetMapping("/likes/likedByCurrentUser")
    public Response getCurrentLikeState(@RequestParam(value="id") final String generalBaseId) {
        try {
            Liked liked = new Liked();
            liked.setGeneralBaseId(generalBaseId);

            // make sure a GeneralBase ID has been specified
            if (generalBaseId == null) {
                throw new Exception("Must specify GeneralBase ID when determining if current user liked something.");
            }

            // make sure the user is currently logged in
            User currentUser = authentication.getCurrentUser();
            GeneralBase currentGeneralBase = authentication.getCurrentUserGeneralBase();
            if (currentUser == null || currentGeneralBase == null) {
                throw new Exception("Must be logged in to check if current user liked something.");
            }

            // make sure a GeneralBase with the specified GeneralBase ID exists
            Optional<GeneralBase> generalBaseOptional = generalBaseRepository.findById(generalBaseId);
            if (!generalBaseOptional.isPresent()) {
                throw new Exception("Failed to find GeneralBase with ID: " + generalBaseId + ".");
            }

            // check if the current logged in user likes the specified GeneralBase
            if (currentUser.getLiked().contains(generalBaseId)) {
                liked.setLiked(true);
            } else {
                liked.setLiked(false);
            }

            return new Response(Response.OK, liked);
        } catch (Exception e) {
            return new Response(Response.ERROR, e.toString());
        }
    }

    @GetMapping("/likes/everythingILike")
    public Response getCurrentLikes() {
        try {
            // make sure the user is currently logged in
            User currentUser = authentication.getCurrentUser();
            GeneralBase currentGeneralBase = authentication.getCurrentUserGeneralBase();
            if (currentUser == null || currentGeneralBase == null) {
                throw new Exception("Must be logged in to check if current user liked something.");
            }

            return new Response(Response.OK, currentUser.getLiked());
        } catch (Exception e) {
            return new Response(Response.ERROR, e.toString());
        }
    }

    /**
     * Description:
     *   - (un)subscribe to an author/series or (un)like a piece of content
     *   - must be logged in
     *   - automatically like/subscribe if currently not liked/subscribed, and vice versa if currently liked/subscribed
     *
     * Request Params:
     *   - generalBaseId: String (GeneralBase ID of the GeneralBase of the thing the current user is
     *                    (un)liking/(un)subscribing)
     *
     * Returns:
     *   - status: String ('OK' or 'error')
     *   - content (if status is 'error'): String (error message)
     */
    @GetMapping("/clicklike")
    public Response clickLike(@RequestParam("id") final String generalBaseId) {
        try {
            // make sure a GeneralBase ID has been specified
            if (generalBaseId == null) {
                throw new Exception("Must specify GeneralBase ID when liking/subscribing.");
            }

            // make sure the user is currently logged in
            User currentUser = authentication.getCurrentUser();
            GeneralBase currentGeneralBase = authentication.getCurrentUserGeneralBase();
            if (currentUser == null || currentGeneralBase == null) {
                throw new Exception("Must be logged in to like/subscribe.");
            }

            // make sure a GeneralBase with the specified GeneralBase ID exists
            Optional<GeneralBase> generalBaseOptional = generalBaseRepository.findById(generalBaseId);
            if (!generalBaseOptional.isPresent()) {
                throw new Exception("Failed to find GeneralBase with ID: " + generalBaseId + ".");
            }
            GeneralBase generalBase = generalBaseOptional.get();

            // (un)liking/(un)subscribing logic
            List<String> likerGeneralBaseIds = generalBase.getLikers();
            List<String> likedGeneralBaseIds = currentUser.getLiked();
            if (likedGeneralBaseIds.contains(generalBaseId)) {
                // the current user already liked/subscribed to the specified GeneralBase ID, so unlike/unsubscribe
                likedGeneralBaseIds.remove(generalBaseId);
                likerGeneralBaseIds.remove(currentGeneralBase.getId());
            } else {
                // the current user has not liked/subscribed to the specified GeneralBase ID, so like/subscribe
                likedGeneralBaseIds.add(generalBaseId);
                likerGeneralBaseIds.add(currentGeneralBase.getId());
            }

            // save changes
            generalBaseRepository.save(generalBase);
            userRepository.save(currentUser);

            return new Response(Response.OK);
        } catch (Exception e) {
            return new Response(Response.ERROR, e.toString());
        }
    }

    /**
     JSON.parse(await doFetch('/likeSeries?id=5cb935a77a7a5b5a319c4216', {method:'GET'}))

     */
    @GetMapping("/likeSeries")
    public Response likeSeries(@RequestParam(value="id") String generalBaseID) {
        try{
            GeneralBase generalBase = generalBaseRepository.findById(generalBaseID).get();
            User currentUser = authentication.getCurrentUser();
            List<String> likers = generalBase.getLikers();
            List<String> userLiked = currentUser.getLiked();
            for (int i = 0; i < likers.size(); i++){
                if (likers.get(i).equals(currentUser.getGeneralBaseRef())){
                    likers.remove(i);
                    generalBase.setLikers(likers);
                    generalBaseRepository.save(generalBase);

                    userLiked.remove(generalBaseID);
                    currentUser.setLiked(userLiked);
                    userRepository.save(currentUser);
                    return new Response(Response.OK);
                }
            }

            likers.add(currentUser.getGeneralBaseRef());
            generalBase.setLikers(likers);
            generalBaseRepository.save(generalBase);

            //content also added to user's liked
            userLiked.add(generalBaseID);
            currentUser.setLiked(userLiked);
            userRepository.save(currentUser);

            return new Response(Response.OK);
        }catch(Exception e){
            return new Response(Response.ERROR);

        }

    }

    /**
     * Description:
     *   - get the number of likes for a specified GeneralBase
     *
     * Request Params:
     *   - id: String (GeneralBase ID of the GeneralBase to get the number of likes of)
     *
     * Returns:
     *   - status: String ('OK' or 'error')
     *   - content (if status is 'OK'):
     *       {
     *           generalBaseId: String (GeneralBase ID of the specified GeneralBase),
     *           numLikes: Integer (number of likes for the specified GeneralBase)
     *       }
     */
    @GetMapping("/likes/count")
    public Response getNumber(@RequestParam("id") final String generalBaseId) {
        try {
            LikeCount likeCount = new LikeCount();
            likeCount.setGeneralBaseId(generalBaseId);

            // make sure there is a specified GeneralBase ID and that it is valid
            if (generalBaseId == null) {
                throw new Exception("Must provide a GeneralBase ID when getting number of likes.");
            }
            Optional<GeneralBase> generalBaseOptional = generalBaseRepository.findById(generalBaseId);
            if (!generalBaseOptional.isPresent()) {
                throw new Exception("Failed to find GeneralBase with ID: " + generalBaseId + ".");
            }
            GeneralBase generalBase = generalBaseOptional.get();

            // get the number of likes for the specified GeneralBase
            int numLikes = generalBase.getLikers().size();
            likeCount.setNumLikes(numLikes);

            return new Response(Response.OK, likeCount);
        } catch (Exception e) {
            return new Response(Response.ERROR, e.toString());
        }
    }

    @GetMapping("/likes/GetlikedItem")
    public Response getlikedItem(@RequestParam("type") String type){
        try {
            User currentUser = authentication.getCurrentUser();
            List<String> userLiked = currentUser.getLiked();
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

            for (int i=0;i<userLiked.size();i++) {
                GeneralBase item = generalBaseRepository.findById(userLiked.get(i)).get();
                AggregateInfo aggregateInfo = new AggregateInfo();
                if (type.equals("All")) {
                    aggregateInfo.setGeneralBase(item);
                    if (item.getType().equals(GeneralBase.USER_TYPE)) {
                        User user = userRepository.findById(item.getTypeRef()).get();
                        aggregateInfo.setType(GeneralBase.USER_TYPE);
                        aggregateInfo.setContentBase(null);
                        aggregateInfo.setUser(user);
                        aggregateInfo.setSketch(sketchRepository.findById(item.getSketch()).get());
                    } else {
                        ContentBase content = contentBaseRepository.findById(item.getTypeRef()).get();
                        aggregateInfo.setType(content.getType());
                        aggregateInfo.setContentBase(content);
                        aggregateInfo.setUser(null);
                        aggregateInfo.setSketch(sketchRepository.findById(item.getSketch()).get());

                    }
                    switch (aggregateInfo.getType()) {
                        case GeneralBase.USER_TYPE:
                            users.add(aggregateInfo);
                            break;
                        case ContentBase.SERIES:
                            series.add(aggregateInfo);
                            break;
                        case ContentBase.EPISODE:
                            episodes.add(aggregateInfo);
                            break;
                        case ContentBase.FRAME:
                            frames.add(aggregateInfo);
                            break;
                    }
                } else if (type.equals("User")) {
                    if (item.getType().equals(GeneralBase.USER_TYPE)) {
                        aggregateInfo.setGeneralBase(item);
                        User user = userRepository.findById(item.getTypeRef()).get();
                        aggregateInfo.setType(GeneralBase.USER_TYPE);
                        aggregateInfo.setContentBase(null);
                        aggregateInfo.setUser(user);
                        aggregateInfo.setSketch(sketchRepository.findById(item.getSketch()).get());
                        users.add(aggregateInfo);
                    }
                } else if (type.equals("Content")) {
                    if (!item.getType().equals(GeneralBase.USER_TYPE)) {
                        aggregateInfo.setGeneralBase(item);
                        ContentBase content = contentBaseRepository.findById(item.getTypeRef()).get();
                        aggregateInfo.setType(content.getType());
                        aggregateInfo.setContentBase(content);
                        aggregateInfo.setUser(null);
                        aggregateInfo.setSketch(sketchRepository.findById(item.getSketch()).get());
                        switch (aggregateInfo.getType()) {
                            case ContentBase.SERIES:
                                series.add(aggregateInfo);
                                break;
                            case ContentBase.EPISODE:
                                episodes.add(aggregateInfo);
                                break;
                            case ContentBase.FRAME:
                                frames.add(aggregateInfo);
                                break;
                        }
                    }
                } else if (type.equals("Series")) {
                    if (!item.getType().equals(GeneralBase.USER_TYPE)) {
                        ContentBase content = contentBaseRepository.findById(item.getTypeRef()).get();
                        if (content.getType().equals(ContentBase.SERIES)) {
                            aggregateInfo.setGeneralBase(item);
                            aggregateInfo.setType(content.getType());
                            aggregateInfo.setContentBase(content);
                            aggregateInfo.setUser(null);
                            aggregateInfo.setSketch(sketchRepository.findById(item.getSketch()).get());
                            series.add(aggregateInfo);
                        }
                    } else if (type.equals("Episode")) {
                        if (!item.getType().equals(GeneralBase.USER_TYPE)) {
                            ContentBase content = contentBaseRepository.findById(item.getTypeRef()).get();
                            if (content.getType().equals(ContentBase.EPISODE)) {
                                aggregateInfo.setGeneralBase(item);
                                aggregateInfo.setType(content.getType());
                                aggregateInfo.setContentBase(content);
                                aggregateInfo.setUser(null);
                                aggregateInfo.setSketch(sketchRepository.findById(item.getSketch()).get());
                                episodes.add(aggregateInfo);

                            }
                        }
                    } else if (type.equals("Frame")) {
                        if (!item.getType().equals(GeneralBase.USER_TYPE)) {
                            ContentBase content = contentBaseRepository.findById(item.getTypeRef()).get();
                            if (content.getType().equals(ContentBase.FRAME)) {
                                aggregateInfo.setGeneralBase(item);
                                aggregateInfo.setType(content.getType());
                                aggregateInfo.setContentBase(content);
                                aggregateInfo.setUser(null);
                                aggregateInfo.setSketch(sketchRepository.findById(item.getSketch()).get());
                                frames.add(aggregateInfo);
                            }
                        }
                    }
                }
            }
            System.out.println(searchResult.toString());
            return new Response(Response.OK, searchResult);
        }catch (Exception e){
            return new Response(Response.ERROR, e.toString());
        }
    }
    @GetMapping("/recommendation")
    public Response recommendation(){
        try {
            User currentUser = authentication.getCurrentUser();
            List<String> userLiked = currentUser.getLiked();
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

            for (int i=0;i<userLiked.size();i++){
                GeneralBase item = generalBaseRepository.findById(userLiked.get(i)).get();
                if (item.getType().equals(GeneralBase.USER_TYPE)){
                    User user = userRepository.findById(item.getTypeRef()).get();
                    List<String> recommendContent=user.getContent();
                    for (int j=0;j<recommendContent.size();j++){
                        ContentBase content = contentBaseRepository.findById(recommendContent.get(j)).get();
                        GeneralBase contentbase = generalBaseRepository.findById(content.getGeneralBaseRef()).get();
                        AggregateInfo aggregateInfo = new AggregateInfo();
                        aggregateInfo.setGeneralBase(item);
                        aggregateInfo.setType(content.getType());
                        aggregateInfo.setContentBase(content);
                        aggregateInfo.setUser(user);
                        aggregateInfo.setSketch(sketchRepository.findById(contentbase.getSketch()).get());
                        switch (aggregateInfo.getType()) {
                            case ContentBase.SERIES:
                                series.add(aggregateInfo);
                                break;
                            case ContentBase.EPISODE:
                                episodes.add(aggregateInfo);
                                break;
                            case ContentBase.FRAME:
                                frames.add(aggregateInfo);
                                break;
                            default:
                                return new Response(Response.ERROR, "Found invalid AggregateInfo type: " + aggregateInfo.getType());
                        }
                    }
                }
            }
            return new Response(Response.OK, searchResult);
        }catch (Exception e){
            return new Response(Response.ERROR, e.toString());
        }
    }
}

