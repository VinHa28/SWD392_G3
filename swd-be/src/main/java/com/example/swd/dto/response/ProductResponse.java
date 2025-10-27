package com.example.swd.dto.response;

import com.example.swd.entity.Category;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductResponse {
    String id;
    String name;
    String description;
    String imageUrl;
    int stock;
    double price;
    Set<Category> categories;
}
