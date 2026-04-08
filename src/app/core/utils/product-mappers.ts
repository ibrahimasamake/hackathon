import { ProductApi } from '../models/product.model';
import { ProductCardModel } from '../../shared/types/marketplace.types';

export function toProductCard(product: ProductApi): ProductCardModel {
  return {
    id: product.id,
    title: product.title,
    farmerName: product.farmerName,
    location: product.location,
    price: Number(product.price),
    currency: product.currency,
    unit: product.unit.toLowerCase(),
    quantity: Number(product.quantity),
    imageUrl: primaryImage(product) ?? 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800',
    freshnessLabel: freshnessLabel(product.harvestDate),
  };
}

function primaryImage(product: ProductApi): string | null {
  const primary = product.images.find((img) => img.isPrimary) ?? product.images[0];
  return primary?.publicUrl ?? null;
}

function freshnessLabel(harvestDate: string | null): 'Fresh' | 'Today' | 'Aging' {
  if (!harvestDate) {
    return 'Aging';
  }
  const diffDays = Math.floor((Date.now() - new Date(harvestDate).getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) {
    return 'Today';
  }
  if (diffDays <= 3) {
    return 'Fresh';
  }
  return 'Aging';
}
