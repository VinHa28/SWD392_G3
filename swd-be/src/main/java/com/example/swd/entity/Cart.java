package com.example.swd.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@Builder

@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    // Liên kết tới User thay vì Customer
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore // ✅ tránh vòng lặp ngược lại

            User user;

    @Column(nullable = false, columnDefinition = "DOUBLE DEFAULT 0.0")
    Double totalPrice = 0.0;
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @Builder.Default  // ← Quan trọng cho Builder
    private List<CartDetail> cartDetails = new ArrayList<>();
}