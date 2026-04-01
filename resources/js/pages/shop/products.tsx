import { Head, Link } from '@inertiajs/react';
import { Filter, Star } from 'lucide-react';
import { useState } from 'react';
import { ShopLayout } from '@/components/ecommerce/shop-layout';
import { products, formatPrice } from '@/components/ecommerce/product-data';
import { categories } from '@/components/ecommerce/category-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function ShopProducts() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'rating'>('default');

    const filtered = products
        .filter((p) => !selectedCategory || p.category === selectedCategory)
        .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === 'price-low') return a.price - b.price;
            if (sortBy === 'price-high') return b.price - a.price;
            if (sortBy === 'rating') return b.rating - a.rating;

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
                            <option value="rating">Top Rated</option>
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
                            key={cat.name}
                            variant={selectedCategory === cat.name ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategory(cat.name)}
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
                                <div className="relative flex aspect-[4/3] items-center justify-center bg-muted/30 text-3xl transition-transform group-hover:scale-105">
                                    {product.image}
                                    {!product.inStock && (
                                        <Badge variant="secondary" className="absolute left-2 top-2 text-[10px]">
                                            Out of stock
                                        </Badge>
                                    )}
                                    {product.originalPrice > product.price && (
                                        <Badge className="absolute right-2 top-2 bg-red-500 text-[10px] text-white hover:bg-red-500">
                                            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                        </Badge>
                                    )}
                                </div>
                                <CardContent className="p-2">
                                    <p className="mb-0.5 text-[10px] text-muted-foreground">{product.category}</p>
                                    <h3 className="mb-0.5 truncate text-xs font-medium sm:text-sm">{product.name}</h3>
                                    <div className="mb-0.5 flex items-center gap-0.5">
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        <span className="text-[10px] text-muted-foreground">{product.rating}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs font-bold text-primary sm:text-sm">{formatPrice(product.price)}</span>
                                        <span className="text-[10px] text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                                    </div>
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
