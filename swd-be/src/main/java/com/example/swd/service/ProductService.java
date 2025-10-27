package com.example.swd.service;

import com.example.swd.dto.request.ProductCreationRequest;
import com.example.swd.dto.request.ProductUpdateRequest;
import com.example.swd.dto.response.ProductResponse;
import com.example.swd.entity.Category;
import com.example.swd.entity.Product;
import com.example.swd.exception.AppException;
import com.example.swd.exception.ErrorCode;
import com.example.swd.mapper.ProductMapper;
import com.example.swd.repository.CategoryRepository;
import com.example.swd.repository.ProductRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ProductService {
    ProductRepository productRepository;
    CategoryRepository categoryRepository;
    ProductMapper productMapper;

    // ====== CREATE ======
    @PreAuthorize("hasRole('ADMIN')")
    public ProductResponse createProduct(ProductCreationRequest request) {
        log.info("Service: Creating product {}", request.getName());

        Product product = productMapper.toProduct(request);

        if (request.getCategories() != null && !request.getCategories().isEmpty()) {
            var categories = new HashSet<Category>(
                    categoryRepository.findAllById(request.getCategories())
            );
            product.setCategories(categories);
        }

        Product saved = productRepository.save(product);
        return productMapper.toProductResponse(saved);
    }

    // ====== READ ALL ======
    public List<ProductResponse> getAllProducts() {
        log.info("Service: Get all products");
        return productMapper.toProductResponse(productRepository.findAll());
    }

    // ====== READ BY ID ======
    public ProductResponse getProductById(String id) {
        log.info("Service: Get product {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        return productMapper.toProductResponse(product);
    }

    // ====== UPDATE ======
    @PreAuthorize("hasRole('ADMIN')")
    public ProductResponse updateProduct(String id, ProductUpdateRequest request) {
        log.info("Service: Updating product {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        productMapper.updateProduct(product, request);

        if (request.getCategories() != null) {
            var categories = new HashSet<Category>(
                    categoryRepository.findAllById(request.getCategories())
            );
            product.setCategories(categories);
        }

        Product updated = productRepository.save(product);
        return productMapper.toProductResponse(updated);
    }

    // ====== DELETE ======
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteProduct(String id) {
        log.info("Service: Deleting product {}", id);
        if (!productRepository.existsById(id)) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }
        productRepository.deleteById(id);
    }
}


