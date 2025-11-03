// src/main/java/com/example/swd/repository/CartRepository.java
package com.example.swd.repository;

import com.example.swd.entity.Cart;
import com.example.swd.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Integer> {

    @Query("SELECT c FROM Cart c " +
            "LEFT JOIN FETCH c.cartDetails cd " +
            "LEFT JOIN FETCH cd.product p " +
            "WHERE c.user = :user")
    Optional<Cart> findByUserWithDetails(@Param("user") User user);
}