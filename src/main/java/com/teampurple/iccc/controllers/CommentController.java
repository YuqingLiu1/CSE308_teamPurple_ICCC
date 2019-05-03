package com.teampurple.iccc.controllers;

import com.teampurple.iccc.models.*;
import com.teampurple.iccc.repositories.CommentRepository;
import com.teampurple.iccc.repositories.GeneralBaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
public class CommentController {
    @Autowired
    private GeneralBaseRepository generalBases;
    @Autowired
    private CommentRepository comments;

    @PostMapping(value = "/comment/add")
    public Response addComment(@RequestBody NewComment comment){
        try {
            
            return new Response(Response.OK);
        } catch (Exception e){
            return new Response(Response.ERROR);
        }
    }



}
