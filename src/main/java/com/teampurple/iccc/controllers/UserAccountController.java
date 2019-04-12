package com.teampurple.iccc.controllers;

import com.teampurple.iccc.models.GeneralBase;
import com.teampurple.iccc.models.User;
import com.teampurple.iccc.repositories.GeneralBaseRepository;
import com.teampurple.iccc.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/")
public class UserAccountController {
    @Autowired
    private UserRepository users;
    private GeneralBaseRepository generalbase;

    @PostMapping("/user/add")
    public boolean addUserAccount(@RequestBody final String userInfor) {
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
            user.setPassword(new BCryptPasswordEncoder(10).encode(password));
            user.setGeneralBaseRef(gb.getId());
            users.save(user);
            return true;
        }
        catch(Exception e){
            return false;
        }
    }


    @PostMapping("/user/exists")
    public Boolean checkUserExist(@RequestBody final String email) {
        if (users.existsUserByEmail(email)) {
            return false;
        }
        return true;
    }

    @GetMapping(value="/generalBase/thumbnail")
    public String getThumbnail(@RequestParam(value="id") final String generalBaseId) {
        GeneralBase gb = generalbase.findById(generalBaseId);
        return gb.getThumbnail();
    }

    @GetMapping(value="/generalBase/title")
    public String getTitle(@RequestParam(value="id") final String generalBaseId) {
        GeneralBase gb = generalbase.findById(generalBaseId);
        return gb.getTitle();
    }

    //After login
//    @GetMapping(value="")
//    public @ResponseBody
//    String getCurrentUserEmail() {
//        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        String email;
//
//        if (principal instanceof UserDetails) {
//            email = ((UserDetails)principal).getUsername();
//        } else {
//            email = principal.toString();
//        }
//        return email;
//    }

    @GetMapping(value="/generalBase/id")
    public String getCurrentUserGeneralBaseId() {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return "";
        }
        return currentUser.getGeneralBaseRef();
    }
    

    @PostMapping(value="/user/username")
    public boolean setCurrentUserName(@RequestBody final String username) {
        try {
            User currentUser = getCurrentUser();
            GeneralBase gb = generalbase.findById(currentUser.getGeneralBaseRef());
            gb.setTitle(username);
            generalbase.save(gb);
            return true;
        }catch (Exception e){
            return false;
        }
    }

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email;

        if (principal instanceof UserDetails) {
            email = ((UserDetails)principal).getUsername();
        } else {
            email = principal.toString();
        }

        return users.findByEmail(email);
    }

}
