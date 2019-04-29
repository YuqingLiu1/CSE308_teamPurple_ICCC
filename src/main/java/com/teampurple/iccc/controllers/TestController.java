package com.teampurple.iccc.controllers;

import com.teampurple.iccc.models.*;
import com.teampurple.iccc.repositories.*;
import com.teampurple.iccc.utils.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@RestController
public class TestController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GeneralBaseRepository generalBaseRepository;

    @Autowired
    private ContentBaseRepository contentBaseRepository;

    @Autowired
    private SketchRepository sketchRepository;

    @Autowired
    private AuthenticationManager am;

    @Autowired
    private Authentication auth;

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping("/test/getuser")
    public User getUser(@RequestParam(value="email", defaultValue="testemail") String email) {
        return userRepository.findByEmail(email);
    }

    @PostMapping("/test/adduser")
    public void addUser(@RequestBody User user) {
        user.setPassword(new BCryptPasswordEncoder(10).encode(user.getPassword()));
        userRepository.save(user);
    }

    @GetMapping("/test/adduser")
    public void test() {
        return;
    }

    @PostMapping("/test/upload")
    public void upload(@RequestParam("file") MultipartFile file) {
        try {
            String encodedData = Base64.getEncoder().encodeToString(file.getBytes());
            System.out.println(encodedData);
        } catch (Exception e) {

        }
    }

    /**
     * Get all of the current user's series.
     */
    @GetMapping("/test/user/series")
    public Response getCurrentUserSeries() {
        User currentUser = auth.getCurrentUser();

        SeriesList seriesList = new SeriesList();
        List<Series> series = new ArrayList<>();
        seriesList.setSeriesList(series);
        for (ContentBase contentBase : contentBaseRepository.findAllById(currentUser.getContent())) {
            if (contentBase.getType().equals(ContentBase.SERIES)) {
                GeneralBase generalBase = generalBaseRepository.findById(contentBase.getGeneralBaseRef()).get();
                Sketch sketch = sketchRepository.findById(generalBase.getSketch()).get();
                Series series1 = new Series();
                series1.setContentBase(contentBase);
                series1.setGeneralBase(generalBase);
                series1.setSketch(sketch);
                series.add(series1);
            }
        }

        return new Response(Response.OK, seriesList);
    }

    /**
     * Get all of the current user's episodes.
     */
    @GetMapping("/test/user/episodes")
    public EpisodeList getCurrentUserEpisodes() {
        User currentUser = auth.getCurrentUser();

        EpisodeList episodeList = new EpisodeList();
        List<Episode> episodes = new ArrayList<>();
        episodeList.setEpisodeList(episodes);
        for (ContentBase contentBase : contentBaseRepository.findAllById(currentUser.getContent())) {
            if (contentBase.getType().equals(ContentBase.EPISODE)) {
                GeneralBase generalBase = generalBaseRepository.findById(contentBase.getGeneralBaseRef()).get();
                Episode episode = new Episode();
                episode.setContentBase(contentBase);
                episode.setGeneralBase(generalBase);
                episodes.add(episode);
            }
        }

        return episodeList;
    }

    /**
     * Get all of the current user's frames.
     */
    @GetMapping("/test/user/frames")
    public FrameList getCurrentUserFrames() {
        User currentUser = auth.getCurrentUser();

        FrameList frameList = new FrameList();
        List<Frame> frames = new ArrayList<>();
        frameList.setFrames(frames);
        for (ContentBase contentBase : contentBaseRepository.findAllById(currentUser.getContent())) {
            if (contentBase.getType().equals(ContentBase.FRAME)) {
                GeneralBase generalBase = generalBaseRepository.findById(contentBase.getGeneralBaseRef()).get();
                Frame frame = new Frame();
                frame.setContentBase(contentBase);
                frame.setGeneralBase(generalBase);
                frames.add(frame);
            }
        }

        return frameList;
    }

    @GetMapping("/test/userlist")
    public UserList getAllUserList(){
        UserList userList = new UserList();
        List<UserItem> users = new ArrayList<>();
        for (User user : userRepository.findAll()){
            UserItem userItem = new UserItem();
            userItem.setUsername(generalBaseRepository.findById(user.getGeneralBaseRef()).get().getTitle());
            userItem.setBio(generalBaseRepository.findById(user.getGeneralBaseRef()).get().getDescription());
            userItem.setemail(user.getEmail());
            userItem.setThumbnail(sketchRepository.findById(generalBaseRepository.findById(user.getGeneralBaseRef()).get().getSketch()).get().getThumbnail());
            userItem.setgeneralbase(user.getGeneralBaseRef());
            userItem.setUserCategories(getCategories(user.getUserCategories()));
            userItem.setHomeCategories(getCategories(user.getHomeCategories()));
            users.add(userItem);
        }
        userList.setUserlist(users);
        return userList;
    }

    private List<Category> getCategories(List<String> categoryIds) {
        List<Category> categories = new ArrayList<>();
        for (Category category : categoryRepository.findAllById(categoryIds)) {
            categories.add(category);
        }
        return categories;
    }

    @PostMapping("/test/boolean")
    public Response testBoolean(@RequestBody ContentInfo contentInfo) {
        if (contentInfo.getPublic() == null) {
            return new Response(Response.OK, "I think public is null");
        } else if (contentInfo.getPublic()) {
            return new Response(Response.OK, "I think public is true");
        } else {
            return new Response(Response.OK, "I think public is false");
        }
    }

}
