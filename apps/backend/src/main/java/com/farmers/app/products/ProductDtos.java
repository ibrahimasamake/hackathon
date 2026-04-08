package com.farmers.app.products;

import com.farmers.app.products.ProductEnums.AvailabilityStatus;
import com.farmers.app.products.ProductEnums.Unit;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class ProductDtos {
  public record ProductImageDto(Long id, String publicUrl, boolean isPrimary, int position) {}

  public record ProductResponse(
      Long id,
      Long farmerId,
      String farmerName,
      String title,
      String description,
      String category,
      BigDecimal price,
      String currency,
      BigDecimal quantity,
      Unit unit,
      LocalDate harvestDate,
      String location,
      AvailabilityStatus availabilityStatus,
      boolean published,
      String moderationStatus,
      String tags,
      List<ProductImageDto> images) {}

  public record SaveProductRequest(
      @NotBlank @Size(max = 160) String title,
      @NotBlank @Size(max = 700) String description,
      @NotBlank @Size(max = 80) String category,
      @NotNull @DecimalMin("0.01") BigDecimal price,
      @NotBlank @Size(max = 10) String currency,
      @NotNull @DecimalMin("0.01") BigDecimal quantity,
      @NotNull Unit unit,
      LocalDate harvestDate,
      @NotBlank @Size(max = 120) String location,
      @NotNull AvailabilityStatus availabilityStatus,
      @Size(max = 260) String tags) {}
}
