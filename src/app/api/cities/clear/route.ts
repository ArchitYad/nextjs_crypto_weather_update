import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function DELETE(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('data');
    const collection = db.collection('cities');

    const count = await collection.countDocuments();
    if (count === 0) {
      return NextResponse.json({ message: 'Collection already empty' }, { status: 200 });
    }

    await collection.deleteMany({});
    return NextResponse.json({ message: 'Cities collection cleared' }, { status: 200 });
  } catch (error) {
    console.error('Error clearing cities collection:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}