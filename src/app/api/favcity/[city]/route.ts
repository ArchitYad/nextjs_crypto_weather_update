import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(req: NextRequest, { params }: { params: Promise<{ city: string }> }) {
  try {
    const { city } =  await params;

    const client = await clientPromise;
    const db = client.db('data');
    const collection = db.collection('favcity');

    const existing = await collection.findOne({ city });
    if (existing) {
      return NextResponse.json({ exists: true, count: existing.count }, { status: 200 });
    } else {
      return NextResponse.json({ exists: false }, { status: 200 });
    }
  } catch (error) {
    console.error('Error checking city:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}