package com.teampurple.iccc.services;

import com.teampurple.iccc.models.GeneralBase;
import com.teampurple.iccc.models.User;
import com.teampurple.iccc.repositories.GeneralBaseRepository;
import com.teampurple.iccc.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

public class MongoUserDetailsService implements UserDetailsService {

    @Autowired
    private GeneralBaseRepository generalBaseRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        List<GeneralBase> possibleGeneralBases = generalBaseRepository.findByTitle(username);
        Optional<User> user = null;
        GeneralBase generalBase = null;
        for (GeneralBase candidate : possibleGeneralBases) {
            if (candidate.getType().equals("User")) {
                generalBase = candidate;
                user = userRepository.findById(candidate.getTypeRef());
                break;
            }
        }

        if (!user.isPresent()) {
            throw new UsernameNotFoundException("User not found");
        }

        List<SimpleGrantedAuthority> authorities = Arrays.asList(new SimpleGrantedAuthority("user"));

        return new org.springframework.security.core.userdetails.User(generalBase.getTitle(), user.get().getPassword(), authorities);
    }
}
