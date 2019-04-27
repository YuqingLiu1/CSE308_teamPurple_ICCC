package com.teampurple.iccc.controllers;

import com.teampurple.iccc.models.GeneralBase;
import com.teampurple.iccc.models.Response;
import com.teampurple.iccc.models.Sketch;
import com.teampurple.iccc.repositories.SketchRepository;
import com.teampurple.iccc.utils.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import java.util.Base64;

@RestController
public class ImageStoreController {

    @Autowired
    private SketchRepository sketchRepository;

    @Autowired
    private Authentication auth;

    /**
     * Description:
     *   - set the profile picture for the current logged in user
     *   - must be logged in
     *
     * Request params:
     *   - use multipart/form-data upload to send the image file
     *
     * Returns:
     *   - status: 'OK' or 'error'
     */
    @PostMapping("/profilePicture/edit")
    public Response setProfilePicture(@RequestParam("file") MultipartFile file) {
        try {
            GeneralBase currentGeneralBase = auth.getCurrentUserGeneralBase();
            if (currentGeneralBase == null) {
                return new Response(Response.ERROR);
            }

            Sketch userSketch = sketchRepository.findById(currentGeneralBase.getSketch()).get();
            if (userSketch == null) {
                return new Response(Response.ERROR);
            }

            String encodedImage = Base64.getEncoder().encodeToString(file.getBytes());
            userSketch.setThumbnail(encodedImage);
            sketchRepository.save(userSketch);
            return new Response(Response.OK);
        } catch (Exception e) {
            return new Response(Response.ERROR);
        }
    }

}
