package com.example.swd.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductCreationRequest {
    String name;
    String description;
    String imageUrl;
    int stock;
    double price;
    List<String> categories;
}
