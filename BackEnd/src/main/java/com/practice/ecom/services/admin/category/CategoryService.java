package com.practice.ecom.services.admin.category;

import com.practice.ecom.dto.CategoryDto;
import com.practice.ecom.entity.Category;

import java.util.List;

public interface CategoryService {
    Category createcategory(CategoryDto categoryDto);

    List<Category> getAllCategories();
}
