import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { useMemo, useState } from 'react';

type Category = { id: number; name: string };
type SubCategory = { id: number; category_id: number; name: string };

type ProductImage = { id: number; image_path: string; sort_order: number };

type ProductData = {
    id: number;
    category_id: number;
    sub_category_id: number | null;
    name: string;
    description: string | null;
    price: string;
    original_price: string | null;
    in_stock: boolean;
    images: ProductImage[];
};

type Props = {
    product: ProductData;
    categories: Category[];
    subCategories: SubCategory[];
};

export default function EditProduct() {
    const { product, categories, subCategories } = usePage<Props>().props;
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        category_id: String(product.category_id),
        sub_category_id: product.sub_category_id ? String(product.sub_category_id) : '',
        name: product.name,
        description: product.description || '',
        price: product.price,
        original_price: product.original_price || '',
        images: [] as File[],
        remove_images: [] as number[],
        in_stock: product.in_stock,
    });

    const [previews, setPreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<ProductImage[]>(product.images || []);

    const filteredSubCategories = useMemo(
        () => (data.category_id ? subCategories.filter((sc) => sc.category_id === Number(data.category_id)) : []),
        [data.category_id, subCategories],
    );

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(`/admin/products/${product.id}`, {
            forceFormData: true,
        });
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);
        const totalAllowed = 10 - existingImages.length;
        const newFiles = [...data.images, ...files].slice(0, totalAllowed);
        setData('images', newFiles);

        const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
        setPreviews((prev) => {
            prev.forEach((url) => URL.revokeObjectURL(url));
            return newPreviews;
        });
    }

    function removeNewImage(index: number) {
        const newFiles = data.images.filter((_, i) => i !== index);
        setData('images', newFiles);
        setPreviews((prev) => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    }

    function removeExistingImage(imageId: number) {
        setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
        setData('remove_images', [...data.remove_images, imageId]);
    }

    return (
        <>
            <Head title={`Edit ${product.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products" className="inline-flex items-center rounded-md p-1.5 hover:bg-accent">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Edit Product</h2>
                        <p className="text-muted-foreground">Update details for {product.name}.</p>
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
                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm disabled:opacity-50 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
                                {existingImages.map((img) => (
                                    <div key={img.id} className="relative h-24 w-24 overflow-hidden rounded-lg border">
                                        <img src={`/${img.image_path}`} alt="" className="h-full w-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeExistingImage(img.id)}
                                            className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                                {previews.map((src, i) => (
                                    <div key={`new-${i}`} className="relative h-24 w-24 overflow-hidden rounded-lg border">
                                        <img src={src} alt="" className="h-full w-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeNewImage(i)}
                                            className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                                {existingImages.length + data.images.length < 10 && (
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
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save Changes'}
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

EditProduct.layout = {
    breadcrumbs: [
        { title: 'Admin Dashboard', href: '/admin/dashboard' },
        { title: 'Products', href: '/admin/products' },
        { title: 'Edit', href: '#' },
    ],
};
