package com.teampurple.iccc.controllers;

import com.teampurple.iccc.models.*;
import com.teampurple.iccc.repositories.ContentBaseRepository;
import com.teampurple.iccc.repositories.GeneralBaseRepository;
import com.teampurple.iccc.repositories.UserRepository;
import com.teampurple.iccc.utils.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

@RestController
public class ContentController {

    @Autowired
    private ContentBaseRepository contentBaseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GeneralBaseRepository generalBaseRepository;

    @Autowired
    private Authentication authentication;

    // TODO: create a new sketch for the new content, and think about what to do with creation date
    @PostMapping("/content/create")
    public Response addContent(@RequestBody ContentInfo contentInfo) {
        User currentUser = authentication.getCurrentUser();
        GeneralBase currentUserGeneralbase = authentication.getCurrentUserGeneralBase();

        if (currentUser == null || currentUserGeneralbase == null) {
            return new Response("error");
        }

        // build the generalbase for the new content
        GeneralBase newContentGeneralBase = new GeneralBase();
        newContentGeneralBase.setType(GeneralBase.CONTENT_BASE_TYPE);
        newContentGeneralBase.setTitle(contentInfo.getTitle());
        newContentGeneralBase.setDescription(contentInfo.getDescription());
        newContentGeneralBase.setChildren(new ArrayList<>());
        newContentGeneralBase.setLikers(new ArrayList<>());
        newContentGeneralBase.setComments(new ArrayList<>());

        // set the appropriate parents for the new content, based on the type of the new content
        Parents parents = new Parents();
        switch (contentInfo.getType()) {
            case ContentBase.SERIES:
                parents.setUser(currentUser.getId());
                break;
            default:
                // reaching the default case indicates an invalid content type
                return new Response("error");
        }

        // save the general base to the database to get the ID generated for it
        generalBaseRepository.save(newContentGeneralBase);

        // build the contentbase for the new content
        ContentBase newContentBase = new ContentBase();
        newContentBase.setGeneralBaseRef(newContentGeneralBase.getId());
        newContentBase.setAuthor(currentUser.getId());
        newContentBase.setParents(parents);
        newContentBase.setType(contentInfo.getType());
        newContentBase.setContributable(false);
        newContentBase.setPublic(false);
        contentBaseRepository.save(newContentBase);

        // don't forget to link to the new contentbase from the generalbase
        newContentGeneralBase.setTypeRef(newContentBase.getId());
        generalBaseRepository.save(newContentGeneralBase);

        return new Response("OK");
    }


}
