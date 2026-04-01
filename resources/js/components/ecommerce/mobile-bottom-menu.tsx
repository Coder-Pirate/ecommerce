import { Link, usePage } from '@inertiajs/react';
import { Grid3x3, Home, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { useState } from 'react';
import { categories } from '@/components/ecommerce/category-data';
import { cn } from '@/lib/utils';

function MobileCategorySheet({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    if (!open) {
        return null;
    }

    return (
        <>
            <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />
            <div className="fixed inset-x-0 bottom-14 top-0 z-50 overflow-y-auto bg-background">
                <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-4 py-3">
                    <h2 className="text-base font-semibold">All Categories</h2>
                    <button onClick={onClose} className="text-sm font-medium text-primary">
                        Close
                    </button>
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-2 gap-3">
                        {categories.map((cat, idx) => {
                            const Icon = cat.icon;
                            const isExpanded = expandedIndex === idx;

                            return (
                                <div key={cat.name} className="col-span-2">
                                    <button
                                        onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                                        className={cn(
                                            'flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors',
                                            isExpanded
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:bg-accent',
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                'flex h-9 w-9 items-center justify-center rounded-lg',
                                                isExpanded
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted',
                                            )}
                                        >
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-medium">{cat.name}</span>
                                    </button>
                                    {isExpanded && (
                                        <div className="mt-2 ml-4 grid grid-cols-2 gap-2">
                                            {cat.subcategories.map((sub) => (
                                                <Link
                                                    key={sub.name}
                                                    href={sub.href}
                                                    className="rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                                                >
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

export function MobileBottomMenu() {
    const { auth } = usePage().props;
    const [categoriesOpen, setCategoriesOpen] = useState(false);

    const menuItems = [
        { name: 'Home', icon: Home, href: '/' },
        { name: 'Category', icon: Grid3x3, href: '#', onClick: () => setCategoriesOpen(true) },
        { name: 'Shop', icon: ShoppingBag, href: '/products' },
        { name: 'Cart', icon: ShoppingCart, href: '/cart', badge: 0 },
        { name: 'Account', icon: User, href: auth.user ? '/dashboard' : '/login' },
    ];

    return (
        <>
            <MobileCategorySheet open={categoriesOpen} onClose={() => setCategoriesOpen(false)} />

            <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] lg:hidden">
                <div className="flex h-14 items-center justify-around">
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        if (item.onClick) {
                            return (
                                <button
                                    key={item.name}
                                    onClick={item.onClick}
                                    className="flex flex-1 flex-col items-center justify-center gap-0.5 text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="text-[10px] font-medium">{item.name}</span>
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={item.name}
                                href={item.href!}
                                className="relative flex flex-1 flex-col items-center justify-center gap-0.5 text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <Icon className="h-5 w-5" />
                                {item.badge !== undefined && item.badge > 0 && (
                                    <span className="absolute right-1/4 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                                        {item.badge}
                                    </span>
                                )}
                                <span className="text-[10px] font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
