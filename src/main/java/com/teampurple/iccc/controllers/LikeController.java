package com.teampurple.iccc.controllers;

import com.mongodb.MongoException;
import com.teampurple.iccc.models.*;
import com.teampurple.iccc.repositories.GeneralBaseRepository;
import com.teampurple.iccc.repositories.UserRepository;
import com.teampurple.iccc.utils.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
public class LikeController {
    @Autowired
    private GeneralBaseRepository generalBases;
    @Autowired
    private Authentication auth;

    @Autowired
    private UserRepository users;

    @GetMapping("/liked")
    public String getCurrentLikeState(@RequestParam(value="id") String generalBaseID) {
        GeneralBase generalBase = generalBases.findById(generalBaseID).get();
        User currentUser = auth.getCurrentUser();
        ArrayList<String> likedusers = generalBase.getLikers();
        for (int i = 0; i < likedusers.size(); i++) {
            if (likedusers.get(i).equals(currentUser.getGeneralBaseRef())) {
                return "True";
            }
        }
        return "False";
    }

    @GetMapping("/clicklike")
    public Response clickLike(@RequestParam(value="id") String generalBaseID) {
        try {
            GeneralBase generalBase = generalBases.findById(generalBaseID).get();//The thing we're about to like
            User currentUser = auth.getCurrentUser();
            ArrayList<String> likers = generalBase.getLikers();//A list of generalbaseId's
            ArrayList<String> liked = currentUser.getLiked();
            for (int i = 0; i < likers.size(); i++) {
                if (likers.get(i).equals(currentUser.getGeneralBaseRef())) {
                    likers.remove(i);
                    generalBase.setLikers(likers);
                    generalBases.save(generalBase);
                    //System.out.println("Remove");
                    liked.remove(currentUser.getGeneralBaseRef());
                    currentUser.setLiked(liked);
                    users.save(currentUser);
                    return new Response(Response.OK);
                }
            }
            likers.add(currentUser.getGeneralBaseRef());
            generalBase.setLikers(likers);
            generalBases.save(generalBase);
            liked.add(currentUser.getGeneralBaseRef());
            currentUser.setLiked(liked);
            users.save(currentUser);
            //System.out.println("add");
            return new Response(Response.OK);
        }catch (Exception e ){
            return new Response(Response.ERROR);
        }
    }

    /**
     JSON.parse(await doFetch('/likeSeries?id=5cb935a77a7a5b5a319c4216', {method:'GET'}))
     {"title":"Suri's Series1"}

     */
    @GetMapping("/likeSeries")
    public Response likeSeries(@RequestParam(value="id") String generalBaseID){
        System.out.println("generalBaseId: " + generalBaseID);
        try{
            //System.out.println("in here");
            GeneralBase generalBase = generalBases.findById(generalBaseID).get();
            //System.out.println("generalBase: " + generalBase);
            User currentUser = auth.getCurrentUser();
            //System.out.println("current User: " + currentUser);
            ArrayList<String> likers = generalBase.getLikers();
            //System.out.println("likers before liking: " + likers);
            ArrayList<String> userLiked = currentUser.getLiked();
            for (int i = 0; i < likers.size(); i++){
                //System.out.println("current user id: " + currentUser.getId());
                if (likers.get(i).equals(currentUser.getId())){
                    System.out.println("unlike");
                    likers.remove(i);
                    generalBase.setLikers(likers);
                    generalBases.save(generalBase);
                    //System.out.println("after deleting, likers are: " + generalBase.getLikers());

                    userLiked.remove(generalBaseID);
                    currentUser.setLiked(userLiked);
                    users.save(currentUser);
                    return new Response(Response.OK);
                }
            }

            System.out.println("like");
            likers.add(currentUser.getId());
            generalBase.setLikers(likers);
            generalBases.save(generalBase);
            //System.out.println("after adding, liker are: " + generalBase.getLikers());

            //content also added to user's liked
            userLiked.add(generalBaseID);
            currentUser.setLiked(userLiked);
            users.save(currentUser);


            return new Response(Response.OK);
        }catch(Exception e){
            return new Response(Response.ERROR);

        }

    }

    @GetMapping("/getNumlike")
    public String getNumber(){
        User user = auth.getCurrentUser();
        GeneralBase generalBase= generalBases.findById(user.getGeneralBaseRef()).get();
        Integer num = new Integer(generalBase.getLikers().size());
        return num.toString();
    }

    @GetMapping("/getNumlikes")
    public String getNumber(@RequestParam(value="id") String generalBaseID) {
        GeneralBase generalBase = generalBases.findById(generalBaseID).get();
        Integer num = new Integer(generalBase.getLikers().size());
        return num.toString();
    }
}

