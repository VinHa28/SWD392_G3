package com.example.swd.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderDetailResponse {
    String productId;
    String productName;
    String productImageUrl;
    int quantity;
    double unitPrice;
}