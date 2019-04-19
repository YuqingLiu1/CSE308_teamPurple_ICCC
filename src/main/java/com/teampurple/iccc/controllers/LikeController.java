package com.teampurple.iccc.controllers;

import com.mongodb.MongoException;
import com.teampurple.iccc.models.*;
import com.teampurple.iccc.repositories.GeneralBaseRepository;
import com.teampurple.iccc.utils.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

public class LikeController {
    @Autowired
    private GeneralBaseRepository generalBases;
    @Autowired
    private Authentication auth;

    @GetMapping("/liked")
    public String getCurrentLikeState(@RequestBody String generalBaseID) {
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

    @PostMapping("/clicklike")
    public Response clickLike(@RequestBody String generalBaseID) {
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

    @PostMapping("/getNumlikes")
    public String getNumber(@RequestBody String generalBaseID){
        GeneralBase generalBase = generalBases.findById(generalBaseID).get();
        Integer num = new Integer(generalBase.getLikers().size());
        return num.toString();
    }
}

