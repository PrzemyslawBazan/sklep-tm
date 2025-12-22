import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import supabase from '@/app/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_API_KEY as string, {
});

export async function POST(request: NextRequest) {
  try {
    const { orderId, customerId, customerStripeId, items, userInfo } = await request.json();
    let stripeCustomerId = customerStripeId;
    console.log('Initial stripeCustomerId:', stripeCustomerId);
    
    if (!stripeCustomerId) {
      console.log('Creating new Stripe customer for:', userInfo.email);
      const stripeCustomer = await stripe.customers.create({
        email: userInfo.email,
        name: userInfo.name,
        metadata: {
          user_id: userInfo.userId,
          order_id: orderId,
        },
      });

      stripeCustomerId = stripeCustomer.id;
      console.log('Created Stripe customer:', stripeCustomerId);

      const { error: updateError } = await supabase
        .from('customers')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', customerId); 

      if (updateError) {
        console.error('Error updating customer with Stripe ID:', updateError);
        throw updateError;
      }
      
      console.log('Updated database with Stripe customer ID');
    }

    console.log('Items:', items);
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'pln',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), 
      },
      quantity: item.quantity,
    }));

    console.log('Creating Stripe session with customer:', stripeCustomerId);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'blik', 'p24'],
      line_items: lineItems,
      customer: stripeCustomerId, // FIXED: was customerStripeId, now stripeCustomerId
      mode: 'payment',
      success_url: `https://sklep-tm.vercel.app//success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://sklep-tm.vercel.app/checkout`,
      metadata: {
        orderId,
      },
      invoice_creation: {
        enabled: true,
      },
    });

    console.log('Stripe session created successfully:', session.id);
    return NextResponse.json({ sessionUrl: session.url });
  } catch (error) {
    console.error('Stripe session error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}