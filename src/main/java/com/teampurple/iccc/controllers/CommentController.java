package com.teampurple.iccc.controllers;

import com.teampurple.iccc.models.*;
import com.teampurple.iccc.repositories.CommentRepository;
import com.teampurple.iccc.repositories.GeneralBaseRepository;
import com.teampurple.iccc.utils.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class CommentController {

    @Autowired
    private GeneralBaseRepository generalBaseRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private Authentication authentication;

    @PostMapping("/comments/add")
    public Response addComment(@RequestBody Comment comment) {
        try {
            // make sure there is a logged-in user
            GeneralBase currentUserGeneralBase = authentication.getCurrentUserGeneralBase();
            if (currentUserGeneralBase == null) {
                return new Response("Must be logged in to leave a comment.");
            }

            // make sure the GeneralBase being commented on exists
            Optional<GeneralBase> onGeneralBaseOptional = generalBaseRepository.findById(comment.getOn());
            if (!onGeneralBaseOptional.isPresent()) {
                return new Response("Could not find GeneralBase that the comment is being made on.");
            }
            GeneralBase onGeneralBase = onGeneralBaseOptional.get();

            // save the comment
            commentRepository.save(comment);

            // update the list of comments of the GeneralBase being commented on
            List<String> comments = onGeneralBase.getComments();
            comments.add(comment.getId());
            generalBaseRepository.save(onGeneralBase);

            return new Response(Response.OK);
        } catch (Exception e) {
            return new Response(Response.ERROR);
        }
    }

}
