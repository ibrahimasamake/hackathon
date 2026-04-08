import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  template: `
    <img
      [src]="src() || fallback"
      [alt]="alt()"
      class="h-10 w-10 rounded-full border border-border object-cover"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppAvatarComponent {
  readonly src = input<string>('');
  readonly alt = input<string>('User avatar');
  readonly fallback = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200';
}
