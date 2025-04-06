import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { money, count } = body;

    if (!money || count == null) return NextResponse.json({ message: 'City and count are required' }, { status: 400 });

    const client = await clientPromise;
    const db = client.db('data');
    const collection = db.collection('favmoney');

    const existing = await collection.findOne({ money });
    if (existing) return NextResponse.json({ message: 'City already exists' }, { status: 409 });

    await collection.insertOne({ money, count });
    return NextResponse.json({ message: 'City added to favorites' }, { status: 201 });
  } catch (error) {
    console.error('Error adding city:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}