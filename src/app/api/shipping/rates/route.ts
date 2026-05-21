import { NextRequest, NextResponse } from 'next/server';

const FALLBACK_RATE = 9.99;
const FREE_THRESHOLD = parseFloat(process.env.FREE_SHIPPING_THRESHOLD || '75');

export type ShippingRate = {
  id: string;
  provider: string;
  service: string;
  price: number;
  estimated_days: string;
};

export async function POST(req: NextRequest) {
  try {
    const { zip, items, subtotal } = await req.json();

    if (!zip || zip.length < 5) {
      return NextResponse.json({ error: 'Valid US ZIP code required' }, { status: 400 });
    }

    // Free shipping threshold
    if (subtotal >= FREE_THRESHOLD) {
      return NextResponse.json({
        rates: [
          {
            id: 'free_standard',
            provider: 'USPS',
            service: 'Free Standard Shipping',
            price: 0,
            estimated_days: '5–7 business days',
          },
        ],
        freeShipping: true,
      });
    }

    const apiKey = process.env.SHIPPO_API_KEY;

    if (!apiKey || apiKey.startsWith('shippo_test_...')) {
      // Return realistic mock rates when Shippo not configured
      return NextResponse.json({ rates: getMockRates(subtotal) });
    }

    const totalWeightOz = items.reduce(
      (sum: number, item: { weight_oz: number; quantity: number }) =>
        sum + (item.weight_oz || 4) * item.quantity,
      0
    );

    const shipmentRes = await fetch('https://api.goshippo.com/shipments/', {
      method: 'POST',
      headers: {
        Authorization: `ShippoToken ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address_from: {
          zip: process.env.SHIPPO_FROM_ZIP || '10001',
          country: 'US',
        },
        address_to: {
          zip,
          country: 'US',
        },
        parcels: [
          {
            length: '6',
            width: '4',
            height: '4',
            distance_unit: 'in',
            weight: totalWeightOz.toString(),
            mass_unit: 'oz',
          },
        ],
        async: false,
      }),
    });

    if (!shipmentRes.ok) {
      console.error('Shippo error:', await shipmentRes.text());
      return NextResponse.json({ rates: getFallbackRates() });
    }

    const shipment = await shipmentRes.json();
    const rates: ShippingRate[] = (shipment.rates || [])
      .slice(0, 3)
      .map((r: any) => ({
        id: r.object_id,
        provider: r.provider,
        service: r.servicelevel?.name || r.provider,
        price: parseFloat(r.amount),
        estimated_days: r.estimated_days
          ? `${r.estimated_days} business day${r.estimated_days !== 1 ? 's' : ''}`
          : '5–7 business days',
      }));

    if (rates.length === 0) {
      return NextResponse.json({ rates: getFallbackRates() });
    }

    return NextResponse.json({ rates });
  } catch (err: any) {
    console.error('Shipping rate error:', err);
    return NextResponse.json({ rates: getFallbackRates() });
  }
}

function getFallbackRates(): ShippingRate[] {
  return [
    {
      id: 'fallback_standard',
      provider: 'USPS',
      service: 'Standard Shipping',
      price: FALLBACK_RATE,
      estimated_days: '5–7 business days',
    },
  ];
}

function getMockRates(subtotal: number): ShippingRate[] {
  return [
    {
      id: 'mock_standard',
      provider: 'USPS',
      service: 'Priority Mail (Standard)',
      price: 7.99,
      estimated_days: '3–5 business days',
    },
    {
      id: 'mock_express',
      provider: 'UPS',
      service: 'UPS Ground (Express)',
      price: 14.99,
      estimated_days: '1–2 business days',
    },
  ];
}
