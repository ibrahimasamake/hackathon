package com.farmers.app.products;

import com.farmers.app.common.dto.ApiResponse;
import com.farmers.app.common.dto.PageResponse;
import com.farmers.app.common.security.AuthPrincipal;
import com.farmers.app.products.ProductDtos.ProductResponse;
import com.farmers.app.products.ProductDtos.SaveProductRequest;
import com.farmers.app.products.ProductEnums.AvailabilityStatus;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ProductController {
  private final ProductService productService;

  @PostMapping("/api/products")
  @PreAuthorize("hasAnyRole('FARMER','ADMIN')")
  public ApiResponse<ProductResponse> create(
      @AuthenticationPrincipal AuthPrincipal principal, @Valid @RequestBody SaveProductRequest request) {
    return ApiResponse.ok(productService.create(principal.userId(), request));
  }

  @PutMapping("/api/products/{id}")
  @PreAuthorize("hasAnyRole('FARMER','ADMIN')")
  public ApiResponse<ProductResponse> update(
      @AuthenticationPrincipal AuthPrincipal principal,
      @PathVariable Long id,
      @Valid @RequestBody SaveProductRequest request) {
    return ApiResponse.ok(productService.update(principal.userId(), id, request));
  }

  @DeleteMapping("/api/products/{id}")
  @PreAuthorize("hasAnyRole('FARMER','ADMIN')")
  public ApiResponse<Void> delete(@AuthenticationPrincipal AuthPrincipal principal, @PathVariable Long id) {
    productService.delete(principal.userId(), id);
    return ApiResponse.ok(null);
  }

  @GetMapping("/api/products/my")
  @PreAuthorize("hasAnyRole('FARMER','ADMIN')")
  public ApiResponse<List<ProductResponse>> myProducts(@AuthenticationPrincipal AuthPrincipal principal) {
    return ApiResponse.ok(productService.myProducts(principal.userId()));
  }

  @GetMapping("/api/products/{id}")
  public ApiResponse<ProductResponse> byId(@PathVariable Long id) {
    return ApiResponse.ok(productService.byId(id));
  }

  @GetMapping("/api/public/products")
  public ApiResponse<PageResponse<ProductResponse>> publicProducts(
      @RequestParam(required = false) String q,
      @RequestParam(required = false) String category,
      @RequestParam(required = false) String location,
      @RequestParam(required = false) AvailabilityStatus availability,
      @RequestParam(required = false, defaultValue = "newest") String sort,
      @RequestParam(required = false, defaultValue = "0") int page,
      @RequestParam(required = false, defaultValue = "12") int size) {
    return ApiResponse.ok(productService.searchPublic(q, category, location, availability, sort, page, size));
  }

  @GetMapping("/api/public/products/featured")
  public ApiResponse<List<ProductResponse>> featuredProducts() {
    return ApiResponse.ok(productService.featuredProducts());
  }

  @GetMapping("/api/public/products/{id}/related")
  public ApiResponse<List<ProductResponse>> relatedProducts(@PathVariable Long id) {
    return ApiResponse.ok(productService.relatedProducts(id));
  }

  @GetMapping("/api/public/farmers/{farmerId}/products")
  public ApiResponse<List<ProductResponse>> byFarmer(@PathVariable Long farmerId) {
    return ApiResponse.ok(productService.byFarmer(farmerId));
  }

  @PatchMapping("/api/products/{id}/publish")
  @PreAuthorize("hasAnyRole('FARMER','ADMIN')")
  public ApiResponse<ProductResponse> publish(
      @AuthenticationPrincipal AuthPrincipal principal, @PathVariable Long id) {
    return ApiResponse.ok(productService.publish(principal.userId(), id, true));
  }

  @PatchMapping("/api/products/{id}/unpublish")
  @PreAuthorize("hasAnyRole('FARMER','ADMIN')")
  public ApiResponse<ProductResponse> unpublish(
      @AuthenticationPrincipal AuthPrincipal principal, @PathVariable Long id) {
    return ApiResponse.ok(productService.publish(principal.userId(), id, false));
  }
}
