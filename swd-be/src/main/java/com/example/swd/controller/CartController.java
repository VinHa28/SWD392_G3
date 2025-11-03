// src/main/java/com/example/swd/controller/CartController.java
package com.example.swd.controller;

import com.example.swd.dto.request.AddToCartRequest;
import com.example.swd.dto.request.ApiResponse;
import com.example.swd.dto.response.CartResponse;
import com.example.swd.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/carts")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping("/me")
    public ResponseEntity<CartResponse> getMyCart() {
        CartResponse cart = cartService.getCurrentUserCart();
        return ResponseEntity.ok(cart);
    }
    @PostMapping("/me")
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(@RequestBody AddToCartRequest request) {
        // Validate quantity
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            request.setQuantity(1);
        }

        CartResponse cart = cartService.addToCart(request);
        return ResponseEntity.ok(
                ApiResponse.<CartResponse>builder()
                        .code(200)
                        .message("Added to cart successfully")
                        .result(cart)
                        .build()
        );
    }
    @PutMapping("/update")
    public ResponseEntity<?> updateCartItem(@RequestParam String productId, @RequestParam int quantity) {
        return ResponseEntity.ok(cartService.updateCartItemQuantity(productId, quantity));
    }

    @DeleteMapping("/remove")
    public ResponseEntity<?> removeCartItem(@RequestParam String productId) {
        return ResponseEntity.ok(cartService.removeCartItem(productId));
    }

}