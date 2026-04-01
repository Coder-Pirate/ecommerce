import { Link, usePage } from '@inertiajs/react';
import { Home, Info, Mail, Menu, Search, ShoppingBag, ShoppingCart, User, X } from 'lucide-react';
import { useState } from 'react';
import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function EcommerceHeader({ onToggleSidebar }: { onToggleSidebar: () => void }) {
    const { auth } = usePage().props;
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 border-b border-border bg-background">
            {/* Top bar */}
            <div className="bg-primary px-4 py-1.5 text-center text-xs text-primary-foreground">
                Free shipping on orders over $50 — Shop now!
            </div>

            {/* Main header */}
            <div className="flex h-14 items-center gap-3 px-4">
                {/* Mobile menu toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 lg:hidden"
                    onClick={onToggleSidebar}
                >
                    <Menu className="h-5 w-5" />
                </Button>

                {/* Logo */}
                <Link href="/" className="flex shrink-0 items-center gap-2">
                    <AppLogo />
                </Link>

                <div className="flex-1" />

                {/* Mobile search toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 lg:hidden"
                    onClick={() => setSearchOpen(!searchOpen)}
                >
                    {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                </Button>

                {/* Right side: nav + search + actions */}
                <div className="hidden items-center gap-2 lg:flex">
                    <nav className="flex items-center gap-5 mr-4">
                        <Link href="/" className="flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary"><Home className="h-4 w-4" />Home</Link>
                        <Link href="/products" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"><ShoppingBag className="h-4 w-4" />Shop</Link>
                        <Link href="/about" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"><Info className="h-4 w-4" />About</Link>
                        <Link href="/contact" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"><Mail className="h-4 w-4" />Contact</Link>
                    </nav>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search products..."
                            className="h-9 pl-9"
                        />
                    </div>
                    <Button variant="ghost" size="icon" className="relative" asChild>
                        <Link href="/cart">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                0
                            </span>
                        </Link>
                    </Button>
                    {auth.user ? (
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/dashboard">
                                <User className="mr-1.5 h-4 w-4" />
                                {auth.user.name}
                            </Link>
                        </Button>
                    ) : (
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/login">Log in</Link>
                            </Button>
                            <Button size="sm" asChild>
                                <Link href="/register">Register</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile search bar */}
            {searchOpen && (
                <div className="border-t px-4 py-2 lg:hidden">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search products..."
                            className="pl-9"
                            autoFocus
                        />
                    </div>
                </div>
            )}
        </header>
    );
}
