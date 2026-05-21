import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_API_KEY as string, {
});

export async function GET() {
  try {
    const customers = [];
    for await (const customer of stripe.customers.list({
      limit: 100,
    })) {
      customers.push({
        id: customer.id,
        email: customer.email,
        name: customer.name || customer.email,
        metadata: customer.metadata,
        address: customer.address,
        phone: customer.phone,
      });
    }
    
    return NextResponse.json({
      customers,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}