package com.farmers.app.orders;

import com.farmers.app.common.exception.NotFoundException;
import com.farmers.app.orders.OrderDtos.CreateOrderRequest;
import com.farmers.app.orders.OrderDtos.OrderResponse;
import com.farmers.app.products.Product;
import com.farmers.app.products.ProductRepository;
import com.farmers.app.users.User;
import com.farmers.app.users.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrderService {
  private final OrderRepository orderRepository;
  private final ProductRepository productRepository;
  private final UserRepository userRepository;

  @Transactional
  public OrderResponse create(Long buyerUserId, CreateOrderRequest request) {
    Product product =
        productRepository
            .findById(request.productId())
            .orElseThrow(() -> new NotFoundException("Product not found"));
    User buyer =
        userRepository.findById(buyerUserId).orElseThrow(() -> new NotFoundException("User not found"));
    OrderRequest order = new OrderRequest();
    order.setBuyer(buyer);
    order.setProduct(product);
    order.setFarmer(product.getFarmer().getUser());
    order.setQuantity(request.quantity());
    order.setNote(request.note());
    return toResponse(orderRepository.save(order));
  }

  @Transactional(readOnly = true)
  public List<OrderResponse> buyerOrders(Long userId) {
    return orderRepository.findByBuyerIdOrderByCreatedAtDesc(userId).stream().map(this::toResponse).toList();
  }

  @Transactional(readOnly = true)
  public List<OrderResponse> farmerOrders(Long userId) {
    return orderRepository.findByFarmerIdOrderByCreatedAtDesc(userId).stream().map(this::toResponse).toList();
  }

  @Transactional
  public OrderResponse transition(Long userId, Long id, OrderStatus targetStatus) {
    OrderRequest order =
        orderRepository.findById(id).orElseThrow(() -> new NotFoundException("Order not found"));
    if (!order.getFarmer().getId().equals(userId)) {
      throw new NotFoundException("Order not found");
    }
    order.setStatus(targetStatus);
    return toResponse(orderRepository.save(order));
  }

  private OrderResponse toResponse(OrderRequest order) {
    return new OrderResponse(
        order.getId(),
        order.getProduct().getId(),
        order.getProduct().getTitle(),
        order.getBuyer().getId(),
        order.getFarmer().getId(),
        order.getQuantity(),
        order.getNote(),
        order.getStatus().name());
  }
}
