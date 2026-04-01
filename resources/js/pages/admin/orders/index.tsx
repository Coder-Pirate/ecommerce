import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, Plus, Search, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useFlashToast } from '@/hooks/use-flash-toast';

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
    created_at: string;
    items: OrderItem[];
};

type PaginatedOrders = {
    data: Order[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    per_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

type Props = {
    orders: PaginatedOrders;
    filters: { search?: string; status?: string; perPage?: string };
    statuses: string[];
};

const perPageOptions = [10, 15, 25, 50, 100];

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

    return `$${parseFloat(price).toFixed(2)}`;
}

export default function OrdersIndex() {
    const { orders, filters, statuses } = usePage<Props>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [perPage, setPerPage] = useState(filters.perPage || '10');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isFirstRender = useRef(true);
    const [deleteOrderId, setDeleteOrderId] = useState<number | null>(null);

    useFlashToast();

    const fetchOrders = useCallback(
        (params: Record<string, string>) => {
            router.get('/admin/orders', params, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        },
        [],
    );

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;

            return;
        }

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            fetchOrders({ search, status, perPage });
        }, 300);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [search, status, perPage, fetchOrders]);

    function confirmDelete() {
        if (deleteOrderId !== null) {
            router.delete(`/admin/orders/${deleteOrderId}`, {
                onFinish: () => setDeleteOrderId(null),
            });
        }
    }

    return (
        <>
            <Head title="Manage Orders" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
                        <p className="text-muted-foreground">Manage customer orders.</p>
                    </div>
                    <Link
                        href="/admin/orders/create"
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        <Plus className="h-4 w-4" />
                        Create Order
                    </Link>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative min-w-50 flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by order #, name, email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="rounded-lg border border-input bg-background px-3 py-2 text-sm capitalize focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        <option value="">All Statuses</option>
                        {statuses.map((s) => (
                            <option key={s} value={s} className="capitalize">
                                {s}
                            </option>
                        ))}
                    </select>
                    <select
                        value={perPage}
                        onChange={(e) => setPerPage(e.target.value)}
                        className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        {perPageOptions.map((n) => (
                            <option key={n} value={String(n)}>
                                {n} per page
                            </option>
                        ))}
                    </select>
                </div>

                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Order #</th>
                                <th className="px-4 py-3 text-left font-medium">Customer</th>
                                <th className="px-4 py-3 text-left font-medium">Items</th>
                                <th className="px-4 py-3 text-left font-medium">Total</th>
                                <th className="px-4 py-3 text-left font-medium">Status</th>
                                <th className="px-4 py-3 text-left font-medium">Date</th>
                                <th className="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {orders.data.map((order) => (
                                <tr key={order.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3 font-medium">{order.order_number}</td>
                                    <td className="px-4 py-3">
                                        <div>{order.first_name} {order.last_name}</div>
                                        <div className="text-xs text-muted-foreground">{order.email}</div>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-primary">{formatPrice(order.total)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColors[order.status] || ''}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="inline-flex items-center rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => setDeleteOrderId(order.id)}
                                                className="inline-flex items-center rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {orders.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                        {orders.from && orders.to
                            ? `Showing ${orders.from} to ${orders.to} of ${orders.total} results`
                            : `${orders.total} results`}
                    </p>

                    {orders.last_page > 1 && (
                        <div className="flex gap-1">
                            {orders.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`rounded-md px-3 py-1.5 text-sm ${
                                        link.active
                                            ? 'bg-primary text-primary-foreground'
                                            : link.url
                                              ? 'hover:bg-accent'
                                              : 'cursor-not-allowed opacity-50'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    preserveState
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <AlertDialog open={deleteOrderId !== null} onOpenChange={(open) => !open && setDeleteOrderId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Order</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this order? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

OrdersIndex.layout = {
    breadcrumbs: [
        { title: 'Admin Dashboard', href: '/admin/dashboard' },
        { title: 'Orders', href: '/admin/orders' },
    ],
};
