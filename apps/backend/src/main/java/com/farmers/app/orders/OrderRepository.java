package com.farmers.app.orders;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<OrderRequest, Long> {
  List<OrderRequest> findByBuyerIdOrderByCreatedAtDesc(Long buyerId);

  List<OrderRequest> findByFarmerIdOrderByCreatedAtDesc(Long farmerId);
}
