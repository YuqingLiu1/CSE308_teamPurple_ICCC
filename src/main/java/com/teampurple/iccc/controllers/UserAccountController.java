package com.teampurple.iccc.controllers;

import com.mongodb.MongoException;
import com.teampurple.iccc.models.*;
import com.teampurple.iccc.repositories.CategoryRepository;
import com.teampurple.iccc.repositories.GeneralBaseRepository;
import com.teampurple.iccc.repositories.SketchRepository;
import com.teampurple.iccc.repositories.UserRepository;
import com.teampurple.iccc.utils.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.List;

@RestController
public class UserAccountController {

    @Autowired
    private UserRepository users;
    @Autowired
    private GeneralBaseRepository generalbase;
    @Autowired
    private Authentication auth;
    @Autowired
    private SketchRepository sketchRepository;
    @Autowired
    private CategoryRepository categoryRepository;

    //TODO Create a function
    // @SuppressWarnings("Duplicates")
    // @GetMapping(value="/generalBase/title")
    // public Response getGeneralBaseInfo(@RequestParam(value="id") final String generalBaseId)
    // {
    //     GeneralBase gb=generalbase.findById(generalBaseId).get();
    //     User currentUser=auth.getCurrentUser();
    //     GeneralBase currentGeneralBase=gb;
    //     if(currentUser==null||currentGeneralBase==null)
    //     {
    //         return new Response(Response.ERROR);
    //     }
    //     // get the user's categories
    //     List<Category> userCategories=getCategories(currentUser.getUserCategories());
    //     // get the default "home" categories
    //     List<Category> homeCategories=getCategories(currentUser.getHomeCategories());
    //     UserInfo userInfo=new UserInfo();
    //     userInfo.setGeneralBase(currentGeneralBase);
    //     userInfo.setUsername(currentGeneralBase.getTitle());
    //     userInfo.setBio(currentGeneralBase.getDescription());
    //     userInfo.setEmail(currentUser.getEmail());
    //     userInfo.setPassword(currentUser.getPassword());
    //     userInfo.setUserCategories(userCategories);
    //     userInfo.setUserCategories(userCategories);
    //     userInfo.setHomeCategories(homeCategories);
    //     userInfo.setSketchRef(currentGeneralBase.getSketch());
    //     userInfo.setUser(currentUser);
    //     return new Response(Response.OK,userInfo);
    // }


    // @GetMapping("/general/info")


    /**
     * Description:
     *   - get information about current logged in user
     *   - must be logged in
     *
     * Request params:
     *   - none
     *
     * Returns:
     *   - status: String ('OK' or 'error')
     *   - content (if status is 'OK'):
     *       {
     *           username: String (the username of the current logged in user),
     *           bio: String (the bio of the current logged in user),
     *           email: String (the email of the current logged in user),
     *           password: String (the hashed password of the current logged in user),
     *           sketchRef: String (Sketch ID of the sketch associated with the current logged in user),
     *           userCategories: [ array of Category IDs for categories on the user's account page ],
     *           homeCategories: [ array of Category IDs for categories on the user's home page ],
     *           user:
     *             {
     *                 id: String (User ID of the current logged in user),
     *                 generalBaseRef: String (GeneralBase ID of the current logged in user),
     *                 email: String (email of the current logged in user),
     *                 password: String (hashed password of the current loggedd in user),
     *                 liked: [ array of GeneralBase IDs of things the current logged in user has liked ],
     *                 content: [ array of ContentBase IDs of content created by the current logged in user ],
     *                 userCategories: [ array of Category IDs for categories on the user's account page ],
     *                 homeCategories: [ array of Category IDs for categories on the user's home page ]
     *             },
     *           generalBase:
     *             {
     *                 id: String (GeneralBase ID of the current logged in user),
     *                 typeRef: String (User ID of the current logged in user),
     *                 type: String ("User'),
     *                 sketch: String (Sketch ID of the current logged in user's profile picture sketch),
     *                 title: String (username of the current logged in user),
     *                 description: String (bio of the current logged in user),
     *                 dateCreated: String (ISO 8601 datetime of when the user account was created),
     *                 dateLastEdited: String (ISO 8601 datetime of when the user account was last edited),
     *                 children: [ array of ContentBase IDs of the current logged in user's series ],
     *                 likers: [ array of User IDs of users who have liked the current logged in user ],
     *                 comments: [ array of Comment IDs of the current logged in user's comments ]
     *             }
     *       }
     */
    @GetMapping("/user/info")
    public Response getUserInfo() {
        User currentUser = auth.getCurrentUser();
        GeneralBase currentGeneralBase = auth.getCurrentUserGeneralBase();

        if (currentUser == null || currentGeneralBase == null) {
            return new Response(Response.ERROR);
        }

        // get the user's categories
        List<Category> userCategories = getCategories(currentUser.getUserCategories());

        // get the default "home" categories
        List<Category> homeCategories = getCategories(currentUser.getHomeCategories());

        UserInfo userInfo = new UserInfo();

        userInfo.setGeneralBase(currentGeneralBase);
        userInfo.setUsername(currentGeneralBase.getTitle());
        userInfo.setBio(currentGeneralBase.getDescription());
        userInfo.setEmail(currentUser.getEmail());
        userInfo.setPassword(currentUser.getPassword());
        userInfo.setUserCategories(userCategories);
        userInfo.setUserCategories(userCategories);
        userInfo.setHomeCategories(homeCategories);
        userInfo.setSketchRef(currentGeneralBase.getSketch());
        userInfo.setUser(currentUser);

        return new Response(Response.OK, userInfo);
    }

