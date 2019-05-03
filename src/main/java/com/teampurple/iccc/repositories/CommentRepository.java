package com.teampurple.iccc.repositories;

import com.teampurple.iccc.models.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CommentRepository extends MongoRepository<Comment, String>{
}
