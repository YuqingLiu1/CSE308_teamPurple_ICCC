package com.teampurple.iccc.utils;

import com.teampurple.iccc.models.GeneralBase;
import com.teampurple.iccc.models.User;
import com.teampurple.iccc.repositories.GeneralBaseRepository;
import com.teampurple.iccc.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class Authentication {

    private UserRepository userRepository;
    private GeneralBaseRepository generalBaseRepository;

    @Autowired
    public Authentication(UserRepository userRepository, GeneralBaseRepository generalBaseRepository) {
        this.userRepository = userRepository;
        this.generalBaseRepository = generalBaseRepository;
    }

    public User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email;

        if (principal instanceof UserDetails) {
            email = ((UserDetails)principal).getUsername();
        } else {
            email = principal.toString();
        }

        return userRepository.findByEmail(email);
    }

    public GeneralBase getCurrentUserGeneralBase() {
        User currentUser = getCurrentUser();

        if (currentUser == null) {
            return null;
        }

        return generalBaseRepository.findById(currentUser.getGeneralBaseRef()).get();
    }

}
