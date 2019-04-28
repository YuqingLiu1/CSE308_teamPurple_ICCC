package com.teampurple.iccc.controllers;

import com.teampurple.iccc.models.*;
import com.teampurple.iccc.repositories.ContentBaseRepository;
import com.teampurple.iccc.repositories.GeneralBaseRepository;
import com.teampurple.iccc.repositories.SketchRepository;
import com.teampurple.iccc.repositories.UserRepository;
import com.teampurple.iccc.utils.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

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
     *   - parentSeries: String (ContentBase ID)
     *     - only if the new content will be an episode
     *   - parentEpisode: String (ContentBase ID)
     *     - only if the new content will be a frame
     *   - parentFrame: String (ContentBase ID)
     *     - only if the new content will be a frame
     *
     * Returns:
     *   - status: 'OK' or 'error'
     *   - content (if status is 'OK'):
     *       {
     *           type: String (the type of the new content),
     *           title: String (the title of the new content),
     *           description: String (the description of the new content),
     *           parentSeries: String (ContentBase ID of the series this content belongs to; doesn't apply if the new
     *                                 content is a series itself),
     *           parentEpisode: String (ContentBase ID of the episode this content belongs to; only applies if the new
     *                                  content is a frame),
     *           parentFrame: String (ContentBase ID of the immediate parent frame this content belongs to; only applies
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
     *                       series: String (ContentBase ID of the series this content belongs to; doesn't apply if the
     *                                       new content is a series itself),
     *                       episode: String (ContentBase ID of the episode this content belongs to; only applies if the
     *                                        new content is a frame),
     *                       frame: String (ContentBase ID of the immediate parent frame this content belongs to; only
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
            return new Response(Response.ERROR);
        }

        // build the GeneralBase for the new content
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
        String parentContentBaseRef = null;
        switch (contentInfo.getType()) {
            case ContentBase.SERIES:
                // the parent user is already set for for the new series, so nothing more needs to be done
                break;
            case ContentBase.EPISODE:
                // the new content is an episode, and must have a series as a parent
                if (parentSeries != null) {
                    parents.setSeries(parentSeries);
                    parentContentBaseRef = parentSeries;
                } else {
                    return new Response(Response.ERROR, "Parent series not specified for new episode");
                }
                break;
            case ContentBase.FRAME:
                // the new content is a frame, and must have either an episode or another frame as a parent
                if (parentFrame != null) {
                    // the new frame is a child of an existing frame
                    parents.setFrame(parentFrame);
                    Optional<ContentBase> parentContentBaseOptional = contentBaseRepository.findById(parentFrame);
                    if (!parentContentBaseOptional.isPresent()) {
                        return new Response(Response.ERROR, "Could not find parent frame for new frame");
                    }
                    ContentBase parentContentBase = parentContentBaseOptional.get();
                    parents.setEpisode(parentContentBase.getParents().getEpisode());
                    parents.setSeries(parentContentBase.getParents().getSeries());
                    parentContentBaseRef = parentFrame;
                } else if (parentEpisode != null) {
                    // the new frame is a child of an existing episode
                    parents.setEpisode(parentEpisode);
                    Optional<ContentBase> parentContentBaseOptional = contentBaseRepository.findById(parentEpisode);
                    if (!parentContentBaseOptional.isPresent()) {
                        return new Response(Response.ERROR, "Could not find parent episode for new frame");
                    }
                    ContentBase parentContentBase = parentContentBaseOptional.get();
                    parents.setSeries(parentContentBase.getParents().getSeries());
                    parentContentBaseRef = parentEpisode;
                } else {
                    return new Response(Response.ERROR, "Trying to add new frame without specifying parent frame or episode");
                }
                break;
            default:
                // reaching the default case indicates an invalid content type
                return new Response(Response.ERROR, "Invalid type for new content");
        }

        // save the new content's GeneralBase to the database to get the ID generated for it
        generalBaseRepository.save(newContentGeneralBase);

        // build the ContentBase for the new content
        ContentBase newContentBase = new ContentBase();
        newContentBase.setGeneralBaseRef(newContentGeneralBase.getId());
        newContentBase.setAuthor(currentUser.getId());
        newContentBase.setParents(parents);
        newContentBase.setType(contentInfo.getType());
        newContentBase.setContributable(false);
        newContentBase.setPublic(false);
        contentBaseRepository.save(newContentBase);

        // build the Sketch for the new content
        Sketch newSketch = new Sketch();
        sketchRepository.save(newSketch);

        // don't forget to update the parent GeneralBase's list of children with the new ContentBase
        String parentGeneralBaseRef = null;
        switch (contentInfo.getType()) {
            case ContentBase.SERIES:
                parentGeneralBaseRef = currentUser.getGeneralBaseRef();
                break;
            case ContentBase.EPISODE:
            case ContentBase.FRAME:
                Optional<ContentBase> parentContentBaseOptional = contentBaseRepository.findById(parentContentBaseRef);
                if (!parentContentBaseOptional.isPresent()) {
                    return new Response(Response.ERROR, "Could not find parent ContentBase reference for new content");
                }
                ContentBase parentContentBase = parentContentBaseOptional.get();
                parentGeneralBaseRef = parentContentBase.getGeneralBaseRef();
                break;
            default:
                return new Response(Response.ERROR, "Invalid type for new content");
        }
        Optional<GeneralBase> parentGeneralBaseOptional = generalBaseRepository.findById(parentGeneralBaseRef);
        if (!parentGeneralBaseOptional.isPresent()) {
            return new Response(Response.ERROR, "Could not find parent GeneralBase reference for new content");
        }
        GeneralBase parentGeneralBase = parentGeneralBaseOptional.get();
        List<String> oldChildren =  parentGeneralBase.getChildren();
        oldChildren.add(newContentBase.getId());
        generalBaseRepository.save(parentGeneralBase);

        // don't forget to link to the new ContentBase from the new GeneralBase
        newContentGeneralBase.setTypeRef(newContentBase.getId());

        // don't forget to link to the new Sketch from the new GeneralBase
        newContentGeneralBase.setSketch(newSketch.getId());

        // save the above changes
        generalBaseRepository.save(newContentGeneralBase);

        // don't forget to update the user's content with the new content
        List<String> oldUserContent = currentUser.getContent();
        oldUserContent.add(newContentBase.getId());
        userRepository.save(currentUser);

        // add to the content info to return to the user
        contentInfo.setParentSeries(parents.getSeries());
        contentInfo.setParentEpisode(parents.getEpisode());
        contentInfo.setParentFrame(parents.getFrame());
        contentInfo.setContentBase(newContentBase);
        contentInfo.setGeneralBase(newContentGeneralBase);
        contentInfo.setSketch(newSketch);

        return new Response(Response.OK, contentInfo);
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

    /**
     * Description:
     *   - get the immediate surrounding ContentBase IDs (parent, child, left, and right) of a given ContentBase ID
     *   - only returns ContentBase IDs, so if the given ContentBase ID is for a series then the parent would be null
     *     (since it would be a user, which does not have an associated ContentBase)
     *   - only returns ContentBase IDs of content that the current user is allowed to see
     *     - if the user is logged in, then this means public content from all users as well as all of their own content
     *     - if the user is logged out, then this means only the public content from all users
     *
     * Request params:
     *   - id: String (ContentBase ID to find surroundings of; query string field)
     *
     * Returns:
     *   - status: String ('OK' or 'error')
     *   - parent: String (ContentBase ID of the parent content; null if the parent is a user)
     *   - child: String (ContentBase ID of the child content; null if there is no child content)
     *   - left: String (ContentBase ID of the content immediately to the left; null if there is none)
     *   - right: String (ContentBase ID of the content immediately to the right; null if there is none)
     */
    @GetMapping("/content/surroundings")
    public Response getSurroundingContent(@RequestParam("id") final String contentBaseId) {
        Optional<ContentBase> currentContentBaseOptional = contentBaseRepository.findById(contentBaseId);
        if (!currentContentBaseOptional.isPresent()) {
            return new Response(Response.ERROR);
        }
        ContentBase currentContentBase = currentContentBaseOptional.get();

        // create surrounding content object to build up over the course of this function
        SurroundingContent surroundingContent = new SurroundingContent();

        // go to the parent GeneralBase to get the list of child content on this level
        String parentGeneralBaseRef = null;
        Optional<ContentBase> parentContentBaseOptional;
        ContentBase parentContentBase = null;
        switch (currentContentBase.getType()) {
            case ContentBase.SERIES:
                Optional<User> parentUserOptional = userRepository.findById(currentContentBase.getParents().getUser());
                if (!parentUserOptional.isPresent()) {
                    return new Response(Response.ERROR);
                }
                User parentUser = parentUserOptional.get();
                parentGeneralBaseRef = parentUser.getGeneralBaseRef();
                break;
            case ContentBase.EPISODE:
                parentContentBaseOptional = contentBaseRepository.findById(currentContentBase.getParents().getSeries());
                if (!parentContentBaseOptional.isPresent()) {
                    return new Response(Response.ERROR);
                }
                parentContentBase = parentContentBaseOptional.get();
                parentGeneralBaseRef = parentContentBase.getGeneralBaseRef();
                break;
            case ContentBase.FRAME:
                String parentContentBaseRef = null;
                if (currentContentBase.getParents().getSeries() != null) {
                    parentContentBaseRef = currentContentBase.getParents().getSeries();
                } else {
                    parentContentBaseRef = currentContentBase.getParents().getFrame();
                }
                parentContentBaseOptional = contentBaseRepository.findById(parentContentBaseRef);
                if (!parentContentBaseOptional.isPresent()) {
                    return new Response(Response.ERROR);
                }
                parentContentBase = parentContentBaseOptional.get();
                parentGeneralBaseRef = parentContentBase.getGeneralBaseRef();
                break;
            default:
                return new Response(Response.ERROR, "Given content somehow has an invalid type");
        }
        Optional<GeneralBase> parentGeneralBaseOptional = generalBaseRepository.findById(parentGeneralBaseRef);
        if (!parentGeneralBaseOptional.isPresent()) {
            return new Response(Response.ERROR);
        }
        GeneralBase parentGeneralBase = parentGeneralBaseOptional.get();
        List<String> childContent = parentGeneralBase.getChildren();

        // get the parent content (there is any)
        switch (currentContentBase.getType()) {
            case ContentBase.SERIES:
                // series do not have parent ContentBase (their parent is a user)
                break;
            case ContentBase.EPISODE:
            case ContentBase.FRAME:
                surroundingContent.setParentContentBaseRef(parentContentBase.getId());
                break;
            default:
                return new Response(Response.ERROR, "Given content somehow has an invalid type");
        }

        // get the content to the right (if there is any)
        Response rightResponse = getAdjacentVisibleContent(contentBaseId, childContent, true);
        if (rightResponse.getStatus() == Response.ERROR) {
            return new Response(Response.ERROR);
        }
        surroundingContent.setRightContentBaseRef((String)rightResponse.getContent());

        // get the content to the left (if there is any)
        Response leftResponse = getAdjacentVisibleContent(contentBaseId, childContent, false);
        if (leftResponse.getStatus() == Response.ERROR) {
            return new Response(Response.ERROR);
        }
        surroundingContent.setLeftContentBaseRef((String)leftResponse.getContent());

        return new Response(Response.OK, surroundingContent);
    }

    /**
     * Find the next "visible" ContentBase ID to the right or left of the current ContentBase. Content is "visible" when
     * it is public, or when it is private but belongs to the current logged in user.
     * @param currentContentBaseRef The ContentBase ID of the current content.
     * @param contentBaseRefs A list of ContentBase IDs on the same level.
     * @param toTheRight Whether to find content to the right or to the left of the current content.
     * @return A response object that indicates success or failure. Failure occurs when contentBaseRefs does not contain
     *         currentContentBaseRef, or there is a database error. Success occurs otherwise. On success, the returned
     *         response also contains either the next "visible" ContentBase ID (to the right or left of the current
     *         content), or null if there is none.
     */
    private Response getAdjacentVisibleContent(String currentContentBaseRef, List<String> contentBaseRefs, boolean toTheRight) {
        if (!contentBaseRefs.contains(currentContentBaseRef)) {
            return new Response(Response.ERROR);
        }

        User currentUser = authentication.getCurrentUser();
        boolean loggedIn = currentUser != null;

        List<String> orderedContentBaseRefs = contentBaseRefs;
        if (!toTheRight) {
            Collections.reverse(orderedContentBaseRefs);
        }

        for (int i = orderedContentBaseRefs.indexOf(currentContentBaseRef) + 1; i < orderedContentBaseRefs.size(); i++) {
            String contentBaseRef = orderedContentBaseRefs.get(i);
            Optional<ContentBase> contentBaseOptional = contentBaseRepository.findById(contentBaseRef);
            if (!contentBaseOptional.isPresent()) {
                return new Response(Response.ERROR);
            }
            ContentBase contentBase = contentBaseOptional.get();
            if (contentBase.getPublic() || (loggedIn && contentBase.getAuthor().equals(currentUser.getId()))) {
                return new Response(Response.OK, contentBaseRef);
            }
        }
        // didn't find next "visible" content
        return new Response(Response.OK, null);
    }
}