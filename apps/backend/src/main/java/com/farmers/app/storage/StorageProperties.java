package com.farmers.app.storage;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.r2")
public record StorageProperties(
    String accountId,
    String accessKeyId,
    String secretAccessKey,
    String bucket,
    String region,
    String endpoint,
    String publicBaseUrl,
    int maxFileMb,
    String allowedMime) {}
