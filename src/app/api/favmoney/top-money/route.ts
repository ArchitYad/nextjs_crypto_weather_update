// app/api/favcity/top-cities/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('data');
    const collection = db.collection('favmoney');
    const topCrypto = await collection
      .find({})
      .sort({ count: -1 })
      .limit(3)
      .toArray();

    return NextResponse.json({ topCrypto }, { status: 200 });
  } catch (error) {
    console.error('Error fetching top cities:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}