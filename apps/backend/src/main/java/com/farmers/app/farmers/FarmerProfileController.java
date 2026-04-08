package com.farmers.app.farmers;

import com.farmers.app.common.security.AuthPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/farmers")
@RequiredArgsConstructor
public class FarmerProfileController {
  private final FarmerProfileService farmerProfileService;

  @GetMapping("/me")
  @PreAuthorize("hasAnyRole('FARMER','ADMIN')")
  public FarmerProfileDto getMyProfile(@AuthenticationPrincipal AuthPrincipal principal) {
    return farmerProfileService.getMe(principal.userId());
  }

  @PutMapping("/me")
  @PreAuthorize("hasAnyRole('FARMER','ADMIN')")
  public FarmerProfileDto updateMyProfile(
      @AuthenticationPrincipal AuthPrincipal principal,
      @Valid @RequestBody UpdateFarmerProfileRequest request) {
    return farmerProfileService.upsertMyProfile(principal.userId(), request);
  }

  @GetMapping("/{id}")
  public FarmerProfileDto getFarmerById(@PathVariable Long id) {
    return farmerProfileService.getById(id);
  }
}
