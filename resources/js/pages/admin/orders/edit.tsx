import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

type Variant = {
    id: number;
    size: string | null;
    color: string | null;
    price: string;
    in_stock: boolean;
};

type ProductImage = {
    id: number;
    image_path: string;
};

type Product = {
    id: number;
    name: string;
    price: string;
    in_stock: boolean;
    variants: Variant[];
    images: ProductImage[];
};

type OrderItem = {
    id: number;
    product_id: number;
    product_variant_id: number | null;
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
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    address: string;
    city: string;
    zip: string;
    items: OrderItem[];
};

type OrderItemRow = {
    product_id: string;
    variant_id: string;
    quantity: string;
};

type Props = {
    order: Order;
    products: Product[];
    statuses: string[];
};

function formatPrice(price: string | null): string {
    if (!price) {
        return '';
    }

    return `$${parseFloat(price).toFixed(2)}`;
}

export default function EditOrder({ order, products, statuses }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        first_name: order.first_name,
        last_name: order.last_name,
        email: order.email,
        phone: order.phone || '',
        address: order.address,
        city: order.city,
        zip: order.zip,
        status: order.status,
        items: order.items.map((item) => ({
            product_id: String(item.product_id),
            variant_id: item.product_variant_id ? String(item.product_variant_id) : '',
            quantity: String(item.quantity),
        })) as OrderItemRow[],
    });

    function addItem() {
        setData('items', [...data.items, { product_id: '', variant_id: '', quantity: '1' }]);
    }

    function updateItem(index: number, field: keyof OrderItemRow, value: string) {
        const updated = [...data.items];

        updated[index] = { ...updated[index], [field]: value };

        if (field === 'product_id') {
            updated[index].variant_id = '';
        }

        setData('items', updated);
    }

    function removeItem(index: number) {
        if (data.items.length <= 1) {
            return;
        }

        setData('items', data.items.filter((_, i) => i !== index));
    }

    function getProduct(productId: string): Product | undefined {
        return products.find((p) => p.id === Number(productId));
    }

    const getItemPrice = (item: OrderItemRow): number => {
        const product = getProduct(item.product_id);

        if (!product) {
            return 0;
        }

        if (item.variant_id) {
            const variant = product.variants.find((v) => v.id === Number(item.variant_id));

            if (variant) {
                return parseFloat(variant.price);
            }
        }

        return parseFloat(product.price);
    };

    const subtotal = data.items.reduce((sum, item) => {
        return sum + getItemPrice(item) * (parseInt(item.quantity) || 0);
    }, 0);

    const shipping = subtotal > 50 ? 0 : 5.99;
    const total = subtotal + shipping;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/admin/orders/${order.id}`);
    }

    return (
        <>
            <Head title={`Edit ${order.order_number}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <a
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </a>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Edit {order.order_number}</h2>
                        <p className="text-muted-foreground">Update order details and items.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            {/* Customer info */}
                            <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                                <h3 className="mb-4 text-sm font-semibold">Customer Information</h3>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium">First Name</label>
                                        <input
                                            type="text"
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                        {errors.first_name && <p className="mt-1 text-xs text-destructive">{errors.first_name}</p>}
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium">Last Name</label>
                                        <input
                                            type="text"
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                        {errors.last_name && <p className="mt-1 text-xs text-destructive">{errors.last_name}</p>}
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium">Email</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                        {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium">Phone</label>
                                        <input
                                            type="text"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="mb-1.5 block text-sm font-medium">Address</label>
                                        <input
                                            type="text"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                        {errors.address && <p className="mt-1 text-xs text-destructive">{errors.address}</p>}
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium">City</label>
                                        <input
                                            type="text"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                        {errors.city && <p className="mt-1 text-xs text-destructive">{errors.city}</p>}
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium">ZIP Code</label>
                                        <input
                                            type="text"
                                            value={data.zip}
                                            onChange={(e) => setData('zip', e.target.value)}
                                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        />
                                        {errors.zip && <p className="mt-1 text-xs text-destructive">{errors.zip}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Order items */}
                            <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold">Order Items</h3>
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                                    >
                                        <Plus className="h-3 w-3" />
                                        Add Item
                                    </button>
                                </div>
                                {errors.items && <p className="mb-3 text-xs text-destructive">{errors.items}</p>}
                                <div className="space-y-4">
                                    {data.items.map((item, index) => {
                                        const product = getProduct(item.product_id);
                                        const variants = product?.variants || [];
                                        const unitPrice = getItemPrice(item);
                                        const lineTotal = unitPrice * (parseInt(item.quantity) || 0);

                                        return (
                                            <div key={index} className="flex flex-wrap items-start gap-3 rounded-lg border border-input p-3">
                                                <div className="min-w-50 flex-1">
                                                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Product</label>
                                                    <select
                                                        value={item.product_id}
                                                        onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                                                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                                    >
                                                        <option value="">Select product...</option>
                                                        {products.map((p) => (
                                                            <option key={p.id} value={String(p.id)}>
                                                                {p.name} — {formatPrice(p.price)}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors[`items.${index}.product_id` as keyof typeof errors] && (
                                                        <p className="mt-1 text-xs text-destructive">
                                                            {errors[`items.${index}.product_id` as keyof typeof errors]}
                                                        </p>
                                                    )}
                                                </div>

                                                {variants.length > 0 && (
                                                    <div className="min-w-40">
                                                        <label className="mb-1 block text-xs font-medium text-muted-foreground">Variant</label>
                                                        <select
                                                            value={item.variant_id}
                                                            onChange={(e) => updateItem(index, 'variant_id', e.target.value)}
                                                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                                        >
                                                            <option value="">Default</option>
                                                            {variants.map((v) => (
                                                                <option key={v.id} value={String(v.id)}>
                                                                    {[v.size, v.color].filter(Boolean).join(' / ')} — {formatPrice(v.price)}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}

                                                <div className="w-20">
                                                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Qty</label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                                    />
                                                </div>

                                                <div className="flex items-end gap-2 pt-5">
                                                    <span className="text-sm font-medium text-primary">
                                                        {lineTotal > 0 ? `$${lineTotal.toFixed(2)}` : '—'}
                                                    </span>
                                                    {data.items.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeItem(index)}
                                                            className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Summary sidebar */}
                        <div className="space-y-4">
                            <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                                <h3 className="mb-3 text-sm font-semibold">Order Status</h3>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm capitalize focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                    {statuses.map((s) => (
                                        <option key={s} value={s} className="capitalize">
                                            {s}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                                <h3 className="mb-3 text-sm font-semibold">Order Summary</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Shipping</span>
                                        <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-2 text-base font-bold">
                                        <span>Total</span>
                                        <span className="text-primary">${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Update Order'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

EditOrder.layout = {
    breadcrumbs: [
        { title: 'Admin Dashboard', href: '/admin/dashboard' },
        { title: 'Orders', href: '/admin/orders' },
        { title: 'Edit Order', href: '#' },
    ],
};