    // TODO: handle updating categories, liked content/users, and comments
    // TODO: change the dateLastEdited when making updates
    /**
     * Description:
     *   - edit information about the current logged in user
     *   - must be logged in
     *   - the logged in user can only edit their own information
     *
     * Request params:
     *   - username: String (new username of the current logged in user; optional)
     *   - bio: String (new bio of the current logged in user; optional),
     *   - email: String (new email of the current logged in user; optional)
     *     - note that emails uniquely identify users, so the current logged in user's email cannot be changed to
     *       an email address that matches that of another existing user
     *   - password: String (new plaintext password of the current logged in user; optional)
     *
     * Returns:
     *   - status: String ('OK' or 'error')
     */
    @PostMapping("/user/edit")
    public Response editUserInfo(@RequestBody UserInfo userInfo) {
        User currentUser = auth.getCurrentUser();
        GeneralBase currentGeneralBase = generalbase.findById(currentUser.getGeneralBaseRef()).get();
        if (currentUser == null || currentGeneralBase == null) {
            return new Response("error");
        }

        // only change the appropriate properties
        String username = userInfo.getUsername();
        String password = userInfo.getPassword();
        String email = userInfo.getEmail();
        String bio = userInfo.getBio();
        if (username != null) {
            currentGeneralBase.setTitle(username);
        }
        if (password != null) {
            currentUser.setPassword(new BCryptPasswordEncoder().encode(password));
        }
        if (email != null) {
            currentUser.setEmail(email);
        }
        if (bio != null) {
            currentGeneralBase.setDescription(bio);
        }

        // don't forget to save changes to database
        try {
            generalbase.save(currentGeneralBase);
            users.save(currentUser);
        } catch (MongoException ex) {
            return new Response(Response.ERROR);
        }

        return new Response(Response.OK);
    }

    // TODO: create a new sketch for the new user's profile picture upon creation
    /**
     * Description:
     *   - create a new user
     *   - provided email must be unique among existing users' emails in the database
     *
     * Request params:
     *   - username: String (username of the new user to create)
     *   - password: String (plaintext password of the new user to create),
     *   - email: String (email of the new user to create)
     *
     * Returns:
     *   - status: String ('OK' or 'error')
     */
    @PostMapping(value = "/user/add")
    public Response addUserAccount(@RequestBody NewUser user) {
        try {
            GeneralBase gb = new GeneralBase();
            gb.setType(GeneralBase.USER_TYPE);
            gb.setTitle(user.getUsername());
            gb.setDescription("Hello! I am " + user.getUsername() + ".");
            gb.setDateCreated(new Date());
            gb.setDateLastEdited(new Date());
            generalbase.save(gb);

            User newUser = new User(user.getEmail(), new BCryptPasswordEncoder().encode(user.getPassword()));
            newUser.setGeneralBaseRef(gb.getId());
            users.save(newUser);

            // don't forget to set the reference to the contentbase or user related to this generalbase
            gb.setTypeRef(newUser.getId());
            generalbase.save(gb);

            return new Response(Response.OK);
        } catch (Exception e) {
            return new Response(Response.ERROR);
        }
    }

