// src/main/java/com/example/swd/service/CartService.java
package com.example.swd.service;

import com.example.swd.dto.request.AddToCartRequest;
import com.example.swd.dto.response.CartResponse;
import com.example.swd.entity.Cart;
import com.example.swd.entity.CartDetail;
import com.example.swd.entity.Product;
import com.example.swd.entity.User;
import com.example.swd.mapper.CartMapper;
import com.example.swd.repository.CartDetailRepository;
import com.example.swd.repository.CartRepository;
import com.example.swd.repository.ProductRepository;
import com.example.swd.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final CartMapper cartMapper;
    private final ProductRepository productRepository;
    private final CartDetailRepository cartDetailRepository;

    @Transactional
    public CartResponse addToCart(AddToCartRequest request) {
        // 1. Lấy thông tin user hiện tại
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Tìm hoặc tạo cart cho user
        Cart cart = cartRepository.findByUserWithDetails(user)
                .orElseGet(() -> createEmptyCartForUser(user));

        // 3. Tìm product
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // 4. Kiểm tra stock
        if (product.getStock() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock. Available: " + product.getStock());
        }

        // 5. Kiểm tra xem product đã có trong cart chưa
        Optional<CartDetail> existingDetail = cart.getCartDetails().stream()
                .filter(cd -> cd.getProduct().getId().equals(request.getProductId()))
                .findFirst();

        if (existingDetail.isPresent()) {
            // Nếu đã có → tăng quantity
            CartDetail detail = existingDetail.get();
            int newQuantity = detail.getQuantity() + request.getQuantity();

            // Kiểm tra stock cho số lượng mới
            if (product.getStock() < newQuantity) {
                throw new RuntimeException("Insufficient stock. Available: " + product.getStock());
            }

            detail.setQuantity(newQuantity);
            cartDetailRepository.save(detail);
        } else {
            // Nếu chưa có → tạo mới CartDetail
            CartDetail newDetail = CartDetail.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .unitPrice(product.getPrice())
                    .build();

            cart.getCartDetails().add(newDetail);
            cartDetailRepository.save(newDetail);
        }

        // 6. Tính lại tổng giá
        double totalPrice = cart.getCartDetails().stream()
                .mapToDouble(cd -> cd.getQuantity() * cd.getUnitPrice())
                .sum();
        cart.setTotalPrice(totalPrice);

        // 7. Lưu cart
        Cart savedCart = cartRepository.save(cart);

        // 8. Trả về response
        return cartMapper.toCartResponse(savedCart);
    }


    public CartResponse getCurrentUserCart() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUserWithDetails(user)
                .orElseGet(() -> createEmptyCartForUser(user));

        return cartMapper.toCartResponse(cart);
    }

    private Cart createEmptyCartForUser(User user) {
        Cart cart = Cart.builder()
                .user(user)
                .totalPrice(0.0)
                .cartDetails(new ArrayList<>())
                .build();
        return cartRepository.save(cart);
    }

    @Transactional
    public CartResponse updateCartItemQuantity(String productId, int newQuantity) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUserWithDetails(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        // Tìm sản phẩm trong giỏ
        CartDetail detail = cart.getCartDetails().stream()
                .filter(cd -> cd.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Product not in cart"));

        // Kiểm tra số lượng mới
        if (newQuantity <= 0) {
            // Nếu newQuantity <= 0 thì xóa luôn sản phẩm khỏi giỏ
            cart.getCartDetails().remove(detail);
            cartDetailRepository.delete(detail);
        } else {
            // Nếu > 0 thì cập nhật lại số lượng
            Product product = detail.getProduct();
            if (product.getStock() < newQuantity) {
                throw new RuntimeException("Insufficient stock. Available: " + product.getStock());
            }
            detail.setQuantity(newQuantity);
            cartDetailRepository.save(detail);
        }

        // Cập nhật lại tổng giá
        double totalPrice = cart.getCartDetails().stream()
                .mapToDouble(cd -> cd.getQuantity() * cd.getUnitPrice())
                .sum();
        cart.setTotalPrice(totalPrice);

        Cart savedCart = cartRepository.save(cart);

        return cartMapper.toCartResponse(savedCart);

    }
    @Transactional
    public CartResponse removeCartItem(String productId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUserWithDetails(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        // Tìm sản phẩm trong giỏ
        CartDetail detail = cart.getCartDetails().stream()
                .filter(cd -> cd.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Product not in cart"));

        // Xóa khỏi danh sách và DB
        cart.getCartDetails().remove(detail);
        cartDetailRepository.delete(detail);

        // Cập nhật lại tổng giá
        double totalPrice = cart.getCartDetails().stream()
                .mapToDouble(cd -> cd.getQuantity() * cd.getUnitPrice())
                .sum();
        cart.setTotalPrice(totalPrice);

        Cart savedCart = cartRepository.save(cart);

        return cartMapper.toCartResponse(savedCart);
    }

}