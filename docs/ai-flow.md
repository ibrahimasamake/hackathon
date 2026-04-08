# AI Voice Market Flow

## Endpoint Flow
1. Frontend captures voice/text on `/ai-market-assistant`
2. Request sent to `/api/ai/market/query` or `/api/ai/market/voice-query`
3. Backend detects language and normalizes multilingual product terms
4. Intent translated into marketplace filters (query, location, sort, freshness)
5. Product search runs via product service
6. Response returns:
   - detected language
   - assistant message
   - intent object
   - follow-up suggestions
   - product result cards

## Fallback
- AI unavailable: manual search/filter on marketplace still works.
- No results: assistant returns alternatives and suggestion chips.
