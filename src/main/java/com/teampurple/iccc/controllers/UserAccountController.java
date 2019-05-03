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

import java.util.*;

@RestController
public class UserAccountController {

    // default profile picture
    public static final String DEFAULT_USER_THUMBNAIL = "data:image/png;base64,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";

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
     *           type: String ("User"),
     *           generalBase:
     *             {
     *                  id: String (GeneralBase ID of this GeneralBase),
     *                  typeRef: String (User ID of the User for this GeneralBase),
     *                  type: String ("User"),
     *                  sketch: String (Sketch ID of the Sketch for this GeneralBase),
     *                  title: String (username of this user),
     *                  description: String (bio of this user),
     *                  dateCreated: String (ISO 8601 datetime of when this user was created),
     *                  dateLastEdited: String (ISO 8601 datetime of when this user was last edited),
     *                  children: [ array of ContentBase IDs for this user's series ],
     *                  likers: [ array of User IDs of users who have liked this user ],
     *                  comments: [ array of Comment IDs of this user's comments ]
     *             },
     *           contentBase: null,
     *           user:
     *             {
     *                  id: String (User ID of this User),
     *                  generalBaseRef: String (GeneralBase ID of this user),
     *                  email: String (email of this user),
     *                  password: String (hashed password of this user),
     *                  liked: [ array of GeneralBase IDs of things this user has liked ],
     *                  userCategories: [ array of Category IDs for categories on this user's profile page ],
     *                  homeCategories: [ array of Category IDs for categories on this user's home page ]
     *             },
     *           sketch:
     *             {
     *                  id: String (Sketch ID of this user's sketch),
     *                  thumbnail: String (base 64 encoded image data of this user's sketch),
     *                  data: String (JSON stringified image data for this user's sketch)
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

        Optional<Sketch> sketchOptional = sketchRepository.findById(currentGeneralBase.getSketch());
        if (!sketchOptional.isPresent()) {
            return new Response(Response.ERROR, "Could not find Sketch for current user");
        }
        Sketch sketch = sketchOptional.get();

        AggregateInfo aggregateInfo = new AggregateInfo();
        aggregateInfo.setType(GeneralBase.USER_TYPE);
        aggregateInfo.setGeneralBase(currentGeneralBase);
        aggregateInfo.setUser(currentUser);
        aggregateInfo.setSketch(sketch);

        return new Response(Response.OK, aggregateInfo);
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

            // create a new sketch for the user profile
            Sketch sketch = new Sketch();
            sketch.setThumbnail(DEFAULT_USER_THUMBNAIL);
            sketchRepository.save(sketch);

            // don't forget to set the reference to the User and Sketch related to this GeneralBase
            gb.setTypeRef(newUser.getId());
            gb.setSketch(sketch.getId());
            generalbase.save(gb);

            return new Response(Response.OK);
        } catch (Exception e) {
            return new Response(Response.ERROR);
        }
    }

    /**
     * Description:
     *   - add a new category for a user
     *   - must be logged in as the user to which the category will be added
     *   - can specify if the category should be added to the user's home page or user page
     *
     * Request params:
     *   - location: String ("Home" or "User"; where the new category should be added; required)
     *   - name: String (the name of the category)
     *   - type: String ("User", "Series", "Episode", "Frame", or null for all content; specifies the type of content
     *                   that will show up in the category),
     *   - creator: String (User ID; specifies the user that must have created the content that will show up in the
     *                      category; null indicates that the content can come from anyone),
     *   - searchText: String (the text used for searching in user names/bios and/or content titles/descriptions; can
     *                         be null if you don't want to search by text)
     *
     * Returns:
     *   - status: String ('OK' or 'error')
     *   - content: null
     */
    @PostMapping("/user/categories/add")
    public Response addCategory(@RequestBody NewCategoryItem newCategoryItem) {
        User currentUser = auth.getCurrentUser();
        if (currentUser == null) {
            return new Response(Response.ERROR, "Could not find current logged in user");
        }

        String location = newCategoryItem.getLocation();
        String name = newCategoryItem.getName();
        String type = newCategoryItem.getType();
        String creator = newCategoryItem.getCreator();
        String searchText = newCategoryItem.getSearchText();
        String likedBy = newCategoryItem.getLikedBy();

        // check for valid category location
        if (location == null ||
                (!location.equals(NewCategoryItem.HOME_LOCATION) && !location.equals(NewCategoryItem.USER_LOCATION))) {
            return new Response(Response.ERROR, "Invalid category location: " + location);
        }

        // check for valid category type
        if(isValidCategoryType(type))
        {
            return new Response(Response.ERROR,"Invalid category type: "+type);
        }
        Category category = new Category();
        category.setName(name);
        category.setType(type);
        category.setCreator(creator);
        category.setSearchText(searchText);
        category.setUserRef(currentUser.getId());
        category.setLikedBy(likedBy);//Null by default because we don't normally want this field
        categoryRepository.save(category);

        List<String> oldCategoryIds = null;
        switch (location) {
            case NewCategoryItem.HOME_LOCATION:
                oldCategoryIds = currentUser.getHomeCategories();
                break;
            case NewCategoryItem.USER_LOCATION:
                oldCategoryIds = currentUser.getUserCategories();
                break;
            default:
                return new Response(Response.ERROR, "Invalid category location: " + location);
        }
        oldCategoryIds.add(category.getId());
        users.save(currentUser);

        return new Response(Response.OK);
    }

    // @PostMapping("/user/categories/edit")
    // public Response updateCategory(@RequestBody Category newCategoryItem)
    // {
    //     if(auth.getCurrentUser()==null)
    //     {
    //         return new Response(Response.ERROR,"Could not find current logged in user");
    //     }
    //     // check for valid category type
    //     if(isValidCategoryType(newCategoryItem.getType()))
    //     {
    //         return new Response(Response.ERROR,"Invalid category type: "+newCategoryItem.getType());
    //     }
    //     categoryRepository.findById(newCategoryItem.getId())
    //     Category category=new Category();
    //     category.setId         (newCategoryItem.getId());//---------------------------------------------------------CHANGED
    //     category.setName       (newCategoryItem.getName());
    //     category.setType       (newCategoryItem.getType());
    //     category.setCreator    (newCategoryItem.getCreator());
    //     category.setSearchText (newCategoryItem.getSearchText());
    //     category.setLikedBy    (newCategoryItem.getLikedBy());//Null by default because we don't normally want this field
    //     category.setUserRef    (auth.getCurrentUser().getId());
    //     categoryRepository.save(category);
    //     return new Response    (Response.OK);
    // }

    private boolean isValidCategoryType(String type)
    {
        return type!=null&&!type.equals(GeneralBase.USER_TYPE)&&!type.equals(ContentBase.SERIES)&&
               !type.equals(ContentBase.EPISODE)&&!type.equals(ContentBase.FRAME);
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

    // TODO: think about returning a Response instead so that a status ('OK' or 'error') can be produced
    /**
     * Description:
     *   - get the thumbnail image associated with a given GeneralBase ID
     *
     * Request params:
     *   - id: String (GeneralBase ID to find the image for; query string field)
     *
     * Returns:
     *   - the decoded thumbnail image data associated with the given GeneralBase ID
     */
    @GetMapping(value="/generalBase/thumbnail")
    public ResponseEntity<byte[]> getThumbnail(@RequestParam(value="id") final String generalBaseId) {
        GeneralBase gb = generalbase.findById(generalBaseId).get();
        Sketch sketch = sketchRepository.findById(gb.getSketch()).get();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);

        byte[] media = Base64.getDecoder().decode(sketch.getThumbnail());

        return new ResponseEntity<>(media, headers, HttpStatus.OK);
    }

    // TODO: return a Response so that a status ('OK' or 'error') can be produced
    /**
     * Description:
     *   - get the title field of the GeneralBase with the given GeneralBase ID
     *
     * Request params:
     *   - id: String (GeneralBase ID to search for; query string field)
     *
     * Returns:
     *   - title: String (the title of the GeneralBase with the given GeneralBase ID)
     */
    @GetMapping(value="/generalBase/title")
    public String getTitle(@RequestParam(value="id") final String generalBaseId) {
        GeneralBase gb = generalbase.findById(generalBaseId).get();
        return gb.getTitle();
    }

    // TODO: return a Response so that a status ('OK' or 'error') can be produced
    /**
     * Description:
     *   - get the GeneralBase ID of the current logged in user
     *
     * Request params:
     *   - none
     *
     * Returns:
     *   - id: String (GeneralBase ID of the current logged in user)
     */
    @GetMapping("/generalBase/id")
    public String getCurrentUserGeneralBaseId() {
        User currentUser = auth.getCurrentUser();
        if (currentUser == null) {
            return "{\"id\":\"\"}";
        }
        return "{\"id\":\"" + currentUser.getGeneralBaseRef() + "\"}";
    }

    /**
     * Description:
     *   - get the User ID of the current logged in user
     *
     * Request params:
     *   - none
     *
     * Returns:
     *   - status: String ('OK' or 'error')
     *   - content (if status is 'OK'): String (User ID of current logged in user)
     */
    @GetMapping("/user/id")
    public Response getUserId() {
        User currentUser = auth.getCurrentUser();
        if (currentUser == null) {
            return new Response(Response.ERROR, "Could not find current logged in user");
        }

        return new Response(Response.OK, currentUser.getId());
    }

    // TODO: remove this, as the functionality already exists in /user/edit
    /**
     * Description:
     *   - set the password of the current logged in user
     *   - must be logged in
     *
     * Request params:
     *   - password: String (the new plaintext password to set for the current logged in user)
     *
     * Returns:
     *   - status: String ('OK' or 'error')
     */
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

    // TODO: remove this, as the functionality already exists in /user/edit
    /**
     * Description:
     *   - set the username of the current logged in user
     *   - must be logged in
     *
     * Request params:
     *   - username: String (new username to set for the current logged in user)
     *
     * Returns:
     *   - status: String ('OK' or 'error')
     */
    @PostMapping("/user/username")
    public Response setCurrentUserName(@RequestBody final String username) {
        try {
            User currentUser = auth.getCurrentUser();
            GeneralBase gb = generalbase.findById(currentUser.getGeneralBaseRef()).get();
            gb.setTitle(username);
            generalbase.save(gb);
            return new Response(Response.OK);
        } catch (Exception e){
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
