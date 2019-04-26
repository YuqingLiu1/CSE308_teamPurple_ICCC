package com.teampurple.iccc.repositories;

import com.teampurple.iccc.models.Category;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CategoryRepository extends MongoRepository<Category, String> {
}
