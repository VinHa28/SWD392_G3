package com.example.swd.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.util.List; // Import List

@Data
@Builder
public class OrderResponse {
    String id;
    LocalDate requiredDate;
    String status;
    double totalPrice;
    String paymentMethod;
    String address;
    String customerId;
    String customerName;

    List<OrderDetailResponse> orderDetails;
}