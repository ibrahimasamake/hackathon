package com.farmers.app.admin;

import com.farmers.app.admin.AdminDtos.AdminStatsResponse;
import com.farmers.app.products.Product;
import com.farmers.app.products.ProductRepository;
import com.farmers.app.products.ProductService;
import com.farmers.app.products.ProductEnums.ModerationStatus;
import com.farmers.app.users.RoleName;
import com.farmers.app.users.User;
import com.farmers.app.users.UserRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminService {
  private final UserRepository userRepository;
  private final ProductRepository productRepository;
  private final ProductService productService;

  @Transactional(readOnly = true)
  public AdminStatsResponse stats() {
    long farmers = userRepository.countByRole_Name(RoleName.ROLE_FARMER);
    long buyers = userRepository.countByRole_Name(RoleName.ROLE_BUYER);
    long products = productRepository.count();
    long flagged = productRepository.countByModerationStatus(ModerationStatus.FLAGGED);
    long recentRegistrations =
        userRepository.findAll().stream()
            .filter(u -> u.getCreatedAt().isAfter(Instant.now().minus(7, ChronoUnit.DAYS)))
            .count();
    return new AdminStatsResponse(farmers, buyers, products, flagged, recentRegistrations);
  }

  @Transactional(readOnly = true)
  public org.springframework.data.domain.Page<User> users(int page, int size) {
    return userRepository.findAll(PageRequest.of(page, size));
  }

  @Transactional(readOnly = true)
  public org.springframework.data.domain.Page<Product> products(int page, int size) {
    return productRepository.findAll(PageRequest.of(page, size));
  }

  @Transactional
  public void flagProduct(Long id) {
    productService.moderate(id, ModerationStatus.FLAGGED);
  }

  @Transactional
  public void approveProduct(Long id) {
    productService.moderate(id, ModerationStatus.APPROVED);
  }
}
