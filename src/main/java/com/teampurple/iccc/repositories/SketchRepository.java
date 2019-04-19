package com.teampurple.iccc.repositories;

import com.teampurple.iccc.models.Sketch;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SketchRepository extends MongoRepository<Sketch, String> {
}
