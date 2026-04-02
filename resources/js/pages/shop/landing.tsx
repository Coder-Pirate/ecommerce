import { Head, useForm, usePage } from '@inertiajs/react';
import {
    Award,
    Battery,
    Bluetooth,
    Box,
    ChevronRight,
    Clock,
    Cpu,
    Headphones,
    ListChecks,
    Lock,
    MapPin,
    Minus,
    Phone,
    Plus,
    RefreshCcw,
    Shield,
    ShieldCheck,
    Signal,
    Star,
    ThumbsUp,
    Truck,
    Volume2,
    Wifi,
    Zap,
} from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type { Product } from '@/types/global';

type LandingPageData = {
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

function formatPrice(price: string | number | null): string {
    if (price === null) {
        return '';
    }

    const num = typeof price === 'string' ? parseFloat(price) : price;

    return `$${num.toFixed(2)}`;
}

export default function LandingPage() {
    const { product, landingPage } = usePage<{ product: Product; landingPage: LandingPageData }>().props;

    const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState(1);
    const checkoutRef = useRef<HTMLDivElement>(null);

    const variants = useMemo(() => product.variants || [], [product.variants]);
    const sizes = useMemo(() => [...new Set(variants.filter((v) => v.size).map((v) => v.size!))], [variants]);
    const colors = useMemo(() => [...new Set(variants.filter((v) => v.color).map((v) => v.color!))], [variants]);

    const selectedVariant = variants.find((v) => v.id === selectedVariantId) ?? null;
    const activePrice = selectedVariant ? selectedVariant.price : product.price;
    const activeOriginalPrice = selectedVariant ? selectedVariant.original_price : product.original_price;
    const activeInStock = selectedVariant ? selectedVariant.in_stock : product.in_stock;

    const discount = activeOriginalPrice
        ? Math.round(((parseFloat(activeOriginalPrice) - parseFloat(activePrice)) / parseFloat(activeOriginalPrice)) * 100)
        : 0;

    const unitPrice = parseFloat(activePrice);
    const subtotal = unitPrice * quantity;
    const shipping = subtotal > 50 ? 0 : 5.99;
    const total = subtotal + shipping;

    const { data, setData, post, processing, errors, transform } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zip: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        transform((formData) => ({
            ...formData,
            variant_id: selectedVariantId,
            quantity,
        }));
        post(`/lp/${landingPage.slug}`);
    }

    function scrollToCheckout() {
        checkoutRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    const heroImage = product.images && product.images.length > 0 ? `/${product.images[0].image_path}` : null;

    const useCaseIcons = [
        <MapPin key="mp" className="h-5 w-5 text-primary" />,
        <Box key="bx" className="h-5 w-5 text-primary" />,
        <Shield key="sh" className="h-5 w-5 text-primary" />,
        <Wifi key="wf" className="h-5 w-5 text-primary" />,
        <Volume2 key="v2" className="h-5 w-5 text-primary" />,
        <Signal key="sg" className="h-5 w-5 text-primary" />,
        <Battery key="bt" className="h-5 w-5 text-primary" />,
        <Bluetooth key="bl" className="h-5 w-5 text-primary" />,
    ];

    const featureIcons = [
        <Bluetooth key="bl" className="h-5 w-5 text-primary" />,
        <Battery key="bt" className="h-5 w-5 text-primary" />,
        <Volume2 key="v2" className="h-5 w-5 text-primary" />,
        <Zap key="zp" className="h-5 w-5 text-primary" />,
        <Shield key="sh" className="h-5 w-5 text-primary" />,
        <Cpu key="cp" className="h-5 w-5 text-primary" />,
        <RefreshCcw key="rc" className="h-5 w-5 text-primary" />,
        <Headphones key="hp" className="h-5 w-5 text-primary" />,
    ];

    const specIcons = [
        <Bluetooth key="bl" className="h-4 w-4 text-primary" />,
        <Battery key="bt" className="h-4 w-4 text-primary" />,
        <Shield key="sh" className="h-4 w-4 text-primary" />,
        <ListChecks key="lc" className="h-4 w-4 text-primary" />,
        <Zap key="zp" className="h-4 w-4 text-primary" />,
        <Award key="aw" className="h-4 w-4 text-primary" />,
    ];

    const whyBuyIcons = [
        <ShieldCheck key="sc" className="h-6 w-6 text-primary" />,
        <RefreshCcw key="rc" className="h-6 w-6 text-primary" />,
        <Truck key="tr" className="h-6 w-6 text-primary" />,
        <ThumbsUp key="tu" className="h-6 w-6 text-primary" />,
    ];

    return (
        <>
            <Head title={landingPage.title} />
            <div className="dark min-h-screen bg-background text-foreground">
                {/* ── Sticky Top Bar ── */}
                <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
                    <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4">
                        <div className="flex items-center gap-3">
                            <span className="rounded bg-primary px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-primary-foreground">{landingPage.badge_text || 'Limited Offer'}</span>
                            <span className="hidden text-sm text-muted-foreground sm:inline">
                                <Clock className="mr-1 inline h-3.5 w-3.5" />
                                Offer ends soon
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <a href={`tel:${(landingPage.phone || '+1234567890').replace(/[^+\d]/g, '')}`} className="flex items-center gap-1.5 transition-colors hover:text-foreground">
                                <Phone className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">{landingPage.phone || '+1 (234) 567-890'}</span>
                            </a>
                            <span className="flex items-center gap-1.5">
                                <Shield className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Secure</span>
                            </span>
                        </div>
                    </div>
                </header>

                {/* ── 1. Hero Section ── */}
                <section className="relative overflow-hidden bg-primary">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,0,0,0.2),transparent_70%)]" />
                    <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-20">
                        {/* Text */}
                        <div className="text-center md:text-left">
                            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary-foreground/70">{landingPage.subtitle || 'Keep your valuables safe'}</p>
                            <h1 className="mb-4 text-3xl font-extrabold leading-tight text-primary-foreground md:text-4xl lg:text-5xl">
                                {landingPage.title}
                            </h1>
                            {(landingPage.hero_text || product.description) && (
                                <p className="mb-6 max-w-lg text-base leading-relaxed text-primary-foreground/80">{landingPage.hero_text || product.description}</p>
                            )}
                            <div className="mb-6 flex items-baseline justify-center gap-3 md:justify-start">
                                <span className="text-4xl font-extrabold text-primary-foreground">{formatPrice(activePrice)}</span>
                                {activeOriginalPrice && (
                                    <span className="text-xl text-primary-foreground/60 line-through">{formatPrice(activeOriginalPrice)}</span>
                                )}
                                {discount > 0 && (
                                    <span className="rounded-full bg-chart-4 px-3 py-1 text-xs font-bold text-foreground">-{discount}%</span>
                                )}
                            </div>
                            <div className="flex flex-wrap justify-center gap-3 md:justify-start">
                                <Button
                                    size="lg"
                                    type="button"
                                    variant="secondary"
                                    onClick={scrollToCheckout}
                                    className="px-8 shadow-lg"
                                >
                                    Order Now <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                                <div className="flex items-center gap-1.5 text-sm text-primary-foreground/80">
                                    <Truck className="h-4 w-4" />
                                    <span>Free shipping over $50</span>
                                </div>
                            </div>
                        </div>
                        {/* Image */}
                        <div className="flex justify-center">
                            <div className="relative w-72 md:w-80 lg:w-96">
                                {heroImage ? (
                                    <img src={heroImage} alt={product.name} className="w-full rounded-2xl object-contain drop-shadow-2xl" />
                                ) : (
                                    <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-primary-foreground/10 text-8xl">📦</div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── 2. Use Cases Section ── */}
                <section className="bg-card">
                    <div className="mx-auto max-w-6xl px-4 py-14">
                        <div className="mb-10 text-center">
                            <h2 className="mb-2 text-2xl font-bold md:text-3xl">
                                {landingPage.use_cases_title || <>What Is <span className="text-primary">{product.name}</span> Used For?</>}
                            </h2>
                            <p className="text-sm text-muted-foreground">Discover the many ways this product makes your life easier</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            {(landingPage.use_cases || [
                                { label: 'Track Your Keys' },
                                { label: 'Find Your Bags' },
                                { label: 'Secure Valuables' },
                                { label: 'Remote Tracking' },
                                { label: 'Ring to Find' },
                                { label: 'Wide Range' },
                                { label: 'Long Battery Life' },
                                { label: 'Easy Connection' },
                            ]).map((item, i) => (
                                <div key={i} className="flex flex-col items-center gap-3 rounded-xl bg-muted/50 p-5 text-center transition-colors hover:bg-muted">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                                        {useCaseIcons[i % useCaseIcons.length]}
                                    </div>
                                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── 3. Features Section ── */}
                <section className="bg-secondary text-secondary-foreground">
                    <div className="mx-auto max-w-6xl px-4 py-14">
                        <div className="mb-10 text-center">
                            <h2 className="mb-2 text-2xl font-bold md:text-3xl">
                                {landingPage.features_title || <>Amazing Features That Keep You <span className="text-primary">Worry-Free</span></>}
                            </h2>
                            <p className="text-sm text-muted-foreground">Engineered with cutting-edge technology for your peace of mind</p>
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {(landingPage.features || [
                                { title: 'Bluetooth 5.1', desc: 'Latest Bluetooth technology for fast, stable connections' },
                                { title: 'Long Battery', desc: 'Up to 12 months battery life on a single charge' },
                                { title: 'Loud Speaker', desc: 'Built-in speaker rings loud so you can find things fast' },
                                { title: 'Instant Alerts', desc: 'Get notified immediately when you leave something behind' },
                                { title: 'Privacy First', desc: 'Encrypted communications keep your data fully secure' },
                                { title: 'Smart Chip', desc: 'Advanced processor for accurate real-time tracking' },
                                { title: 'Replaceable Battery', desc: 'Easy to replace standard battery — no charging needed' },
                                { title: '24/7 Support', desc: 'Our support team is always ready to help you' },
                            ]).map((item, i) => (
                                <div key={i} className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                        {featureIcons[i % featureIcons.length]}
                                    </div>
                                    <h3 className="mb-1 text-sm font-bold text-card-foreground">{item.title}</h3>
                                    <p className="text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 flex justify-center">
                            <Button size="lg" onClick={scrollToCheckout} className="px-8">
                                Order Now <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </section>

                {/* ── 4. Specifications Section ── */}
                <section className="bg-card">
                    <div className="mx-auto max-w-6xl px-4 py-14">
                        <div className="mb-10 text-center">
                            <h2 className="mb-1 text-2xl font-bold md:text-3xl">
                                {landingPage.specifications_title || <>Detailed <span className="text-primary">Specifications</span></>}
                            </h2>
                            <p className="text-sm text-muted-foreground">Everything you need to know about this product</p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {(landingPage.specifications || [
                                { title: 'Connectivity', specs: ['Bluetooth 5.1', 'Compatible with iOS & Android', 'Range up to 100ft'] },
                                { title: 'Battery', specs: ['CR2032 Coin Cell', 'Up to 12 months', 'Easy replacement'] },
                                { title: 'Security', specs: ['End-to-end encryption', 'Anti-stalking feature', 'Privacy certified'] },
                                { title: 'Dimensions', specs: ['Compact & lightweight', 'Water-resistant design', 'Durable materials'] },
                                { title: 'Performance', specs: ['Ultra-low latency', 'Location accuracy', 'Real-time updates'] },
                                { title: 'Warranty', specs: ['1 year guarantee', 'Free replacements', '30-day returns'] },
                            ]).map((item, i) => (
                                <div key={i} className="rounded-xl border border-border bg-muted/50 p-5">
                                    <div className="mb-3 flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                                            {specIcons[i % specIcons.length]}
                                        </div>
                                        <h3 className="text-sm font-bold text-primary">{item.title}</h3>
                                    </div>
                                    <ul className="space-y-1.5">
                                        {item.specs.map((spec, si) => (
                                            <li key={si} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                                {spec}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex flex-wrap justify-center gap-4">
                            <div className="flex items-center gap-2 rounded-full bg-chart-4/10 px-4 py-2 text-sm text-chart-4">
                                <ShieldCheck className="h-4 w-4" />
                                100% Authentic Product
                            </div>
                            <div className="flex items-center gap-2 rounded-full bg-chart-2/10 px-4 py-2 text-sm text-chart-2">
                                <Truck className="h-4 w-4" />
                                Cash on Delivery Available
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── 5. Why Buy From Us ── */}
                <section className="bg-background">
                    <div className="mx-auto max-w-6xl px-4 py-14">
                        <div className="mb-10 text-center">
                            <p className="mb-1 text-sm text-muted-foreground">Customers love our store</p>
                            <h2 className="mb-2 text-2xl font-bold md:text-3xl">
                                {landingPage.why_buy_title || <>Why Buy From <span className="text-primary">Us?</span></>}
                            </h2>
                            <p className="text-sm text-muted-foreground">We're committed to your satisfaction every step of the way</p>
                        </div>
                        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                            {(landingPage.why_buy || [
                                { title: '1 Year Warranty', desc: 'Full product warranty' },
                                { title: '7-Day Returns', desc: 'Easy return policy' },
                                { title: 'Fast Delivery', desc: 'Nationwide shipping' },
                                { title: '100% Genuine', desc: 'Authentic products only' },
                            ]).map((item, i) => (
                                <div key={i} className="flex flex-col items-center gap-3 text-center">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20">
                                        {whyBuyIcons[i % whyBuyIcons.length]}
                                    </div>
                                    <h3 className="text-sm font-bold">{item.title}</h3>
                                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── 6. Checkout Section ── */}
                <section ref={checkoutRef} className="border-t border-border bg-card" id="checkout">
                    <div className="mx-auto max-w-6xl px-4 py-14">
                        {/* Section banner */}
                        <div className="mb-8 rounded-xl bg-primary p-4 text-center">
                            <p className="text-lg font-bold text-primary-foreground">
                                {landingPage.checkout_banner_text || <>Order now and get <span className="underline decoration-chart-4 decoration-2">free shipping</span> on orders over $50!</>}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-8 lg:grid-cols-2">
                                {/* Left — Shipping Form */}
                                <div>
                                    <h2 className="mb-5 text-lg font-bold">Shipping Information</h2>
                                    <div className="rounded-xl border border-border bg-muted/50 p-5">
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <Label htmlFor="firstName">First Name</Label>
                                                <Input
                                                    id="firstName"
                                                    value={data.first_name}
                                                    onChange={(e) => setData('first_name', e.target.value)}
                                                    placeholder="John"
                                                    className="mt-1"
                                                />
                                                {errors.first_name && <p className="mt-1 text-xs text-destructive">{errors.first_name}</p>}
                                            </div>
                                            <div>
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input
                                                    id="lastName"
                                                    value={data.last_name}
                                                    onChange={(e) => setData('last_name', e.target.value)}
                                                    placeholder="Doe"
                                                    className="mt-1"
                                                />
                                                {errors.last_name && <p className="mt-1 text-xs text-destructive">{errors.last_name}</p>}
                                            </div>
                                            <div className="sm:col-span-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    placeholder="john@example.com"
                                                    className="mt-1"
                                                />
                                                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                                            </div>
                                            <div className="sm:col-span-2">
                                                <Label htmlFor="address">Address</Label>
                                                <Input
                                                    id="address"
                                                    value={data.address}
                                                    onChange={(e) => setData('address', e.target.value)}
                                                    placeholder="123 Main Street"
                                                    className="mt-1"
                                                />
                                                {errors.address && <p className="mt-1 text-xs text-destructive">{errors.address}</p>}
                                            </div>
                                            <div>
                                                <Label htmlFor="city">City</Label>
                                                <Input
                                                    id="city"
                                                    value={data.city}
                                                    onChange={(e) => setData('city', e.target.value)}
                                                    placeholder="New York"
                                                    className="mt-1"
                                                />
                                                {errors.city && <p className="mt-1 text-xs text-destructive">{errors.city}</p>}
                                            </div>
                                            <div>
                                                <Label htmlFor="zip">ZIP Code</Label>
                                                <Input
                                                    id="zip"
                                                    value={data.zip}
                                                    onChange={(e) => setData('zip', e.target.value)}
                                                    placeholder="10001"
                                                    className="mt-1"
                                                />
                                                {errors.zip && <p className="mt-1 text-xs text-destructive">{errors.zip}</p>}
                                            </div>
                                            <div className="sm:col-span-2">
                                                <Label htmlFor="phone">Phone (optional)</Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    value={data.phone}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                    placeholder="+1 (555) 000-0000"
                                                    className="mt-1"
                                                />
                                                {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right — Product + Order Summary */}
                                <div className="space-y-5">
                                    <h2 className="text-lg font-bold">Your Products</h2>

                                    {/* Product card */}
                                    <div className="rounded-xl border border-border bg-muted/50 p-4">
                                        <div className="flex gap-4">
                                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-accent">
                                                {heroImage ? (
                                                    <img src={heroImage} alt={product.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-3xl">📦</div>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="truncate text-sm font-bold">{product.name}</h3>
                                                {product.category && (
                                                    <p className="text-xs text-muted-foreground">{product.category.name}</p>
                                                )}
                                                <div className="mt-1 flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className="h-3 w-3 fill-chart-4 text-chart-4" />
                                                    ))}
                                                </div>
                                                <p className="mt-1 text-lg font-bold text-primary">{formatPrice(activePrice)}</p>
                                            </div>
                                        </div>

                                        {/* Variants */}
                                        {variants.length > 0 && (
                                            <div className="mt-4 space-y-3 border-t border-border pt-4">
                                                {sizes.length > 0 && (
                                                    <div>
                                                        <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Size</span>
                                                        <div className="flex flex-wrap gap-2">
                                                            {sizes.map((size) => {
                                                                const mv = variants.filter((v) => v.size === size);
                                                                const isSelected = selectedVariant?.size === size;

                                                                return (
                                                                    <button
                                                                        key={size}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const match = mv.find((v) => !selectedVariant?.color || v.color === selectedVariant.color) || mv[0];

                                                                            setSelectedVariantId(match.id);
                                                                        }}
                                                                        className={`rounded-md border px-3 py-1 text-xs font-medium transition-colors ${isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-primary/50'}`}
                                                                    >
                                                                        {size}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                                {colors.length > 0 && (
                                                    <div>
                                                        <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Color</span>
                                                        <div className="flex flex-wrap gap-2">
                                                            {colors.map((color) => {
                                                                const mv = variants.filter((v) => v.color === color);
                                                                const isSelected = selectedVariant?.color === color;

                                                                return (
                                                                    <button
                                                                        key={color}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const match = mv.find((v) => !selectedVariant?.size || v.size === selectedVariant.size) || mv[0];

                                                                            setSelectedVariantId(match.id);
                                                                        }}
                                                                        className={`rounded-md border px-3 py-1 text-xs font-medium transition-colors ${isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-primary/50'}`}
                                                                    >
                                                                        {color}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Quantity */}
                                        <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                                            <span className="text-xs font-medium text-muted-foreground">Qty:</span>
                                            <div className="flex items-center rounded-md border border-border">
                                                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-2.5 py-1 text-muted-foreground hover:text-foreground">
                                                    <Minus className="h-3.5 w-3.5" />
                                                </button>
                                                <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                                                <button type="button" onClick={() => setQuantity(quantity + 1)} className="px-2.5 py-1 text-muted-foreground hover:text-foreground">
                                                    <Plus className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Summary */}
                                    <div className="rounded-xl border border-border bg-muted/50 p-4">
                                        <h3 className="mb-3 text-sm font-bold">Your Order</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between text-muted-foreground">
                                                <span>Subtotal</span>
                                                <span>{formatPrice(subtotal)}</span>
                                            </div>
                                            <div className="flex justify-between text-muted-foreground">
                                                <span>Shipping</span>
                                                <span className={shipping === 0 ? 'text-chart-2' : ''}>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                                            </div>

                                            <Separator />

                                            <div className="flex justify-between text-base font-bold">
                                                <span>Total</span>
                                                <span className="text-primary">{formatPrice(total)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={processing || !activeInStock}
                                        className="w-full text-base font-bold shadow-lg"
                                    >
                                        <Lock className="mr-2 h-4 w-4" />
                                        {processing ? 'Placing Order...' : `Order Now — ${formatPrice(total)}`}
                                    </Button>

                                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                                        <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Secure Payment</span>
                                        <span className="flex items-center gap-1"><Truck className="h-3 w-3" /> Fast Delivery</span>
                                        <span className="flex items-center gap-1"><RefreshCcw className="h-3 w-3" /> Easy Returns</span>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </section>

                {/* ── Footer ── */}
                <footer className="border-t border-border bg-background py-6 text-center text-xs text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} {landingPage.footer_text || 'All rights reserved. Secure checkout powered by our platform.'}</p>
                </footer>
            </div>
        </>
    );
}
