// app/api/socket/remove/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { city } = body;

    if (!city) {
      return NextResponse.json({ message: 'City is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('data');
    const result = await db.collection('cities').deleteOne({ city });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'City not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'City removed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error removing city:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}