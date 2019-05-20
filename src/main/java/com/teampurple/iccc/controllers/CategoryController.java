package com.teampurple.iccc.controllers;

import com.teampurple.iccc.models.*;
import com.teampurple.iccc.repositories.CategoryRepository;
import com.teampurple.iccc.repositories.UserRepository;
import com.teampurple.iccc.utils.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Authentication authentication;

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

    /**
     * Description:
     *   - edit a category
     *   - must be logged in
     *
     * Request Params:
     *   - id: String (Category ID of the category to edit)
     *   - userRef: String (User ID of the user that owns the category to edit)
     *   - name: String (the new name of the category)
     *   - type: String (the type of content defined by this category; either "User", "Series", "Episode", "Frame",
     *                   or null for all content)
     *   - creator: String (new User ID of the user who created the content found by this category)
     *   - searchText: String (the new text to be used for searching in user names/bios and/or content titles/descriptions)
     *   - likedBy: String (new User ID of user that should have liked the content returned by the category)
     *
     * Returns:
     *   - status: String ('OK' or 'error')
     *   - content (if status is 'OK'):
     *       {
     *           id: String (Category ID of the updated category),
     *           userRef: String (User ID of the user that owns the updated category),
     *           name: String (the name of the updated category),
     *           type: String (the type of content defined by the updated category; either "User", "Series", "Episode",
     *                         "Frame", or null for all content),
     *           creator: String (User ID of the user who created the content found by the updated category),
     *           searchText: String (the text used for searching in the user names/bios and/or content titles/descriptions),
     *           likedBy: String (User ID of the user that should have liked the content returned by the category)
     *       }
     */
    @PostMapping("/category/edit")
    public Response editCategory(@RequestBody Category newCategory) {
        try {
            // make sure there is a logged in user
            User currentUser = authentication.getCurrentUser();
            if (currentUser == null) {
                throw new Exception("Must be logged in to edit a category.");
            }

            // make sure the new category type is valid
            if (!isValidCategoryType(newCategory.getType())) {
                throw new Exception("Invalid category type: " + newCategory.getType());
            }

            // make sure an existing category with the specified Category ID exists
            if (newCategory.getId() == null) {
                throw new Exception("Must specify Category ID when editing a category.");
            }
            Optional<Category> oldCategoryOptional = categoryRepository.findById(newCategory.getId());
            if (!oldCategoryOptional.isPresent()) {
                throw new Exception("Failed to find existing category with ID: " + newCategory.getId() + ".");
            }
            Category oldCategory = oldCategoryOptional.get();

            // make sure the logged in user is the same user that created the category
            if (!currentUser.getId().equals(oldCategory.getUserRef())) {
                throw new Exception("Cannot edit a category that you did not create.");
            }

            // edit the category
            oldCategory.setCreator(newCategory.getCreator());
            oldCategory.setName(newCategory.getName());
            oldCategory.setSearchText(newCategory.getSearchText());
            oldCategory.setType(newCategory.getType());
            oldCategory.setLikedBy(newCategory.getLikedBy());
            categoryRepository.save(oldCategory);

            return new Response(Response.OK, oldCategory);
        } catch (Exception e) {
            return new Response(Response.ERROR, e.toString());
        }
    }

    /**
     * Description:
     *   - delete a category
     *   - must be logged in
     *
     * Request Params:
     *   - id: String (Category ID of the category to delete)
     *
     * Returns:
     *   - status: String ('OK' or 'error')
     *   - content: null
     */
    @GetMapping("/category/delete")
    public Response deleteCategory(@RequestParam("id") final String categoryId) {
        try {
            // make sure the user is logged in
            User currentUser = authentication.getCurrentUser();
            if (currentUser == null) {
                throw new Exception("Must be logged in to delete a category.");
            }

            // make sure the logged in user owns the category being deleted
            if (!currentUser.getHomeCategories().contains(categoryId)
                    && !currentUser.getUserCategories().contains(categoryId)) {
                throw new Exception("Cannot delete a category you do not own.");
            }

            // delete the category
            if (currentUser.getHomeCategories().contains(categoryId)){
                currentUser.getHomeCategories().remove(categoryId);
            } else if (currentUser.getUserCategories().contains(categoryId)){
                currentUser.getUserCategories().remove(categoryId);
            }
            userRepository.save(currentUser);
            categoryRepository.deleteById(categoryId);

            return new Response(Response.OK);
        } catch (Exception e) {
            return new Response(Response.ERROR);
        }
    }

    private boolean isValidCategoryType(String type) {
        return type == null || type.equals(GeneralBase.USER_TYPE) || type.equals(ContentBase.SERIES) ||
                type.equals(ContentBase.EPISODE) || type.equals(ContentBase.FRAME) ||
                type.equals(NewCategoryItem.CONTENT_TYPE) || type.equals(NewCategoryItem.ALL_TYPE);
    }

}
