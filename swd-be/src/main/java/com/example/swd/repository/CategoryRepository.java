package com.example.swd.repository;

import com.example.swd.entity.Category;
import com.example.swd.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {
    boolean existsByName(String name);

    Optional<Category> findByName(String name);
}
