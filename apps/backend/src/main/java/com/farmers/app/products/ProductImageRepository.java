package com.farmers.app.products;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
  List<ProductImage> findByProductIdOrderByPositionAsc(Long productId);
  long deleteByIdAndProductId(Long id, Long productId);
}
