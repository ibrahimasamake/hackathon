package com.farmers.app.farmers;

public record FarmerProfileDto(
    Long id,
    Long userId,
    String fullName,
    String farmName,
    String phone,
    String town,
    String region,
    String bio,
    String avatarUrl,
    boolean verified) {}
