import { NextRequest, NextResponse } from 'next/server';
import { getBudget, createOrUpdateBudget } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const month = request.nextUrl.searchParams.get('month');
    
    if (!month) {
      return NextResponse.json({ error: 'Month parameter is required (format: YYYY-MM)' }, { status: 400 });
    }
    
    const budget = await getBudget(month);
    return NextResponse.json(budget || { month, categories: {} });
  } catch (error) {
    console.error('Error fetching budget:', error);
    return NextResponse.json({ error: 'Failed to fetch budget' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { month, categories } = data;
    
    if (!month || !categories) {
      return NextResponse.json(
        { error: 'Month and categories are required' }, 
        { status: 400 }
      );
    }
    
    const result = await createOrUpdateBudget(month, categories);
    return NextResponse.json({ success: true, upsertedId: result.upsertedId });
  } catch (error) {
    console.error('Error updating budget:', error);
    return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 });
  }
}