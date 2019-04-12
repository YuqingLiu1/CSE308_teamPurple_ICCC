package com.teampurple.iccc.controllers;

import com.teampurple.iccc.models.GeneralBase;
import com.teampurple.iccc.models.User;
import com.teampurple.iccc.repositories.GeneralBaseRepository;
import com.teampurple.iccc.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/")
public class UserAccountController {
    @Autowired
    private UserRepository users;
    private GeneralBaseRepository generalbase;

    @RequestMapping(value="",method = RequestMethod.POST)
    public @ResponseBody
    boolean AddUserAccount(@RequestBody final String userInfor) {
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


    @RequestMapping(value="",method = RequestMethod.POST)
    public @ResponseBody
    Boolean CheckUserExist(@RequestBody final String email) {
        if (users.existsUserByEmail(email)) {
            return false;
        }
        return true;
    }

    @RequestMapping(value="",method = RequestMethod.POST)
    public @ResponseBody
    String getThumbnail(@RequestBody final String generalBaseId) {
        GeneralBase gb = generalbase.findById(generalBaseId);
        return gb.getThumbnail();
    }

    @RequestMapping(value="",method = RequestMethod.POST)
    public @ResponseBody
    String getTitle(@RequestBody final String generalBaseId) {
        GeneralBase gb = generalbase.findById(generalBaseId);
        return gb.getTitle();
    }

    //After login
    @RequestMapping(value="",method = RequestMethod.POST)
    public @ResponseBody
    String getCurrentUserEmail() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email;

        if (principal instanceof UserDetails) {
            email = ((UserDetails)principal).getUsername();
        } else {
            email = principal.toString();
        }
        return email;
    }

    @RequestMapping(value="",method = RequestMethod.POST)
    public @ResponseBody
    String getCurrentUserGeneralBaseId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email;

        if (principal instanceof UserDetails) {
            email = ((UserDetails)principal).getUsername();
        } else {
            email = principal.toString();
        }

        User currentUser = users.findByEmail(email);
        return currentUser.getGeneralBaseRef();
    }
    

    @RequestMapping(value="",method = RequestMethod.POST)
    public @ResponseBody
    boolean setCurrentUserName(@RequestBody final String username) {
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String email;

            if (principal instanceof UserDetails) {
                email = ((UserDetails) principal).getUsername();
            } else {
                email = principal.toString();
            }

            User currentUser = users.findByEmail(email);
            GeneralBase gb = generalbase.findById(currentUser.getGeneralBaseRef());
            gb.setTitle(username);
            generalbase.save(gb);
            return true;
        }catch (Exception e){
            return false;
        }
    }


}
