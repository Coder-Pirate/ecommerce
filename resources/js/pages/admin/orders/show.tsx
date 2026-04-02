import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, FileText, Pencil } from 'lucide-react';
import { useState } from 'react';
import { useFlashToast } from '@/hooks/use-flash-toast';

type OrderItem = {
    id: number;
    product_name: string;
    variant_label: string | null;
    price: string;
    quantity: number;
    total: string;
    product: {
        id: number;
        images?: { id: number; image_path: string; sort_order: number }[];
    } | null;
};

type Order = {
    id: number;
    order_number: string;
    status: string;
    payment_method: string;
    payment_phone: string | null;
    payment_amount: string | null;
    subtotal: string;
    shipping: string;
    total: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    address: string;
    city: string;
    zip: string;
    created_at: string;
    updated_at: string;
    user: { id: number; name: string; email: string } | null;
    items: OrderItem[];
};

type Props = {
    order: Order;
    statuses: string[];
    paymentMethods: Record<string, string>;
};

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    shipped: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

function formatPrice(price: string | null): string {
    if (!price) {
        return '';
    }

    return `৳${parseFloat(price).toFixed(0)}`;
}

export default function OrderShow() {
    const { order, statuses, paymentMethods } = usePage<Props>().props;
    const [status, setStatus] = useState(order.status);
    const [saving, setSaving] = useState(false);

    useFlashToast();

    function handleStatusChange(newStatus: string) {
        setStatus(newStatus);
        setSaving(true);
        router.patch(`/admin/orders/${order.id}/status`, { status: newStatus }, {
            preserveScroll: true,
            onFinish: () => setSaving(false),
        });
    }

    return (
        <>
            <Head title={`Order ${order.order_number}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <a
                        href="/admin/orders"
                        className="inline-flex items-center rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </a>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold tracking-tight">{order.order_number}</h2>
                        <p className="text-sm text-muted-foreground">
                            Placed on {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium capitalize ${statusColors[order.status] || ''}`}>
                        {order.status}
                    </span>
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/admin/orders/${order.id}/edit`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent"
                        >
                            <Pencil className="h-4 w-4" />
                            Edit
                        </Link>
                        <a
                            href={`/admin/orders/${order.id}/invoice`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                        >
                            <FileText className="h-4 w-4" />
                            Invoice
                        </a>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Order items */}
                    <div className="lg:col-span-2">
                        <div className="overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <div className="border-b bg-muted/50 px-4 py-3">
                                <h3 className="text-sm font-semibold">Order Items</h3>
                            </div>
                            <table className="w-full text-sm">
                                <thead className="border-b bg-muted/30">
                                    <tr>
                                        <th className="px-4 py-2.5 text-left font-medium">Product</th>
                                        <th className="px-4 py-2.5 text-left font-medium">Price</th>
                                        <th className="px-4 py-2.5 text-left font-medium">Qty</th>
                                        <th className="px-4 py-2.5 text-right font-medium">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {order.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted/30">
                                                        {item.product?.images?.[0] ? (
                                                            <img src={`/${item.product.images[0].image_path}`} alt={item.product_name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <span className="text-lg">📦</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{item.product_name}</div>
                                                        {item.variant_label && (
                                                            <div className="text-xs text-muted-foreground">{item.variant_label}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">{formatPrice(item.price)}</td>
                                            <td className="px-4 py-3">{item.quantity}</td>
                                            <td className="px-4 py-3 text-right font-medium">{formatPrice(item.total)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="border-t bg-muted/20 px-4 py-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="mt-1 flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>{parseFloat(order.shipping) === 0 ? 'Free' : formatPrice(order.shipping)}</span>
                                </div>
                                <div className="mt-2 flex justify-between border-t pt-2 text-base font-bold">
                                    <span>Total</span>
                                    <span className="text-primary">{formatPrice(order.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Status */}
                        <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                            <h3 className="mb-3 text-sm font-semibold">Update Status</h3>
                            <select
                                value={status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                disabled={saving}
                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm capitalize focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                {statuses.map((s) => (
                                    <option key={s} value={s} className="capitalize">
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Customer */}
                        <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                            <h3 className="mb-3 text-sm font-semibold">Customer</h3>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Name: </span>
                                    <span className="font-medium">{order.first_name} {order.last_name}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Email: </span>
                                    <span className="font-medium">{order.email}</span>
                                </div>
                                {order.phone && (
                                    <div>
                                        <span className="text-muted-foreground">Phone: </span>
                                        <span className="font-medium">{order.phone}</span>
                                    </div>
                                )}
                                {order.user && (
                                    <div>
                                        <span className="text-muted-foreground">Account: </span>
                                        <span className="font-medium">{order.user.name}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Shipping address */}
                        <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                            <h3 className="mb-3 text-sm font-semibold">Shipping Address</h3>
                            <div className="text-sm leading-relaxed text-muted-foreground">
                                <p>{order.address}</p>
                                <p>{order.city}, {order.zip}</p>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                            <h3 className="mb-3 text-sm font-semibold">Payment Method</h3>
                            <p className="text-sm font-medium">{paymentMethods[order.payment_method] || order.payment_method}</p>
                            {order.payment_phone && (
                                <div className="mt-2 text-sm">
                                    <span className="text-muted-foreground">Number: </span>
                                    <span className="font-medium">{order.payment_phone}</span>
                                </div>
                            )}
                            {order.payment_amount && (
                                <div className="mt-1 text-sm">
                                    <span className="text-muted-foreground">Amount: </span>
                                    <span className="font-medium">{formatPrice(order.payment_amount)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

OrderShow.layout = {
    breadcrumbs: [
        { title: 'Admin Dashboard', href: '/admin/dashboard' },
        { title: 'Orders', href: '/admin/orders' },
        { title: 'Order Details', href: '#' },
    ],
};
