// app/api/stripe/customers/[customerId]/route.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_API_KEY as string, {
});

export async function GET(
  request: Request,
  context: { params: Promise<{ customerId: string }> }
) {
  try {
    // Await the params object
    const { customerId } = await context.params;
    
    console.log('Fetching customer:', customerId); // Debug log
    
    // Retrieve the customer from Stripe
    const customer = await stripe.customers.retrieve(customerId);
    const taxIds = await stripe.customers.listTaxIds(customerId);
    console.log("FETCHING \n")
    console.log(taxIds)
    console.log(taxIds.data[0].value)
    // Check if customer was deleted
    if ('deleted' in customer && customer.deleted) {
      return NextResponse.json(
        { error: 'Customer not found or has been deleted' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name || customer.email,
        metadata: customer.metadata,
        address: customer.address,
        phone: customer.phone,
        created: customer.created,
        description: customer.description,
        nip: taxIds.data[0].value
      },
    });
  } catch (error: any) {
    console.error('Stripe API Error:', error); // Debug log
    
    // Handle specific Stripe errors
    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json(
        { error: 'Invalid customer ID' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
