package com.teampurple.iccc.repositories;

import com.teampurple.iccc.models.ContentBase;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ContentBaseRepository extends MongoRepository<ContentBase, String> {

    List<ContentBase> findByAuthor(String userId);

    @Query("{ '_public': ?0, 'type': ?1 }")
    List<ContentBase> findByPublicAndType(boolean _public, String type);

    @Query("{ '_public': ?0, 'author': ?1 }")
    List<ContentBase> findByPublicAndAuthor(boolean _public, String authorId);

    @Query("{ '_public': ?0, 'type': ?1, 'author': ?2 }")
    List<ContentBase> findByPublicAndTypeAndAuthor(boolean _public, String type, String authorId);

}
