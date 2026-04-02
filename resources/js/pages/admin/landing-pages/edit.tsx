import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { LandingPageForm, defaultFormData } from './_form';
import type { LandingPageFormData } from './_form';

type ProductOption = { id: number; name: string };
type LandingPageRecord = {
    id: number;
    product_id: number;
    title: string;
    slug: string;
    subtitle: string | null;
    hero_text: string | null;
    badge_text: string | null;
    phone: string | null;
    use_cases: { label: string }[] | null;
    use_cases_title: string | null;
    features: { title: string; desc: string }[] | null;
    features_title: string | null;
    specifications: { title: string; specs: string[] }[] | null;
    specifications_title: string | null;
    why_buy: { title: string; desc: string }[] | null;
    why_buy_title: string | null;
    checkout_banner_text: string | null;
    footer_text: string | null;
    is_active: boolean;
};
type Props = { landingPage: LandingPageRecord; products: ProductOption[] };

export default function EditLandingPage() {
    const { landingPage, products } = usePage<Props>().props;
    const { data, setData, put, processing, errors } = useForm<LandingPageFormData>({
        product_id: String(landingPage.product_id),
        title: landingPage.title,
        slug: landingPage.slug,
        subtitle: landingPage.subtitle || '',
        hero_text: landingPage.hero_text || '',
        badge_text: landingPage.badge_text || defaultFormData.badge_text,
        phone: landingPage.phone || defaultFormData.phone,
        use_cases_title: landingPage.use_cases_title || defaultFormData.use_cases_title,
        use_cases: landingPage.use_cases || defaultFormData.use_cases,
        features_title: landingPage.features_title || defaultFormData.features_title,
        features: landingPage.features || defaultFormData.features,
        specifications_title: landingPage.specifications_title || defaultFormData.specifications_title,
        specifications: landingPage.specifications || defaultFormData.specifications,
        why_buy_title: landingPage.why_buy_title || defaultFormData.why_buy_title,
        why_buy: landingPage.why_buy || defaultFormData.why_buy,
        checkout_banner_text: landingPage.checkout_banner_text || defaultFormData.checkout_banner_text,
        footer_text: landingPage.footer_text || defaultFormData.footer_text,
        is_active: landingPage.is_active,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/admin/landing-pages/${landingPage.id}`);
    }

    return (
        <>
            <Head title={`Edit — ${landingPage.title}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/landing-pages" className="inline-flex items-center rounded-md p-1.5 hover:bg-accent">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Edit Landing Page</h2>
                        <p className="text-muted-foreground">Update all content for {landingPage.title}.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <LandingPageForm
                        data={data}
                        setData={setData as (key: string, value: unknown) => void}
                        errors={errors}
                        products={products}
                    />

                    <div className="mt-6 flex max-w-3xl gap-3">
                        <button type="submit" disabled={processing} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                        <Link href="/admin/landing-pages" className="rounded-lg border border-input px-4 py-2 text-sm font-medium hover:bg-accent">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}

EditLandingPage.layout = {
    breadcrumbs: [
        { title: 'Admin Dashboard', href: '/admin/dashboard' },
        { title: 'Landing Pages', href: '/admin/landing-pages' },
        { title: 'Edit', href: '#' },
    ],
};
