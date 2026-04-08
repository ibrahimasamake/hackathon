package com.farmers.app.orders;

import com.farmers.app.common.dto.ApiResponse;
import com.farmers.app.common.security.AuthPrincipal;
import com.farmers.app.orders.OrderDtos.CreateOrderRequest;
import com.farmers.app.orders.OrderDtos.OrderResponse;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
  private final OrderService orderService;

  @PostMapping
  @PreAuthorize("hasAnyRole('BUYER','ADMIN')")
  public ApiResponse<OrderResponse> create(
      @AuthenticationPrincipal AuthPrincipal principal, @Valid @RequestBody CreateOrderRequest request) {
    return ApiResponse.ok(orderService.create(principal.userId(), request));
  }

  @GetMapping("/my-buyer-requests")
  @PreAuthorize("hasAnyRole('BUYER','ADMIN')")
  public ApiResponse<List<OrderResponse>> myBuyerRequests(@AuthenticationPrincipal AuthPrincipal principal) {
    return ApiResponse.ok(orderService.buyerOrders(principal.userId()));
  }

  @GetMapping("/my-farmer-requests")
  @PreAuthorize("hasAnyRole('FARMER','ADMIN')")
  public ApiResponse<List<OrderResponse>> myFarmerRequests(@AuthenticationPrincipal AuthPrincipal principal) {
    return ApiResponse.ok(orderService.farmerOrders(principal.userId()));
  }

  @PatchMapping("/{id}/accept")
  @PreAuthorize("hasAnyRole('FARMER','ADMIN')")
  public ApiResponse<OrderResponse> accept(@AuthenticationPrincipal AuthPrincipal principal, @PathVariable Long id) {
    return ApiResponse.ok(orderService.transition(principal.userId(), id, OrderStatus.ACCEPTED));
  }

  @PatchMapping("/{id}/reject")
  @PreAuthorize("hasAnyRole('FARMER','ADMIN')")
  public ApiResponse<OrderResponse> reject(@AuthenticationPrincipal AuthPrincipal principal, @PathVariable Long id) {
    return ApiResponse.ok(orderService.transition(principal.userId(), id, OrderStatus.REJECTED));
  }

  @PatchMapping("/{id}/complete")
  @PreAuthorize("hasAnyRole('FARMER','ADMIN')")
  public ApiResponse<OrderResponse> complete(
      @AuthenticationPrincipal AuthPrincipal principal, @PathVariable Long id) {
    return ApiResponse.ok(orderService.transition(principal.userId(), id, OrderStatus.COMPLETED));
  }
}
