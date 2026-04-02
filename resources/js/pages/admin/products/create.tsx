import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Plus, Trash2, Upload, X } from 'lucide-react';
import { useMemo, useState } from 'react';

type Category = { id: number; name: string };
type SubCategory = { id: number; category_id: number; name: string };
type VariantRow = { size: string; color: string; price: string; original_price: string; in_stock: boolean };

type Props = {
    categories: Category[];
    subCategories: SubCategory[];
};

export default function CreateProduct({ categories, subCategories }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        category_id: '',
        sub_category_id: '',
        name: '',
        description: '',
        price: '',
        original_price: '',
        images: [] as File[],
        in_stock: true,
        free_shipping: false,
        shipping_zones: [] as { zone: string; charge: string }[],
        variants: [] as VariantRow[],
    });

    const [previews, setPreviews] = useState<string[]>([]);

    const filteredSubCategories = useMemo(
        () => (data.category_id ? subCategories.filter((sc) => sc.category_id === Number(data.category_id)) : []),
        [data.category_id, subCategories],
    );

    function addVariant() {
        setData('variants', [...data.variants, { size: '', color: '', price: '', original_price: '', in_stock: true }]);
    }

    function updateVariant(index: number, field: keyof VariantRow, value: string | boolean) {
        const updated = [...data.variants];
        updated[index] = { ...updated[index], [field]: value };
        setData('variants', updated);
    }

    function removeVariant(index: number) {
        setData('variants', data.variants.filter((_, i) => i !== index));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/products', {
            forceFormData: true,
        });
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);
        const newFiles = [...data.images, ...files].slice(0, 10);
        setData('images', newFiles);

        const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
        setPreviews((prev) => {
            prev.forEach((url) => URL.revokeObjectURL(url));
            return newPreviews;
        });
    }

    function removeImage(index: number) {
        const newFiles = data.images.filter((_, i) => i !== index);
        setData('images', newFiles);
        setPreviews((prev) => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    }

    return (
        <>
            <Head title="Create Product" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products" className="inline-flex items-center rounded-md p-1.5 hover:bg-accent">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Create Product</h2>
                        <p className="text-muted-foreground">Add a new product to your catalog.</p>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="max-w-2xl space-y-6 rounded-xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border"
                >
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2 sm:col-span-2">
                            <label htmlFor="name" className="text-sm font-medium">
                                Product Name
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
                            <label htmlFor="category_id" className="text-sm font-medium">
                                Category
                            </label>
                            <select
                                id="category_id"
                                value={data.category_id}
                                onChange={(e) => {
                                    setData('category_id', e.target.value);
                                    setData('sub_category_id', '');
                                }}
                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                <option value="">Select category...</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={String(cat.id)}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category_id && <p className="text-sm text-destructive">{errors.category_id}</p>}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="sub_category_id" className="text-sm font-medium">
                                Sub Category
                            </label>
                            <select
                                id="sub_category_id"
                                value={data.sub_category_id}
                                onChange={(e) => setData('sub_category_id', e.target.value)}
                                disabled={!data.category_id}
                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                            >
                                <option value="">None</option>
                                {filteredSubCategories.map((sc) => (
                                    <option key={sc.id} value={String(sc.id)}>
                                        {sc.name}
                                    </option>
                                ))}
                            </select>
                            {errors.sub_category_id && <p className="text-sm text-destructive">{errors.sub_category_id}</p>}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="price" className="text-sm font-medium">
                                Price ($)
                            </label>
                            <input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                            {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="original_price" className="text-sm font-medium">
                                Original Price ($)
                            </label>
                            <input
                                id="original_price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.original_price}
                                onChange={(e) => setData('original_price', e.target.value)}
                                placeholder="Leave empty if no discount"
                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                            {errors.original_price && <p className="text-sm text-destructive">{errors.original_price}</p>}
                        </div>

                        <div className="space-y-2 sm:col-span-2">
                            <label className="text-sm font-medium">Product Images (max 10)</label>
                            <div className="flex flex-wrap gap-3">
                                {previews.map((src, i) => (
                                    <div key={i} className="relative h-24 w-24 overflow-hidden rounded-lg border">
                                        <img src={src} alt="" className="h-full w-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(i)}
                                            className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                                {data.images.length < 10 && (
                                    <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-input hover:border-primary/50 hover:bg-muted/30">
                                        <Upload className="mb-1 h-5 w-5 text-muted-foreground" />
                                        <span className="text-[10px] text-muted-foreground">Upload</span>
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                                            multiple
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                            {errors.images && <p className="text-sm text-destructive">{errors.images}</p>}
                        </div>

                        <div className="space-y-2 sm:col-span-2">
                            <label htmlFor="description" className="text-sm font-medium">
                                Description
                            </label>
                            <textarea
                                id="description"
                                rows={4}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                        </div>

                        <div className="flex items-center gap-2 sm:col-span-2">
                            <input
                                id="in_stock"
                                type="checkbox"
                                checked={data.in_stock}
                                onChange={(e) => setData('in_stock', e.target.checked)}
                                className="h-4 w-4 rounded border-input"
                            />
                            <label htmlFor="in_stock" className="text-sm font-medium">
                                In Stock
                            </label>
                        </div>

                        <div className="flex items-center gap-2 sm:col-span-2">
                            <input
                                id="free_shipping"
                                type="checkbox"
                                checked={data.free_shipping}
                                onChange={(e) => setData('free_shipping', e.target.checked)}
                                className="h-4 w-4 rounded border-input"
                            />
                            <label htmlFor="free_shipping" className="text-sm font-medium">
                                Free Shipping
                            </label>
                        </div>

                        {!data.free_shipping && (
                            <div className="space-y-3 sm:col-span-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">Shipping Zones</label>
                                    <button
                                        type="button"
                                        onClick={() => setData('shipping_zones', [...data.shipping_zones, { zone: '', charge: '' }])}
                                        className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/20"
                                    >
                                        <Plus className="h-3 w-3" /> Add Zone
                                    </button>
                                </div>
                                {data.shipping_zones.length === 0 && (
                                    <p className="text-xs text-muted-foreground">No shipping zones added. Click "Add Zone" to add delivery areas.</p>
                                )}
                                {data.shipping_zones.map((sz, i) => (
                                    <div key={i} className="flex items-end gap-2 rounded-lg border border-input p-3">
                                        <div className="flex-1 space-y-1">
                                            <label className="text-[11px] text-muted-foreground">Zone Name</label>
                                            <input
                                                type="text"
                                                value={sz.zone}
                                                onChange={(e) => {
                                                    const updated = [...data.shipping_zones];
                                                    updated[i] = { ...updated[i], zone: e.target.value };
                                                    setData('shipping_zones', updated);
                                                }}
                                                placeholder="e.g. Inside Dhaka"
                                                className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                                            />
                                            {errors[`shipping_zones.${i}.zone` as keyof typeof errors] && (
                                                <p className="text-[10px] text-destructive">{errors[`shipping_zones.${i}.zone` as keyof typeof errors]}</p>
                                            )}
                                        </div>
                                        <div className="w-32 space-y-1">
                                            <label className="text-[11px] text-muted-foreground">Charge (৳)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={sz.charge}
                                                onChange={(e) => {
                                                    const updated = [...data.shipping_zones];
                                                    updated[i] = { ...updated[i], charge: e.target.value };
                                                    setData('shipping_zones', updated);
                                                }}
                                                placeholder="e.g. 50"
                                                className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                                            />
                                            {errors[`shipping_zones.${i}.charge` as keyof typeof errors] && (
                                                <p className="text-[10px] text-destructive">{errors[`shipping_zones.${i}.charge` as keyof typeof errors]}</p>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setData('shipping_zones', data.shipping_zones.filter((_, idx) => idx !== i))}
                                            className="mb-0.5 rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                {errors.shipping_zones && <p className="text-sm text-destructive">{errors.shipping_zones}</p>}
                            </div>
                        )}
                    </div>

                    {/* Variants */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Product Variants</label>
                            <button
                                type="button"
                                onClick={addVariant}
                                className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/20"
                            >
                                <Plus className="h-3 w-3" /> Add Variant
                            </button>
                        </div>
                        {data.variants.length === 0 && (
                            <p className="text-xs text-muted-foreground">No variants added. Product will use the base price above.</p>
                        )}
                        {data.variants.map((variant, i) => (
                            <div key={i} className="flex flex-wrap items-end gap-2 rounded-lg border border-input p-3">
                                <div className="w-24 space-y-1">
                                    <label className="text-[11px] text-muted-foreground">Size</label>
                                    <input
                                        type="text"
                                        value={variant.size}
                                        onChange={(e) => updateVariant(i, 'size', e.target.value)}
                                        placeholder="e.g. M, L, XL"
                                        className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                                    />
                                </div>
                                <div className="w-24 space-y-1">
                                    <label className="text-[11px] text-muted-foreground">Color</label>
                                    <input
                                        type="text"
                                        value={variant.color}
                                        onChange={(e) => updateVariant(i, 'color', e.target.value)}
                                        placeholder="e.g. Red"
                                        className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                                    />
                                </div>
                                <div className="w-28 space-y-1">
                                    <label className="text-[11px] text-muted-foreground">Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={variant.price}
                                        onChange={(e) => updateVariant(i, 'price', e.target.value)}
                                        className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                                    />
                                    {errors[`variants.${i}.price` as keyof typeof errors] && (
                                        <p className="text-[10px] text-destructive">{errors[`variants.${i}.price` as keyof typeof errors]}</p>
                                    )}
                                </div>
                                <div className="w-28 space-y-1">
                                    <label className="text-[11px] text-muted-foreground">Original ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={variant.original_price}
                                        onChange={(e) => updateVariant(i, 'original_price', e.target.value)}
                                        className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                                    />
                                </div>
                                <div className="flex items-center gap-1.5 pb-1">
                                    <input
                                        type="checkbox"
                                        checked={variant.in_stock}
                                        onChange={(e) => updateVariant(i, 'in_stock', e.target.checked)}
                                        className="h-3.5 w-3.5 rounded border-input"
                                    />
                                    <span className="text-[11px]">In Stock</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeVariant(i)}
                                    className="mb-0.5 rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                        {errors.variants && <p className="text-sm text-destructive">{errors.variants}</p>}
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                        >
                            {processing ? 'Creating...' : 'Create Product'}
                        </button>
                        <Link
                            href="/admin/products"
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

CreateProduct.layout = {
    breadcrumbs: [
        { title: 'Admin Dashboard', href: '/admin/dashboard' },
        { title: 'Products', href: '/admin/products' },
        { title: 'Create', href: '/admin/products/create' },
    ],
};
