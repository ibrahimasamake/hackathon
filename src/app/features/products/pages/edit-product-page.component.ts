import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CreateProductPageComponent } from './create-product-page.component';

@Component({
  selector: 'app-edit-product-page',
  imports: [CreateProductPageComponent],
  template: `
    <div class="mx-auto max-w-3xl px-4 pt-4 text-sm text-muted-foreground">
      Editing product #{{ productId }} (full update supported)
    </div>
    <app-create-product-page [productId]="productIdNum" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProductPageComponent {
  private readonly route = inject(ActivatedRoute);
  readonly productId = this.route.snapshot.paramMap.get('id');
  readonly productIdNum = this.productId ? Number(this.productId) : null;
}
