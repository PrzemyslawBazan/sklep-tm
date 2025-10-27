import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import supabase from '@/app/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { order, timestamp, source } = await request.json();

    if (!order || typeof order !== 'object') {
      return NextResponse.json({ message: 'Invalid order data' }, { status: 400 });
    }

    const orderId = order.id;
    if (!orderId) {
      return NextResponse.json({ message: 'Missing order_id' }, { status: 400 });
    }

    const { data: existing, error: fetchError } = await supabase
      .from('automation_triggers')
      .select('order_id')
      .eq('order_id', orderId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking for existing trigger:', fetchError);
      return NextResponse.json({ message: 'Failed to check existing order' }, { status: 500 });
    }

    if (existing) {
      console.log(`Order ${orderId} already triggered. Skipping.`);
      return NextResponse.json({ message: 'Already launched' }, { status: 200 });
    }

    const { error: insertError } = await supabase
      .from('automation_triggers')
      .insert([{ order_id: orderId, is_launched: true }]);

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ message: 'Insert failed' }, { status: 500 });
    }

    const response = await axios.post(
      process.env.N8N_WEBHOOK_URL as string,
      { timestamp, source, order },
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'ShopApp/1.0',
        },
        timeout: 10000,
        maxRedirects: 0,
      }
    );

    return NextResponse.json({
      success: true,
      data: response.data,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('N8N webhook error:', {
      message: error.message,
      code: error.code,
      response: error.response?.data || null,
    });

    if (error.code === 'ECONNABORTED') {
      return NextResponse.json({ message: 'N8N service timeout' }, { status: 504 });
    }

    if (error.response?.status === 401) {
      return NextResponse.json({ message: 'Authentication failed' }, { status: 401 });
    }

    return NextResponse.json({
      message: 'Failed to process order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }, { status: 500 });
  }
}

