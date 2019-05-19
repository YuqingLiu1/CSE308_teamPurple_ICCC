package com.teampurple.iccc.controllers;

import com.teampurple.iccc.models.*;
import com.teampurple.iccc.repositories.CommentRepository;
import com.teampurple.iccc.repositories.GeneralBaseRepository;
import com.teampurple.iccc.repositories.UserRepository;
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
    private UserRepository userRepository;

    @Autowired
    private Authentication authentication;

    /**
     * Description:
     *   - add a new comment to a GeneralBase
     *   - must be logged in
     *
     * Request Params:
     *   - on: String (GeneralBase ID of the GeneralBase this new comment is on; required)
     *   - author: String (User ID of the user who made the new comment; required)
     *   - content: String (the actual string content of the new comment)
     *
     * Returns:
     *   - status: String ('OK' or 'error')
     *   - content: null
     */
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

    /**
     * Description:
     *   - get information about a comment
     *
     * Request Params:
     *   - id: String (Comment ID of the comment to get information about)
     *
     * Returns:
     *   - status: String ('OK' or 'error')
     *   - content (if status is 'OK'):
     *       {
     *           comment:
     *             {
     *                 id: String (Comment ID of the comment),
     *                 on: String (GeneralBase ID of the GeneralBase this comment is on),
     *                 author: String (User ID of the author of this comment),
     *                 content: String (the actual string content of this comment)
     *             },
     *           authorGeneralBase:
     *             {
     *                 id: String (GeneralBase ID of this comment's author's GeneralBase),
     *                 typeRef: String (User ID of this comment's author's User),
     *                 type: String ("User"),
     *                 sketch: String (Sketch ID of the sketch associated with this comment's author),
     *                 title: String (username of this comment's author),
     *                 description: String (bio of this comment's author),
     *                 dateCreated: String (ISO 8601 datetime of when this comment's author created their account),
     *                 dateLastEdited: String (ISO 8601 datetime of when this comment's author last edited their
     *                                 account),
     *                 children: [ array of GeneralBase IDs of this comment's author's series ],
     *                 likers: [ array of GeneralBase IDs of users who have liked this comment's author ],
     *                 comments: [ array of Comment IDs of this comment's author's comments ]
     *             }
     *       }
     */
    @GetMapping("/comments/info")
    public Response getCommentInfo(@RequestParam("id") final String commentId) {
        CommentInfo commentInfo = new CommentInfo();

        // get the Comment info for the specified comment
        Optional<Comment> commentOptional = commentRepository.findById(commentId);
        if (!commentOptional.isPresent()) {
            return new Response(Response.ERROR, "Could not find comment with Comment ID: " + commentId + ".");
        }
        Comment comment = commentOptional.get();
        commentInfo.setComment(comment);

        // get the GeneralBase info for the author of the specified comment
        Optional<User> authorUserOptional = userRepository.findById(comment.getAuthor());
        if (!authorUserOptional.isPresent()) {
            return new Response(Response.ERROR, "Could not find User with User ID: " + comment.getAuthor() + ".");
        }
        User authorUser = authorUserOptional.get();
        Optional<GeneralBase> authorGeneralBaseOptional = generalBaseRepository.findById(authorUser.getGeneralBaseRef());
        if (!authorGeneralBaseOptional.isPresent()) {
            return new Response(Response.ERROR, "Could not find GeneralBase with GeneralBase ID: "
                    + authorUser.getGeneralBaseRef() + ".");
        }
        GeneralBase authorGeneralBase = authorGeneralBaseOptional.get();
        commentInfo.setAuthorGeneralBase(authorGeneralBase);

        return new Response(Response.OK, commentInfo);
    }

}
