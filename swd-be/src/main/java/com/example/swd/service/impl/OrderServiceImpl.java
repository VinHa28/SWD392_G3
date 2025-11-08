package com.example.swd.service.impl;

import com.example.swd.dto.response.OrderDetailResponse;
import com.example.swd.dto.response.OrderResponse;
import com.example.swd.entity.Order;
import com.example.swd.entity.OrderStatus;
import com.example.swd.entity.User;
import com.example.swd.repository.OrderRepository;
import com.example.swd.repository.UserRepository;
import com.example.swd.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    // --- Helper method: Convert Entity -> OrderResponse DTO ---
    private OrderResponse mapToResponse(Order order) {
        // 1. Map danh sách chi tiết đơn hàng
        List<OrderDetailResponse> details = order.getOrderDetails().stream()
                .map(detail -> OrderDetailResponse.builder()
                        .productId(detail.getProduct().getId())
                        .productName(detail.getProduct().getName())
                        .productImageUrl(detail.getProduct().getImageUrl()) // Đảm bảo Product entity có field này
                        .quantity(detail.getQuantity())
                        .unitPrice(detail.getUnitPrice())
                        .build())
                .collect(Collectors.toList());

        // 2. Map thông tin đơn hàng chính
        return OrderResponse.builder()
                .id(order.getId())
                .requiredDate(order.getRequiredDate())
                .paymentMethod(order.getPaymentMethod())
                .address(order.getAddress())
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus().name())
                // Lấy thông tin user an toàn (tránh null nếu dữ liệu cũ bị thiếu)
                .customerId(order.getCustomer() != null ? order.getCustomer().getId() : null)
                .customerName(order.getCustomer() != null ? order.getCustomer().getUsername() : "Unknown Customer")
                .orderDetails(details) // Gán danh sách chi tiết vào DTO trả về
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        return mapToResponse(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByUserId(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        List<Order> orders = orderRepository.findByCustomer(user);
        return orders.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponse> getAllOrders(Pageable pageable, String statusFilter) {
        Page<Order> orderPage;
        if (statusFilter == null || statusFilter.isBlank()) {
            orderPage = orderRepository.findAll(pageable);
        } else {
            try {
                OrderStatus status = OrderStatus.valueOf(statusFilter.toUpperCase());
                orderPage = orderRepository.findByStatus(status, pageable);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid order status: " + statusFilter);
            }
        }
        return orderPage.map(this::mapToResponse);
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(String orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        OrderStatus newStatusEnum;
        try {
            newStatusEnum = OrderStatus.valueOf(newStatus.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid order status: " + newStatus);
        }

        // Validate logic chuyển trạng thái
        if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.CANCELLED) {
            throw new IllegalStateException("Cannot update status of a finished order.");
        }
        order.setStatus(newStatusEnum);
        Order savedOrder = orderRepository.save(order);
        return mapToResponse(savedOrder);
    }

    @Override
    @Transactional
    public OrderResponse cancelOrder(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        if (order.getStatus() == OrderStatus.PENDING || order.getStatus() == OrderStatus.PROCESSING) {
            order.setStatus(OrderStatus.CANCELLED);
            Order savedOrder = orderRepository.save(order);
            return mapToResponse(savedOrder);
        } else {
            throw new IllegalStateException("Cannot cancel order with status: " + order.getStatus());
        }
    }
}