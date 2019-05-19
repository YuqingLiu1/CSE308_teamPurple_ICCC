package com.teampurple.iccc.repositories;

import com.teampurple.iccc.models.Sketch;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;

public interface SketchRepository extends MongoRepository<Sketch, String> {

    @Query(value="{ '_id': ?0 }", fields="{ '_id': 1 }")
    Optional<Sketch> findByIdAndExcludeAllData(String id);

    @Query(value="{ '_id': ?0 }", fields="{ '_id': 1, 'thumbnail': 1 }")
    Optional<Sketch> findByIdAndExcludeJSONData(String id);

}
