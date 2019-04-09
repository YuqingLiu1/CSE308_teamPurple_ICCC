package com.teampurple.iccc.repositories;

import com.teampurple.iccc.models.GeneralBase;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface GeneralBaseRepository extends MongoRepository<GeneralBase, ObjectId> {
    List<GeneralBase> findByTitle(String title);
}
