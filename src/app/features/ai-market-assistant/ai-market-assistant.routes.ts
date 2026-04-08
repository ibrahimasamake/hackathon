import { Routes } from '@angular/router';

export const AI_MARKET_ASSISTANT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/ai-market-assistant-page.component').then((m) => m.AiMarketAssistantPageComponent),
  },
];
