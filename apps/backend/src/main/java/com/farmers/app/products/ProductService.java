package com.farmers.app.products;

import com.farmers.app.common.dto.PageResponse;
import com.farmers.app.common.exception.NotFoundException;
import com.farmers.app.farmers.FarmerProfile;
import com.farmers.app.farmers.FarmerProfileRepository;
import com.farmers.app.products.ProductDtos.ProductImageDto;
import com.farmers.app.products.ProductDtos.ProductResponse;
import com.farmers.app.products.ProductDtos.SaveProductRequest;
import com.farmers.app.products.ProductEnums.AvailabilityStatus;
import com.farmers.app.products.ProductEnums.ModerationStatus;
import com.farmers.app.users.User;
import com.farmers.app.users.UserRepository;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductService {
  private final ProductRepository productRepository;
  private final FarmerProfileRepository farmerProfileRepository;
  private final ProductImageRepository productImageRepository;
  private final UserRepository userRepository;

  @Transactional
  public ProductResponse create(Long userId, SaveProductRequest request) {
    FarmerProfile farmer =
        farmerProfileRepository
            .findByUserId(userId)
            .orElseGet(() -> createDefaultFarmerProfile(userId, request.location()));
    Product product = map(new Product(), request);
    product.setFarmer(farmer);
    product.setModerationStatus(ModerationStatus.PENDING);
    return toResponse(productRepository.save(product));
  }

  @Transactional
  public ProductResponse update(Long userId, Long id, SaveProductRequest request) {
    Product product = requireOwnedProduct(userId, id);
    return toResponse(productRepository.save(map(product, request)));
  }

  @Transactional
  public void delete(Long userId, Long id) {
    Product product = requireOwnedProduct(userId, id);
    productRepository.delete(product);
  }

  @Transactional(readOnly = true)
  public List<ProductResponse> myProducts(Long userId) {
    return productRepository.findByFarmerUserId(userId).stream().map(this::toResponse).toList();
  }

  @Transactional(readOnly = true)
  public ProductResponse byId(Long id) {
    Product product =
        productRepository.findById(id).orElseThrow(() -> new NotFoundException("Product not found"));
    return toResponse(product);
  }

  @Transactional(readOnly = true)
  public List<ProductResponse> featuredProducts() {
    return productRepository
        .findTop8ByPublishedTrueAndModerationStatusNotOrderByCreatedAtDesc(ModerationStatus.FLAGGED)
        .stream()
        .map(this::toResponse)
        .toList();
  }

  @Transactional(readOnly = true)
  public List<ProductResponse> byFarmer(Long farmerId) {
    return productRepository
        .findByFarmerIdAndPublishedTrueAndModerationStatusNotOrderByCreatedAtDesc(
            farmerId, ModerationStatus.FLAGGED)
        .stream()
        .map(this::toResponse)
        .toList();
  }

  @Transactional(readOnly = true)
  public List<ProductResponse> relatedProducts(Long id) {
    Product current =
        productRepository.findById(id).orElseThrow(() -> new NotFoundException("Product not found"));
    return productRepository
        .findTop6ByPublishedTrueAndModerationStatusNotAndCategoryAndIdNotOrderByCreatedAtDesc(
            ModerationStatus.FLAGGED, current.getCategory(), current.getId())
        .stream()
        .map(this::toResponse)
        .toList();
  }

  @Transactional(readOnly = true)
  public PageResponse<ProductResponse> searchPublic(
      String q,
      String category,
      String location,
      AvailabilityStatus availability,
      String sort,
      int page,
      int size) {
    Sort order =
        switch (sort == null ? "newest" : sort) {
          case "price_asc" -> Sort.by("price").ascending();
          case "price_desc" -> Sort.by("price").descending();
          case "freshest" -> Sort.by("harvestDate").descending();
          default -> Sort.by("createdAt").descending();
        };
    var result =
        productRepository.searchPublic(
            blankToNull(q),
            blankToNull(category),
            blankToNull(location),
            availability,
            PageRequest.of(page, size, order));
    return PageResponse.from(result.map(this::toResponse));
  }

  @Transactional
  public ProductResponse publish(Long userId, Long id, boolean published) {
    Product product = requireOwnedProduct(userId, id);
    product.setPublished(published);
    return toResponse(productRepository.save(product));
  }

  @Transactional
  public ProductResponse moderate(Long id, ModerationStatus moderationStatus) {
    Product product =
        productRepository.findById(id).orElseThrow(() -> new NotFoundException("Product not found"));
    product.setModerationStatus(moderationStatus);
    return toResponse(productRepository.save(product));
  }

  private Product requireOwnedProduct(Long userId, Long id) {
    Product product =
        productRepository.findById(id).orElseThrow(() -> new NotFoundException("Product not found"));
    if (!product.getFarmer().getUser().getId().equals(userId)) {
      throw new NotFoundException("Product not found");
    }
    return product;
  }

  private Product map(Product product, SaveProductRequest request) {
    product.setTitle(request.title());
    product.setDescription(request.description());
    product.setCategory(request.category());
    product.setPrice(request.price());
    product.setCurrency(request.currency());
    product.setQuantity(request.quantity());
    product.setUnit(request.unit());
    product.setHarvestDate(request.harvestDate());
    product.setLocation(request.location());
    product.setAvailabilityStatus(request.availabilityStatus());
    product.setTags(request.tags());
    return product;
  }

  private ProductResponse toResponse(Product product) {
    List<ProductImageDto> images =
        productImageRepository.findByProductIdOrderByPositionAsc(product.getId()).stream()
            .map(img -> new ProductImageDto(img.getId(), img.getPublicUrl(), img.isPrimary(), img.getPosition()))
            .sorted(Comparator.comparingInt(ProductImageDto::position))
            .toList();
    String farmerName = product.getFarmer().getFarmName();
    return new ProductResponse(
        product.getId(),
        product.getFarmer().getId(),
        farmerName,
        product.getTitle(),
        product.getDescription(),
        product.getCategory(),
        product.getPrice(),
        product.getCurrency(),
        product.getQuantity(),
        product.getUnit(),
        product.getHarvestDate(),
        product.getLocation(),
        product.getAvailabilityStatus(),
        product.isPublished(),
        product.getModerationStatus().name(),
        product.getTags(),
        images);
  }

  public long freshnessDays(LocalDate harvestDate) {
    if (harvestDate == null) {
      return Long.MAX_VALUE;
    }
    return ChronoUnit.DAYS.between(harvestDate, LocalDate.now());
  }

  private String blankToNull(String value) {
    return value == null || value.isBlank() ? null : value;
  }

  private FarmerProfile createDefaultFarmerProfile(Long userId, String location) {
    User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("User not found"));
    String baseName = nameFromEmail(user.getEmail());
    FarmerProfile profile = new FarmerProfile();
    profile.setUser(user);
    profile.setFullName(limit(baseName, 120));
    profile.setFarmName(limit(baseName + " Farm", 140));
    profile.setPhone("0000000000");
    profile.setTown(limit((location == null || location.isBlank()) ? "Unknown" : location, 100));
    profile.setRegion("Unknown");
    profile.setBio("Auto-created profile. Please update your farmer details.");
    return farmerProfileRepository.save(profile);
  }

  private String nameFromEmail(String email) {
    if (email == null || email.isBlank()) {
      return "Farmer";
    }
    int atIndex = email.indexOf('@');
    String local = atIndex > 0 ? email.substring(0, atIndex) : email;
    String spaced = local.replace('.', ' ').replace('_', ' ').replace('-', ' ').trim();
    return spaced.isBlank() ? "Farmer" : spaced;
  }

  private String limit(String value, int maxLength) {
    return value.length() <= maxLength ? value : value.substring(0, maxLength);
  }
}
