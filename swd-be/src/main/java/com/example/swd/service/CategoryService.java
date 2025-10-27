package com.example.swd.service;

import com.example.swd.dto.request.CategoryCreationRequest;
import com.example.swd.dto.request.CategoryUpdateRequest;
import com.example.swd.dto.response.CategoryResponse;
import com.example.swd.entity.Category;
import com.example.swd.exception.AppException;
import com.example.swd.exception.ErrorCode;
import com.example.swd.mapper.CategoryMapper;
import com.example.swd.repository.CategoryRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CategoryService {
    CategoryRepository categoryRepository;
    CategoryMapper categoryMapper;

    // ====== CREATE ======
    @PreAuthorize("hasRole('ADMIN')")
    public CategoryResponse createCategory(CategoryCreationRequest request) {
        log.info("Service: Creating category {}", request.getName());

        // kiểm tra trùng tên
        if (categoryRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.CATEGORY_EXISTED);
        }

        Category category = categoryMapper.toCategory(request);
        Category saved = categoryRepository.save(category);

        return categoryMapper.toCategoryResponse(saved);
    }

    // ====== READ ALL ======
    public List<CategoryResponse> getAllCategories() {
        log.info("Service: Get all categories");
        return categoryMapper.toCategoryResponse(categoryRepository.findAll());
    }

    // ====== READ BY ID ======
    public CategoryResponse getCategoryById(String id) {
        log.info("Service: Get category {}", id);
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        return categoryMapper.toCategoryResponse(category);
    }

    // ====== UPDATE ======
    @PreAuthorize("hasRole('ADMIN')")
    public CategoryResponse updateCategory(String id, CategoryUpdateRequest request) {
        log.info("Service: Updating category {}", id);
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        categoryMapper.updateCategory(category, request);

        Category updated = categoryRepository.save(category);
        return categoryMapper.toCategoryResponse(updated);
    }

    // ====== DELETE ======
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteCategory(String id) {
        log.info("Service: Deleting category {}", id);
        if (!categoryRepository.existsById(id)) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }
        categoryRepository.deleteById(id);
    }
}
