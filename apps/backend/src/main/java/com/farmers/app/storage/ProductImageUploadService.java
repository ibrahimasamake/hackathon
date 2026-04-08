package com.farmers.app.storage;

import com.farmers.app.common.exception.BadRequestException;
import com.farmers.app.common.exception.NotFoundException;
import com.farmers.app.products.Product;
import com.farmers.app.products.ProductImage;
import com.farmers.app.products.ProductImageRepository;
import com.farmers.app.products.ProductRepository;
import com.farmers.app.storage.StorageDtos.ConfirmUploadRequest;
import com.farmers.app.storage.StorageDtos.ReorderImagesRequest;
import com.farmers.app.storage.StorageDtos.RemoveImageRequest;
import com.farmers.app.storage.StorageDtos.SetPrimaryImageRequest;
import com.farmers.app.storage.StorageDtos.UploadUrlRequest;
import com.farmers.app.storage.StorageDtos.UploadUrlResponse;
import java.time.Duration;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

@Service
@RequiredArgsConstructor
public class ProductImageUploadService {
  private final ProductRepository productRepository;
  private final ProductImageRepository productImageRepository;
  private final StorageProperties storageProperties;
  private final S3Presigner s3Presigner;
  private final S3Client s3Client;

  @Transactional(readOnly = true)
  public UploadUrlResponse createUploadUrl(Long userId, UploadUrlRequest request) {
    Product product = requireOwnedProduct(userId, request.productId());
    String mimeType = normalizeMimeType(request.mimeType());
    validateFile(mimeType, request.sizeBytes());
    String sanitized = request.fileName().replaceAll("[^a-zA-Z0-9._-]", "_");
    String objectKey =
        "farmers/%d/products/%d/%s-%s"
            .formatted(product.getFarmer().getId(), product.getId(), UUID.randomUUID(), sanitized);

    PutObjectRequest objectRequest =
        PutObjectRequest.builder()
            .bucket(storageProperties.bucket())
            .key(objectKey)
            .contentType(mimeType)
            .build();
    PutObjectPresignRequest presignRequest =
        PutObjectPresignRequest.builder()
            .signatureDuration(Duration.ofMinutes(10))
            .putObjectRequest(objectRequest)
            .build();
    PresignedPutObjectRequest presigned = s3Presigner.presignPutObject(presignRequest);
    String uploadUrl = presigned.url().toString();
    String publicUrl = storageProperties.publicBaseUrl() + "/" + objectKey;
    return new UploadUrlResponse(objectKey, uploadUrl, publicUrl, "PUT");
  }

  @Transactional
  public Long confirmUpload(Long userId, ConfirmUploadRequest request) {
    Product product = requireOwnedProduct(userId, request.productId());
    String mimeType = normalizeMimeType(request.mimeType());
    validateFile(mimeType, request.sizeBytes());

    if (request.primary()) {
      List<ProductImage> images = productImageRepository.findByProductIdOrderByPositionAsc(product.getId());
      for (ProductImage image : images) {
        if (image.isPrimary()) {
          image.setPrimary(false);
        }
      }
      productImageRepository.saveAll(images);
    }

    ProductImage image = new ProductImage();
    image.setProduct(product);
    image.setObjectKey(request.objectKey());
    image.setPublicUrl(request.publicUrl());
    image.setMimeType(mimeType);
    image.setSizeBytes(request.sizeBytes());
    image.setPrimary(request.primary());
    image.setPosition(Math.max(0, request.position()));
    return productImageRepository.save(image).getId();
  }

