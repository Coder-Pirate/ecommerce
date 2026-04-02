import { Link, usePage } from '@inertiajs/react';
import { BookOpen, ClipboardList, CreditCard, FileText, FolderGit2, LayoutGrid, Shield, Users, UserCheck, Tag, Layers, Package } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import type { UserRole } from '@/types/auth';

function getNavItems(role: UserRole): NavItem[] {
    switch (role) {
        case 'admin':
            return [
                { title: 'Dashboard', href: '/admin/dashboard', icon: Shield },
                { title: 'Manage Users', href: '/admin/users', icon: Users },
                { title: 'Categories', href: '/admin/categories', icon: Tag },
                { title: 'Sub Categories', href: '/admin/sub-categories', icon: Layers },
                { title: 'Products', href: '/admin/products', icon: Package },
                { title: 'Orders', href: '/admin/orders', icon: ClipboardList },
                { title: 'Landing Pages', href: '/admin/landing-pages', icon: FileText },
                { title: 'Payment Methods', href: '/admin/payment-methods', icon: CreditCard },
            ];
        case 'manager':
            return [
                { title: 'Dashboard', href: '/manager/dashboard', icon: UserCheck },
            ];
        default:
            return [
                { title: 'Dashboard', href: '/user/dashboard', icon: LayoutGrid },
            ];
    }
}

function getDashboardHref(role: UserRole): string {
    switch (role) {
        case 'admin':
            return '/admin/dashboard';
        case 'manager':
            return '/manager/dashboard';
        default:
            return '/user/dashboard';
    }
}

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const role = (auth.user?.role as UserRole) || 'user';
    const mainNavItems = getNavItems(role);
    const dashboardHref = getDashboardHref(role);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardHref} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
