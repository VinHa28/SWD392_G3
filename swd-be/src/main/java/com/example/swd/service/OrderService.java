package com.example.swd.service;

import com.example.swd.dto.response.OrderResponse;
import com.example.swd.entity.Order; // Vẫn cần import nếu có method nội bộ dùng, nhưng API public nên dùng OrderResponse
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OrderService {
    OrderResponse getOrderById(String orderId);

    List<OrderResponse> getOrdersByUserId(String userId);

    Page<OrderResponse> getAllOrders(Pageable pageable, String statusFilter);

    OrderResponse updateOrderStatus(String orderId, String newStatus);

    OrderResponse cancelOrder(String orderId);
}