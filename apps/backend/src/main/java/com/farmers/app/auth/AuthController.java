package com.farmers.app.auth;

import com.farmers.app.auth.AuthDtos.AuthResponse;
import com.farmers.app.auth.AuthDtos.LoginRequest;
import com.farmers.app.auth.AuthDtos.RefreshRequest;
import com.farmers.app.auth.AuthDtos.RegisterRequest;
import com.farmers.app.common.dto.ApiResponse;
import com.farmers.app.common.security.AuthPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
  private final AuthService authService;

  @PostMapping("/register")
  public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
    return ApiResponse.ok(authService.register(request));
  }

  @PostMapping("/login")
  public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
    return ApiResponse.ok(authService.login(request));
  }

  @PostMapping("/refresh")
  public ApiResponse<AuthResponse> refresh(@Valid @RequestBody RefreshRequest request) {
    return ApiResponse.ok(authService.refresh(request));
  }

  @PostMapping("/logout")
  public ApiResponse<Void> logout(@Valid @RequestBody RefreshRequest request) {
    authService.logout(request);
    return ApiResponse.ok(null);
  }

  @GetMapping("/me")
  public ApiResponse<AuthPrincipal> me(@AuthenticationPrincipal AuthPrincipal principal) {
    return ApiResponse.ok(authService.me(principal));
  }
}
