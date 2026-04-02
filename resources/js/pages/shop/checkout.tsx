import { Head, Link, useForm, router } from '@inertiajs/react';
import { Lock, ShoppingBag } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ShopLayout } from '@/components/ecommerce/shop-layout';
import { useCart, clearCart } from '@/stores/use-cart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

function formatPrice(amount: number): string {
    return `৳${amount.toFixed(0)}`;
}

export default function CheckoutPage() {
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

    if (!deliveryZone && allZones.length > 0) {
        setDeliveryZone(allZones[0]);
    }

    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zip: '',
        delivery_zone: '',
        items: [] as { product_id: number; variant_id: number | null; quantity: number }[],
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        data.items = items.map((i) => ({
            product_id: i.productId,
            variant_id: i.variantId,
            quantity: i.quantity,
        }));
        data.delivery_zone = deliveryZone;
        post('/checkout', {
            onSuccess: () => clearCart(),
        });
    }

    if (items.length === 0) {
        return (
            <>
                <Head title="Checkout" />
                <ShopLayout>
                    <div className="py-16 text-center">
                        <ShoppingBag className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                        <p className="mb-1 text-lg font-medium">Your cart is empty</p>
                        <p className="mb-4 text-sm text-muted-foreground">Add some products before checking out</p>
                        <Button asChild>
                            <Link href="/products">Continue Shopping</Link>
                        </Button>
                    </div>
                </ShopLayout>
            </>
        );
    }

    return (
        <>
            <Head title="Checkout" />
            <ShopLayout>
                {/* Breadcrumb */}
                <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-foreground">Home</Link>
                    <span>/</span>
                    <Link href="/cart" className="hover:text-foreground">Cart</Link>
                    <span>/</span>
                    <span className="text-foreground">Checkout</span>
                </div>

                <h1 className="mb-6 text-xl font-bold md:text-2xl">Checkout</h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Form */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Delivery Zone */}
                            {allZones.length > 0 && (
                                <Card className="p-4">
                                    <h2 className="mb-3 text-base font-semibold">Delivery Area</h2>
                                    <div className="flex flex-wrap gap-3">
                                        {allZones.map((zone) => (
                                            <button
                                                key={zone}
                                                type="button"
                                                onClick={() => setDeliveryZone(zone)}
                                                className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${deliveryZone === zone ? 'border-primary bg-primary/10 text-primary' : 'border-input hover:border-primary/50'}`}
                                            >
                                                {zone}
                                            </button>
                                        ))}
                                    </div>
                                </Card>
                            )}

                            {/* Shipping info */}
                            <Card className="p-4">
                                <h2 className="mb-4 text-base font-semibold">Shipping Information</h2>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            placeholder="John"
                                            className="mt-1"
                                        />
                                        {errors.first_name && <p className="mt-1 text-xs text-destructive">{errors.first_name}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            placeholder="Doe"
                                            className="mt-1"
                                        />
                                        {errors.last_name && <p className="mt-1 text-xs text-destructive">{errors.last_name}</p>}
                                    </div>
                                    <div className="sm:col-span-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="john@example.com"
                                            className="mt-1"
                                        />
                                        {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                                    </div>
                                    <div className="sm:col-span-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Input
                                            id="address"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            placeholder="123 Main Street"
                                            className="mt-1"
                                        />
                                        {errors.address && <p className="mt-1 text-xs text-destructive">{errors.address}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="city">City</Label>
                                        <Input
                                            id="city"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            placeholder="New York"
                                            className="mt-1"
                                        />
                                        {errors.city && <p className="mt-1 text-xs text-destructive">{errors.city}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="zip">ZIP Code</Label>
                                        <Input
                                            id="zip"
                                            value={data.zip}
                                            onChange={(e) => setData('zip', e.target.value)}
                                            placeholder="10001"
                                            className="mt-1"
                                        />
                                        {errors.zip && <p className="mt-1 text-xs text-destructive">{errors.zip}</p>}
                                    </div>
                                    <div className="sm:col-span-2">
                                        <Label htmlFor="phone">Phone (optional)</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="+1 (555) 000-0000"
                                            className="mt-1"
                                        />
                                        {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Order summary */}
                        <Card className="h-fit p-4">
                            <h2 className="mb-4 text-base font-semibold">Order Summary</h2>
                            <div className="space-y-3">
                                {items.map((item) => (
                                    <div key={`${item.productId}-${item.variantId}`} className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted/30">
                                            {item.image ? (
                                                <img src={`/${item.image}`} alt={item.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-lg">📦</span>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-xs font-medium">{item.name}</p>
                                            <p className="text-[10px] text-muted-foreground">
                                                Qty: {item.quantity}
                                                {item.variantLabel && ` · ${item.variantLabel}`}
                                            </p>
                                        </div>
                                        <span className="text-xs font-medium">{formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>

                            <Separator className="my-4" />

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
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

                            <Button type="submit" className="mt-4 w-full" size="lg" disabled={processing}>
                                <Lock className="mr-2 h-4 w-4" />
                                {processing ? 'Placing Order...' : `Place Order — ${formatPrice(total)}`}
                            </Button>
                        </Card>
                    </div>
                </form>
            </ShopLayout>
        </>
    );
}
