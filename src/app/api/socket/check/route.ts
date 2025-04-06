// app/api/socket/check/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const API_KEY = process.env.VISUAL_CROSSING_API_KEY;

// Define thresholds
const TEMP_THRESHOLD = 2; // degrees Celsius

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city');

  try {
    const client = await clientPromise;
    const db = client.db('data');
    const collection = db.collection('cities');

    if (!city) {
      // return all cities if no param
      const cities = await collection.find({}).toArray();
      return NextResponse.json(cities.map((c) => c.city));
    }

    const existing = await collection.findOne({ city });
    if (!existing) {
      return NextResponse.json({ message: 'City not found' }, { status: 404 });
    }

    // Fetch latest weather
    const weatherRes = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(city)}/today?key=${API_KEY}&unitGroup=metric`);
    const weatherData = await weatherRes.json();
    const latestTemp = weatherData?.currentConditions?.temp;
    const latestConditions = weatherData?.currentConditions?.conditions;

    if (latestTemp == null || latestConditions == null) {
      return NextResponse.json({ message: 'Latest weather data not available' }, { status: 500 });
    }

    let tempChange = Math.abs(latestTemp - existing.temp);
    let conditionChange = latestConditions !== existing.conditions;
    if (tempChange >= TEMP_THRESHOLD || conditionChange) {
      await collection.updateOne(
        { city },
        { $set: { temp: latestTemp, conditions: latestConditions, updatedAt: new Date() } }
      );

      return NextResponse.json({
        city,
        changed: true,
        temp: latestTemp,
        conditions: latestConditions,
        prevTemp: existing.temp,
        prevConditions: existing.conditions,
      });
    }

    return NextResponse.json({
      city,
      changed: false,
      temp: latestTemp,
      conditions: latestConditions,
    });

  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}