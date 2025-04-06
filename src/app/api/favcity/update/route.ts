// app/api/favcity/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { city, count } = body;

    if (!city || count == null) return NextResponse.json({ message: 'City and count are required' }, { status: 400 });

    const client = await clientPromise;
    const db = client.db('data');
    const collection = db.collection('favcity');

    const existing = await collection.findOne({ city });
    if (!existing) return NextResponse.json({ message: 'City does not exist' }, { status: 404 });

    await collection.updateOne({ city }, { $set: { count } });
    return NextResponse.json({ message: 'City count updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating city:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
