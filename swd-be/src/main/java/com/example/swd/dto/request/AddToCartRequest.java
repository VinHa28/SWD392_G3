    // src/main/java/com/example/swd/dto/request/AddToCartRequest.java
    package com.example.swd.dto.request;

    import lombok.*;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public class AddToCartRequest {
        private String productId;
        private Integer quantity = 1;
    }