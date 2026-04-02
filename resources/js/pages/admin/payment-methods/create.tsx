import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function CreatePaymentMethod() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        description: '',
        account_number: '',
        requires_payment_details: true,
        is_active: true,
        sort_order: 0,
    });

    function handleNameChange(value: string) {
        setData((prev) => ({
            ...prev,
            name: value,
            slug: value
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim(),
        }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/payment-methods');
    }

    return (
        <>
            <Head title="Create Payment Method" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/payment-methods"
                        className="inline-flex items-center rounded-md p-1.5 hover:bg-accent"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Create Payment Method</h2>
                        <p className="text-muted-foreground">Add a new payment option for checkout.</p>
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
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="e.g. Cash on Delivery"
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
                            placeholder="e.g. cod"
                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        <p className="text-xs text-muted-foreground">Auto-generated from name. Used internally.</p>
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
                            placeholder="e.g. Pay when you receive"
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
                            {processing ? 'Creating...' : 'Create Payment Method'}
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

CreatePaymentMethod.layout = {
    breadcrumbs: [
        { title: 'Admin Dashboard', href: '/admin/dashboard' },
        { title: 'Payment Methods', href: '/admin/payment-methods' },
        { title: 'Create', href: '/admin/payment-methods/create' },
    ],
};
