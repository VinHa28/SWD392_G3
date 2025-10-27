package com.example.swd.controller;

import com.example.swd.dto.request.ApiResponse;
import com.example.swd.dto.request.CategoryCreationRequest;
import com.example.swd.dto.request.CategoryUpdateRequest;
import com.example.swd.dto.response.CategoryResponse;
import com.example.swd.service.CategoryService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CategoryController {
    CategoryService categoryService;

    // ====== CREATE ======
    @PostMapping
    ApiResponse<CategoryResponse> createCategory(@RequestBody @Valid CategoryCreationRequest request) {
        log.info("Controller: Creating category");
        ApiResponse<CategoryResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(categoryService.createCategory(request));
        return apiResponse;
    }

    // ====== GET ALL ======
    @GetMapping
    ApiResponse<List<CategoryResponse>> getCategories() {
        log.info("Controller: Getting all categories");
        ApiResponse<List<CategoryResponse>> apiResponse = new ApiResponse<>();
        apiResponse.setResult(categoryService.getAllCategories());
        return apiResponse;
    }

    // ====== GET BY ID ======
    @GetMapping("/{categoryId}")
    ApiResponse<CategoryResponse> getCategory(@PathVariable String categoryId) {
        log.info("Controller: Getting category by id {}", categoryId);
        ApiResponse<CategoryResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(categoryService.getCategoryById(categoryId));
        return apiResponse;
    }

    // ====== UPDATE ======
    @PutMapping("/{categoryId}")
    ApiResponse<CategoryResponse> updateCategory(
            @PathVariable String categoryId,
            @RequestBody @Valid CategoryUpdateRequest request) {
        log.info("Controller: Updating category {}", categoryId);
        ApiResponse<CategoryResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(categoryService.updateCategory(categoryId, request));
        return apiResponse;
    }

    // ====== DELETE ======
    @DeleteMapping("/{categoryId}")
    ApiResponse<String> deleteCategory(@PathVariable String categoryId) {
        log.info("Controller: Deleting category {}", categoryId);
        categoryService.deleteCategory(categoryId);
        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setMessage("Category deleted successfully");
        return apiResponse;
    }
}
