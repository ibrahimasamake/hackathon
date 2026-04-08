package com.farmers.app.storage;

import com.farmers.app.common.dto.ApiResponse;
import com.farmers.app.common.security.AuthPrincipal;
import com.farmers.app.storage.StorageDtos.ConfirmUploadRequest;
import com.farmers.app.storage.StorageDtos.ReorderImagesRequest;
import com.farmers.app.storage.StorageDtos.RemoveImageRequest;
import com.farmers.app.storage.StorageDtos.SetPrimaryImageRequest;
import com.farmers.app.storage.StorageDtos.UploadUrlRequest;
import com.farmers.app.storage.StorageDtos.UploadUrlResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/storage/product-image")
@RequiredArgsConstructor
public class StorageController {
  private final ProductImageUploadService productImageUploadService;

  @PostMapping("/upload-url")
  @PreAuthorize("hasAnyRole('FARMER','ADMIN')")
  public ApiResponse<UploadUrlResponse> uploadUrl(
      @AuthenticationPrincipal AuthPrincipal principal, @Valid @RequestBody UploadUrlRequest request) {
    return ApiResponse.ok(productImageUploadService.createUploadUrl(principal.userId(), request));
  }

  @PostMapping("/confirm")
  @PreAuthorize("hasAnyRole('FARMER','ADMIN')")
  public ApiResponse<Long> confirm(
      @AuthenticationPrincipal AuthPrincipal principal, @Valid @RequestBody ConfirmUploadRequest request) {
    return ApiResponse.ok(productImageUploadService.confirmUpload(principal.userId(), request));
  }

  @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @PreAuthorize("hasAnyRole('FARMER','ADMIN')")
  public ApiResponse<Long> upload(
      @AuthenticationPrincipal AuthPrincipal principal,
      @RequestParam Long productId,
      @RequestParam(defaultValue = "false") boolean primary,
      @RequestParam(defaultValue = "0") int position,
      @RequestParam("file") MultipartFile file) {
    return ApiResponse.ok(productImageUploadService.uploadDirect(principal.userId(), productId, file, primary, position));
  }

  @DeleteMapping
  @PreAuthorize("hasAnyRole('FARMER','ADMIN')")
  public ApiResponse<Void> remove(
      @AuthenticationPrincipal AuthPrincipal principal, @Valid @RequestBody RemoveImageRequest request) {
    productImageUploadService.removeImage(principal.userId(), request);
    return ApiResponse.ok(null);
  }

  @PostMapping("/reorder")
  @PreAuthorize("hasAnyRole('FARMER','ADMIN')")
  public ApiResponse<Void> reorder(
      @AuthenticationPrincipal AuthPrincipal principal, @Valid @RequestBody ReorderImagesRequest request) {
    productImageUploadService.reorderImages(principal.userId(), request);
    return ApiResponse.ok(null);
  }

  @PostMapping("/set-primary")
  @PreAuthorize("hasAnyRole('FARMER','ADMIN')")
  public ApiResponse<Void> setPrimary(
      @AuthenticationPrincipal AuthPrincipal principal, @Valid @RequestBody SetPrimaryImageRequest request) {
    productImageUploadService.setPrimary(principal.userId(), request);
    return ApiResponse.ok(null);
  }
}
