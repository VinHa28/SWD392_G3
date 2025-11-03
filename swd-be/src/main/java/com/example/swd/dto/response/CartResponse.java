// src/main/java/com/example/swd/dto/response/CartResponse.java
package com.example.swd.dto.response;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {
    private Integer id;
    private Double totalPrice;
    private List<CartItemDto> items;
}