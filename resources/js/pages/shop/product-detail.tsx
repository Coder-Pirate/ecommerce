import { Head, Link, usePage } from '@inertiajs/react';
import { Heart, Minus, Plus, ShoppingCart, Truck } from 'lucide-react';
import { useState } from 'react';
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

    const discount = product.original_price
        ? Math.round(((parseFloat(product.original_price) - parseFloat(product.price)) / parseFloat(product.original_price)) * 100)
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
                            <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
                            {product.original_price && (
                                <span className="text-lg text-muted-foreground line-through">{formatPrice(product.original_price)}</span>
                            )}
                            {discount > 0 && (
                                <Badge className="bg-red-500 text-white hover:bg-red-500">-{discount}%</Badge>
                            )}
                        </div>

                        <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

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
                            <Button size="lg" className="flex-1" disabled={!product.in_stock} asChild>
                                <Link href="/cart">
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
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
                                {product.in_stock ? (
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
