package com.teampurple.iccc.controllers;

import com.teampurple.iccc.models.ContentBase;
import com.teampurple.iccc.models.Frame;
import com.teampurple.iccc.models.FrameList;
import com.teampurple.iccc.models.User;
import com.teampurple.iccc.repositories.ContentBaseRepository;
import com.teampurple.iccc.repositories.GeneralBaseRepository;
import com.teampurple.iccc.repositories.UserRepository;
import com.teampurple.iccc.utils.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
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
    private AuthenticationManager am;

    @Autowired
    private Authentication auth;

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

    @GetMapping("/test/user/frames")
    public FrameList getCurrentUserFrames() {
        User currentUser = auth.getCurrentUser();

        FrameList frameList = new FrameList();
        List<Frame> frames = new ArrayList<>();
        frameList.setFrames(frames);
        for (ContentBase contentBase : contentBaseRepository.findAllById(currentUser.getContent())) {
            if (contentBase.getType().equals(ContentBase.FRAME)) {
                Frame frame = new Frame();
                frame.setContentBase(contentBase);
                frames.add(frame);
            }
        }

        return frameList;
    }

}
