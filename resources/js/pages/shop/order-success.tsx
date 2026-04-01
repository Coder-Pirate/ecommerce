import { Head, Link, usePage } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import { ShopLayout } from '@/components/ecommerce/shop-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type OrderItem = {
    id: number;
    product_name: string;
    variant_label: string | null;
    price: string;
    quantity: number;
    total: string;
};

type Order = {
    id: number;
    order_number: string;
    status: string;
    subtotal: string;
    shipping: string;
    total: string;
    first_name: string;
    last_name: string;
    email: string;
    items: OrderItem[];
};

function formatPrice(amount: string): string {
    return `$${parseFloat(amount).toFixed(2)}`;
}

export default function OrderSuccess() {
    const { order } = usePage<{ order: Order }>().props;

    return (
        <>
            <Head title="Order Confirmed" />
            <ShopLayout>
                <div className="mx-auto max-w-lg py-10 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <ShieldCheck className="h-8 w-8" />
                    </div>
                    <h1 className="mb-2 text-2xl font-bold">Order Confirmed!</h1>
                    <p className="mb-1 text-muted-foreground">
                        Thank you, {order.first_name}! Your order has been placed.
                    </p>
                    <p className="mb-6 text-sm text-muted-foreground">
                        Order #{order.order_number}
                    </p>

                    <Card className="mb-6 p-4 text-left">
                        <h2 className="mb-3 text-sm font-semibold">Order Items</h2>
                        <div className="space-y-2">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between text-sm">
                                    <div>
                                        <span className="font-medium">{item.product_name}</span>
                                        {item.variant_label && (
                                            <span className="text-xs text-muted-foreground"> ({item.variant_label})</span>
                                        )}
                                        <span className="text-xs text-muted-foreground"> × {item.quantity}</span>
                                    </div>
                                    <span>{formatPrice(item.total)}</span>
                                </div>
                            ))}
                        </div>
                        <Separator className="my-3" />
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatPrice(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span>{parseFloat(order.shipping) === 0 ? 'Free' : formatPrice(order.shipping)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold">
                                <span>Total</span>
                                <span className="text-primary">{formatPrice(order.total)}</span>
                            </div>
                        </div>
                    </Card>

                    <p className="mb-6 text-xs text-muted-foreground">
                        A confirmation will be sent to {order.email}
                    </p>

                    <Button asChild>
                        <Link href="/">Continue Shopping</Link>
                    </Button>
                </div>
            </ShopLayout>
        </>
    );
}
