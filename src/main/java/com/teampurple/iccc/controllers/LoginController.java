package com.teampurple.iccc.controllers;

import com.teampurple.iccc.models.Response;
import com.teampurple.iccc.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {

    @Autowired
    private AuthenticationManager am;

    @PostMapping("/login")
    public Response login(@RequestBody User user) {
        try {
            String email = user.getEmail();
            String password = user.getPassword();
            Authentication request = new UsernamePasswordAuthenticationToken(email, password);
            Authentication result = am.authenticate(request);
            SecurityContextHolder.getContext().setAuthentication(result);
        } catch (AuthenticationException e) {
            return new Response("error");
        }
        return new Response("OK");
    }

}
