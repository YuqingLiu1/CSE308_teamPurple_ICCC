package com.teampurple.iccc.repositories;

import com.teampurple.iccc.models.ContentBase;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ContentBaseRepository extends MongoRepository<ContentBase, String> {

    List<ContentBase> findByAuthor(String userId);

    @Query("{ 'author': ?0, '_public': true }")
    List<ContentBase> findVisibleByAuthor(String authorId);

}
