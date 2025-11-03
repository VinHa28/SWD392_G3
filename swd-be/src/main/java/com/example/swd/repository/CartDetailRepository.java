package com.example.swd.repository;

import com.example.swd.entity.Cart;
import com.example.swd.entity.CartDetail;
import com.example.swd.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartDetailRepository extends JpaRepository<CartDetail, Integer> {

    // Lấy tất cả chi tiết của giỏ hàng
    List<CartDetail> findByCart(Cart cart);

    // Tìm 1 chi tiết theo giỏ + sản phẩm
    Optional<CartDetail> findByCartAndProduct(Cart cart, Product product);
}
