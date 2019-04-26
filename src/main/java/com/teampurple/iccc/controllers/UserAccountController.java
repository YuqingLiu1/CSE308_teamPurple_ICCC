package com.teampurple.iccc.controllers;

import com.mongodb.MongoException;
import com.teampurple.iccc.models.*;
import com.teampurple.iccc.repositories.CategoryRepository;
import com.teampurple.iccc.repositories.GeneralBaseRepository;
import com.teampurple.iccc.repositories.SketchRepository;
import com.teampurple.iccc.repositories.UserRepository;
import com.teampurple.iccc.utils.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.List;

@RestController
public class UserAccountController {

    @Autowired
    private UserRepository users;
    @Autowired
    private GeneralBaseRepository generalbase;
    @Autowired
    private Authentication auth;
    @Autowired
    private SketchRepository sketchRepository;
    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping("/user/info")
    public Response getUserInfo() {
        User currentUser = auth.getCurrentUser();
        GeneralBase currentGeneralBase = auth.getCurrentUserGeneralBase();

        if (currentUser == null || currentGeneralBase == null) {
            return new Response(Response.ERROR);
        }

        // get the user's categories
        List<Category> userCategories = getCategories(currentUser.getUserCategories());

        // get the default "home" categories
        List<Category> homeCategories = getCategories(currentUser.getHomeCategories());

        UserInfo userInfo = new UserInfo();

        userInfo.setGeneralBase(currentGeneralBase);
        userInfo.setUsername(currentGeneralBase.getTitle());
        userInfo.setBio(currentGeneralBase.getDescription());
        userInfo.setEmail(currentUser.getEmail());
        userInfo.setPassword(currentUser.getPassword());
        userInfo.setUserCategories(userCategories);
        userInfo.setUserCategories(userCategories);
        userInfo.setHomeCategories(homeCategories);
        userInfo.setSketchRef(currentGeneralBase.getSketch());

        return new Response(Response.OK, userInfo);
    }

    @PostMapping("/user/edit")
    public Response editUserInfo(@RequestBody UserInfo userInfo) {
        User currentUser = auth.getCurrentUser();
        GeneralBase currentGeneralBase = generalbase.findById(currentUser.getGeneralBaseRef()).get();
        if (currentUser == null || currentGeneralBase == null) {
            return new Response("error");
        }

        // only change the appropriate properties
        String username = userInfo.getUsername();
        String password = userInfo.getPassword();
        String email = userInfo.getEmail();
        String bio = userInfo.getBio();
        String sketchRef = userInfo.getSketchRef();
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
        if (sketchRef != null) {
            currentGeneralBase.setSketch(sketchRef);
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
            gb.setDescription("Hello! I am " + user.getUsername() + ".");
            gb.setDateCreated(new Date());
            gb.setDateLastEdited(new Date());
            generalbase.save(gb);

            User newUser = new User(user.getEmail(), new BCryptPasswordEncoder().encode(user.getPassword()));
            newUser.setGeneralBaseRef(gb.getId());
            users.save(newUser);

            // don't forget to set the reference to the contentbase or user related to this generalbase
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
    public ResponseEntity<byte[]> getThumbnail(@RequestParam(value="id") final String generalBaseId) {
        GeneralBase gb = generalbase.findById(generalBaseId).get();
        Sketch sketch = sketchRepository.findById(gb.getSketch()).get();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);

        byte[] media = Base64.getDecoder().decode(sketch.getThumbnail());

        return new ResponseEntity<>(media, headers, HttpStatus.OK);
    }

    @GetMapping(value="/generalBase/title")
    public String getTitle(@RequestParam(value="id") final String generalBaseId) {
        GeneralBase gb = generalbase.findById(generalBaseId).get();
        return gb.getTitle();
    }

    @GetMapping("/generalBase/id")
    public String getCurrentUserGeneralBaseId() {
        User currentUser = auth.getCurrentUser();
        if (currentUser == null) {
            return "{\"id\":\"\"}";
        }
        return "{\"id\":\"" + currentUser.getGeneralBaseRef() + "\"}";
    }

    @PostMapping("/user/setpassword")
    public Response setCurrentUserPassword(@RequestBody final String password) {
        try {
            User currentUser = auth.getCurrentUser();
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
            User currentUser = auth.getCurrentUser();
            GeneralBase gb = generalbase.findById(currentUser.getGeneralBaseRef()).get();
            gb.setTitle(username);
            generalbase.save(gb);
            return new Response(Response.OK);
        }catch (Exception e){
            return new Response(Response.ERROR);
        }
    }

    /**
     * Get a list of categories given a list of category ids.
     * @param categoryIds The list of category ids.
     * @return A list of categories corresponding to the category ids.
     */
    private List<Category> getCategories(List<String> categoryIds) {
        List<Category> categories = new ArrayList<>();
        for (Category category : categoryRepository.findAllById(categoryIds)) {
            categories.add(category);
        }
        return categories;
    }

}
