package com.teampurple.iccc.repositories;

import com.teampurple.iccc.models.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;


public interface CommentRepository extends MongoRepository<Comment, String>{
    List<Comment> findByAuthor(String comment);
}
