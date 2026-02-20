import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import supabase from '@/app/lib/supabase';

import Stripe from 'stripe';
import { ok } from 'assert';

const stripe = new Stripe(process.env.STRIPE_API_KEY as string, {
});

export async function POST(request: NextRequest) {
    const { sessionId, customerEmail } = await request.json();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["invoice"],
    });
    if (session.invoice) {
        const invoiceId = typeof session.invoice === "string"
        ? session.invoice
        : session.invoice.id;

        const invoice = await stripe.invoices.retrieve(invoiceId as string);
        const invoicePdf = invoice.invoice_pdf;
        
        const response = await fetch(invoicePdf as string);
        const arrayBuffer = await response.arrayBuffer();

        const buffer = Buffer.from(arrayBuffer)
        const FormData = require('form-data');
        const form = new FormData();
        form.append('sessionId', sessionId);
        form.append('customerEmail', customerEmail);
        form.append('file', buffer, {
        filename: `invoice-${sessionId}.pdf`,
        contentType: 'application/pdf',
        });
    const resp = await axios.post(
  "",
  form,
  {
    headers: {
      ...form.getHeaders(), 
      'User-Agent': 'ShopApp/1.0',
    },
    timeout: 10000,
    maxRedirects: 0,
  }
);

         return NextResponse.json({
      success: true,
      data: resp.data,
      timestamp: new Date().toISOString(),
    });
    }
}