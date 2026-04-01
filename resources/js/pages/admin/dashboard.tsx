import { Head, Link, usePage } from '@inertiajs/react';
import { ClipboardList, DollarSign, Package, Shield, Users, UserCheck } from 'lucide-react';

type Stats = {
    totalUsers: number;
    totalAdmins: number;
    totalManagers: number;
    totalRegularUsers: number;
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: string;
    totalProducts: number;
};

type OrderItem = {
    id: number;
    product_name: string;
    quantity: number;
};

type RecentOrder = {
    id: number;
    order_number: string;
    status: string;
    total: string;
    first_name: string;
    last_name: string;
    created_at: string;
    items: OrderItem[];
};

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    shipped: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function AdminDashboard() {
    const { stats, recentOrders } = usePage<{ stats: Stats; recentOrders: RecentOrder[] }>().props;

    const cards = [
        { title: 'Total Orders', value: stats.totalOrders, icon: ClipboardList, color: 'text-blue-600 dark:text-blue-400' },
        { title: 'Pending Orders', value: stats.pendingOrders, icon: ClipboardList, color: 'text-yellow-600 dark:text-yellow-400' },
        { title: 'Revenue', value: `$${parseFloat(stats.totalRevenue || '0').toFixed(2)}`, icon: DollarSign, color: 'text-green-600 dark:text-green-400' },
        { title: 'Products', value: stats.totalProducts, icon: Package, color: 'text-purple-600 dark:text-purple-400' },
        { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600 dark:text-blue-400' },
        { title: 'Admins', value: stats.totalAdmins, icon: Shield, color: 'text-red-600 dark:text-red-400' },
        { title: 'Managers', value: stats.totalManagers, icon: UserCheck, color: 'text-amber-600 dark:text-amber-400' },
        { title: 'Users', value: stats.totalRegularUsers, icon: Users, color: 'text-green-600 dark:text-green-400' },
    ];

    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
                    <p className="text-muted-foreground">Overview of your application.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card) => (
                        <div
                            key={card.title}
                            className="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border"
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                                <card.icon className={`h-5 w-5 ${card.color}`} />
                            </div>
                            <p className="mt-2 text-3xl font-bold">{card.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {/* Recent orders */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <h3 className="text-lg font-semibold">Recent Orders</h3>
                            <Link href="/admin/orders" className="text-sm text-primary hover:underline">View all</Link>
                        </div>
                        <div className="divide-y">
                            {recentOrders.length === 0 ? (
                                <p className="px-6 py-8 text-center text-sm text-muted-foreground">No orders yet.</p>
                            ) : (
                                recentOrders.map((order) => (
                                    <Link
                                        key={order.id}
                                        href={`/admin/orders/${order.id}`}
                                        className="flex items-center justify-between px-6 py-3 hover:bg-muted/30"
                                    >
                                        <div>
                                            <p className="text-sm font-medium">{order.order_number}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {order.first_name} {order.last_name} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-primary">${parseFloat(order.total).toFixed(2)}</p>
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${statusColors[order.status] || ''}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Quick actions */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                        <h3 className="text-lg font-semibold">Quick Actions</h3>
                        <div className="mt-4 space-y-2">
                            <Link
                                href="/admin/orders"
                                className="flex items-center gap-2 rounded-lg p-3 text-sm hover:bg-accent"
                            >
                                <ClipboardList className="h-4 w-4" />
                                Manage Orders
                            </Link>
                            <Link
                                href="/admin/orders/create"
                                className="flex items-center gap-2 rounded-lg p-3 text-sm hover:bg-accent"
                            >
                                <ClipboardList className="h-4 w-4" />
                                Create Custom Order
                            </Link>
                            <Link
                                href="/admin/products"
                                className="flex items-center gap-2 rounded-lg p-3 text-sm hover:bg-accent"
                            >
                                <Package className="h-4 w-4" />
                                Manage Products
                            </Link>
                            <Link
                                href="/admin/users"
                                className="flex items-center gap-2 rounded-lg p-3 text-sm hover:bg-accent"
                            >
                                <Users className="h-4 w-4" />
                                Manage Users
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Admin Dashboard',
            href: '/admin/dashboard',
        },
    ],
};
