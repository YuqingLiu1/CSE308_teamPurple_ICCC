package com.teampurple.iccc.controllers;

import com.teampurple.iccc.models.GeneralBase;
import com.teampurple.iccc.models.User;
import com.teampurple.iccc.repositories.GeneralBaseRepository;
import com.teampurple.iccc.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/")
public class CreateAccountController {
    @Autowired
    private UserRepository users;
    private GeneralBaseRepository generalbase;

    @RequestMapping(value="",method = RequestMethod.POST)
    public @ResponseBody
    Boolean post(@RequestBody final String userInfor) {
        int index = 0;
        index=userInfor.indexOf(":",index);
        String email = userInfor.substring(index+2,userInfor.indexOf("\"",index+2));
        if (users.existsUserByEmail(email)){
            return false;
        }
        try {
            index = userInfor.indexOf(":", index + 1);
            String password = userInfor.substring(index + 2, userInfor.indexOf("\"", index + 2));
            index = userInfor.indexOf(":", index + 1);
            String name = userInfor.substring(index + 2, userInfor.indexOf("\"", index + 2));
            index = userInfor.indexOf(":", index + 1);
            String description = userInfor.substring(index + 2, userInfor.indexOf("\"", index + 2));
            index = userInfor.indexOf(":", index + 1);
            String imageURL = userInfor.substring(index + 2, userInfor.indexOf("\"", index + 2));
            GeneralBase gb = new GeneralBase();
            gb.setType("User");
            if (!name.equals(null)) {
                gb.setTitle(name);
            }
            if (!description.equals(null)) {
                gb.setDescription(description);
            }
            if (!imageURL.equals(null)) {
                gb.setThumbnail(imageURL);
            }
            generalbase.save(gb);
            User user = new User(email, password);
            user.setGeneralBaseRef(gb.getId());
            users.save(user);
            return true;
        }
        catch(Exception e){
            return false;
        }
    }

    
}
