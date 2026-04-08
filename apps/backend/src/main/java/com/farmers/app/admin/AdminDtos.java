package com.farmers.app.admin;

public class AdminDtos {
  public record AdminStatsResponse(
      long totalFarmers, long totalBuyers, long totalProducts, long flaggedProducts, long recentRegistrations) {}

  public record AdminUserRow(Long id, String email, String role, java.time.Instant createdAt) {}

  public record AdminProductRow(Long id, String title, String moderationStatus, boolean published) {}
}
