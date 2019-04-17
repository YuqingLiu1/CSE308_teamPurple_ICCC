package com.teampurple.iccc.controllers;

import com.teampurple.iccc.models.Response;
import com.teampurple.iccc.models.Sketch;
import com.teampurple.iccc.repositories.GeneralBaseRepository;
import com.teampurple.iccc.repositories.SketchRepository;
import org.bson.BsonBinarySubType;
import org.bson.types.Binary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;

@RestController
public class ImageStoreController {
    @Autowired
    private GeneralBaseRepository generalbase;
    @Autowired
    private SketchRepository sketchs;

    @PostMapping("/frame/upload")
    public String uploadImage(HttpServletRequest request, @RequestParam("image") MultipartFile image){
        try {
            Sketch sketch = new Sketch();
            UserAccountController UserAccount = new UserAccountController();
            sketch.setGeneralBaseId(UserAccount.getCurrentUserGeneralBaseId());
            sketch.setImage(new Binary(BsonBinarySubType.BINARY, image.getBytes()));
            sketchs.insert(sketch);
            String URL=request.getRequestURI()+sketch.getId();
            return URL;
        }catch (Exception e){
            return "ERROR";
        }
    }

}
