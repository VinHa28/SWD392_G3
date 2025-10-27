package com.example.swd.controller;

import com.example.swd.dto.request.ApiResponse;
import com.example.swd.dto.request.ProductCreationRequest;
import com.example.swd.dto.request.ProductUpdateRequest;
import com.example.swd.dto.response.ProductResponse;
import com.example.swd.service.ProductService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ProductController {
    ProductService productService;

    // ====== CREATE ======
    @PostMapping
    ApiResponse<ProductResponse> createProduct(@RequestBody @Valid ProductCreationRequest request) {
        log.info("Controller: Creating product");
        ApiResponse<ProductResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(productService.createProduct(request));
        return apiResponse;
    }

    // ====== GET ALL ======
    @GetMapping
    ApiResponse<List<ProductResponse>> getProducts() {
        log.info("Controller: Get all products");
        ApiResponse<List<ProductResponse>> apiResponse = new ApiResponse<>();
        apiResponse.setResult(productService.getAllProducts());
        return apiResponse;
    }

    // ====== GET BY ID ======
    @GetMapping("/{productId}")
    ApiResponse<ProductResponse> getProduct(@PathVariable String productId) {
        log.info("Controller: Get product by id {}", productId);
        ApiResponse<ProductResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(productService.getProductById(productId));
        return apiResponse;
    }

    // ====== UPDATE ======
    @PutMapping("/{productId}")
    ApiResponse<ProductResponse> updateProduct(
            @PathVariable String productId,
            @RequestBody @Valid ProductUpdateRequest request) {
        log.info("Controller: Updating product {}", productId);
        ApiResponse<ProductResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(productService.updateProduct(productId, request));
        return apiResponse;
    }

    // ====== DELETE ======
    @DeleteMapping("/{productId}")
    ApiResponse<String> deleteProduct(@PathVariable String productId) {
        log.info("Controller: Deleting product {}", productId);
        productService.deleteProduct(productId);
        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setMessage("Product deleted successfully");
        return apiResponse;
    }
}
