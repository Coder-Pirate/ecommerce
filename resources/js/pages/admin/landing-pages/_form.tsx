import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

type ProductOption = { id: number; name: string };

type UseCase = { label: string };
type Feature = { title: string; desc: string };
type Specification = { title: string; specs: string[] };
type WhyBuy = { title: string; desc: string };

export type LandingPageFormData = {
    product_id: string;
    title: string;
    slug: string;
    subtitle: string;
    hero_text: string;
    badge_text: string;
    phone: string;
    use_cases_title: string;
    use_cases: UseCase[];
    features_title: string;
    features: Feature[];
    specifications_title: string;
    specifications: Specification[];
    why_buy_title: string;
    why_buy: WhyBuy[];
    checkout_banner_text: string;
    footer_text: string;
    is_active: boolean;
};

export const defaultFormData: LandingPageFormData = {
    product_id: '',
    title: '',
    slug: '',
    subtitle: '',
    hero_text: '',
    badge_text: 'Limited Offer',
    phone: '+1 (234) 567-890',
    use_cases_title: 'What Is This Product Used For?',
    use_cases: [
        { label: 'Track Your Keys' },
        { label: 'Find Your Bags' },
        { label: 'Secure Valuables' },
        { label: 'Remote Tracking' },
        { label: 'Ring to Find' },
        { label: 'Wide Range' },
        { label: 'Long Battery Life' },
        { label: 'Easy Connection' },
    ],
    features_title: 'Amazing Features That Keep You Worry-Free',
    features: [
        { title: 'Bluetooth 5.1', desc: 'Latest Bluetooth technology for fast, stable connections' },
        { title: 'Long Battery', desc: 'Up to 12 months battery life on a single charge' },
        { title: 'Loud Speaker', desc: 'Built-in speaker rings loud so you can find things fast' },
        { title: 'Instant Alerts', desc: 'Get notified immediately when you leave something behind' },
        { title: 'Privacy First', desc: 'Encrypted communications keep your data fully secure' },
        { title: 'Smart Chip', desc: 'Advanced processor for accurate real-time tracking' },
        { title: 'Replaceable Battery', desc: 'Easy to replace standard battery — no charging needed' },
        { title: '24/7 Support', desc: 'Our support team is always ready to help you' },
    ],
    specifications_title: 'Detailed Specifications',
    specifications: [
        { title: 'Connectivity', specs: ['Bluetooth 5.1', 'Compatible with iOS & Android', 'Range up to 100ft'] },
        { title: 'Battery', specs: ['CR2032 Coin Cell', 'Up to 12 months', 'Easy replacement'] },
        { title: 'Security', specs: ['End-to-end encryption', 'Anti-stalking feature', 'Privacy certified'] },
        { title: 'Dimensions', specs: ['Compact & lightweight', 'Water-resistant design', 'Durable materials'] },
        { title: 'Performance', specs: ['Ultra-low latency', 'Location accuracy', 'Real-time updates'] },
        { title: 'Warranty', specs: ['1 year guarantee', 'Free replacements', '30-day returns'] },
    ],
    why_buy_title: 'Why Buy From Us?',
    why_buy: [
        { title: '1 Year Warranty', desc: 'Full product warranty' },
        { title: '7-Day Returns', desc: 'Easy return policy' },
        { title: 'Fast Delivery', desc: 'Nationwide shipping' },
        { title: '100% Genuine', desc: 'Authentic products only' },
    ],
    checkout_banner_text: 'Order now and get free shipping on orders over $50!',
    footer_text: 'All rights reserved. Secure checkout powered by our platform.',
    is_active: true,
};

const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring';
const labelClass = 'text-sm font-medium';

function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="rounded-lg border border-sidebar-border/70 dark:border-sidebar-border">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between p-4 text-left text-sm font-semibold hover:bg-muted/50"
            >
                {title}
                <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && <div className="space-y-4 border-t px-4 pb-4 pt-4">{children}</div>}
        </div>
    );
}

