import { Head, Link, usePage } from '@inertiajs/react';
import { Filter } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ShopLayout } from '@/components/ecommerce/shop-layout';
import type { SharedCategory, Product } from '@/types/global';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

function formatPrice(price: string | null): string {
    if (!price) return '';
    return `৳${parseFloat(price).toFixed(0)}`;
}

export default function ShopProducts() {
    const { categories, products } = usePage<{ categories: SharedCategory[]; products: Product[] }>().props;

    const initialCategory = useMemo(() => {
        const params = new URLSearchParams(window.location.search);
        const catParam = params.get('category');
        return catParam ? Number(catParam) : null;
    }, []);

    const [selectedCategory, setSelectedCategory] = useState<number | null>(initialCategory);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high'>('default');

    const filtered = products
        .filter((p) => !selectedCategory || p.category_id === selectedCategory)
        .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === 'price-low') return parseFloat(a.price) - parseFloat(b.price);
            if (sortBy === 'price-high') return parseFloat(b.price) - parseFloat(a.price);

            return 0;
        });

    return (
        <>
            <Head title="Shop All Products" />
            <ShopLayout>
                {/* Filters bar */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold md:text-2xl">All Products</h1>
                        <p className="text-sm text-muted-foreground">{filtered.length} products found</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Input
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-9 w-40"
                        />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                        >
                            <option value="default">Sort by</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* Category pills */}
                <div className="mb-6 flex flex-wrap gap-2">
                    <Button
                        variant={selectedCategory === null ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(null)}
                    >
                        All
                    </Button>
                    {categories.map((cat) => (
                        <Button
                            key={cat.id}
                            variant={selectedCategory === cat.id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategory(cat.id)}
                        >
                            {cat.name}
                        </Button>
                    ))}
                </div>

                {/* Product grid */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {filtered.map((product) => (
                        <Link key={product.id} href={`/product/${product.id}`}>
                            <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-md">
                                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-muted/30 transition-transform group-hover:scale-105">
                                    {product.images?.[0] ? (
                                        <img src={`/${product.images[0].image_path}`} alt={product.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <span className="text-3xl">📦</span>
                                    )}
                                    {!product.in_stock && (
                                        <Badge variant="secondary" className="absolute left-2 top-2 text-[10px]">
                                            Out of stock
                                        </Badge>
                                    )}
                                    {product.original_price && parseFloat(product.original_price) > parseFloat(product.price) && (
                                        <Badge className="absolute right-2 top-2 bg-red-500 text-[10px] text-white hover:bg-red-500">
                                            -{Math.round(((parseFloat(product.original_price) - parseFloat(product.price)) / parseFloat(product.original_price)) * 100)}%
                                        </Badge>
                                    )}
                                </div>
                                <CardContent className="p-2">
                                    <p className="mb-0.5 text-[10px] text-muted-foreground">{product.category?.name}</p>
                                    <h3 className="mb-0.5 truncate text-xs font-medium sm:text-sm">{product.name}</h3>
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs font-bold text-primary sm:text-sm">{formatPrice(product.price)}</span>
                                        {product.original_price && (
                                            <span className="text-[10px] text-muted-foreground line-through">{formatPrice(product.original_price)}</span>
                                        )}
                                    </div>
                                    {product.free_shipping && (
                                        <p className="mt-0.5 text-[10px] font-medium text-green-600">Free Shipping</p>
                                    )}
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="py-16 text-center">
                        <Filter className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                        <p className="text-lg font-medium">No products found</p>
                        <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
                    </div>
                )}
            </ShopLayout>
        </>
    );
}
