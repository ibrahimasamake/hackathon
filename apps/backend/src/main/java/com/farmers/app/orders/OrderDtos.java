package com.farmers.app.orders;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public class OrderDtos {
  public record CreateOrderRequest(
      @NotNull Long productId,
      @NotNull @DecimalMin("0.01") BigDecimal quantity,
      @Size(max = 400) String note) {}

  public record OrderResponse(
      Long id,
      Long productId,
      String productTitle,
      Long buyerId,
      Long farmerUserId,
      BigDecimal quantity,
      String note,
      String status) {}
}
