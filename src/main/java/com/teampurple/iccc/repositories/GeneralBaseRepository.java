package com.teampurple.iccc.repositories;

import com.teampurple.iccc.models.GeneralBase;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface GeneralBaseRepository extends MongoRepository<GeneralBase, String> {
}
