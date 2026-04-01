import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight, Tag, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type SubCategory = {
    id: number;
    category_id: number;
    name: string;
};

type DbCategory = {
    id: number;
    name: string;
    icon: string | null;
    sub_categories: SubCategory[];
};

function CategoryItem({ category, desktopCollapsed, onExpand }: { category: DbCategory; desktopCollapsed: boolean; onExpand: () => void }) {
    const [expanded, setExpanded] = useState(false);
    const Icon = category.icon
        ? (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[category.icon] || Tag
        : Tag;
    const hasSubs = category.sub_categories && category.sub_categories.length > 0;

    const fullItem = (
        <li className={desktopCollapsed ? 'lg:hidden' : ''}>
            <button
                onClick={() => hasSubs ? setExpanded(!expanded) : undefined}
                className={cn(
                    'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                    expanded && 'bg-accent/50 text-accent-foreground',
                )}
            >
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 text-left">{category.name}</span>
                {hasSubs && (
                    expanded
                        ? <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                        : <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
            </button>
            {expanded && hasSubs && (
                <ul className="ml-7 mt-1 space-y-0.5 border-l border-border pl-3">
                    {category.sub_categories.map((sub) => (
                        <li key={sub.id}>
                            <Link
                                href={`/products?category=${category.id}&sub=${sub.id}`}
                                className="block rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                                {sub.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );

    if (!desktopCollapsed) {
        return fullItem;
    }

    return (
        <>
            {fullItem}
            <li className="hidden lg:block">
                <button
                    onClick={onExpand}
                    className="flex w-full items-center justify-center rounded-md p-2.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    title={category.name}
                >
                    <Icon className="h-5 w-5 shrink-0" />
                </button>
            </li>
        </>
    );
}

export function CategorySidebar({
    open,
    onClose,
    desktopCollapsed,
    onToggleDesktop,
}: {
    open: boolean;
    onClose: () => void;
    desktopCollapsed: boolean;
    onToggleDesktop: () => void;
}) {
    const { categories } = usePage<{ categories: DbCategory[] }>().props;

    return (
        <>
            {/* Mobile overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Desktop overlay to collapse when clicking outside */}
            {!desktopCollapsed && (
                <div
                    className="fixed inset-0 z-30 hidden lg:block"
                    onClick={onToggleDesktop}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed top-0 left-0 z-50 h-full w-72 transform overflow-y-auto border-r border-border bg-background transition-all duration-300 ease-in-out',
                    'lg:fixed lg:top-20 lg:z-40 lg:h-[calc(100vh-5rem)] lg:translate-x-0 lg:border-r',
                    desktopCollapsed ? 'lg:w-16' : 'lg:w-60',
                    open ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                {/* Mobile close button */}
                <div className="flex items-center justify-between border-b border-border px-4 py-3 lg:hidden">
                    <span className="text-sm font-semibold">Menu</span>
                    <button onClick={onClose}>
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Mobile nav links */}
                <div className="border-b border-border p-3 lg:hidden">
                    <ul className="space-y-0.5">
                        <li>
                            <Link href="/" className="block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent">Home</Link>
                        </li>
                        <li>
                            <Link href="/products" className="block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent">Shop</Link>
                        </li>
                        <li>
                            <Link href="/about" className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent">About</Link>
                        </li>
                        <li>
                            <Link href="/contact" className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent">Contact</Link>
                        </li>
                    </ul>
                </div>

                <div className={cn('p-3', desktopCollapsed && 'lg:p-2')}>
                    {!desktopCollapsed && (
                        <div className="mb-2 hidden items-center justify-between px-3 lg:flex">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Browse Categories
                            </h3>
                            <button
                                onClick={onToggleDesktop}
                                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                    <ul className="space-y-0.5">
                        {categories.map((cat) => (
                            <CategoryItem key={cat.id} category={cat} desktopCollapsed={desktopCollapsed} onExpand={onToggleDesktop} />
                        ))}
                    </ul>
                </div>
            </aside>
        </>
    );
}
