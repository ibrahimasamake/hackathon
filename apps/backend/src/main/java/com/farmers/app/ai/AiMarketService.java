package com.farmers.app.ai;

import com.farmers.app.ai.AiDtos.AiIntent;
import com.farmers.app.ai.AiDtos.AiMarketQueryResponse;
import com.farmers.app.products.ProductDtos.ProductResponse;
import com.farmers.app.products.ProductEnums.AvailabilityStatus;
import com.farmers.app.products.ProductService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AiMarketService {
  private final MultilingualQueryNormalizer normalizer;
  private final ProductService productService;

  @Transactional(readOnly = true)
  public AiMarketQueryResponse query(String message, String languageHint, String locationHint) {
    String detected = normalizer.detectLanguage(message, languageHint);
    String canonical = normalizer.canonicalProduct(message).orElse(null);
    String sort = message != null && (message.toLowerCase().contains("cheap") || message.contains("सस्ता"))
        ? "price_asc"
        : "freshest";
    String freshness = message != null && message.toLowerCase().contains("fresh") ? "fresh" : "any";

    var page =
        productService.searchPublic(
            canonical,
            null,
            locationHint,
            AvailabilityStatus.AVAILABLE,
            sort,
            0,
            8);
    List<ProductResponse> products = page.content();
    AiIntent intent = new AiIntent(canonical, null, locationHint, sort, freshness, "budget", null);
    String answer =
        products.isEmpty()
            ? fallbackMessage(detected, canonical)
            : successMessage(detected, products.size(), canonical);
    return new AiMarketQueryResponse(
        detected,
        answer,
        intent,
        List.of(
            localized(detected, "Show cheaper options", "सस्ते विकल्प दिखाओ"),
            localized(detected, "Show nearest farmers", "पास के किसान दिखाओ"),
            localized(detected, "Only freshest today", "आज की सबसे ताज़ा उपज")),
        products);
  }

  public String transcribe(String ignoredAudioBase64, String languageHint) {
    return localized(normalizer.detectLanguage("", languageHint), "Show me fresh tomatoes near me", "मुझे पास के ताज़ा टमाटर दिखाओ");
  }

  public List<String> suggestions(String languageHint) {
    String lang = normalizer.detectLanguage("", languageHint);
    return List.of(
        localized(lang, "Find fresh onions under ₹500", "₹500 के अंदर ताज़ा प्याज़ ढूँढो"),
        localized(lang, "Show organic rice nearby", "पास का ऑर्गेनिक चावल दिखाओ"),
        localized(lang, "Need 10kg tomatoes today", "आज के लिए 10 किलो टमाटर चाहिए"));
  }

  private String successMessage(String lang, int count, String canonical) {
    return localized(
        lang,
        "I found %d products%s. You can refine by price, freshness, or location."
            .formatted(count, canonical == null ? "" : " for " + canonical),
        "मुझे %d उत्पाद मिले%s। आप कीमत, ताज़गी या लोकेशन से और फ़िल्टर कर सकते हैं।"
            .formatted(count, canonical == null ? "" : " (" + canonical + ")"));
  }

  private String fallbackMessage(String lang, String canonical) {
    return localized(
        lang,
        "No exact matches found%s. Try broader location or another product name."
            .formatted(canonical == null ? "" : " for " + canonical),
        "सटीक परिणाम नहीं मिला%s। लोकेशन या प्रोडक्ट नाम बदलकर देखें।"
            .formatted(canonical == null ? "" : " (" + canonical + ")"));
  }

  private String localized(String language, String en, String hi) {
    return "hi".equals(language) ? hi : en;
  }
}
