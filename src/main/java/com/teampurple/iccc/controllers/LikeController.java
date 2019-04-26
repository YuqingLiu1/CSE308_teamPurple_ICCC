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
            GeneralBase generalBase = generalBases.findById(generalBaseID).get();//The thing we're about to like
            User currentUser = auth.getCurrentUser();
            ArrayList<String> likedusers = generalBase.getLikers();//A list of generalbaseId's
            for (int i = 0; i < likedusers.size(); i++) {
                if (likedusers.get(i).equals(currentUser.getGeneralBaseRef())) {
                    likedusers.remove(i);
                    generalBase.setLikers(likedusers);
                    generalBases.save(generalBase);
                    //System.out.println("Remove");
                    return new Response(Response.OK);
                }
            }
            likedusers.add(generalBaseID);
            generalBase.setLikers(likedusers);
            generalBases.save(generalBase);
            //System.out.println("add");
            return new Response(Response.OK);
        }catch (Exception e ){
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

