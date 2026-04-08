package com.farmers.app.common.security;

import com.farmers.app.users.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Map;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
  private final JwtProperties jwtProperties;
  private final SecretKey signingKey;

  public JwtService(JwtProperties jwtProperties) {
    this.jwtProperties = jwtProperties;
    this.signingKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtProperties.secret()));
  }

  public String generateAccessToken(User user) {
    Instant now = Instant.now();
    Instant expiry = now.plus(jwtProperties.accessMinutes(), ChronoUnit.MINUTES);
    return Jwts.builder()
        .subject(user.getId().toString())
        .issuedAt(Date.from(now))
        .expiration(Date.from(expiry))
        .claims(Map.of("email", user.getEmail(), "role", user.getRole().getName().name()))
        .signWith(signingKey)
        .compact();
  }

  public String generateRefreshToken(User user) {
    Instant now = Instant.now();
    Instant expiry = now.plus(jwtProperties.refreshDays(), ChronoUnit.DAYS);
    return Jwts.builder()
        .subject(user.getId().toString())
        .issuedAt(Date.from(now))
        .expiration(Date.from(expiry))
        .claim("type", "refresh")
        .signWith(signingKey)
        .compact();
  }

  public Claims parse(String token) {
    return Jwts.parser().verifyWith(signingKey).build().parseSignedClaims(token).getPayload();
  }
}
