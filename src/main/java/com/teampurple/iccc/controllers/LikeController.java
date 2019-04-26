package com.teampurple.iccc.controllers;

import com.mongodb.MongoException;
import com.teampurple.iccc.models.*;
import com.teampurple.iccc.repositories.GeneralBaseRepository;
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

    @GetMapping("/liked")
    public String getCurrentLikeState(@RequestParam(value="id") String generalBaseID) {
        GeneralBase generalBase = generalBases.findById(generalBaseID).get();
        User currentUser = auth.getCurrentUser();
        ArrayList<String> likedusers = generalBase.getLikers();
        for (int i = 0; i < likedusers.size(); i++) {
            if (likedusers.get(i).equals(currentUser.getId())) {
                return "True";
            }
        }
        return "False";
    }

    @GetMapping("/clicklike")
    public Response clickLike(@RequestParam(value="id") String generalBaseID) {
        try {
            GeneralBase generalBase = generalBases.findById(generalBaseID).get();
            User currentUser = auth.getCurrentUser();
            ArrayList<String> likedusers = generalBase.getLikers();
            for (int i = 0; i < likedusers.size(); i++) {
                if (likedusers.get(i).equals(currentUser.getId())) {
                    likedusers.remove(i);
                    return new Response(Response.OK);
                }
            }
            likedusers.add(generalBaseID);
            return new Response(Response.OK);
        }catch (Exception e ){
            return new Response(Response.ERROR);
        }
    }

    /**
     JSON.parse(await doFetch('/likeSeries?id=5cc261da1c9d4400005308be', {method:'GET'}))
     {"title":"Suri's Series1"}

     */
    @GetMapping("/likeSeries")
    public Response likeSeries(@RequestParam(value="id") String generalBaseID){
        System.out.println("generalBaseId: " + generalBaseID);
        try{
            System.out.println("in here");
            GeneralBase generalBase = generalBases.findById(generalBaseID).get();
            System.out.println("generalBase: " + generalBase);
            User currentUser = auth.getCurrentUser();
            System.out.println("current User: " + currentUser);
            ArrayList<String> likers = generalBase.getLikers();
            System.out.println("likers before liking: " + likers);
            for (int i = 0; i < likers.size(); i++){
                System.out.println("current user id: " + currentUser.getId());
                if (likers.get(i).equals(currentUser.getId())){
                    System.out.println("unlike");
                    likers.remove(i);
                    currentUser.getLiked().remove(generalBaseID);
                    return new Response(Response.OK);
                }
            }
            System.out.println("like");
            likers.add(currentUser.getId());
            currentUser.getLiked().add(generalBaseID);
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