  @Transactional
  public Long uploadDirect(Long userId, Long productId, MultipartFile file, boolean primary, int position) {
    if (file == null || file.isEmpty()) {
      throw new BadRequestException("Image file is required");
    }
    Product product = requireOwnedProduct(userId, productId);
    String mimeType =
        normalizeMimeType(file.getContentType() == null ? "application/octet-stream" : file.getContentType());
    validateFile(mimeType, file.getSize());
    String originalName = file.getOriginalFilename() == null ? "image" : file.getOriginalFilename();
    String sanitized = originalName.replaceAll("[^a-zA-Z0-9._-]", "_");
    String objectKey =
        "farmers/%d/products/%d/%s-%s"
            .formatted(product.getFarmer().getId(), product.getId(), UUID.randomUUID(), sanitized);

    try {
      PutObjectRequest putObjectRequest =
          PutObjectRequest.builder()
              .bucket(storageProperties.bucket())
              .key(objectKey)
              .contentType(mimeType)
              .build();
      s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));
    } catch (Exception ex) {
      String message = ex.getMessage() == null ? ex.getClass().getSimpleName() : ex.getMessage();
      throw new BadRequestException("Image upload failed: " + message);
    }

    if (primary) {
      List<ProductImage> images = productImageRepository.findByProductIdOrderByPositionAsc(product.getId());
      for (ProductImage image : images) {
        if (image.isPrimary()) {
          image.setPrimary(false);
        }
      }
      productImageRepository.saveAll(images);
    }

    ProductImage image = new ProductImage();
    image.setProduct(product);
    image.setObjectKey(objectKey);
    image.setPublicUrl(storageProperties.publicBaseUrl() + "/" + objectKey);
    image.setMimeType(mimeType);
    image.setSizeBytes(file.getSize());
    image.setPrimary(primary);
    image.setPosition(Math.max(0, position));
    return productImageRepository.save(image).getId();
  }

  @Transactional
  public void removeImage(Long userId, RemoveImageRequest request) {
    Product product = requireOwnedProduct(userId, request.productId());
    long deleted = productImageRepository.deleteByIdAndProductId(request.imageId(), product.getId());
    if (deleted == 0) {
      throw new NotFoundException("Image not found");
    }
  }

  @Transactional
  public void reorderImages(Long userId, ReorderImagesRequest request) {
    Product product = requireOwnedProduct(userId, request.productId());
    List<ProductImage> images = productImageRepository.findByProductIdOrderByPositionAsc(product.getId());
    java.util.Map<Long, Integer> order = new java.util.HashMap<>();
    for (int i = 0; i < request.orderedImageIds().size(); i++) {
      order.put(request.orderedImageIds().get(i), i);
    }
    for (ProductImage image : images) {
      image.setPosition(order.getOrDefault(image.getId(), image.getPosition()));
    }
    productImageRepository.saveAll(images);
  }

  @Transactional
  public void setPrimary(Long userId, SetPrimaryImageRequest request) {
    Product product = requireOwnedProduct(userId, request.productId());
    List<ProductImage> images = productImageRepository.findByProductIdOrderByPositionAsc(product.getId());
    boolean found = false;
    for (ProductImage image : images) {
      boolean isPrimary = image.getId().equals(request.imageId());
      image.setPrimary(isPrimary);
      found = found || isPrimary;
    }
    if (!found) {
      throw new NotFoundException("Image not found");
    }
    productImageRepository.saveAll(images);
  }

  private void validateFile(String mimeType, long sizeBytes) {
    Set<String> allowed = Set.of(storageProperties.allowedMime().split(","));
    if (!allowed.contains(mimeType)) {
      throw new BadRequestException("Unsupported file type");
    }
    long maxBytes = storageProperties.maxFileMb() * 1024L * 1024L;
    if (sizeBytes > maxBytes) {
      throw new BadRequestException("File too large");
    }
  }

  private String normalizeMimeType(String mimeType) {
    if (mimeType == null || mimeType.isBlank()) {
      return "application/octet-stream";
    }
    String normalized = mimeType.trim().toLowerCase();
    if ("image/jpg".equals(normalized)) {
      return "image/jpeg";
    }
    return normalized;
  }

  private Product requireOwnedProduct(Long userId, Long productId) {
    Product product =
        productRepository
            .findById(productId)
            .orElseThrow(() -> new NotFoundException("Product not found"));
    if (!product.getFarmer().getUser().getId().equals(userId)) {
      throw new NotFoundException("Product not found");
    }
    return product;
  }
}
