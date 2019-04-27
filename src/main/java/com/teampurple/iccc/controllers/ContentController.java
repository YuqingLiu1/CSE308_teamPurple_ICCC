package com.teampurple.iccc.controllers;

import com.teampurple.iccc.models.*;
import com.teampurple.iccc.repositories.ContentBaseRepository;
import com.teampurple.iccc.repositories.GeneralBaseRepository;
import com.teampurple.iccc.repositories.SketchRepository;
import com.teampurple.iccc.repositories.UserRepository;
import com.teampurple.iccc.utils.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

    /**
     * Description:
     *   - create a new piece of content (series, episode, or frame)
     *   - must be logged in to use this endpoint
     *   - associate the new content with the current user
     *
     * Request params:
     *   - type: String (either "Series", "Episode", or "Frame", note the capitalization)
     *   - title: String
     *   - description: String
     *   - parentSeries: String (GeneralBase ID)
     *     - only if the new content will be an episode
     *   - parentEpisode: String (GeneralBase ID)
     *     - only if the new content will be a frame
     *   - parentFrame: String (GeneralBase ID)
     *     - only if the new content will be a frame
     *
     * Returns:
     *   - status: 'OK' or 'error'
     *   - content (if status is 'OK'):
     *       {
     *           type: String (the type of the new content),
     *           title: String (the title of the new content),
     *           description: String (the description of the new content),
     *           parentSeries: String (GeneralBase ID of the series this content belongs to; doesn't apply if the new
     *                                 content is a series itself),
     *           parentEpisode: String (GeneralBase ID of the episode this content belongs to; only applies if the new
     *                                  content is a frame),
     *           parentFrame: String (GeneralBase ID of the immediate parent frame this content belongs to; only applies
     *                                if the new content is a frame)
     *           sketch:
     *             {
     *                 id: String (Sketch ID of the sketch associated with the new content),
     *                 thumbnail: String (base 64 encoded image data of the sketch; initially null),
     *                 data: String (JSON stringified sketch data that can be used by react-sketch; initially null)
     *             },
     *           generalBase:
     *             {
     *                 id: String (GeneralBase ID of the GeneralBase associated with the new content),
     *                 typeRef: String (ContentBase ID of the ContentBase associated with the new content),
     *                 type: String ("ContentBase", because new content is being created, not a user),
     *                 sketch: String (Sketch ID of the sketch associated with the new content),
     *                 title: String (title of the new content),
     *                 description: String (description of the new content),
     *                 dateCreated: String (ISO 8601 datetime of when the content was created),
     *                 dateLastEdited: String (ISO 8601 datetime of when the content was last edited; same as above on
     *                                         creation),
     *                 children: [ array of GeneralBase IDs of the immediate children of the new content; initially
     *                             an empty array ],
     *                 likers: [ array of GeneralBase IDs of users who liked the new content; initially an empty
     *                           array ],
     *                 comments: [ array of Comment IDs of the comments on the new content; initially an empty array ]
     *             },
     *           contentBase:
     *             {
     *                 id: String (ContentBase ID of the ContentBase associated with the new content),
     *                 generalBaseRef: String (GeneralBase ID of the GeneralBase associated with the new content),
     *                 author: String (User ID of the user who created the new content),
     *                 type: String (either "Series", "Episode", or "Frame", depending on the type of the new content),
     *                 contributable: Boolean (whether users other than the author can child content to the new content;
     *                                         false by default for the new content),
     *                 public: Boolean (whether users other than the author can view the new content; false by default
     *                                  for the new content),
     *                 parents:
     *                   {
     *                       user: String (User ID of the user who created the new content),
     *                       series: String (GeneralBase ID of the series this content belongs to; doesn't apply if the
     *                                       new content is a series itself),
     *                       episode: String (GeneralBase ID of the episode this content belongs to; only applies if the
     *                                        new content is a frame),
     *                       frame: String (GeneralBase ID of the immediate parent frame this content belongs to; only
     *                                      applies if the new content is a frame)
     *                   }
     *                 dateMadeContributable: String (ISO 8601 datetime of when the content was made contributable;
     *                                                null for the new content),
     *                 dateMadePublic: String (ISO 8601 datetime of when the content was made public; null for the new
     *                                         content)
     *             }
     *       }
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

    // TODO: make sure that the current logged in user is the author of the sketch they are trying to save
    /**
     * Description:
     *   - save the current version of a sketch
     *   - must be logged in as the author who owns the sketch data
     *   - overwrites the old thumbnail and data of the sketch currently in the database
     *
     * Request params:
     *   - id: String (Sketch ID of the sketch to save),
     *   - thumbnail: String (base 64 encoded image data of the sketch),
     *   - data: String (JSON stringified sketch data that can be used by react-sketch)
     *
     * Returns:
     *   - status: 'OK' or 'error'
     *   - content: null
     */
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

    /**
     * Description:
     *   - get information about a piece of content given a ContentBase ID
     *
     * Request params:
     *   - id: String (ContentBase ID of the content to get info for; query string field)
     *
     * Returns:
     *   - status: 'OK' or 'error'
     *   - content (if status is 'OK'):
     *       {
     *           sketch:
     *             {
     *                 id: String (Sketch ID of the sketch associated with the content),
     *                 thumbnail: String (base 64 encoded image data of the sketch),
     *                 data: String (JSON stringified sketch data that can be used by react-sketch)
     *             },
     *           generalBase:
     *             {
     *                 id: String (GeneralBase ID of the GeneralBase associated with the content),
     *                 typeRef: String (ContentBase ID of the ContentBase associated with the content),
     *                 type: String ("ContentBase"),
     *                 sketch: String (Sketch ID of the sketch associated with the content),
     *                 title: String (title of the content),
     *                 description: String (description of the content),
     *                 dateCreated: String (ISO 8601 datetime of when the content was created),
     *                 dateLastEdited: String (ISO 8601 datetime of when the content was last edited),
     *                 children: [ array of GeneralBase IDs of the immediate children of the content ],
     *                 likers: [ array of GeneralBase IDs of users who liked the content ],
     *                 comments: [ array of Comment IDs of the comments on the content ]
     *             },
     *           contentBase:
     *             {
     *                 id: String (ContentBase ID of the ContentBase associated with the content),
     *                 generalBaseRef: String (GeneralBase ID of the GeneralBase associated with the content),
     *                 author: String (User ID of the user who created the content),
     *                 type: String (either "Series", "Episode", or "Frame", depending on the type of the content),
     *                 contributable: Boolean (whether users other than the author can child content to the content),
     *                 public: Boolean (whether users other than the author can view the content),
     *                 parents:
     *                   {
     *                       user: String (User ID of the user who created the content),
     *                       series: String (GeneralBase ID of the series this content belongs to; doesn't apply if the
     *                                       content is a series itself),
     *                       episode: String (GeneralBase ID of the episode this content belongs to; only applies if the
     *                                        content is a frame),
     *                       frame: String (GeneralBase ID of the immediate parent frame this content belongs to; only
     *                                      applies if the content is a frame)
     *                   }
     *                 dateMadeContributable: String (ISO 8601 datetime of when the content was made contributable),
     *                 dateMadePublic: String (ISO 8601 datetime of when the content was made public)
     *             }
     *       }
     */
    @GetMapping("/content/info")
    public Response getContentInfo(@RequestParam(value="id") final String contentBaseId) {
        if (contentBaseId == null) {
            return new Response(Response.ERROR, "Content base ID cannot be null");
        }

        ContentBase contentBase = contentBaseRepository.findById(contentBaseId).get();
        if (contentBase == null) {
            return new Response(Response.ERROR, "Could not find content base by ID: " + contentBaseId);
        }

        GeneralBase generalBase = generalBaseRepository.findById(contentBase.getGeneralBaseRef()).get();
        if (generalBase == null) {
            return new Response(Response.ERROR, "Could not find general base of the content base");
        }

        Sketch sketch = sketchRepository.findById(generalBase.getSketch()).get();
        if (sketch == null) {
            return new Response(Response.ERROR, "Could not find sketch of the general base");
        }

        ContentInfo contentInfo = new ContentInfo();
        contentInfo.setContentBase(contentBase);
        contentInfo.setGeneralBase(generalBase);
        contentInfo.setSketch(sketch);

        return new Response(Response.OK, contentInfo);
    }
}