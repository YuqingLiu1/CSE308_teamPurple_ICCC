package com.teampurple.iccc.controllers;

import com.teampurple.iccc.models.User;
import com.teampurple.iccc.repositories.GeneralBaseRepository;
import com.teampurple.iccc.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.Base64;

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

    @PostMapping("/test/upload")
    public void upload(@RequestParam("file") MultipartFile file) {
        try {
            String encodedData = Base64.getEncoder().encodeToString(file.getBytes());
            System.out.println(encodedData);
        } catch (Exception e) {

        }
    }

}
