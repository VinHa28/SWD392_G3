package com.example.swd.configuration;


import com.example.swd.entity.Category;

import com.example.swd.entity.Product;

import com.example.swd.repository.CategoryRepository;

import com.example.swd.repository.ProductRepository;

import com.github.javafaker.Faker;

import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;

import org.springframework.boot.CommandLineRunner;

import org.springframework.core.annotation.Order;

import org.springframework.stereotype.Component;

import org.springframework.transaction.annotation.Transactional;


import java.util.ArrayList;

import java.util.HashSet;

import java.util.List;

import java.util.Set;


@Component

@RequiredArgsConstructor

@Slf4j

@Order(2)

public class ProductDataInitializer implements CommandLineRunner {


    private final ProductRepository productRepository;

    private final CategoryRepository categoryRepository;


    @Override

    @Transactional

    public void run(String... args) throws Exception {

        if (productRepository.count() > 0) {

            log.info(">>> [INIT] Product data already exists.");

            return;

        }


        List<Category> categories = categoryRepository.findAll();

        if (categories.isEmpty()) {

            log.warn("!!! [INIT] Cannot seed Products: No Categories found.");

            return;

        }


        log.info(">>> [INIT] Seeding Products...");

        Faker faker = new Faker();

        List<Product> products = new ArrayList<>();


        for (int i = 0; i < 30; i++) {

// Random 1-2 category cho mỗi sản phẩm

            Set<Category> productCats = new HashSet<>();

            int numCats = faker.number().numberBetween(1, 3);

            for (int j = 0; j < numCats; j++) {

                productCats.add(categories.get(faker.random().nextInt(categories.size())));

            }


            products.add(Product.builder()

                    .name(faker.commerce().productName())

                    .description(faker.lorem().paragraph())

                    .price(Double.parseDouble(faker.commerce().price().replace(",", ".")))

                    .stock(faker.number().numberBetween(10, 100))

                    .imageUrl("https://picsum.photos/300?random=" + i)

                    .categories(productCats)

                    .build());

        }

        productRepository.saveAll(products);

        log.info(">>> [INIT] Seeded {} Products.", products.size());

    }

}