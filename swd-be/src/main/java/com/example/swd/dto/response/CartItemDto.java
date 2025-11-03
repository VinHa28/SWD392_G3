package com.example.swd.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.*;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor


public  class CartItemDto {
private String imageUrl;
    private String productId;
    private String productName;
    private Integer quantity;
    private Double unitPrice;
}
