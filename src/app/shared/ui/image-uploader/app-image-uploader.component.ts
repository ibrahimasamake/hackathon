import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';

export interface UploadFilePreview {
  file: File;
  previewUrl: string;
  primary?: boolean;
}

@Component({
  selector: 'app-image-uploader',
  template: `
    <section class="space-y-3 rounded-2xl border border-border bg-surface p-4">
      <label class="inline-flex cursor-pointer items-center rounded-xl border border-border px-3 py-2 text-sm">
        Select images
        <input class="hidden" type="file" accept="image/*" multiple (change)="onFiles($event)" />
      </label>
      <div class="grid grid-cols-3 gap-2">
        @for (item of previews(); track item.previewUrl; let idx = $index) {
          <div class="relative overflow-hidden rounded-lg border border-border">
            <img [src]="item.previewUrl" alt="Preview image" class="h-24 w-full object-cover" />
            <div class="absolute inset-x-0 bottom-0 flex justify-between bg-black/55 px-1 py-1 text-[10px] text-white">
              <button (click)="setPrimary(idx)">{{ item.primary ? 'Primary' : 'Set primary' }}</button>
              <div class="flex gap-1">
                <button (click)="move(idx, -1)">↑</button>
                <button (click)="move(idx, 1)">↓</button>
                <button (click)="remove(idx)">✕</button>
              </div>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppImageUploaderComponent {
  readonly filesSelected = output<UploadFilePreview[]>();
  readonly previews = signal<UploadFilePreview[]>([]);

  onFiles(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    const previews = files.map((file, index) => ({ file, previewUrl: URL.createObjectURL(file), primary: index === 0 }));
    this.previews.set(previews);
    this.filesSelected.emit(previews);
  }

  remove(index: number): void {
    const next = this.previews().filter((_, i) => i !== index);
    if (next.length > 0 && !next.some((item) => item.primary)) {
      next[0] = { ...next[0], primary: true };
    }
    this.previews.set(next);
    this.filesSelected.emit(next);
  }

  move(index: number, delta: number): void {
    const target = index + delta;
    const list = [...this.previews()];
    if (target < 0 || target >= list.length) {
      return;
    }
    [list[index], list[target]] = [list[target], list[index]];
    this.previews.set(list);
    this.filesSelected.emit(list);
  }

  setPrimary(index: number): void {
    const next = this.previews().map((item, i) => ({ ...item, primary: i === index }));
    this.previews.set(next);
    this.filesSelected.emit(next);
  }
}
