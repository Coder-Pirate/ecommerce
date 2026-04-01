import { Head } from '@inertiajs/react';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import { ShopLayout } from '@/components/ecommerce/shop-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const contactInfo = [
    { icon: MapPin, title: 'Address', detail: '123 Commerce Street, Business City, BC 10001' },
    { icon: Phone, title: 'Phone', detail: '+1 (234) 567-890', href: 'tel:+1234567890' },
    { icon: Mail, title: 'Email', detail: 'support@yourstore.com', href: 'mailto:support@yourstore.com' },
    { icon: Clock, title: 'Working Hours', detail: 'Mon - Fri: 9AM - 6PM, Sat: 10AM - 4PM' },
];

export default function Contact() {
    const [submitted, setSubmitted] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitted(true);
    }

    return (
        <>
            <Head title="Contact Us" />
            <ShopLayout>
                {/* Hero */}
                <div className="mb-10 text-center">
                    <h1 className="mb-3 text-3xl font-bold md:text-4xl">Contact Us</h1>
                    <p className="mx-auto max-w-2xl text-muted-foreground">
                        Have a question, feedback, or need help? We'd love to hear from you. Reach out through any of the channels below or fill out the contact form.
                    </p>
                </div>

                {/* Contact Cards */}
                <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {contactInfo.map((item) => {
                        const Icon = item.icon;
                        const content = (
                            <CardContent className="p-6 text-center">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <h3 className="mb-1 font-semibold">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.detail}</p>
                            </CardContent>
                        );

                        if (item.href) {
                            return (
                                <a key={item.title} href={item.href}>
                                    <Card className="h-full transition-shadow hover:shadow-md">{content}</Card>
                                </a>
                            );
                        }

                        return <Card key={item.title}>{content}</Card>;
                    })}
                </div>

                {/* Form + Map */}
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Contact Form */}
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="mb-4 text-xl font-bold">Send us a Message</h2>
                            {submitted ? (
                                <div className="py-10 text-center">
                                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
                                        <Mail className="h-7 w-7" />
                                    </div>
                                    <h3 className="mb-1 text-lg font-semibold">Message Sent!</h3>
                                    <p className="mb-4 text-sm text-muted-foreground">We'll get back to you within 24 hours.</p>
                                    <Button variant="outline" onClick={() => setSubmitted(false)}>Send Another</Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium">Name</label>
                                            <Input placeholder="Your name" required />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium">Email</label>
                                            <Input type="email" placeholder="you@example.com" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">Subject</label>
                                        <Input placeholder="How can we help?" required />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">Message</label>
                                        <textarea
                                            rows={5}
                                            placeholder="Tell us more..."
                                            required
                                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        />
                                    </div>
                                    <Button type="submit" className="w-full">Send Message</Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>

                    {/* Map Placeholder */}
                    <Card>
                        <CardContent className="flex h-full min-h-[400px] flex-col items-center justify-center p-6">
                            <MapPin className="mb-3 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-1 text-lg font-semibold">Find Us</h3>
                            <p className="mb-4 text-center text-sm text-muted-foreground">
                                123 Commerce Street, Business City, BC 10001
                            </p>
                            <div className="w-full flex-1 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground text-sm">
                                Map placeholder — integrate Google Maps or Leaflet here
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* FAQ teaser */}
                <div className="mt-10 rounded-xl bg-muted/30 p-6 text-center md:p-10">
                    <h2 className="mb-3 text-2xl font-bold">Frequently Asked Questions</h2>
                    <p className="mx-auto mb-6 max-w-xl text-muted-foreground">
                        Find quick answers to common questions about orders, shipping, returns, and more.
                    </p>
                    <div className="mx-auto max-w-2xl space-y-3 text-left">
                        {[
                            { q: 'How long does shipping take?', a: 'Standard shipping takes 3-5 business days. Express shipping is available for 1-2 day delivery.' },
                            { q: 'What is your return policy?', a: 'We offer a 30-day hassle-free return policy on all items in their original condition.' },
                            { q: 'How can I track my order?', a: 'Once your order ships, you\'ll receive a tracking number via email to monitor your delivery.' },
                        ].map((faq) => (
                            <Card key={faq.q}>
                                <CardContent className="p-4">
                                    <h4 className="mb-1 font-medium">{faq.q}</h4>
                                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </ShopLayout>
        </>
    );
}
