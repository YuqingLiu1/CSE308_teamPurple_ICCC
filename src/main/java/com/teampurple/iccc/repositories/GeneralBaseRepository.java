package com.teampurple.iccc.repositories;

import com.teampurple.iccc.models.GeneralBase;
import org.springframework.data.mongodb.core.query.TextCriteria;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;


public interface GeneralBaseRepository extends MongoRepository<GeneralBase, String> {

    List<GeneralBase> findAllBy(TextCriteria criteria);

}
