import { Head } from '@inertiajs/react';
import { Award, Heart, Shield, Truck, Users, Zap } from 'lucide-react';
import { ShopLayout } from '@/components/ecommerce/shop-layout';
import { Card, CardContent } from '@/components/ui/card';

const values = [
    { icon: Heart, title: 'Customer First', description: 'We put our customers at the center of everything we do, ensuring the best shopping experience.' },
    { icon: Shield, title: 'Quality Assured', description: 'Every product is carefully vetted to meet our high standards of quality and durability.' },
    { icon: Truck, title: 'Fast Delivery', description: 'We partner with reliable carriers to get your orders delivered quickly and safely.' },
    { icon: Zap, title: 'Innovation', description: 'We constantly evolve our platform to bring you the latest products and features.' },
];

const stats = [
    { value: '50K+', label: 'Happy Customers' },
    { value: '10K+', label: 'Products' },
    { value: '99%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Support' },
];

const team = [
    { name: 'Sarah Johnson', role: 'CEO & Founder', avatar: '👩‍💼' },
    { name: 'Michael Chen', role: 'CTO', avatar: '👨‍💻' },
    { name: 'Emily Davis', role: 'Head of Design', avatar: '👩‍🎨' },
    { name: 'James Wilson', role: 'Head of Operations', avatar: '👨‍💼' },
];

export default function About() {
    return (
        <>
            <Head title="About Us" />
            <ShopLayout>
                {/* Hero */}
                <div className="mb-10 text-center">
                    <h1 className="mb-3 text-3xl font-bold md:text-4xl">About Us</h1>
                    <p className="mx-auto max-w-2xl text-muted-foreground">
                        We're passionate about bringing you the best products at the best prices. Since our founding, we've been dedicated to making online shopping simple, enjoyable, and accessible for everyone.
                    </p>
                </div>

                {/* Our Story */}
                <div className="mb-12 rounded-xl bg-muted/30 p-6 md:p-10">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="mb-4 text-2xl font-bold">Our Story</h2>
                        <p className="mb-4 text-muted-foreground">
                            Founded in 2020, our store started as a small idea — to create a marketplace where quality meets affordability. What began as a passion project has grown into a trusted destination for thousands of happy customers.
                        </p>
                        <p className="text-muted-foreground">
                            Today, we offer over 10,000 products across multiple categories, from electronics and fashion to home essentials and beyond. Our commitment to quality, fast shipping, and exceptional customer service remains at the core of everything we do.
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {stats.map((stat) => (
                        <Card key={stat.label} className="text-center">
                            <CardContent className="p-6">
                                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Values */}
                <div className="mb-12">
                    <h2 className="mb-6 text-center text-2xl font-bold">Our Values</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {values.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Card key={item.title}>
                                    <CardContent className="p-6 text-center">
                                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="mb-2 font-semibold">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Team */}
                <div className="mb-12">
                    <h2 className="mb-6 text-center text-2xl font-bold">Meet Our Team</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {team.map((member) => (
                            <Card key={member.name}>
                                <CardContent className="p-6 text-center">
                                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-3xl">
                                        {member.avatar}
                                    </div>
                                    <h3 className="font-semibold">{member.name}</h3>
                                    <p className="text-sm text-muted-foreground">{member.role}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Mission */}
                <div className="rounded-xl bg-primary p-6 text-center text-primary-foreground md:p-10">
                    <Users className="mx-auto mb-4 h-10 w-10" />
                    <h2 className="mb-3 text-2xl font-bold">Our Mission</h2>
                    <p className="mx-auto max-w-2xl text-primary-foreground/80">
                        To empower every customer with access to high-quality products, transparent pricing, and an unmatched shopping experience — all backed by a team that truly cares.
                    </p>
                </div>
            </ShopLayout>
        </>
    );
}
