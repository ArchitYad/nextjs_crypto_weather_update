// app/api/socket/add/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const API_KEY = process.env.VISUAL_CROSSING_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { city } = body;

    if (!city) return NextResponse.json({ message: 'City is required' }, { status: 400 });

    const client = await clientPromise;
    const db = client.db('data');
    const collection = db.collection('cities');

    const existing = await collection.findOne({ city });
    if (existing) return NextResponse.json({ message: 'City already exists' }, { status: 409 });

    // Fetch current weather
    const weatherRes = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(city)}/today?key=${API_KEY}&unitGroup=metric`);
    const weatherData = await weatherRes.json();

    const temp = weatherData?.currentConditions?.temp;
    const conditions = weatherData?.currentConditions?.conditions;

    if (temp == null || conditions == null) {
      return NextResponse.json({ message: 'Weather data not available' }, { status: 500 });
    }

    await collection.insertOne({
      city,
      temp,
      conditions,
      updatedAt: new Date(),
    });

    return NextResponse.json({ message: 'City and weather added successfully' }, { status: 201 });

  } catch (error) {
    console.error('Error adding city:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}