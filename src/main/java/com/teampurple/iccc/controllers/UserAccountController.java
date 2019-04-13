package com.teampurple.iccc.controllers;

import com.teampurple.iccc.models.GeneralBase;
import com.teampurple.iccc.models.NewUser;
import com.teampurple.iccc.models.Response;
import com.teampurple.iccc.models.User;
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

            return new Response("OK");
        } catch (Exception e) {
            return new Response("error");
        }
    }


    @PostMapping("/user/exists")
    public Response checkUserExist(@RequestBody final String email) {
        if (users.existsUserByEmail(email)) {
            return new Response("error");
        }
        return new Response("OK");
    }

    @GetMapping(value="/generalBase/thumbnail")
    public String getThumbnail(@RequestParam(value="id") final String generalBaseId) {
        GeneralBase gb = generalbase.findById(generalBaseId);
        return gb.getThumbnail();
    }

    @GetMapping(value="/generalBase/title")
    public String getTitle(@RequestParam(value="id") final String generalBaseId) {
        GeneralBase gb = generalbase.findById(generalBaseId);
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
            return new Response("OK");
        }catch (Exception e){
            return new Response("error");
        }
    }

    @PostMapping("/user/username")
    public Response setCurrentUserName(@RequestBody final String username) {
        try {
            User currentUser = getCurrentUser();
            GeneralBase gb = generalbase.findById(currentUser.getGeneralBaseRef());
            gb.setTitle(username);
            generalbase.save(gb);
            return new Response("OK");
        }catch (Exception e){
            return new Response("error");
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
