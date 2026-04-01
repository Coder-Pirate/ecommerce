import { Link } from '@inertiajs/react';
import { ArrowRight, Star, TrendingUp, Truck, Shield, RotateCcw } from 'lucide-react';
import { categories } from '@/components/ecommerce/category-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function HeroBanner() {
    return (
        <div className="relative overflow-hidden rounded-xl bg-linear-to-r from-primary to-primary/80 p-6 text-primary-foreground md:p-10">
            <div className="relative z-10 max-w-lg">
                <Badge variant="secondary" className="mb-3">
                    <TrendingUp className="mr-1 h-3 w-3" /> Trending Now
                </Badge>
                <h1 className="mb-3 text-2xl font-bold md:text-4xl">
                    Summer Sale Up to 50% Off
                </h1>
                <p className="mb-5 text-sm opacity-90 md:text-base">
                    Discover amazing deals across electronics, fashion, home & more. Limited time offers on top brands.
                </p>
                <Button variant="secondary" size="lg">
                    Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-10">
                <svg className="h-64 w-64" viewBox="0 0 200 200" fill="currentColor">
                    <circle cx="100" cy="100" r="100" />
                </svg>
            </div>
        </div>
    );
}

export function CategoryGrid() {
    return (
        <section>
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold md:text-xl">Shop by Category</h2>
                <Link href="#" className="text-sm font-medium text-primary hover:underline">
                    View all
                </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {categories.map((cat) => {
                    const Icon = cat.icon;

                    return (
                        <Link
                            key={cat.name}
                            href={cat.href}
                            className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center transition-all hover:border-primary/30 hover:shadow-md"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                <Icon className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-medium sm:text-sm">{cat.name}</span>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}

const featuredProducts = [
    { name: 'Wireless Headphones', price: '$79.99', originalPrice: '$129.99', rating: 4.5, image: '🎧' },
    { name: 'Smart Watch Pro', price: '$199.99', originalPrice: '$299.99', rating: 4.8, image: '⌚' },
    { name: 'Running Shoes', price: '$59.99', originalPrice: '$89.99', rating: 4.3, image: '👟' },
    { name: 'Organic Face Cream', price: '$24.99', originalPrice: '$39.99', rating: 4.7, image: '🧴' },
    { name: 'Laptop Backpack', price: '$34.99', originalPrice: '$54.99', rating: 4.4, image: '🎒' },
    { name: 'Coffee Maker', price: '$89.99', originalPrice: '$149.99', rating: 4.6, image: '☕' },
    { name: 'Bluetooth Speaker', price: '$49.99', originalPrice: '$79.99', rating: 4.5, image: '🔊' },
    { name: 'Desk Lamp', price: '$29.99', originalPrice: '$49.99', rating: 4.2, image: '💡' },
    { name: 'Yoga Mat', price: '$19.99', originalPrice: '$34.99', rating: 4.6, image: '🧘' },
    { name: 'Sunglasses', price: '$39.99', originalPrice: '$69.99', rating: 4.3, image: '🕶️' },
];

export function FeaturedProducts() {
    return (
        <section>
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold md:text-xl">Featured Products</h2>
                <Link href="#" className="text-sm font-medium text-primary hover:underline">
                    See more
                </Link>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5">
                {featuredProducts.map((product) => (
                    <Card key={product.name} className="group cursor-pointer overflow-hidden transition-all hover:shadow-md">
                        <div className="flex aspect-[4/3] items-center justify-center bg-muted/30 text-2xl sm:text-3xl transition-transform group-hover:scale-105">
                            {product.image}
                        </div>
                        <CardContent className="p-2">
                            <h3 className="mb-0.5 truncate text-[11px] sm:text-xs font-medium">{product.name}</h3>
                            <div className="mb-0.5 flex items-center gap-0.5">
                                <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                                <span className="text-[10px] text-muted-foreground">{product.rating}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-1">
                                <span className="text-[11px] sm:text-xs font-bold text-primary">{product.price}</span>
                                <span className="text-[9px] sm:text-[10px] text-muted-foreground line-through">{product.originalPrice}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}

const dealProducts = [
    { name: 'Bluetooth Speaker', price: '$29.99', discount: '40%', image: '🔊' },
    { name: 'Yoga Mat', price: '$19.99', discount: '35%', image: '🧘' },
    { name: 'Desk Lamp', price: '$22.99', discount: '50%', image: '💡' },
    { name: 'Water Bottle', price: '$12.99', discount: '25%', image: '🍶' },
];

export function DealsSection() {
    return (
        <section>
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold md:text-xl">Deals of the Day</h2>
                <Link href="#" className="text-sm font-medium text-primary hover:underline">
                    All deals
                </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {dealProducts.map((product) => (
                    <div
                        key={product.name}
                        className="group relative cursor-pointer overflow-hidden rounded-xl border border-border bg-card p-4 text-center transition-all hover:shadow-md"
                    >
                        <Badge className="absolute right-2 top-2 bg-red-500 text-white hover:bg-red-500">
                            -{product.discount}
                        </Badge>
                        <div className="mb-3 text-4xl">{product.image}</div>
                        <h3 className="mb-1 text-sm font-medium">{product.name}</h3>
                        <span className="text-sm font-bold text-primary">{product.price}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}

export function TrustBadges() {
    const badges = [
        { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
        { icon: Shield, title: 'Secure Payment', desc: '100% protected' },
        { icon: RotateCcw, title: 'Easy Returns', desc: '30-day guarantee' },
    ];

    return (
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {badges.map((badge) => {
                const Icon = badge.icon;

                return (
                    <div
                        key={badge.title}
                        className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">{badge.title}</p>
                            <p className="text-xs text-muted-foreground">{badge.desc}</p>
                        </div>
                    </div>
                );
            })}
        </section>
    );
}
