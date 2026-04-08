# India Multilingual Strategy

Supported MVP languages:
- English (`en`)
- Hindi (`hi`)
- Tamil (`ta`)
- Telugu (`te`)
- Kannada (`kn`)
- Malayalam (`ml`)
- Bengali (`bn`)
- Marathi (`mr`)

## Frontend
- `I18nService` manages language state and dictionary.
- `LanguageSwitcherComponent` is available in top navigation.
- Public UI strings use translation keys.

## Backend
- `MultilingualQueryNormalizer` maps multilingual product words to canonical terms:
  - tomato/tamatar/टमाटर/தக்காளி/టమాటా -> `tomato`
  - onion/pyaj/प्याज/வெங்காயம்/ఉల్లిపాయ -> `onion`
  - rice/chawal/चावल/அரிசி/బియ్యం -> `rice`
- Language detection uses script + hint.
- AI module answers in detected language (English/Hindi currently, extensible).
