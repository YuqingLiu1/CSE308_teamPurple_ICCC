package com.teampurple.iccc.controllers;

import com.teampurple.iccc.models.User;
import com.teampurple.iccc.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class TestController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping(value = "/test", produces = "application/json")
    public @ResponseBody
    User getUser() {
        return userRepository.findByEmail("testemail");
    }

}
