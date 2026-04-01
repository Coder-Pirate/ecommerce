<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $order->order_number }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #333; margin: 0; padding: 30px; }
        .header { display: table; width: 100%; margin-bottom: 30px; }
        .header-left { display: table-cell; vertical-align: top; }
        .header-right { display: table-cell; vertical-align: top; text-align: right; }
        h1 { font-size: 24px; margin: 0 0 5px; color: #111; }
        .invoice-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #888; }
        .info-table { display: table; width: 100%; margin-bottom: 25px; }
        .info-block { display: table-cell; vertical-align: top; width: 50%; }
        .info-block h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #888; margin: 0 0 8px; }
        .info-block p { margin: 0 0 3px; font-size: 12px; line-height: 1.5; }
        table.items { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        table.items th { background: #f3f4f6; padding: 8px 10px; text-align: left; font-size: 11px; font-weight: 600; border-bottom: 2px solid #d1d5db; }
        table.items td { padding: 8px 10px; border-bottom: 1px solid #e5e7eb; font-size: 11px; }
        table.items tr:nth-child(even) td { background: #f9fafb; }
        .text-right { text-align: right; }
        .totals { width: 250px; margin-left: auto; }
        .totals table { width: 100%; }
        .totals td { padding: 5px 0; font-size: 12px; }
        .totals .total-row td { border-top: 2px solid #333; font-size: 14px; font-weight: 700; padding-top: 8px; }
        .status { display: inline-block; padding: 3px 10px; border-radius: 10px; font-size: 10px; font-weight: 600; text-transform: capitalize; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-processing { background: #dbeafe; color: #1e40af; }
        .status-shipped { background: #ede9fe; color: #6b21a8; }
        .status-delivered { background: #d1fae5; color: #065f46; }
        .status-cancelled { background: #fee2e2; color: #991b1b; }
        .footer { margin-top: 40px; padding-top: 15px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 10px; color: #888; }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-left">
            <h1>INVOICE</h1>
            <p class="invoice-label">{{ $order->order_number }}</p>
        </div>
        <div class="header-right">
            <p style="font-size: 11px; color: #666;">
                Date: {{ $order->created_at->format('F j, Y') }}<br>
                Status: <span class="status status-{{ $order->status }}">{{ $order->status }}</span>
            </p>
        </div>
    </div>

    <div class="info-table">
        <div class="info-block">
            <h3>Bill To</h3>
            <p><strong>{{ $order->first_name }} {{ $order->last_name }}</strong></p>
            <p>{{ $order->email }}</p>
            @if($order->phone)
                <p>{{ $order->phone }}</p>
            @endif
        </div>
        <div class="info-block">
            <h3>Ship To</h3>
            <p>{{ $order->address }}</p>
            <p>{{ $order->city }}, {{ $order->zip }}</p>
        </div>
    </div>

    <table class="items">
        <thead>
            <tr>
                <th>#</th>
                <th>Product</th>
                <th>Variant</th>
                <th class="text-right">Price</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $i => $item)
            <tr>
                <td>{{ $i + 1 }}</td>
                <td>{{ $item->product_name }}</td>
                <td>{{ $item->variant_label ?? '—' }}</td>
                <td class="text-right">${{ number_format($item->price, 2) }}</td>
                <td class="text-right">{{ $item->quantity }}</td>
                <td class="text-right">${{ number_format($item->total, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals">
        <table>
            <tr>
                <td>Subtotal</td>
                <td class="text-right">${{ number_format($order->subtotal, 2) }}</td>
            </tr>
            <tr>
                <td>Shipping</td>
                <td class="text-right">{{ $order->shipping == 0 ? 'Free' : '$' . number_format($order->shipping, 2) }}</td>
            </tr>
            <tr class="total-row">
                <td>Total</td>
                <td class="text-right">${{ number_format($order->total, 2) }}</td>
            </tr>
        </table>
    </div>

    <div class="footer">
        <p>Thank you for your business! &mdash; Generated on {{ now()->format('F j, Y \a\t g:i A') }}</p>
    </div>
</body>
</html>
