package com.example.swd.mapper;

import com.example.swd.dto.request.ProductCreationRequest;
import com.example.swd.dto.request.ProductUpdateRequest;
import com.example.swd.dto.response.ProductResponse;
import com.example.swd.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ProductMapper {

    @Mapping(target = "categories", ignore = true)
    Product toProduct(ProductCreationRequest request);

    ProductResponse toProductResponse(Product product);

    List<ProductResponse> toProductResponse(List<Product> products);

    @Mapping(target = "categories", ignore = true)
    void updateProduct(@MappingTarget Product product, ProductUpdateRequest request);
}