    /**
     * Description:
     *   - check if a user with a given email address exists
     *
     * Request params:
     *   - email: String (email of user we are searching for)
     *
     * Returns:
     *   - status: String ('OK' or 'error')
     */
    @PostMapping("/user/exists")
    public Response checkUserExist(@RequestBody UserInfo userInfo) {
        if (!users.existsByEmail(userInfo.getEmail())) {
            return new Response(Response.ERROR);
        }
        return new Response(Response.OK);
    }

    @GetMapping(value="/generalBase/thumbnail")
    public ResponseEntity<byte[]> getThumbnail(@RequestParam(value="id") final String generalBaseId) {
        GeneralBase gb = generalbase.findById(generalBaseId).get();
        Sketch sketch = sketchRepository.findById(gb.getSketch()).get();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);

        byte[] media = Base64.getDecoder().decode(sketch.getThumbnail());

        return new ResponseEntity<>(media, headers, HttpStatus.OK);
    }

    @GetMapping(value="/generalBase/title")
    public String getTitle(@RequestParam(value="id") final String generalBaseId) {
        GeneralBase gb = generalbase.findById(generalBaseId).get();
        return gb.getTitle();
    }

    @GetMapping("/generalBase/id")
    public String getCurrentUserGeneralBaseId() {
        User currentUser = auth.getCurrentUser();
        if (currentUser == null) {
            return "{\"id\":\"\"}";
        }
        return "{\"id\":\"" + currentUser.getGeneralBaseRef() + "\"}";
    }

    @PostMapping("/user/setpassword")
    public Response setCurrentUserPassword(@RequestBody final String password) {
        try {
            User currentUser = auth.getCurrentUser();
            currentUser.setPassword(new BCryptPasswordEncoder(10).encode(password));
            users.save(currentUser);
            return new Response(Response.OK);
        }catch (Exception e){
            return new Response(Response.ERROR);
        }
    }

    @PostMapping("/user/username")
    public Response setCurrentUserName(@RequestBody final String username) {
        try {
            User currentUser = auth.getCurrentUser();
            GeneralBase gb = generalbase.findById(currentUser.getGeneralBaseRef()).get();
            gb.setTitle(username);
            generalbase.save(gb);
            return new Response(Response.OK);
        }catch (Exception e){
            return new Response(Response.ERROR);
        }
    }

    /**
     * Get a list of categories given a list of category ids.
     * @param categoryIds The list of category ids.
     * @return A list of categories corresponding to the category ids.
     */
    private List<Category> getCategories(List<String> categoryIds) {
        List<Category> categories = new ArrayList<>();
        for (Category category : categoryRepository.findAllById(categoryIds)) {
            categories.add(category);
        }
        return categories;
    }

    @GetMapping("/others/info")
    public Response getOtherUserInfo(@RequestParam(value="id") String generalBaseID){
        try{
            GeneralBase generalBase = generalbase.findById(generalBaseID).get();
            if (generalBase == null){
                return new Response(Response.ERROR);
            }
            String typeRef = generalBase.getTypeRef();
            User user = users.findById(typeRef).get();
            if (user == null){
                return new Response(Response.ERROR);
            }

            List<Category> userCategories = getCategories(user.getUserCategories());
            List<Category> homeCategories = getCategories(user.getHomeCategories());

            UserInfo other = new UserInfo();

            other.setGeneralBase(generalBase);
            other.setUsername(generalBase.getTitle());
            other.setBio(generalBase.getDescription());
            other.setEmail(user.getEmail());
            other.setPassword(null);
            other.setUserCategories(userCategories);
            other.setUserCategories(userCategories);
            other.setHomeCategories(homeCategories);
            other.setSketchRef(generalBase.getSketch());
            other.setUser(user);

            return new Response(Response.OK, other);


        }catch(Exception e){
            return new Response(Response.ERROR);
        }
    }


}
