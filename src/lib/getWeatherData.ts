// lib/weatherService.ts

export async function fetchWeatherData(cities: string[]) {
    const apiKey = process.env.YOUR_OPENWEATHERMAP_API_KEY;
  
    if (!apiKey) {
      throw new Error("Missing OpenWeather API key");
    }
  
    const weatherData = await Promise.all(
      cities.map(async (city) => {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        return await res.json();
      })
    );
  
    return weatherData;
  }  