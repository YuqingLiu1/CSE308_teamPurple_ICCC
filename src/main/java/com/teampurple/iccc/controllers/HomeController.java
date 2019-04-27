package com.teampurple.iccc.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    /**
     * Description:
     *   - get the main HTML page of the application
     *
     * Request params:
     *   - none
     *
     * Returns:
     *   - the HTML page containing the root div for React to hook into
     */
    @GetMapping("/")
    public String getHomePage() {
        return "index";
    }

}
