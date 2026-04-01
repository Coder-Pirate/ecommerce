import type { Auth } from '@/types/auth';

export type SharedCategory = {
    id: number;
    name: string;
    icon: string | null;
};

export type ProductImage = {
    id: number;
    product_id: number;
    image_path: string;
    sort_order: number;
};

export type ProductVariant = {
    id: number;
    product_id: number;
    size: string | null;
    color: string | null;
    price: string;
    original_price: string | null;
    in_stock: boolean;
};

export type Product = {
    id: number;
    category_id: number;
    sub_category_id: number | null;
    name: string;
    description: string | null;
    price: string;
    original_price: string | null;
    in_stock: boolean;
    created_at: string;
    updated_at: string;
    images?: ProductImage[];
    variants?: ProductVariant[];
    category?: SharedCategory;
    sub_category?: { id: number; name: string } | null;
};

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            flash: {
                success: string | null;
                error: string | null;
            };
            [key: string]: unknown;
        };
    }
}
