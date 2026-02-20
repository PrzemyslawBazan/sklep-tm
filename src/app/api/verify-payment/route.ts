import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import supabase from '@/app/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_API_KEY as string, {
});


export async function POST(request: NextRequest) {
  const { sessionId } = await request.json();
  console.log('Processing session:', sessionId);
  
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid') {
      const { orderId, customerId } = session.metadata!;
      
      console.log('Payment successful for order:', orderId);
        const paid_at = new Date().toLocaleString("sv-SE", {
      timeZone: "Europe/Warsaw"
    });
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          stripe_payment_intent_id: session.payment_intent as string,
          stripe_customer_id: session.customer as string,
          status: 'completed',
          paid_at: paid_at,
        })
        .eq('id', orderId)
        .select()
        .single();
      if (orderError) {
        console.error('Error updating order:', orderError);
        return NextResponse.json({ 
          success: false, 
          error: "Failed to update order status",
        }, { status: 500 });
      }

      if (session.customer && customerId) {
        const { error: customerError } = await supabase
          .from('customers')
          .update({
            stripe_customer_id: session.customer as string,
          })
          .eq('id', customerId);

        if (customerError) {
          console.error('Error updating customer:', customerError);
        }
      }

      // Get complete order data with relationships
      const { data: completeOrder, error: fetchError } = await supabase
        .from('orders')
        .select(`
          *,
          customers (
            id,
            company_name,
            email,
            contact_first_name,
            contact_last_name,
            contact_phone,
            nip,
            addresses (
              street,
              city,
              postal_code,
              country
            )
          ),
          order_items (
            id,
            name,
            price,
            quantity,
            note,
            services (
              name,
              category,
              description
            )
          )
        `)
        .eq('id', orderId)
        .single();

      if (fetchError) {
        console.error('Error fetching complete order:', fetchError);
        return NextResponse.json({ 
          success: true, 
          order: orderData,
        });
      }

      return NextResponse.json({ 
        success: true, 
        order: completeOrder,
      });
    } else {
      console.log('Payment not completed. Status:', session.payment_status);
      return NextResponse.json({ 
        success: false, 
        error: "Payment not completed",
        paymentStatus: session.payment_status,
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ 
      success: false, 
      error: "Verification failed",
    }, { status: 500 }); // Fixed typo: was 400, should be 500 for server errors
  }
}