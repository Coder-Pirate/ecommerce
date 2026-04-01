import { Head, Link } from '@inertiajs/react';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ShopLayout } from '@/components/ecommerce/shop-layout';
import { products, formatPrice } from '@/components/ecommerce/product-data';
import type { Product } from '@/components/ecommerce/product-data';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type CartItem = {
    product: Product;
    quantity: number;
};

// Demo cart items
const initialCart: CartItem[] = [
    { product: products[0], quantity: 1 },
    { product: products[1], quantity: 2 },
    { product: products[5], quantity: 1 },
];

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>(initialCart);

    const updateQuantity = (productId: number, delta: number) => {
        setCartItems((prev) =>
            prev
                .map((item) =>
                    item.product.id === productId
                        ? { ...item, quantity: Math.max(0, item.quantity + delta) }
                        : item,
                )
                .filter((item) => item.quantity > 0),
        );
    };

    const removeItem = (productId: number) => {
        setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shipping = subtotal > 50 ? 0 : 5.99;
    const total = subtotal + shipping;

    return (
        <>
            <Head title="Shopping Cart" />
            <ShopLayout>
                <h1 className="mb-6 text-xl font-bold md:text-2xl">Shopping Cart</h1>

                {cartItems.length === 0 ? (
                    <div className="py-16 text-center">
                        <ShoppingBag className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                        <p className="mb-1 text-lg font-medium">Your cart is empty</p>
                        <p className="mb-4 text-sm text-muted-foreground">Add some products to get started</p>
                        <Button asChild>
                            <Link href="/products">Continue Shopping</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Cart items */}
                        <div className="space-y-3 lg:col-span-2">
                            {cartItems.map((item) => (
                                <Card key={item.product.id} className="flex gap-4 p-4">
                                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-muted/30 text-3xl">
                                        {item.product.image}
                                    </div>
                                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                                        <div>
                                            <Link
                                                href={`/product/${item.product.id}`}
                                                className="text-sm font-medium hover:text-primary"
                                            >
                                                {item.product.name}
                                            </Link>
                                            <p className="text-xs text-muted-foreground">{item.product.category}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center rounded-md border">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => updateQuantity(item.product.id, -1)}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="w-8 text-center text-sm">{item.quantity}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => updateQuantity(item.product.id, 1)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-bold text-primary">
                                                    {formatPrice(item.product.price * item.quantity)}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                    onClick={() => removeItem(item.product.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Order summary */}
                        <Card className="h-fit p-4">
                            <h2 className="mb-4 text-base font-semibold">Order Summary</h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                                </div>
                                {shipping === 0 && (
                                    <p className="text-xs text-green-600">You qualify for free shipping!</p>
                                )}
                                <Separator />
                                <div className="flex justify-between text-base font-bold">
                                    <span>Total</span>
                                    <span className="text-primary">{formatPrice(total)}</span>
                                </div>
                            </div>
                            <Button className="mt-4 w-full" size="lg" asChild>
                                <Link href="/checkout">Proceed to Checkout</Link>
                            </Button>
                            <Button variant="outline" className="mt-2 w-full" asChild>
                                <Link href="/products">Continue Shopping</Link>
                            </Button>
                        </Card>
                    </div>
                )}
            </ShopLayout>
        </>
    );
}
