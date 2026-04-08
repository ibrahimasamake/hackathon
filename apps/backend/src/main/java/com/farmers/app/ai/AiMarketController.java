package com.farmers.app.ai;

import com.farmers.app.ai.AiDtos.AiMarketQueryRequest;
import com.farmers.app.ai.AiDtos.AiMarketQueryResponse;
import com.farmers.app.ai.AiDtos.AiMarketVoiceRequest;
import com.farmers.app.ai.AiDtos.AiTranscribeRequest;
import com.farmers.app.ai.AiDtos.AiTranscribeResponse;
import com.farmers.app.common.dto.ApiResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai/market")
@RequiredArgsConstructor
public class AiMarketController {
  private final AiMarketService aiMarketService;
  private final MultilingualQueryNormalizer multilingualQueryNormalizer;

  @PostMapping("/query")
  public ApiResponse<AiMarketQueryResponse> query(@RequestBody AiMarketQueryRequest request) {
    return ApiResponse.ok(aiMarketService.query(request.message(), request.languageHint(), request.locationHint()));
  }

  @PostMapping("/voice-query")
  public ApiResponse<AiMarketQueryResponse> voiceQuery(@RequestBody AiMarketVoiceRequest request) {
    return ApiResponse.ok(aiMarketService.query(request.transcript(), request.languageHint(), request.locationHint()));
  }

  @PostMapping("/transcribe")
  public ApiResponse<AiTranscribeResponse> transcribe(@RequestBody AiTranscribeRequest request) {
    String text = aiMarketService.transcribe(request.audioBase64(), request.languageHint());
    String lang = multilingualQueryNormalizer.detectLanguage(text, request.languageHint());
    return ApiResponse.ok(new AiTranscribeResponse(text, lang));
  }

  @GetMapping("/suggestions")
  public ApiResponse<List<String>> suggestions(@RequestParam(required = false) String languageHint) {
    return ApiResponse.ok(aiMarketService.suggestions(languageHint));
  }
}
