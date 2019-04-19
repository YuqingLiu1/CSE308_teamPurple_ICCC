package com.teampurple.iccc.controllers;

import com.mongodb.MongoException;
import com.teampurple.iccc.models.*;
import com.teampurple.iccc.repositories.GeneralBaseRepository;
import com.teampurple.iccc.repositories.UserRepository;
import com.teampurple.iccc.utils.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

public class LikeController {
//    @Autowired
//    private GeneralBaseRepository generalBases;
//    @PostMapping("/like")
//    public String getCurrentLikeState(@RequestBody String generalBaseID){
//        GeneralBase generalBase = generalBases.findById(generalBaseID).get();
//
//        return
//    }
}
