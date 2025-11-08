package com.example.swd.repository;

import com.example.swd.entity.Order;
import com.example.swd.entity.OrderStatus;
import com.example.swd.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

    List<Order> findByCustomer(User user);

    Page<Order> findByStatus(OrderStatus status, Pageable pageable);
}