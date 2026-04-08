package com.farmers.app.ai;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import org.springframework.stereotype.Component;

@Component
public class MultilingualQueryNormalizer {
  private static final Map<String, String> CANONICAL_MAP = new HashMap<>();

  static {
    CANONICAL_MAP.put("tomato", "tomato");
    CANONICAL_MAP.put("tamatar", "tomato");
    CANONICAL_MAP.put("टमाटर", "tomato");
    CANONICAL_MAP.put("தக்காளி", "tomato");
    CANONICAL_MAP.put("టమాటా", "tomato");

    CANONICAL_MAP.put("onion", "onion");
    CANONICAL_MAP.put("pyaj", "onion");
    CANONICAL_MAP.put("प्याज", "onion");
    CANONICAL_MAP.put("வெங்காயம்", "onion");
    CANONICAL_MAP.put("ఉల్లిపాయ", "onion");

    CANONICAL_MAP.put("rice", "rice");
    CANONICAL_MAP.put("chawal", "rice");
    CANONICAL_MAP.put("चावल", "rice");
    CANONICAL_MAP.put("அரிசி", "rice");
    CANONICAL_MAP.put("బియ్యం", "rice");
  }

  public Optional<String> canonicalProduct(String text) {
    if (text == null || text.isBlank()) {
      return Optional.empty();
    }
    String normalized = text.toLowerCase(Locale.ROOT);
    return CANONICAL_MAP.entrySet().stream()
        .filter(entry -> normalized.contains(entry.getKey()))
        .map(Map.Entry::getValue)
        .findFirst();
  }

  public String detectLanguage(String text, String hint) {
    if (hint != null && !hint.isBlank()) {
      return hint;
    }
    if (text == null) {
      return "en";
    }
    if (text.matches(".*[\\u0900-\\u097F].*")) {
      return "hi";
    }
    if (text.matches(".*[\\u0B80-\\u0BFF].*")) {
      return "ta";
    }
    if (text.matches(".*[\\u0C00-\\u0C7F].*")) {
      return "te";
    }
    if (text.matches(".*[\\u0980-\\u09FF].*")) {
      return "bn";
    }
    if (text.matches(".*[\\u0C80-\\u0CFF].*")) {
      return "kn";
    }
    if (text.matches(".*[\\u0D00-\\u0D7F].*")) {
      return "ml";
    }
    return "en";
  }
}
