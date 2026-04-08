package com.farmers.app.admin;

import com.farmers.app.admin.AdminDtos.AdminStatsResponse;
import com.farmers.app.admin.AdminDtos.AdminProductRow;
import com.farmers.app.admin.AdminDtos.AdminUserRow;
import com.farmers.app.common.dto.ApiResponse;
import com.farmers.app.common.dto.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
  private final AdminService adminService;

  @GetMapping("/stats")
  public ApiResponse<AdminStatsResponse> stats() {
    return ApiResponse.ok(adminService.stats());
  }

  @GetMapping("/users")
  public ApiResponse<PageResponse<AdminUserRow>> users(
      @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
    var users =
        adminService
            .users(page, size)
            .map(u -> new AdminUserRow(u.getId(), u.getEmail(), u.getRole().getName().name(), u.getCreatedAt()));
    return ApiResponse.ok(PageResponse.from(users));
  }

  @GetMapping("/products")
  public ApiResponse<PageResponse<AdminProductRow>> products(
      @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
    var products =
        adminService
            .products(page, size)
            .map(p -> new AdminProductRow(p.getId(), p.getTitle(), p.getModerationStatus().name(), p.isPublished()));
    return ApiResponse.ok(PageResponse.from(products));
  }

  @PatchMapping("/products/{id}/flag")
  public ApiResponse<Void> flag(@PathVariable Long id) {
    adminService.flagProduct(id);
    return ApiResponse.ok(null);
  }

  @PatchMapping("/products/{id}/approve")
  public ApiResponse<Void> approve(@PathVariable Long id) {
    adminService.approveProduct(id);
    return ApiResponse.ok(null);
  }
}
