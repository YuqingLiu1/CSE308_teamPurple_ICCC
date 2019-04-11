package com.teampurple.iccc.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String getHomePage() {
//        return "Mockups/loggedOutHomepage";
        return "index";
    }

    @GetMapping("/login")
    public String getLoginPage() {
        return "LoginPage";
    }

}
