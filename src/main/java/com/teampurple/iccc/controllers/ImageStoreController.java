package com.teampurple.iccc.controllers;

import com.teampurple.iccc.models.Response;
import com.teampurple.iccc.models.Sketch;
import com.teampurple.iccc.repositories.GeneralBaseRepository;
import com.teampurple.iccc.repositories.SketchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import java.util.Base64;

@RestController
public class ImageStoreController {

    @Autowired
    private GeneralBaseRepository generalBaseRepository;

    @Autowired
    private SketchRepository sketchRepository;

    @PostMapping("/profilePicture/upload")
    public Response uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String encodedImage = Base64.getEncoder().encodeToString(file.getBytes());
            Sketch sketch = new Sketch();
            sketch.setThumbnail(encodedImage);
            sketchRepository.save(sketch);
            return new Response("OK", sketch.getId());
        } catch (Exception e) {
            return new Response("error");
        }
    }

//    @PostMapping("/frame/save")
//    public Response saveImage(@RequestParam("id") String id,@RequestBody Image image){
//        try {
//            Sketch sketch = sketchs.findById(id);
//            sketch.setImage(image);
//            sketchs.save(sketch);
//            return new Response(Response.OK);
//        }catch (Exception e){
//            return new Response(Response.ERROR);
//        }
//    }

}
