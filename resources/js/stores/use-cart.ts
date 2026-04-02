import { useSyncExternalStore } from 'react';

export type CartItem = {
    productId: number;
    variantId: number | null;
    quantity: number;
    name: string;
    price: number;
    image: string | null;
    variantLabel: string | null;
    freeShipping: boolean;
    shippingZones: { zone: string; charge: number }[];
};

const CART_KEY = 'cart_items';

function getStoredCart(): CartItem[] {
    try {
        const raw = localStorage.getItem(CART_KEY);

        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveCart(items: CartItem[]) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('cart-changed'));
}

let listeners: (() => void)[] = [];
let snapshot = getStoredCart();

function subscribe(listener: () => void) {
    listeners = [...listeners, listener];

    const onStorage = (e: StorageEvent) => {
        if (e.key === CART_KEY) {
            snapshot = getStoredCart();
            listeners.forEach((l) => l());
        }
    };

    const onCartChanged = () => {
        snapshot = getStoredCart();
        listeners.forEach((l) => l());
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('cart-changed', onCartChanged);

    return () => {
        listeners = listeners.filter((l) => l !== listener);
        window.removeEventListener('storage', onStorage);
        window.removeEventListener('cart-changed', onCartChanged);
    };
}

function getSnapshot() {
    return snapshot;
}

export function addToCart(item: Omit<CartItem, 'quantity'>, quantity = 1) {
    const items = getStoredCart();
    const idx = items.findIndex(
        (i) => i.productId === item.productId && i.variantId === item.variantId,
    );

    if (idx >= 0) {
        items[idx].quantity += quantity;
    } else {
        items.push({ ...item, quantity });
    }

    saveCart(items);
}

export function updateCartQuantity(productId: number, variantId: number | null, quantity: number) {
    let items = getStoredCart();

    if (quantity <= 0) {
        items = items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId),
        );
    } else {
        const idx = items.findIndex(
            (i) => i.productId === productId && i.variantId === variantId,
        );

        if (idx >= 0) {
            items[idx].quantity = quantity;
        }
    }

    saveCart(items);
}

export function removeFromCart(productId: number, variantId: number | null) {
    const items = getStoredCart().filter(
        (i) => !(i.productId === productId && i.variantId === variantId),
    );
    saveCart(items);
}

export function clearCart() {
    saveCart([]);
}

export function getCartItems(): CartItem[] {
    return getStoredCart();
}

export function getCartCount(): number {
    return getStoredCart().reduce((sum, i) => sum + i.quantity, 0);
}

export function useCart(deliveryZone: string = '') {
    const items = useSyncExternalStore(subscribe, getSnapshot, () => []);
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shipping = items.reduce((sum, i) => {
        if (i.freeShipping) {
            return sum;
        }

        if (!deliveryZone || !i.shippingZones?.length) {
            return sum;
        }

        const match = i.shippingZones.find((z) => z.zone === deliveryZone);

        return sum + (match ? match.charge : 0);
    }, 0);

    return { items, totalItems, subtotal, shipping };
}
