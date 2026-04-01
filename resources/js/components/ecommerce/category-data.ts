import {
    Smartphone,
    Shirt,
    Sofa,
    Sparkles,
    Dumbbell,
    BookOpen,
    Gamepad2,
    ShoppingBasket,
    type LucideIcon,
} from 'lucide-react';

export type Subcategory = {
    name: string;
    href: string;
};

export type Category = {
    name: string;
    icon: LucideIcon;
    href: string;
    subcategories: Subcategory[];
};

export const categories: Category[] = [
    {
        name: 'Electronics',
        icon: Smartphone,
        href: '#',
        subcategories: [
            { name: 'Smartphones', href: '#' },
            { name: 'Laptops', href: '#' },
            { name: 'Tablets', href: '#' },
            { name: 'Headphones', href: '#' },
            { name: 'Cameras', href: '#' },
        ],
    },
    {
        name: 'Fashion',
        icon: Shirt,
        href: '#',
        subcategories: [
            { name: "Men's Clothing", href: '#' },
            { name: "Women's Clothing", href: '#' },
            { name: "Kids' Wear", href: '#' },
            { name: 'Shoes', href: '#' },
            { name: 'Accessories', href: '#' },
        ],
    },
    {
        name: 'Home & Living',
        icon: Sofa,
        href: '#',
        subcategories: [
            { name: 'Furniture', href: '#' },
            { name: 'Decor', href: '#' },
            { name: 'Kitchen', href: '#' },
            { name: 'Bedding', href: '#' },
            { name: 'Lighting', href: '#' },
        ],
    },
    {
        name: 'Beauty & Health',
        icon: Sparkles,
        href: '#',
        subcategories: [
            { name: 'Skincare', href: '#' },
            { name: 'Makeup', href: '#' },
            { name: 'Haircare', href: '#' },
            { name: 'Supplements', href: '#' },
            { name: 'Personal Care', href: '#' },
        ],
    },
    {
        name: 'Sports & Outdoors',
        icon: Dumbbell,
        href: '#',
        subcategories: [
            { name: 'Fitness Equipment', href: '#' },
            { name: 'Sportswear', href: '#' },
            { name: 'Camping', href: '#' },
            { name: 'Cycling', href: '#' },
            { name: 'Swimming', href: '#' },
        ],
    },
    {
        name: 'Books & Stationery',
        icon: BookOpen,
        href: '#',
        subcategories: [
            { name: 'Fiction', href: '#' },
            { name: 'Non-Fiction', href: '#' },
            { name: 'Notebooks', href: '#' },
            { name: 'Art Supplies', href: '#' },
            { name: 'Office Supplies', href: '#' },
        ],
    },
    {
        name: 'Toys & Games',
        icon: Gamepad2,
        href: '#',
        subcategories: [
            { name: 'Action Figures', href: '#' },
            { name: 'Board Games', href: '#' },
            { name: 'Puzzles', href: '#' },
            { name: 'Educational Toys', href: '#' },
            { name: 'Dolls', href: '#' },
        ],
    },
    {
        name: 'Groceries',
        icon: ShoppingBasket,
        href: '#',
        subcategories: [
            { name: 'Fresh Produce', href: '#' },
            { name: 'Dairy', href: '#' },
            { name: 'Snacks', href: '#' },
            { name: 'Beverages', href: '#' },
            { name: 'Pantry', href: '#' },
        ],
    },
];
