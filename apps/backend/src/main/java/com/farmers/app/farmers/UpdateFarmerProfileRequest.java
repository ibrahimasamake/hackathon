package com.farmers.app.farmers;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateFarmerProfileRequest(
    @NotBlank @Size(max = 120) String fullName,
    @NotBlank @Size(max = 140) String farmName,
    @NotBlank @Size(max = 30) String phone,
    @NotBlank @Size(max = 100) String town,
    @NotBlank @Size(max = 100) String region,
    @Size(max = 500) String bio,
    @Size(max = 300) String avatarUrl) {}
