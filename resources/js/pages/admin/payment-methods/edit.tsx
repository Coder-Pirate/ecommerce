import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

type PaymentMethod = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    account_number: string | null;
    requires_payment_details: boolean;
    is_active: boolean;
    sort_order: number;
};

type Props = {
    paymentMethod: PaymentMethod;
};

export default function EditPaymentMethod() {
    const { paymentMethod } = usePage<Props>().props;
    const { data, setData, put, processing, errors } = useForm({
        name: paymentMethod.name,
        slug: paymentMethod.slug,
        description: paymentMethod.description || '',
        account_number: paymentMethod.account_number || '',
        requires_payment_details: paymentMethod.requires_payment_details,
        is_active: paymentMethod.is_active,
        sort_order: paymentMethod.sort_order,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/admin/payment-methods/${paymentMethod.id}`);
    }

    return (
        <>
            <Head title={`Edit ${paymentMethod.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/payment-methods"
                        className="inline-flex items-center rounded-md p-1.5 hover:bg-accent"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Edit Payment Method</h2>
                        <p className="text-muted-foreground">Update details for {paymentMethod.name}.</p>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="max-w-lg space-y-6 rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border"
                >
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="slug" className="text-sm font-medium">
                            Slug
                        </label>
                        <input
                            id="slug"
                            type="text"
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium">
                            Description <span className="text-muted-foreground">(optional)</span>
                        </label>
                        <input
                            id="description"
                            type="text"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="account_number" className="text-sm font-medium">
                            Account Number <span className="text-muted-foreground">(optional)</span>
                        </label>
                        <input
                            id="account_number"
                            type="text"
                            value={data.account_number}
                            onChange={(e) => setData('account_number', e.target.value)}
                            placeholder="e.g. 01XXXXXXXXX"
                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        <p className="text-xs text-muted-foreground">Your receiving account number shown to customers.</p>
                        {errors.account_number && <p className="text-sm text-destructive">{errors.account_number}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="sort_order" className="text-sm font-medium">
                            Sort Order
                        </label>
                        <input
                            id="sort_order"
                            type="number"
                            min={0}
                            value={data.sort_order}
                            onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        {errors.sort_order && <p className="text-sm text-destructive">{errors.sort_order}</p>}
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            id="requires_payment_details"
                            type="checkbox"
                            checked={data.requires_payment_details}
                            onChange={(e) => setData('requires_payment_details', e.target.checked)}
                            className="h-4 w-4 rounded border-input"
                        />
                        <label htmlFor="requires_payment_details" className="text-sm font-medium">
                            Require Payment Details
                        </label>
                        <span className="text-xs text-muted-foreground">(Show payment number & amount fields on checkout)</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            id="is_active"
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                            className="h-4 w-4 rounded border-input"
                        />
                        <label htmlFor="is_active" className="text-sm font-medium">
                            Active
                        </label>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Update Payment Method'}
                        </button>
                        <Link
                            href="/admin/payment-methods"
                            className="rounded-lg border border-input px-4 py-2 text-sm font-medium hover:bg-accent"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}

EditPaymentMethod.layout = {
    breadcrumbs: [
        { title: 'Admin Dashboard', href: '/admin/dashboard' },
        { title: 'Payment Methods', href: '/admin/payment-methods' },
        { title: 'Edit', href: '#' },
    ],
};
