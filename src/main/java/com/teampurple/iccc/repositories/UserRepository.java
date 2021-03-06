package com.teampurple.iccc.repositories;

import com.teampurple.iccc.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email);
    Boolean existsByEmail(String email);
}
