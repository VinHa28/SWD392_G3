package com.example.swd.mapper;

import com.example.swd.dto.request.CategoryCreationRequest;
import com.example.swd.dto.request.CategoryUpdateRequest;
import com.example.swd.dto.response.CategoryResponse;
import com.example.swd.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface CategoryMapper {
    Category toCategory(CategoryCreationRequest request);

    CategoryResponse toCategoryResponse(Category category);

    List<CategoryResponse> toCategoryResponse(List<Category> categories);

    void updateCategory(@MappingTarget Category category, CategoryUpdateRequest request);
}
