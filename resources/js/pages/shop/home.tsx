import { Head } from '@inertiajs/react';
import { ArrowUp, Headset, MessageCircle, Phone, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CategorySidebar } from '@/components/ecommerce/category-sidebar';
import { EcommerceHeader } from '@/components/ecommerce/ecommerce-header';
import {
    CategoryGrid,
    DealsSection,
    FeaturedProducts,
    HeroBanner,
    TrustBadges,
} from '@/components/ecommerce/home-sections';
import { MobileBottomMenu } from '@/components/ecommerce/mobile-bottom-menu';

function ScrollToTopButton() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        function onScroll() {
            setVisible(window.scrollY > 300);
        }

        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    if (!visible) {
        return null;
    }

    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-20 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-opacity hover:bg-primary/90 lg:bottom-6"
        >
            <ArrowUp className="h-5 w-5" />
        </button>
    );
}

function FloatingSupportButton() {
    const [open, setOpen] = useState(false);

    return (
        <div className="fixed bottom-20 left-4 z-50 flex flex-col items-start gap-2 lg:bottom-6">
            {open && (
                <div className="flex flex-col gap-2">
                    <a
                        href="https://wa.me/1234567890"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
                        title="WhatsApp"
                    >
                        <MessageCircle className="h-5 w-5" />
                    </a>
                    <a
                        href="tel:+1234567890"
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg transition-transform hover:scale-110"
                        title="Call Us"
                    >
                        <Phone className="h-5 w-5" />
                    </a>
                </div>
            )}
            <button
                onClick={() => setOpen(!open)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110"
                title="Support"
            >
                {open ? <X className="h-6 w-6" /> : <Headset className="h-6 w-6" />}
            </button>
        </div>
    );
}

export default function ShopHome() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [desktopCollapsed, setDesktopCollapsed] = useState(true);

    const sidebarMargin = desktopCollapsed ? 'lg:ml-16' : 'lg:ml-60';

    return (
        <>
            <Head title="Shop">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>

            <div className="flex min-h-screen flex-col bg-background">
                <EcommerceHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

                <div className="flex w-full flex-1 py-6">
                    {/* Sidebar: fixed on desktop, overlay on mobile */}
                    <CategorySidebar
                        open={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                        desktopCollapsed={desktopCollapsed}
                        onToggleDesktop={() => setDesktopCollapsed(!desktopCollapsed)}
                    />

                    {/* Main content */}
                    <main className={`flex min-w-0 flex-1 flex-col gap-6 px-4 pb-16 transition-[margin] duration-300 lg:pb-0 ${sidebarMargin}`}>
                        <HeroBanner />
                        <CategoryGrid />
                        <FeaturedProducts />
                        <DealsSection />
                        <TrustBadges />
                    </main>
                </div>

                {/* Footer */}
                <footer className={`mb-14 border-t border-border bg-muted/30 transition-[margin] duration-300 lg:mb-0 ${sidebarMargin}`}>
                    <div className="px-4 py-8">
                        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                            <div>
                                <h4 className="mb-3 text-sm font-semibold">Shop</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li><a href="#" className="hover:text-foreground">New Arrivals</a></li>
                                    <li><a href="#" className="hover:text-foreground">Best Sellers</a></li>
                                    <li><a href="#" className="hover:text-foreground">Deals</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="mb-3 text-sm font-semibold">Support</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li><a href="#" className="hover:text-foreground">Help Center</a></li>
                                    <li><a href="#" className="hover:text-foreground">Track Order</a></li>
                                    <li><a href="#" className="hover:text-foreground">Returns</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="mb-3 text-sm font-semibold">Company</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li><a href="/about" className="hover:text-foreground">About Us</a></li>
                                    <li><a href="#" className="hover:text-foreground">Careers</a></li>
                                    <li><a href="/contact" className="hover:text-foreground">Contact</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="mb-3 text-sm font-semibold">Legal</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
                                    <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
                                    <li><a href="#" className="hover:text-foreground">Cookie Policy</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-8 border-t border-border pt-4 text-center text-xs text-muted-foreground">
                            &copy; {new Date().getFullYear()} Your Store. All rights reserved.
                        </div>
                    </div>
                </footer>

                <MobileBottomMenu />
                <ScrollToTopButton />
                <FloatingSupportButton />
            </div>
        </>
    );
}
