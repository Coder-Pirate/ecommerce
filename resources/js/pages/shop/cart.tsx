import { Head, Link } from '@inertiajs/react';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ShopLayout } from '@/components/ecommerce/shop-layout';
import { useCart, updateCartQuantity, removeFromCart } from '@/stores/use-cart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

function formatPrice(amount: number): string {
    return `৳${amount.toFixed(0)}`;
}

export default function CartPage() {
    const [deliveryZone, setDeliveryZone] = useState('');
    const { items, totalItems, subtotal, shipping } = useCart(deliveryZone);
    const total = subtotal + shipping;

    const allZones = useMemo(() => {
        const zoneSet = new Set<string>();
        items.forEach((item) => {
            if (!item.freeShipping && item.shippingZones) {
                item.shippingZones.forEach((z) => zoneSet.add(z.zone));
            }
        });
        return [...zoneSet];
    }, [items]);

    // Auto-select first zone if none selected
    if (!deliveryZone && allZones.length > 0) {
        setDeliveryZone(allZones[0]);
    }

    return (
        <>
            <Head title="Shopping Cart" />
            <ShopLayout>
                <h1 className="mb-6 text-xl font-bold md:text-2xl">Shopping Cart</h1>

                {items.length === 0 ? (
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
                            {items.map((item) => (
                                <Card key={`${item.productId}-${item.variantId}`} className="flex gap-4 p-4">
                                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted/30">
                                        {item.image ? (
                                            <img src={`/${item.image}`} alt={item.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="text-3xl">📦</span>
                                        )}
                                    </div>
                                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                                        <div>
                                            <Link
                                                href={`/product/${item.productId}`}
                                                className="text-sm font-medium hover:text-primary"
                                            >
                                                {item.name}
                                            </Link>
                                            {item.variantLabel && (
                                                <p className="text-xs text-muted-foreground">{item.variantLabel}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center rounded-md border">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => updateCartQuantity(item.productId, item.variantId, item.quantity - 1)}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="w-8 text-center text-sm">{item.quantity}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => updateCartQuantity(item.productId, item.variantId, item.quantity + 1)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-bold text-primary">
                                                    {formatPrice(item.price * item.quantity)}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                    onClick={() => removeFromCart(item.productId, item.variantId)}
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

                            {/* Delivery Zone */}
                            {allZones.length > 0 && (
                                <div className="mb-4">
                                    <p className="mb-2 text-sm font-medium">Delivery Area</p>
                                    <div className="flex flex-wrap gap-2">
                                        {allZones.map((zone) => (
                                            <button
                                                key={zone}
                                                type="button"
                                                onClick={() => setDeliveryZone(zone)}
                                                className={`rounded-md border px-3 py-2 text-xs font-medium transition-colors ${deliveryZone === zone ? 'border-primary bg-primary text-primary-foreground' : 'border-input hover:border-primary/50'}`}
                                            >
                                                {zone}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                                </div>
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
