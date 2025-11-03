// src/main/java/com/example/swd/entity/Product.java
package com.example.swd.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    String name;
    String description;
    String imageUrl;
    int stock;

    @Column(nullable = false, columnDefinition = "DOUBLE DEFAULT 0.0")
    Double price = 0.0;

    // Danh mục sản phẩm
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "product_categories",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    Set<Category> categories = new HashSet<>();

    // NGĂN VÒNG LẶP: Product → CartDetail → Cart → CartDetail → ...
    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    @JsonIgnore
    Set<CartDetail> cartDetails = new HashSet<>();
}