export function LandingPageForm({
    data,
    setData,
    errors,
    products,
    slugEditable = true,
    onSlugChange,
}: {
    data: LandingPageFormData;
    setData: (key: string, value: unknown) => void;
    errors: Partial<Record<string, string>>;
    products: ProductOption[];
    slugEditable?: boolean;
    onSlugChange?: (value: string) => void;
}) {
    function updateArrayItem<T>(field: string, index: number, key: keyof T, value: string) {
        const arr = [...(data[field as keyof LandingPageFormData] as T[])];
        arr[index] = { ...arr[index], [key]: value };
        setData(field, arr);
    }

    function addArrayItem<T>(field: string, template: T) {
        const arr = [...(data[field as keyof LandingPageFormData] as T[]), template];
        setData(field, arr);
    }

    function removeArrayItem<T>(field: string, index: number) {
        const arr = [...(data[field as keyof LandingPageFormData] as T[])];
        arr.splice(index, 1);
        setData(field, arr);
    }

    function updateSpecItem(specIndex: number, itemIndex: number, value: string) {
        const specs = [...data.specifications];
        const updated = { ...specs[specIndex], specs: [...specs[specIndex].specs] };
        updated.specs[itemIndex] = value;
        specs[specIndex] = updated;
        setData('specifications', specs);
    }

    function addSpecItem(specIndex: number) {
        const specs = [...data.specifications];
        specs[specIndex] = { ...specs[specIndex], specs: [...specs[specIndex].specs, ''] };
        setData('specifications', specs);
    }

    function removeSpecItem(specIndex: number, itemIndex: number) {
        const specs = [...data.specifications];
        const updatedSpecs = [...specs[specIndex].specs];
        updatedSpecs.splice(itemIndex, 1);
        specs[specIndex] = { ...specs[specIndex], specs: updatedSpecs };
        setData('specifications', specs);
    }

    return (
        <div className="max-w-3xl space-y-5">
            {/* ── General Settings ── */}
            <Section title="General Settings" defaultOpen>
                <div className="space-y-2">
                    <label htmlFor="product_id" className={labelClass}>Product <span className="text-destructive">*</span></label>
                    <select id="product_id" value={data.product_id} onChange={(e) => setData('product_id', e.target.value)} className={inputClass}>
                        <option value="">Select a product...</option>
                        {products.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
                    </select>
                    {errors.product_id && <p className="text-sm text-destructive">{errors.product_id}</p>}
                </div>
                <div className="space-y-2">
                    <label htmlFor="title" className={labelClass}>Title <span className="text-destructive">*</span></label>
                    <input id="title" type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} placeholder="e.g. Smart Tracker Pro — Limited Offer" className={inputClass} />
                    {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                </div>
                <div className="space-y-2">
                    <label htmlFor="slug" className={labelClass}>Slug <span className="text-destructive">*</span></label>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">/lp/</span>
                        <input id="slug" type="text" value={data.slug} onChange={(e) => onSlugChange ? onSlugChange(e.target.value) : setData('slug', e.target.value)} placeholder="smart-tracker-pro" className={'flex-1 ' + inputClass.replace('w-full ', '')} />
                    </div>
                    {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
                </div>
                <div className="flex items-center gap-3">
                    <button type="button" role="switch" aria-checked={data.is_active} onClick={() => setData('is_active', !data.is_active)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${data.is_active ? 'bg-primary' : 'bg-input'}`}>
                        <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${data.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                    <label className={labelClass}>Active</label>
                </div>
            </Section>

            {/* ── Top Bar ── */}
            <Section title="Top Bar">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="badge_text" className={labelClass}>Badge Text</label>
                        <input id="badge_text" type="text" value={data.badge_text} onChange={(e) => setData('badge_text', e.target.value)} placeholder="Limited Offer" className={inputClass} />
                        {errors.badge_text && <p className="text-sm text-destructive">{errors.badge_text}</p>}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="phone" className={labelClass}>Phone Number</label>
                        <input id="phone" type="text" value={data.phone} onChange={(e) => setData('phone', e.target.value)} placeholder="+1 (234) 567-890" className={inputClass} />
                        {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                    </div>
                </div>
            </Section>

            {/* ── Hero Section ── */}
            <Section title="Hero Section">
                <div className="space-y-2">
                    <label htmlFor="subtitle" className={labelClass}>Subtitle</label>
                    <input id="subtitle" type="text" value={data.subtitle} onChange={(e) => setData('subtitle', e.target.value)} placeholder="Keep your valuables safe" className={inputClass} />
                    {errors.subtitle && <p className="text-sm text-destructive">{errors.subtitle}</p>}
                </div>
                <div className="space-y-2">
                    <label htmlFor="hero_text" className={labelClass}>Hero Description</label>
                    <textarea id="hero_text" value={data.hero_text} onChange={(e) => setData('hero_text', e.target.value)} placeholder="Describe the product benefits for the hero section..." rows={3} className={inputClass} />
                    {errors.hero_text && <p className="text-sm text-destructive">{errors.hero_text}</p>}
                </div>
            </Section>

            {/* ── Use Cases ── */}
            <Section title="Use Cases Section">
                <div className="space-y-2">
                    <label htmlFor="use_cases_title" className={labelClass}>Section Title</label>
                    <input id="use_cases_title" type="text" value={data.use_cases_title} onChange={(e) => setData('use_cases_title', e.target.value)} className={inputClass} />
                </div>
                <div className="space-y-2">
                    <label className={labelClass}>Items</label>
                    <div className="space-y-2">
                        {data.use_cases.map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <span className="w-6 text-center text-xs text-muted-foreground">{i + 1}</span>
                                <input type="text" value={item.label} onChange={(e) => updateArrayItem<UseCase>('use_cases', i, 'label', e.target.value)} className={inputClass} placeholder="Use case label" />
                                <button type="button" onClick={() => removeArrayItem<UseCase>('use_cases', i)} className="p-1.5 text-muted-foreground hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={() => addArrayItem<UseCase>('use_cases', { label: '' })} className="flex items-center gap-1 text-sm text-primary hover:underline">
                        <Plus className="h-3.5 w-3.5" /> Add Use Case
                    </button>
                </div>
            </Section>

            {/* ── Features ── */}
            <Section title="Features Section">
                <div className="space-y-2">
                    <label htmlFor="features_title" className={labelClass}>Section Title</label>
                    <input id="features_title" type="text" value={data.features_title} onChange={(e) => setData('features_title', e.target.value)} className={inputClass} />
                </div>
                <div className="space-y-3">
                    <label className={labelClass}>Feature Cards</label>
                    {data.features.map((item, i) => (
                        <div key={i} className="flex gap-2 rounded-lg border border-input p-3">
                            <span className="mt-2 w-5 text-center text-xs text-muted-foreground">{i + 1}</span>
                            <div className="flex-1 space-y-2">
                                <input type="text" value={item.title} onChange={(e) => updateArrayItem<Feature>('features', i, 'title', e.target.value)} className={inputClass} placeholder="Feature title" />
                                <input type="text" value={item.desc} onChange={(e) => updateArrayItem<Feature>('features', i, 'desc', e.target.value)} className={inputClass} placeholder="Feature description" />
                            </div>
                            <button type="button" onClick={() => removeArrayItem<Feature>('features', i)} className="mt-2 p-1.5 text-muted-foreground hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={() => addArrayItem<Feature>('features', { title: '', desc: '' })} className="flex items-center gap-1 text-sm text-primary hover:underline">
                        <Plus className="h-3.5 w-3.5" /> Add Feature
                    </button>
                </div>
            </Section>

            {/* ── Specifications ── */}
            <Section title="Specifications Section">
                <div className="space-y-2">
                    <label htmlFor="specifications_title" className={labelClass}>Section Title</label>
                    <input id="specifications_title" type="text" value={data.specifications_title} onChange={(e) => setData('specifications_title', e.target.value)} className={inputClass} />
                </div>
                <div className="space-y-3">
                    <label className={labelClass}>Specification Groups</label>
                    {data.specifications.map((group, gi) => (
                        <div key={gi} className="rounded-lg border border-input p-3 space-y-2">
                            <div className="flex items-center gap-2">
                                <input type="text" value={group.title} onChange={(e) => updateArrayItem<Specification>('specifications', gi, 'title', e.target.value)} className={inputClass} placeholder="Group title (e.g. Connectivity)" />
                                <button type="button" onClick={() => removeArrayItem<Specification>('specifications', gi)} className="p-1.5 text-muted-foreground hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="ml-4 space-y-1.5">
                                {group.specs.map((spec, si) => (
                                    <div key={si} className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                        <input type="text" value={spec} onChange={(e) => updateSpecItem(gi, si, e.target.value)} className={inputClass} placeholder="Spec detail" />
                                        <button type="button" onClick={() => removeSpecItem(gi, si)} className="p-1 text-muted-foreground hover:text-destructive">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => addSpecItem(gi)} className="ml-3.5 flex items-center gap-1 text-xs text-primary hover:underline">
                                    <Plus className="h-3 w-3" /> Add Spec
                                </button>
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={() => addArrayItem<Specification>('specifications', { title: '', specs: [''] })} className="flex items-center gap-1 text-sm text-primary hover:underline">
                        <Plus className="h-3.5 w-3.5" /> Add Specification Group
                    </button>
                </div>
            </Section>

            {/* ── Why Buy From Us ── */}
            <Section title="Why Buy From Us Section">
                <div className="space-y-2">
                    <label htmlFor="why_buy_title" className={labelClass}>Section Title</label>
                    <input id="why_buy_title" type="text" value={data.why_buy_title} onChange={(e) => setData('why_buy_title', e.target.value)} className={inputClass} />
                </div>
                <div className="space-y-3">
                    <label className={labelClass}>Trust Items</label>
                    {data.why_buy.map((item, i) => (
                        <div key={i} className="flex gap-2 rounded-lg border border-input p-3">
                            <span className="mt-2 w-5 text-center text-xs text-muted-foreground">{i + 1}</span>
                            <div className="flex-1 space-y-2">
                                <input type="text" value={item.title} onChange={(e) => updateArrayItem<WhyBuy>('why_buy', i, 'title', e.target.value)} className={inputClass} placeholder="Title (e.g. 1 Year Warranty)" />
                                <input type="text" value={item.desc} onChange={(e) => updateArrayItem<WhyBuy>('why_buy', i, 'desc', e.target.value)} className={inputClass} placeholder="Description" />
                            </div>
                            <button type="button" onClick={() => removeArrayItem<WhyBuy>('why_buy', i)} className="mt-2 p-1.5 text-muted-foreground hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={() => addArrayItem<WhyBuy>('why_buy', { title: '', desc: '' })} className="flex items-center gap-1 text-sm text-primary hover:underline">
                        <Plus className="h-3.5 w-3.5" /> Add Trust Item
                    </button>
                </div>
            </Section>

            {/* ── Checkout & Footer ── */}
            <Section title="Checkout Banner & Footer">
                <div className="space-y-2">
                    <label htmlFor="checkout_banner_text" className={labelClass}>Checkout Banner Text</label>
                    <input id="checkout_banner_text" type="text" value={data.checkout_banner_text} onChange={(e) => setData('checkout_banner_text', e.target.value)} className={inputClass} />
                    {errors.checkout_banner_text && <p className="text-sm text-destructive">{errors.checkout_banner_text}</p>}
                </div>
                <div className="space-y-2">
                    <label htmlFor="footer_text" className={labelClass}>Footer Text</label>
                    <input id="footer_text" type="text" value={data.footer_text} onChange={(e) => setData('footer_text', e.target.value)} className={inputClass} />
                    {errors.footer_text && <p className="text-sm text-destructive">{errors.footer_text}</p>}
                </div>
            </Section>
        </div>
    );
}
