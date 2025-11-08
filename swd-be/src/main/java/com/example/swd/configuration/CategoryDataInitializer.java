package com.example.swd.configuration;

import com.example.swd.entity.Category;
import com.example.swd.repository.CategoryRepository;
import com.github.javafaker.Faker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
@Order(1)
public class CategoryDataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() > 0) {
            log.info(">>> [INIT] Category data already exists.");
            return;
        }

        log.info(">>> [INIT] Seeding Categories...");
        Faker faker = new Faker();
        List<Category> categories = new ArrayList<>();
        // Tạo 5 danh mục mẫu
        String[] predefinedCats = {"Electronics", "Books", "Clothing", "Home & Garden", "Toys"};
        for (String catName : predefinedCats) {
            categories.add(Category.builder()
                    .name(catName)
                    .description(faker.lorem().sentence())
                    .imageUrl("https://picsum.photos/200?random=" + faker.number().digits(3))
                    .build());
        }
        categoryRepository.saveAll(categories);
        log.info(">>> [INIT] Seeded {} Categories.", categories.size());
    }
}