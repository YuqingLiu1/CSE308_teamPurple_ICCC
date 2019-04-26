package com.teampurple.iccc.controllers;

import com.teampurple.iccc.models.*;
import com.teampurple.iccc.repositories.ContentBaseRepository;
import com.teampurple.iccc.repositories.GeneralBaseRepository;
import com.teampurple.iccc.repositories.SketchRepository;
import com.teampurple.iccc.repositories.UserRepository;
import com.teampurple.iccc.utils.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
public class ContentController {

    @Autowired
    private ContentBaseRepository contentBaseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GeneralBaseRepository generalBaseRepository;

    @Autowired
    private SketchRepository sketchRepository;

    @Autowired
    private Authentication authentication;

    // TODO: create a new sketch for the new content, and think about what to do with creation date

    /**
     * Create a new piece of content (series, episode, or frame). Link the new content to the current user, and
     * return a ContentInfo object describing the newly created content (along with a status code of whether
     * the content creation was successful or not).
     *
     * Notes:
     *   - must be logged in to access this endpoint
     */
    @PostMapping("/content/create")
    public Response addContent(@RequestBody ContentInfo contentInfo) {
        // make sure there is a current user and that it has a valid reference to its generalbase
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
        newContentGeneralBase.setDateCreated(new Date());
        newContentGeneralBase.setDateLastEdited(new Date());
        newContentGeneralBase.setChildren(new ArrayList<>());
        newContentGeneralBase.setLikers(new ArrayList<>());
        newContentGeneralBase.setComments(new ArrayList<>());

        // set the appropriate parents for the new content, based on the type of the new content
        Parents parents = new Parents();
        parents.setUser(currentUser.getId());
        String parentFrame = contentInfo.getParentFrame();
        String parentEpisode = contentInfo.getParentEpisode();
        String parentSeries = contentInfo.getParentSeries();
        String parentGeneralBaseRef = null;
        switch (contentInfo.getType()) {
            case ContentBase.SERIES:
                // the new content is a series
                parentGeneralBaseRef = currentUserGeneralbase.getId();
                break;
            case ContentBase.EPISODE:
                // the new content is an episode, and must have a series as a parent
                if (parentSeries != null) {
                    parents.setSeries(parentSeries);
                    parentGeneralBaseRef = parentSeries;
                } else {
                    return new Response("error");
                }
                break;
            case ContentBase.FRAME:
                // the new content is a frame, and must have either an episode or another frame as a parent
                if (parentFrame != null) {
                    // the new frame is a child of a frame
                    parents.setFrame(parentFrame);
                    ContentBase parentContentBase = contentBaseRepository.findById(parentFrame).get();
                    parents.setEpisode(parentContentBase.getParents().getEpisode());
                    parents.setSeries(parentContentBase.getParents().getSeries());
                    parentGeneralBaseRef = parentFrame;
                } else if (parentEpisode != null) {
                    // the new frame is a child of an episode
                    parents.setEpisode(parentEpisode);
                    ContentBase parentContentBase = contentBaseRepository.findById(parentEpisode).get();
                    parents.setSeries(parentContentBase.getParents().getSeries());
                    parentGeneralBaseRef = parentEpisode;
                } else {
                    return new Response("error");
                }
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

        // build the sketch for the new content
        Sketch newSketch = new Sketch();
        sketchRepository.save(newSketch);

        // don't forget to update the parent generalbase's list of children with this new contentbase
        GeneralBase parentGeneralBase = generalBaseRepository.findById(parentGeneralBaseRef).get();
        List<String> oldChildren = parentGeneralBase.getChildren();
        oldChildren.add(newContentBase.getId());

        // don't forget to link to the new contentbase from the generalbase
        newContentGeneralBase.setTypeRef(newContentBase.getId());


        // don't forget to link to the new sketch from the generalbase
        newContentGeneralBase.setSketch(newSketch.getId());

        // save the above changes
        generalBaseRepository.save(newContentGeneralBase);

        // don't forget to update the user's content with the new content
        List<String> oldUserContent = currentUser.getContent();
        oldUserContent.add(newContentBase.getId());
        userRepository.save(currentUser);

        // add to the content info to return to the user
        contentInfo.setContentBase(newContentBase);
        contentInfo.setGeneralBase(newContentGeneralBase);
        contentInfo.setSketch(newSketch);

        return new Response("OK", contentInfo);
    }

    @PostMapping("/content/save")
    public Response saveContent(@RequestBody Sketch newSketch) {
        // make sure the sketch exists in the database
        Sketch oldSketch = sketchRepository.findById(newSketch.getId()).get();
        if (oldSketch == null) {
            return new Response(Response.ERROR);
        }

        // overwrite the old sketch with the new sketch
        sketchRepository.save(newSketch);

        return new Response(Response.OK);
    }
}