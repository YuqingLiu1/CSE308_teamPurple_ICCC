package com.teampurple.iccc.controllers;

import com.mongodb.MongoException;
import com.teampurple.iccc.models.*;
import com.teampurple.iccc.repositories.GeneralBaseRepository;
import com.teampurple.iccc.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserAccountController {

    @Autowired
    private UserRepository users;
    @Autowired
    private GeneralBaseRepository generalbase;

    @GetMapping("/user/info")
    public Response getUserInfo() {
        User currentUser = getCurrentUser();

        if (currentUser == null) {
            return new Response(Response.ERROR);
        }

        GeneralBase currentGeneralBase = generalbase.findById(currentUser.getGeneralBaseRef()).get();

        UserInfo userInfo = new UserInfo(currentGeneralBase.getTitle(),
                currentGeneralBase.getDescription(), currentUser.getEmail(), currentUser.getPassword());

        return new Response(Response.OK, userInfo);
    }

    @PostMapping("/user/edit")
    public Response editUserInfo(@RequestBody UserInfo userInfo) {
        User currentUser = getCurrentUser();
        GeneralBase currentGeneralBase = generalbase.findById(currentUser.getGeneralBaseRef()).get();
        if (currentUser == null || currentGeneralBase == null) {
            return new Response("error");
        }

        // only change the appropriate properties
        String username = userInfo.getUsername();
        String password = userInfo.getPassword();
        String email = userInfo.getEmail();
        String bio = userInfo.getBio();
        if (username != null) {
            currentGeneralBase.setTitle(username);
        }
        if (password != null) {
            currentUser.setPassword(new BCryptPasswordEncoder().encode(password));
        }
        if (email != null) {
            currentUser.setEmail(email);
        }
        if (bio != null) {
            currentGeneralBase.setDescription(bio);
        }

        // don't forget to save changes to database
        try {
            generalbase.save(currentGeneralBase);
            users.save(currentUser);
        } catch (MongoException ex) {
            return new Response("error");
        }

        return new Response("OK");
    }

    @PostMapping(value = "/user/add")
    public Response addUserAccount(@RequestBody NewUser user) {
        try {
            GeneralBase gb = new GeneralBase();
            gb.setType("User");
            gb.setTitle(user.getUsername());
            generalbase.save(gb);

            User newUser = new User(user.getEmail(), new BCryptPasswordEncoder().encode(user.getPassword()));
            newUser.setGeneralBaseRef(gb.getId());
            users.save(newUser);

            gb.setTypeRef(newUser.getId());
            generalbase.save(gb);

            return new Response(Response.OK);
        } catch (Exception e) {
            return new Response(Response.ERROR);
        }
    }


    @PostMapping("/user/exists")
    public Response checkUserExist(@RequestBody UserInfo userInfo) {
        if (!users.existsByEmail(userInfo.getEmail())) {
            return new Response(Response.ERROR);
        }
        return new Response(Response.OK);
    }

    @GetMapping(value="/generalBase/thumbnail")
    public String getThumbnail(@RequestParam(value="id") final String generalBaseId) {
        GeneralBase gb = generalbase.findById(generalBaseId).get();
        return gb.getThumbnail();
    }

    @GetMapping(value="/generalBase/title")
    public String getTitle(@RequestParam(value="id") final String generalBaseId) {
        GeneralBase gb = generalbase.findById(generalBaseId).get();
        return gb.getTitle();
    }

    //After login
//    @GetMapping(value="")
//    public @ResponseBody
//    String getCurrentUserEmail() {
//        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        String email;
//
//        if (principal instanceof UserDetails) {
//            email = ((UserDetails)principal).getUsername();
//        } else {
//            email = principal.toString();
//        }
//        return email;
//    }

    @GetMapping("/generalBase/id")
    public String getCurrentUserGeneralBaseId() {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return "{\"id\":\"\"}";
        }
        return "{\"id\":\"" + currentUser.getGeneralBaseRef() + "\"}";
    }

    @PostMapping("/user/setpassword")
    public Response setCurrentUserPassword(@RequestBody final String password) {
        try {
            User currentUser = getCurrentUser();
            currentUser.setPassword(new BCryptPasswordEncoder(10).encode(currentUser.getPassword()));
            users.save(currentUser);
            return new Response(Response.OK);
        }catch (Exception e){
            return new Response(Response.ERROR);
        }
    }

    @PostMapping("/user/username")
    public Response setCurrentUserName(@RequestBody final String username) {
        try {
            User currentUser = getCurrentUser();
            GeneralBase gb = generalbase.findById(currentUser.getGeneralBaseRef()).get();
            gb.setTitle(username);
            generalbase.save(gb);
            return new Response(Response.OK);
        }catch (Exception e){
            return new Response(Response.ERROR);
        }
    }

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email;

        if (principal instanceof UserDetails) {
            email = ((UserDetails)principal).getUsername();
        } else {
            email = principal.toString();
        }

        return users.findByEmail(email);
    }

}
