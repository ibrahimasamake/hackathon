package com.farmers.app.ai;

import com.farmers.app.products.ProductDtos.ProductResponse;
import java.util.List;

public class AiDtos {
  public record AiMarketQueryRequest(String message, String languageHint, String locationHint) {}

  public record AiMarketVoiceRequest(String transcript, String languageHint, String locationHint) {}

  public record AiTranscribeRequest(String audioBase64, String languageHint) {}

  public record AiTranscribeResponse(String transcript, String detectedLanguage) {}

  public record AiIntent(
      String canonicalProduct,
      String category,
      String location,
      String sort,
      String freshness,
      String budgetPreference,
      String quantityHint) {}

  public record AiMarketQueryResponse(
      String detectedLanguage,
      String assistantMessage,
      AiIntent intent,
      List<String> followUpSuggestions,
      List<ProductResponse> products) {}
}
