package com.teampurple.iccc.controllers;

import com.teampurple.iccc.models.Category;
import com.teampurple.iccc.models.Response;
import com.teampurple.iccc.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    /**
     * Description:
     *   - get information about a category by Category ID
     *
     * Request params:
     *   - id: String (Category ID of category to get info about; query string field)
     *
     * Returns:
     *   - status: String ('OK' or 'error')
     *   - content:
     *       {
     *           id: String (Category ID of the category),
     *           userRef: String (User ID of the user this category belongs to),
     *           name: String (the name of this category),
     *           type: String (the type of content defined by this category, either "User", "Series", "Episode",
     *                 "Frame", or null for all content (not including users),
     *           creator: String (User ID of the user who created all the content defined by this category),
     *           searchText: String (the text used for searching in user names/bios and/or content titles/descriptions)
     *       }
     */
    @GetMapping("/category/info")
    public Response getCategoryInfo(@RequestParam("id") final String categoryId) {
        Optional<Category> categoryOptional = categoryRepository.findById(categoryId);
        if (!categoryOptional.isPresent()) {
            return new Response(Response.ERROR, "Could not find category by id: " + categoryId);
        }
        Category category = categoryOptional.get();

        return new Response(Response.OK, category);
    }

}
