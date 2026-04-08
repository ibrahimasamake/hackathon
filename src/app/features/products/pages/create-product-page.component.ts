import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ProductApiService } from '../../../core/services/product-api.service';
import { StorageApiService } from '../../../core/services/storage-api.service';
import { SaveProductPayload } from '../../../core/services/product-api.service';
import { AppButtonComponent } from '../../../shared/ui/button/app-button.component';
import { AppImageUploaderComponent } from '../../../shared/ui/image-uploader/app-image-uploader.component';
import { AppInputComponent } from '../../../shared/ui/input/app-input.component';
import { AppLoadingSpinnerComponent } from '../../../shared/ui/loading/app-loading-spinner.component';
import { AppPageHeaderComponent } from '../../../shared/ui/page-header/app-page-header.component';
import { AppTextareaComponent } from '../../../shared/ui/textarea/app-textarea.component';
import { AppSelectComponent, SelectOption } from '../../../shared/ui/select/app-select.component';
import { UploadFilePreview } from '../../../shared/ui/image-uploader/app-image-uploader.component';

@Component({
  selector: 'app-create-product-page',
  imports: [
    ReactiveFormsModule,
    AppPageHeaderComponent,
    AppInputComponent,
    AppImageUploaderComponent,
    AppButtonComponent,
    AppLoadingSpinnerComponent,
    AppTextareaComponent,
    AppSelectComponent,
  ],
  template: `
    <main class="mx-auto max-w-3xl px-4 py-6">
      <app-page-header [title]="productId() ? 'Edit product' : 'Create product'" subtitle="Publish a new marketplace listing" />
      <form class="space-y-4 rounded-2xl border border-border bg-surface p-5" [formGroup]="form" (ngSubmit)="submit()">
        <div class="grid gap-4 md:grid-cols-2">
          <app-input label="Product title" [control]="form.controls.title" />
          <app-select label="Category" [options]="categoryOptions" [control]="form.controls.category" />
          <app-input label="Price (INR)" type="number" [control]="form.controls.price" />
          <app-input label="Quantity" type="number" [control]="form.controls.quantity" />
          <app-select label="Unit" [options]="unitOptions" [control]="form.controls.unit" />
          <app-input label="Harvest date" type="date" [control]="form.controls.harvestDate" />
          <app-input label="Location" [control]="form.controls.location" />
        </div>
        <app-textarea label="Description (English)" [control]="form.controls.descriptionEn" />
        <app-select label="Stock status" [options]="stockOptions" [control]="form.controls.stockStatus" />

        <section>
          <p class="mb-2 text-sm font-semibold">Product images</p>
          <app-image-uploader (filesSelected)="onFiles($event)" />
          <p class="mt-2 text-xs text-muted-foreground">
            {{ selectedFiles().length }} image(s) selected • reorder and set primary in uploader
          </p>
        </section>

        <div class="flex flex-wrap gap-2">
          <app-button type="button" variant="outline" (click)="saveDraft()">Save draft</app-button>
          <app-button type="button" variant="outline" (click)="preview()">Preview</app-button>
          <app-button type="submit">{{ productId() ? 'Update product' : 'Publish product' }}</app-button>
        </div>
        @if (loading()) {
          <app-loading-spinner />
        }
        @if (error()) {
          <p class="text-sm text-red-600">{{ error() }}</p>
        }
      </form>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProductPageComponent implements OnInit {
  readonly productId = input<number | null>(null);
  private readonly productApi = inject(ProductApiService);
  private readonly storageApi = inject(StorageApiService);
  private readonly router = inject(Router);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    category: new FormControl('vegetables', { nonNullable: true, validators: [Validators.required] }),
    price: new FormControl('0', { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    quantity: new FormControl('0', { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    unit: new FormControl('kg', { nonNullable: true, validators: [Validators.required] }),
    harvestDate: new FormControl('', { nonNullable: true }),
    location: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    descriptionEn: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    stockStatus: new FormControl('available', { nonNullable: true }),
  });

  readonly selectedFiles = signal<UploadFilePreview[]>([]);
  readonly categoryOptions: SelectOption[] = [
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'grains', label: 'Grains' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'dairy', label: 'Dairy' },
  ];
  readonly unitOptions: SelectOption[] = [
    { value: 'kg', label: 'Kg' },
    { value: 'bag', label: 'Bag' },
    { value: 'basket', label: 'Basket' },
    { value: 'piece', label: 'Piece' },
    { value: 'ton', label: 'Ton' },
  ];
  readonly stockOptions: SelectOption[] = [
    { value: 'available', label: 'Available' },
    { value: 'limited', label: 'Limited' },
    { value: 'out', label: 'Out of stock' },
  ];

  ngOnInit(): void {
    if (this.productId()) {
      this.productApi.byId(this.productId()!).subscribe({
        next: (product) =>
          this.form.patchValue({
            title: product.title,
            category: product.category.toLowerCase(),
            price: `${product.price}`,
            quantity: `${product.quantity}`,
            unit: product.unit.toLowerCase(),
            harvestDate: product.harvestDate ?? '',
            location: product.location,
            descriptionEn: product.description,
            stockStatus: product.availabilityStatus === 'AVAILABLE' ? 'available' : 'out',
          }),
      });
    }
  }

  onFiles(files: UploadFilePreview[]): void {
    this.selectedFiles.set(files);
  }

  saveDraft(): void {
    console.info('Draft saved', this.form.getRawValue(), this.selectedFiles());
  }

  preview(): void {
    console.info('Preview product', this.form.getRawValue(), this.selectedFiles());
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    const value = this.form.getRawValue();
    const payload: SaveProductPayload = {
      title: value.title,
      description: value.descriptionEn,
      category: capitalize(value.category),
      price: Number(value.price),
      currency: 'INR',
      quantity: Number(value.quantity),
      unit: value.unit.toUpperCase() as 'KG' | 'BAG' | 'BASKET' | 'PIECE' | 'TON',
      harvestDate: value.harvestDate || null,
      location: value.location,
      availabilityStatus: (value.stockStatus === 'out' ? 'UNAVAILABLE' : 'AVAILABLE') as 'AVAILABLE' | 'UNAVAILABLE',
      tags: null,
    };
    const save$ = this.productId()
      ? this.productApi.update(this.productId()!, payload)
      : this.productApi.create(payload);
    save$
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (product) => {
          const files = this.selectedFiles();
          if (files.length === 0) {
            void this.router.navigateByUrl('/products');
            return;
          }
          let uploaded = 0;
          files.forEach((item, index) => {
            this.storageApi.uploadProductImage(product.id, item.file, !!item.primary, index).subscribe({
              next: () => {
                uploaded += 1;
                if (uploaded === files.length) {
                  void this.router.navigateByUrl('/products');
                }
              },
              error: (err: unknown) => {
                const reason = this.extractErrorMessage(err);
                this.error.set(`Product saved, but image upload failed: ${reason}`);
              },
            });
          });
        },
        error: (err: unknown) => this.error.set(this.extractErrorMessage(err)),
      });
  }

  private extractErrorMessage(err: unknown): string {
    if (!(err instanceof HttpErrorResponse)) {
      return 'Failed to save product. Check backend and form data.';
    }
    const body = err.error as { message?: string; data?: Record<string, string> } | null;
    if (body?.message === 'Validation failed' && body.data && Object.keys(body.data).length > 0) {
      const [field, message] = Object.entries(body.data)[0];
      return `${field}: ${message}`;
    }
    if (err.status === 403) {
      return 'Access denied. Login with a Farmer/Admin account to create products.';
    }
    if (body?.message) {
      return body.message;
    }
    return `Failed to save product (HTTP ${err.status || 'unknown'}).`;
  }
}

function capitalize(value: string): string {
  if (!value) {
    return value;
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}
