package com.teampurple.iccc.repositories;

import com.teampurple.iccc.models.GeneralBase;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface GeneralBaseRepository extends MongoRepository<GeneralBase, String> {
    //GeneralBase findById(String id);
}
