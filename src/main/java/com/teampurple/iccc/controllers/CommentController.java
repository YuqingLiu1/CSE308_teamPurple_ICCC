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

        try {

            GeneralBase currentGeneralBase = generalBases.findById(comment.getOn()).get();
            System.out.println("generalbase is " + currentGeneralBase.getTitle());


            if (currentGeneralBase == null) {
                return new Response("error");
            }

            Comment com = new Comment();

            com.setOn(comment.getOn());

            com.setAuthor(comment.getAuthor());

            com.setContent(comment.getContent());

            try{

                comments.save(com);

            } catch (MongoException ex) {
                return new Response(Response.ERROR);
            }



            List<String> cmts = currentGeneralBase.getComments();
            System.out.println("before adding comments:" + cmts);
            System.out.println("comment id is: " + com.getId());
            cmts.add(com.getId());

            System.out.println("after adding comments: " + cmts);

            currentGeneralBase.setComments(cmts);


            try{

                generalBases.save(currentGeneralBase);

                comments.save(com);

            } catch (MongoException ex) {
                return new Response(Response.ERROR);
            }


            return new Response(Response.OK);
        } catch (Exception e){

            return new Response(Response.ERROR);
        }
    }



}
