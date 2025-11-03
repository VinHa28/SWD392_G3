// src/main/java/com/example/swd/mapper/CartMapper.java
package com.example.swd.mapper;

import com.example.swd.dto.response.CartResponse;
import com.example.swd.dto.response.CartItemDto; // ← Import đúng
import com.example.swd.entity.Cart;
import com.example.swd.entity.CartDetail;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface CartMapper {

    @Mapping(target = "items", source = "cartDetails")
    CartResponse toCartResponse(Cart cart);

    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "productName", source = "product.name")
    @Mapping(target = "unitPrice", source = "unitPrice")
    @Mapping(target = "quantity", source = "quantity") // ✅ Thêm dòng này

    CartItemDto toCartItemDto(CartDetail cartDetail); // ← Đúng kiểu trả về
}