package com.teampurple.iccc.controllers;

import com.teampurple.iccc.models.GeneralBase;
import com.teampurple.iccc.models.Response;
import com.teampurple.iccc.models.SearchCriteria;
import com.teampurple.iccc.repositories.GeneralBaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.TextCriteria;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class SearchController {

    @Autowired
    private GeneralBaseRepository generalBaseRepository;

    /**
     * Description:
     *   - search for content by text, looking in the title and description fields
     *
     * Request params:
     *   - searchText: String (the text to use for the search)
     *
     * Returns:
     *   - status: String ('OK' or 'error')
     *   - content: [
     *       {
     *          << GeneralBase objects for now, but will likely change >>
     *       }, ...
     *   ]
     */
    @PostMapping("/search")
    public Response search(@RequestBody SearchCriteria searchCriteria) {
        TextCriteria criteria = TextCriteria.forDefaultLanguage().matchingAny(searchCriteria.getSearchText());
        List<GeneralBase> generalBases = generalBaseRepository.findAllBy(criteria);

        return new Response(Response.OK, generalBases);
    }

}
