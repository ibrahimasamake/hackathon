import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { I18nService } from '../../../core/i18n/i18n.service';
import { AppLoadingSpinnerComponent } from '../../../shared/ui/loading/app-loading-spinner.component';
import { AppProductCardComponent } from '../../../shared/ui/product-card/app-product-card.component';
import { AiMarketApiService } from '../services/ai-market-api.service';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

@Component({
  selector: 'app-ai-market-assistant-page',
  imports: [FormsModule, AppProductCardComponent, AppLoadingSpinnerComponent],
  template: `
    <main class="mx-auto max-w-6xl px-4 py-6">
      <header class="mb-4">
        <h1 class="text-2xl font-semibold">AI Market Assistant</h1>
        <p class="text-sm text-muted-foreground">Voice-first multilingual product discovery for India.</p>
      </header>

      <section class="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article class="rounded-2xl border border-border bg-surface p-4">
          <div class="mb-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Language: {{ i18n.language() }}</span>
            <span [class]="isRecording() ? 'text-red-600' : ''">{{ isRecording() ? 'Recording...' : 'Idle' }}</span>
          </div>

          <div class="max-h-[420px] space-y-2 overflow-auto rounded-xl bg-background p-3">
            @for (message of chat(); track $index) {
              <div [class]="message.role === 'user' ? 'ml-auto max-w-[82%] rounded-xl bg-primary p-3 text-sm text-white' : 'mr-auto max-w-[82%] rounded-xl border border-border bg-surface p-3 text-sm'">
                {{ message.text }}
              </div>
            }
          </div>

          <div class="mt-3 flex items-center gap-2">
            <input
              class="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm"
              placeholder="Ask in any language..."
              [(ngModel)]="inputText"
              (keyup.enter)="send()"
            />
            <button class="rounded-xl border border-border px-3 py-2 text-sm" (click)="toggleRecording()">
              🎙
            </button>
            <button class="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white" (click)="send()">Send</button>
          </div>
          @if (loading()) {
            <div class="mt-2"><app-loading-spinner /></div>
          }
        </article>

        <aside class="space-y-4">
          <section class="rounded-2xl border border-border bg-surface p-4">
            <h2 class="text-sm font-semibold">Suggestion chips</h2>
            <div class="mt-3 flex flex-wrap gap-2">
              @for (item of suggestions(); track item) {
                <button class="rounded-full border border-border px-3 py-1 text-xs" (click)="useSuggestion(item)">{{ item }}</button>
              }
            </div>
          </section>

          <section class="space-y-3 rounded-2xl border border-border bg-surface p-4">
            <h2 class="text-sm font-semibold">Results</h2>
            @for (card of cards(); track card.id) {
              <app-product-card [product]="card" />
            }
          </section>
        </aside>
      </section>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiMarketAssistantPageComponent {
  readonly i18n = inject(I18nService);
  private readonly api = inject(AiMarketApiService);
  readonly loading = signal(false);
  readonly isRecording = signal(false);
  readonly chat = signal<ChatMessage[]>([
    { role: 'assistant', text: 'Try: “मुझे पास के ताज़ा टमाटर दिखाओ” or “Show cheap onions near me”' },
  ]);
  readonly suggestions = signal<string[]>([]);
  readonly cards = signal<ReturnType<AiMarketApiService['toCards']>>([]);
  readonly canUseSpeech = computed(
    () => typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window),
  );

  inputText = '';

  constructor() {
    this.api.suggestions(this.i18n.language()).subscribe((items) => this.suggestions.set(items));
  }

  send(): void {
    const message = this.inputText.trim();
    if (!message) {
      return;
    }
    this.chat.update((prev) => [...prev, { role: 'user', text: message }]);
    this.inputText = '';
    this.loading.set(true);
    this.api
      .query(message, this.i18n.language())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((response) => {
        this.chat.update((prev) => [...prev, { role: 'assistant', text: response.assistantMessage }]);
        this.cards.set(this.api.toCards(response));
        this.suggestions.set(response.followUpSuggestions);
      });
  }

  useSuggestion(suggestion: string): void {
    this.inputText = suggestion;
    this.send();
  }

  toggleRecording(): void {
    if (!this.canUseSpeech()) {
      this.inputText = 'Show fresh tomatoes near me';
      return;
    }
    this.isRecording.set(true);
    const SpeechRecognitionClass = (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognition; SpeechRecognition?: new () => SpeechRecognition }).webkitSpeechRecognition
      ?? (window as unknown as { SpeechRecognition?: new () => SpeechRecognition }).SpeechRecognition;
    if (!SpeechRecognitionClass) {
      this.isRecording.set(false);
      return;
    }
    const recognition = new SpeechRecognitionClass();
    recognition.lang = this.i18n.language() === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      this.inputText = event.results[0][0].transcript;
      this.isRecording.set(false);
      this.send();
    };
    recognition.onerror = () => this.isRecording.set(false);
    recognition.onend = () => this.isRecording.set(false);
    recognition.start();
  }
}
