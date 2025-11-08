package com.example.swd.configuration;

import com.example.swd.entity.*;
import com.example.swd.repository.OrderRepository;
import com.example.swd.repository.ProductRepository;
import com.example.swd.repository.UserRepository;
import com.github.javafaker.Faker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
@Order(3)
public class OrderDataInitializer implements CommandLineRunner {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (orderRepository.count() > 0) {
            log.info(">>> [INIT] Order data already exists.");
            return;
        }

        List<User> users = userRepository.findAll();
        List<Product> products = productRepository.findAll();

        if (users.isEmpty() || products.isEmpty()) {
            log.warn("!!! [INIT] Cannot seed Orders: Missing Users or Products.");
            return;
        }

        log.info(">>> [INIT] Seeding Orders...");
        Faker faker = new Faker();
        List<com.example.swd.entity.Order> orders = new ArrayList<>();

        for (int i = 0; i < 20; i++) {
            com.example.swd.entity.Order order = new com.example.swd.entity.Order();
            order.setCustomer(users.get(faker.random().nextInt(users.size())));
            order.setAddress(faker.address().fullAddress());
            order.setRequiredDate(LocalDate.now().plusDays(faker.number().numberBetween(-5, 10)));
            order.setStatus(OrderStatus.values()[faker.random().nextInt(OrderStatus.values().length)]);
            order.setPaymentMethod(faker.random().nextBoolean() ? "COD" : "CREDIT_CARD");

            Set<OrderDetail> details = new HashSet<>();
            double total = 0;
            int numItems = faker.number().numberBetween(1, 5);

            for (int j = 0; j < numItems; j++) {
                Product p = products.get(faker.random().nextInt(products.size()));
                if (details.stream().anyMatch(d -> d.getProduct().getId().equals(p.getId()))) continue;

                int qty = faker.number().numberBetween(1, 3);
                details.add(OrderDetail.builder()
                        .order(order)
                        .product(p)
                        .quantity(qty)
                        .unitPrice(p.getPrice())
                        .build());
                total += p.getPrice() * qty;
            }
            if (details.isEmpty()) continue; // Skip nếu trùng hết

            order.setOrderDetails(details);
            order.setTotalPrice(total);
            orders.add(order);
        }
        orderRepository.saveAll(orders);
        log.info(">>> [INIT] Seeded {} Orders.", orders.size());
    }
}