package com.teampurple.iccc.repositories;

import com.teampurple.iccc.models.ContentBase;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ContentBaseRepository extends MongoRepository<ContentBase, String> {
}
