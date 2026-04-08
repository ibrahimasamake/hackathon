package com.farmers.app.auth;

import com.farmers.app.auth.AuthDtos.AuthResponse;
import com.farmers.app.auth.AuthDtos.LoginRequest;
import com.farmers.app.auth.AuthDtos.RefreshRequest;
import com.farmers.app.auth.AuthDtos.RegisterRequest;
import com.farmers.app.common.exception.BadRequestException;
import com.farmers.app.common.exception.NotFoundException;
import com.farmers.app.common.security.AuthPrincipal;
import com.farmers.app.common.security.JwtService;
import com.farmers.app.users.RefreshToken;
import com.farmers.app.users.RefreshTokenRepository;
import com.farmers.app.users.Role;
import com.farmers.app.users.RoleName;
import com.farmers.app.users.RoleRepository;
import com.farmers.app.users.User;
import com.farmers.app.users.UserRepository;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final RefreshTokenRepository refreshTokenRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  @Transactional
  public AuthResponse register(RegisterRequest request) {
    if (userRepository.findByEmail(request.email()).isPresent()) {
      throw new BadRequestException("Email already in use");
    }
    RoleName roleName;
    try {
      roleName = RoleName.valueOf(request.role());
    } catch (IllegalArgumentException ex) {
      throw new BadRequestException("Invalid role");
    }
    Role role =
        roleRepository.findByName(roleName).orElseThrow(() -> new NotFoundException("Role missing"));
    User user = new User();
    user.setEmail(request.email().trim().toLowerCase());
    user.setPasswordHash(passwordEncoder.encode(request.password()));
    user.setRole(role);
    user = userRepository.save(user);
    return issueTokens(user);
  }

  @Transactional
  public AuthResponse login(LoginRequest request) {
    User user =
        userRepository
            .findByEmail(request.email().trim().toLowerCase())
            .orElseThrow(() -> new BadRequestException("Invalid credentials"));
    if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
      throw new BadRequestException("Invalid credentials");
    }
    return issueTokens(user);
  }

  @Transactional
  public AuthResponse refresh(RefreshRequest request) {
    String hash = sha256(request.refreshToken());
    RefreshToken stored =
        refreshTokenRepository
            .findByTokenHashAndRevokedAtIsNull(hash)
            .orElseThrow(() -> new BadRequestException("Refresh token invalid"));
    if (stored.getExpiresAt().isBefore(Instant.now())) {
      throw new BadRequestException("Refresh token expired");
    }
    stored.setRevokedAt(Instant.now());
    return issueTokens(stored.getUser());
  }

  @Transactional
  public void logout(RefreshRequest request) {
    refreshTokenRepository
        .findByTokenHashAndRevokedAtIsNull(sha256(request.refreshToken()))
        .ifPresent(
            token -> {
              token.setRevokedAt(Instant.now());
              refreshTokenRepository.save(token);
            });
  }

  @Transactional(readOnly = true)
  public AuthPrincipal me(AuthPrincipal principal) {
    return principal;
  }

  private AuthResponse issueTokens(User user) {
    String accessToken = jwtService.generateAccessToken(user);
    String refreshToken = jwtService.generateRefreshToken(user);
    RefreshToken token = new RefreshToken();
    token.setUser(user);
    token.setTokenHash(sha256(refreshToken));
    token.setExpiresAt(jwtService.parse(refreshToken).getExpiration().toInstant());
    refreshTokenRepository.save(token);
    return new AuthResponse(
        accessToken, refreshToken, user.getId(), user.getEmail(), user.getRole().getName().name());
  }

  private String sha256(String value) {
    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      byte[] hash = digest.digest(value.getBytes(StandardCharsets.UTF_8));
      StringBuilder sb = new StringBuilder();
      for (byte b : hash) {
        sb.append(String.format("%02x", b));
      }
      return sb.toString();
    } catch (Exception ex) {
      throw new IllegalStateException("SHA-256 unavailable", ex);
    }
  }
}
