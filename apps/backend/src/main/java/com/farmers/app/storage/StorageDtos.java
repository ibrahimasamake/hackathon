package com.farmers.app.storage;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class StorageDtos {
  public record UploadUrlRequest(
      @NotNull Long productId,
      @NotBlank String fileName,
      @NotBlank String mimeType,
      @Positive long sizeBytes) {}

  public record UploadUrlResponse(String objectKey, String uploadUrl, String publicUrl, String method) {}

  public record ConfirmUploadRequest(
      @NotNull Long productId,
      @NotBlank String objectKey,
      @NotBlank String publicUrl,
      @NotBlank String mimeType,
      @Positive long sizeBytes,
      boolean primary,
      int position) {}

  public record RemoveImageRequest(@NotNull Long productId, @NotNull Long imageId) {}

  public record ReorderImagesRequest(@NotNull Long productId, @NotNull java.util.List<Long> orderedImageIds) {}

  public record SetPrimaryImageRequest(@NotNull Long productId, @NotNull Long imageId) {}
}
