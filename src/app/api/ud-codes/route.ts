import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/app/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const { name } = await request.json();

        if (!name?.trim()) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('ud_codes')
            .insert({ name: name.trim() })
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error); 
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data, { status: 201 });
    } catch (err) {
        console.error('Unexpected error:', err);
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}