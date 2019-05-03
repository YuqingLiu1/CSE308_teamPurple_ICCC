package com.teampurple.iccc.controllers;

import com.mongodb.MongoException;
import com.teampurple.iccc.models.*;
import com.teampurple.iccc.repositories.CommentRepository;
import com.teampurple.iccc.repositories.GeneralBaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class CommentController {
    @Autowired
    private GeneralBaseRepository generalBases;
    @Autowired
    private CommentRepository comments;

    @PostMapping(value = "/comment/add")
    public Response addComment(@RequestBody NewComment comment){
        System.out.println("point1");
        try {
            System.out.println("point2");
            GeneralBase currentGeneralBase = generalBases.findById(comment.getOn()).get();
            System.out.println("point3");
            if (currentGeneralBase == null) {
                return new Response("error");
            }
            System.out.println("point4");
            Comment com = new Comment();
            System.out.println("point5");
            com.setOn(comment.getOn());
            System.out.println("point6");
            com.setAuthor(comment.getAuthor());
            System.out.println("point7");
            com.setContent(comment.getContent());
            System.out.println("point8");

            List<String> cmts = currentGeneralBase.getComments();
            System.out.println("point9");
            cmts.add(com.getId());
            System.out.println("point10");
            currentGeneralBase.setComments(cmts);
            System.out.println("point11");

            try{
                System.out.println("point12");
                generalBases.save(currentGeneralBase);
                System.out.println("point13");
                comments.save(com);
                System.out.println("point14");
            } catch (MongoException ex) {
                return new Response(Response.ERROR);
            }
            System.out.println("point15");
            return new Response(Response.OK);
        } catch (Exception e){
            System.out.println("point16");
            return new Response(Response.ERROR);
        }
    }



}
