import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Heart, Minus, Plus, ShoppingCart, Star, Truck } from 'lucide-react';
import { useState } from 'react';
import { ShopLayout } from '@/components/ecommerce/shop-layout';
import { products, formatPrice } from '@/components/ecommerce/product-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function ProductDetail({ id }: { id: number }) {
    const product = products.find((p) => p.id === id);
    const [quantity, setQuantity] = useState(1);

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

    const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

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
                    {/* Image */}
                    <div className="flex aspect-square items-center justify-center rounded-xl border bg-muted/20 text-8xl">
                        {product.image}
                    </div>

                    {/* Info */}
                    <div>
                        <Badge variant="secondary" className="mb-2">{product.category}</Badge>
                        <h1 className="mb-2 text-2xl font-bold md:text-3xl">{product.name}</h1>

                        <div className="mb-3 flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-muted-foreground">({product.rating})</span>
                        </div>

                        <div className="mb-4 flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
                            <span className="text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                            <Badge className="bg-red-500 text-white hover:bg-red-500">-{discount}%</Badge>
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
                            <Button size="lg" className="flex-1" disabled={!product.inStock} asChild>
                                <Link href="/cart">
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
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
                                {product.inStock ? (
                                    <span className="text-green-600">● In Stock</span>
                                ) : (
                                    <span className="text-red-500">● Out of Stock</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related products */}
                {related.length > 0 && (
                    <div className="mt-12">
                        <h2 className="mb-4 text-lg font-semibold">Related Products</h2>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {related.map((p) => (
                                <Link key={p.id} href={`/product/${p.id}`}>
                                    <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-md">
                                        <div className="flex aspect-[4/3] items-center justify-center bg-muted/30 text-3xl transition-transform group-hover:scale-105">
                                            {p.image}
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
