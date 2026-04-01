import { Head, Link, usePage } from '@inertiajs/react';
import { Heart, Minus, Plus, ShoppingCart, Truck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ShopLayout } from '@/components/ecommerce/shop-layout';
import type { Product } from '@/types/global';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

function formatPrice(price: string | null): string {
    if (!price) return '';
    return `$${parseFloat(price).toFixed(2)}`;
}

export default function ProductDetail() {
    const { product, relatedProducts } = usePage<{ product: Product; relatedProducts: Product[] }>().props;
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);

    const variants = product.variants || [];
    const sizes = useMemo(() => [...new Set(variants.filter((v) => v.size).map((v) => v.size!))], [variants]);
    const colors = useMemo(() => [...new Set(variants.filter((v) => v.color).map((v) => v.color!))], [variants]);

    const selectedVariant = variants.find((v) => v.id === selectedVariantId) ?? null;
    const activePrice = selectedVariant ? selectedVariant.price : product.price;
    const activeOriginalPrice = selectedVariant ? selectedVariant.original_price : product.original_price;
    const activeInStock = selectedVariant ? selectedVariant.in_stock : product.in_stock;

    if (!product) {
        return (
            <>
                <Head title="Product Not Found" />
                <ShopLayout>
                    <div className="py-16 text-center">
                        <p className="text-lg font-medium">Product not found</p>
                        <Button asChild className="mt-4">
                            <Link href="/products">Back to Shop</Link>
                        </Button>
                    </div>
                </ShopLayout>
            </>
        );
    }

    const discount = activeOriginalPrice
        ? Math.round(((parseFloat(activeOriginalPrice) - parseFloat(activePrice)) / parseFloat(activeOriginalPrice)) * 100)
        : 0;

    return (
        <>
            <Head title={product.name} />
            <ShopLayout>
                {/* Breadcrumb */}
                <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-foreground">Home</Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-foreground">Shop</Link>
                    <span>/</span>
                    <span className="text-foreground">{product.name}</span>
                </div>

                {/* Product detail */}
                <div className="grid gap-8 md:grid-cols-2">
                    {/* Images */}
                    <div>
                        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border bg-muted/20">
                            {product.images && product.images.length > 0 ? (
                                <img src={`/${product.images[selectedImage]?.image_path}`} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                                <span className="text-8xl">📦</span>
                            )}
                        </div>
                        {product.images && product.images.length > 1 && (
                            <div className="mt-3 flex gap-2 overflow-x-auto">
                                {product.images.map((img, i) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setSelectedImage(i)}
                                        className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${selectedImage === i ? 'border-primary' : 'border-transparent'}`}
                                    >
                                        <img src={`/${img.image_path}`} alt="" className="h-full w-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div>
                        <Badge variant="secondary" className="mb-2">{product.category?.name}</Badge>
                        <h1 className="mb-2 text-2xl font-bold md:text-3xl">{product.name}</h1>

                        <div className="mb-4 flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-primary">{formatPrice(activePrice)}</span>
                            {activeOriginalPrice && (
                                <span className="text-lg text-muted-foreground line-through">{formatPrice(activeOriginalPrice)}</span>
                            )}
                            {discount > 0 && (
                                <Badge className="bg-red-500 text-white hover:bg-red-500">-{discount}%</Badge>
                            )}
                        </div>

                        <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

                        {/* Variant selectors */}
                        {variants.length > 0 && (
                            <div className="mb-6 space-y-4">
                                {sizes.length > 0 && (
                                    <div>
                                        <span className="mb-2 block text-sm font-medium">Size</span>
                                        <div className="flex flex-wrap gap-2">
                                            {sizes.map((size) => {
                                                const matchingVariants = variants.filter((v) => v.size === size);
                                                const isSelected = selectedVariant?.size === size;
                                                return (
                                                    <button
                                                        key={size}
                                                        type="button"
                                                        onClick={() => {
                                                            const match = matchingVariants.find(
                                                                (v) => !selectedVariant?.color || v.color === selectedVariant.color,
                                                            ) || matchingVariants[0];
                                                            setSelectedVariantId(match.id);
                                                        }}
                                                        className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                                                            isSelected
                                                                ? 'border-primary bg-primary text-primary-foreground'
                                                                : 'border-input hover:border-primary/50'
                                                        }`}
                                                    >
                                                        {size}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                {colors.length > 0 && (
                                    <div>
                                        <span className="mb-2 block text-sm font-medium">Color</span>
                                        <div className="flex flex-wrap gap-2">
                                            {colors.map((color) => {
                                                const matchingVariants = variants.filter((v) => v.color === color);
                                                const isSelected = selectedVariant?.color === color;
                                                return (
                                                    <button
                                                        key={color}
                                                        type="button"
                                                        onClick={() => {
                                                            const match = matchingVariants.find(
                                                                (v) => !selectedVariant?.size || v.size === selectedVariant.size,
                                                            ) || matchingVariants[0];
                                                            setSelectedVariantId(match.id);
                                                        }}
                                                        className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                                                            isSelected
                                                                ? 'border-primary bg-primary text-primary-foreground'
                                                                : 'border-input hover:border-primary/50'
                                                        }`}
                                                    >
                                                        {color}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <Separator className="mb-6" />

                        {/* Quantity */}
                        <div className="mb-4 flex items-center gap-3">
                            <span className="text-sm font-medium">Quantity:</span>
                            <div className="flex items-center rounded-md border">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9"
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mb-6 flex gap-3">
                            <Button size="lg" className="flex-1" disabled={!activeInStock} asChild>
                                <Link href="/cart">
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    {activeInStock ? 'Add to Cart' : 'Out of Stock'}
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg">
                                <Heart className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Info badges */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Truck className="h-4 w-4" />
                                <span>Free shipping on orders over $50</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                {activeInStock ? (
                                    <span className="text-green-600">● In Stock</span>
                                ) : (
                                    <span className="text-red-500">● Out of Stock</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-12">
                        <h2 className="mb-4 text-lg font-semibold">Related Products</h2>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {relatedProducts.map((p) => (
                                <Link key={p.id} href={`/product/${p.id}`}>
                                    <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-md">
                                        <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-muted/30 transition-transform group-hover:scale-105">
                                            {p.images?.[0] ? (
                                                <img src={`/${p.images[0].image_path}`} alt={p.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-3xl">📦</span>
                                            )}
                                        </div>
                                        <CardContent className="p-2">
                                            <h3 className="truncate text-xs font-medium">{p.name}</h3>
                                            <span className="text-xs font-bold text-primary">{formatPrice(p.price)}</span>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </ShopLayout>
        </>
    );
}
