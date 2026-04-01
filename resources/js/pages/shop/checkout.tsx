import { Head, Link } from '@inertiajs/react';
import { Lock, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { ShopLayout } from '@/components/ecommerce/shop-layout';
import { products, formatPrice } from '@/components/ecommerce/product-data';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

// Demo order items
const orderItems = [
    { product: products[0], quantity: 1 },
    { product: products[1], quantity: 2 },
    { product: products[5], quantity: 1 },
];

export default function CheckoutPage() {
    const [step, setStep] = useState<'form' | 'success'>('form');

    const subtotal = orderItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shipping = subtotal > 50 ? 0 : 5.99;
    const total = subtotal + shipping;

    if (step === 'success') {
        return (
            <>
                <Head title="Order Confirmed" />
                <ShopLayout>
                    <div className="mx-auto max-w-md py-16 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                            <ShieldCheck className="h-8 w-8" />
                        </div>
                        <h1 className="mb-2 text-2xl font-bold">Order Confirmed!</h1>
                        <p className="mb-1 text-muted-foreground">Thank you for your purchase.</p>
                        <p className="mb-6 text-sm text-muted-foreground">Order #ORD-{Math.floor(Math.random() * 90000) + 10000}</p>
                        <div className="flex justify-center gap-3">
                            <Button asChild>
                                <Link href="/">Continue Shopping</Link>
                            </Button>
                        </div>
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

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Form */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Shipping info */}
                        <Card className="p-4">
                            <h2 className="mb-4 text-base font-semibold">Shipping Information</h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" placeholder="John" className="mt-1" />
                                </div>
                                <div>
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" placeholder="Doe" className="mt-1" />
                                </div>
                                <div className="sm:col-span-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="john@example.com" className="mt-1" />
                                </div>
                                <div className="sm:col-span-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="address" placeholder="123 Main Street" className="mt-1" />
                                </div>
                                <div>
                                    <Label htmlFor="city">City</Label>
                                    <Input id="city" placeholder="New York" className="mt-1" />
                                </div>
                                <div>
                                    <Label htmlFor="zip">ZIP Code</Label>
                                    <Input id="zip" placeholder="10001" className="mt-1" />
                                </div>
                                <div className="sm:col-span-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="mt-1" />
                                </div>
                            </div>
                        </Card>

                        {/* Payment */}
                        <Card className="p-4">
                            <h2 className="mb-4 text-base font-semibold">Payment Details</h2>
                            <div className="grid gap-4">
                                <div>
                                    <Label htmlFor="cardName">Name on Card</Label>
                                    <Input id="cardName" placeholder="John Doe" className="mt-1" />
                                </div>
                                <div>
                                    <Label htmlFor="cardNumber">Card Number</Label>
                                    <Input id="cardNumber" placeholder="4242 4242 4242 4242" className="mt-1" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="expiry">Expiry Date</Label>
                                        <Input id="expiry" placeholder="MM/YY" className="mt-1" />
                                    </div>
                                    <div>
                                        <Label htmlFor="cvv">CVV</Label>
                                        <Input id="cvv" placeholder="123" className="mt-1" />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                                <Lock className="h-3 w-3" />
                                <span>Your payment info is encrypted and secure</span>
                            </div>
                        </Card>
                    </div>

                    {/* Order summary */}
                    <Card className="h-fit p-4">
                        <h2 className="mb-4 text-base font-semibold">Order Summary</h2>
                        <div className="space-y-3">
                            {orderItems.map((item) => (
                                <div key={item.product.id} className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted/30 text-lg">
                                        {item.product.image}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-medium">{item.product.name}</p>
                                        <p className="text-[10px] text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                    <span className="text-xs font-medium">{formatPrice(item.product.price * item.quantity)}</span>
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

                        <Button className="mt-4 w-full" size="lg" onClick={() => setStep('success')}>
                            <Lock className="mr-2 h-4 w-4" />
                            Place Order — {formatPrice(total)}
                        </Button>
                    </Card>
                </div>
            </ShopLayout>
        </>
    );
}
