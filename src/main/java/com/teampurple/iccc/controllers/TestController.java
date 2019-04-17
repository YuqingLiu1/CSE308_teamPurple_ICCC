package com.teampurple.iccc.controllers;

import com.mongodb.MongoException;
import com.teampurple.iccc.models.GeneralBase;
import com.teampurple.iccc.models.Response;
import com.teampurple.iccc.models.User;
import com.teampurple.iccc.models.UserInfo;
import com.teampurple.iccc.repositories.GeneralBaseRepository;
import com.teampurple.iccc.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
public class TestController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GeneralBaseRepository generalBaseRepository;

    @Autowired
    private AuthenticationManager am;

    @GetMapping("/test/getuser")
    public User getUser(@RequestParam(value="email", defaultValue="testemail") String email) {
        return userRepository.findByEmail(email);
    }

    @PostMapping("/test/adduser")
    public void addUser(@RequestBody User user) {
        user.setPassword(new BCryptPasswordEncoder(10).encode(user.getPassword()));
        userRepository.save(user);
    }

    @GetMapping("/test/adduser")
    public void test() {
        return;
    }

    @PostMapping("/test/user/edit")
    public Response editUserInfo(@RequestBody UserInfo userInfo) {
        User currentUser = getCurrentUser();
        GeneralBase currentGeneralBase = generalBaseRepository.findById(currentUser.getGeneralBaseRef());
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
            generalBaseRepository.save(currentGeneralBase);
            userRepository.save(currentUser);
        } catch (MongoException ex) {
            return new Response("error");
        }

        return new Response("OK");
    }

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email;

        if (principal instanceof UserDetails) {
            email = ((UserDetails)principal).getUsername();
        } else {
            email = principal.toString();
        }

        return userRepository.findByEmail(email);
    }

}
