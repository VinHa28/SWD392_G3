package com.example.swd.mapper;

import com.example.swd.dto.response.CartItemDto;
import com.example.swd.entity.CartDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CartItemMapper {

    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "productName", source = "product.name")
    @Mapping(target = "unitPrice", source = "unitPrice")
    @Mapping(target = "imageUrl", source = "product.imageUrl")
    @Mapping(target = "quantity", source = "quantity")
    // ⚠️ Không map lại `cart` để tránh vòng lặp
    CartItemDto toDto(CartDetail detail);
}
