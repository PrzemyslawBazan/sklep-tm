import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_API_KEY as string, {
});

export async function GET() {
  try {
    const customers = await stripe.customers.list({ limit: 300 });
    
    return NextResponse.json({
      customers: customers.data.map(c => ({
        id: c.id,
        email: c.email,
        name: c.name || c.email,
        metadata: c.metadata,
        address: c.address,
        phone: c.phone,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}