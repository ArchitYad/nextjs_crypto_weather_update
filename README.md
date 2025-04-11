This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# About Weather Crypto Nexus
![homepage](https://github.com/user-attachments/assets/226cf2c2-f204-44aa-b3f2-f7dd16cadab0)
You have to Login first and it is using Google OAuth 2.0 api.
![Screenshot 2025-04-06 212508](https://github.com/user-attachments/assets/bed6b0ec-b0e4-4d39-b471-3cf301ff0e49)
Having a Dashboard Page with Weather Analysics and Crypto Currency Analysis Page With News Data of Crypto Currency
This dashboard page displays the weather data for New York, London, and Tokyo, showing their temperature, humidity, and condition by fetching data from the OpenWeatherMap API. It also shows cryptocurrency prices for Bitcoin, Ethereum, and Cardano, sourced from the CoinCap API. Additionally, the page displays the latest five cryptocurrency news articles from NewsData.io. Since the cities, coins, and news sources are fixed and do not change often, we use Static Site Generation (SSG). This means the page is built once during build time next build and served as static HTML to users for fast loading.

In Next.js 15, static pages are pages that are generated at build time and remain the same until a new build is triggered. Static Site Generation (SSG) is the process where Next.js pre-renders pages at build time, producing fast, SEO-optimized pages. SSG is the default behavior in Next.js 15 for server components that do not have dynamic fetching. This approach ensures that the dashboard page is fast, efficient, and reliable without needing to re-render on each request.
![Screenshot 2025-04-06 211716](https://github.com/user-attachments/assets/a8ebe1d3-51dc-4df0-a39d-9128ee623dad)
Then on /citys route page by clicking on city weather button here we have Search Bar for City Search and the Top 3 Favourite Cities mark by User.
![Screenshot 2025-04-06 211833](https://github.com/user-attachments/assets/49a0240d-ebe5-4124-bc20-1c90243629cc)
The Top 3 Favourite Cities are coming from MongoDB Database and the count comes when you click on favourite button in /citys/london as example route.
Only one showing because at time of creation i only used it.
Coming to /citys/london example at this route.
This page simulates SSR-like functionality by presenting detailed weather information in a dynamic layout. It first displays the current weather fetched from the Visual Crossing API, showing temperature and condition prominently. This data is stored in MongoDB, and the system polls the API every hour to fetch updated values. Using Redux state management, the page compares the newly fetched temperature and condition with the stored ones. If any changes are detected, it triggers a notification for the user, ensuring that updates are noticed in real time. A "Favorite" button is also available, allowing users to bookmark cities for quicker access.
The page also displays 7-day forecast weather data in card format, fetched from the Open-Meteo API. Additionally, it showcases historical weather data from the past 30 days using beautiful graphs rendered with Recharts. This combination provides users with a complete view of both future forecasts and past weather trends.
Although the page feels highly dynamic, it follows SSR (Server-Side Rendering) principles of Next.js, where data is fetched and rendered on the server at request time. In Next.js 15, SSR means that every time a user requests the page, the server generates it fresh with the latest data, unlike SSG (Static Site Generation) where the page is built once during build time and served statically. This approach ensures the weather dashboard is always current and highly interactive.
This page uses a dynamic route where the city name is passed as a parameter, allowing the same layout to work for multiple cities without duplicating the page. Based on the dynamic city name in the URL, the page fetches and renders city-specific weather information automatically.
![Screenshot 2025-04-06 211911](https://github.com/user-attachments/assets/a97792a6-89b4-4174-b268-cc92d5579806)
![Screenshot 2025-04-06 211923](https://github.com/user-attachments/assets/8e6db977-9b40-43e9-8205-9e474572d36a)
Then Coming to /cryptos route page by clicking on crypto button and we have Search Bar for Crypto Search and the Top 3 Favourite Currency mark by User.
![Screenshot 2025-04-06 211939](https://github.com/user-attachments/assets/fb59963c-9d6c-48f2-9885-c2c2e5347242)
The Top 3 Favourite Currency are coming from MongoDB Database and the count comes when you click on favourite button in /cryptos/bitcoin as example route.
Only one showing because at time of creation i only used it.
Coming to /cryptos/bitcoin example at this route.
In this section of the project, we have used a WebSocket connection to establish a live, two-way communication channel with the Binance API. Through this WebSocket, we receive real-time cryptocurrency price updates without needing to refresh or re-fetch data manually. The incoming live prices are continuously compared against the previously stored prices using Redux state management. Whenever a change in the cryptocurrency price is detected, we generate a real-time notification to immediately alert the user about the price fluctuation. This enhances the user experience by making the dashboard highly responsive and interactive. Additionally, we provide a "Favorite" button feature, allowing users to mark specific cryptocurrencies they are interested in, making it easier for them to track their preferred assets directly from the dashboard.
Apart from live data, we are also simulating historical data fetching using Server-Side Rendering (SSR). We pull 7 days' worth of historical cryptocurrency price data from the CoinDesk API. This historical data is presented in both tabular format and graphical form using Recharts, giving users a clear visual and detailed view of past market trends. The tabular data provides exact values, while the charts help users quickly understand price movements over time.
WebSocket technology plays a crucial role here by maintaining an open, persistent connection between the client and the server. Unlike traditional HTTP requests that involve repeatedly polling the server, WebSockets allow the server to push updates instantly to the client as soon as any new data becomes available. This makes WebSocket ideal for applications like a live cryptocurrency tracker, where data freshness and real-time responsiveness are critical.
Meanwhile, Server-Side Rendering (SSR) in Next.js 15 enables us to fetch and render the historical data on the server during each page request. This ensures that the user always receives the latest and most accurate information when they access the page. SSR improves not only data freshness but also SEO performance and initial page load speed, because the server sends a fully rendered page to the browser. Together, WebSocket and SSR allow us to build a dashboard that is both dynamic (real-time updates without reloads) and reliable (accurate historical data at load time), providing a seamless, modern user experience.
![Screenshot 2025-04-06 212005](https://github.com/user-attachments/assets/ea4c9575-852f-4b84-b8bf-46f6f04fc7d3)
Notification
![Screenshot 2025-04-06 212020](https://github.com/user-attachments/assets/8248f08b-de86-4832-8bb0-a15fbc44af73)
# Challenges
Throughout the development of this project, we encountered several interesting challenges that helped us deepen our understanding of building production-grade applications with Next.js 15 and modern web technologies.
One of the first challenges was implementing Google OAuth login and providing authentication across all pages of the project. We needed a system where the user could sign in using Google and their session could persist seamlessly across both client and server-side rendered pages. This required careful integration of NextAuth.js for managing authentication and setting up token refresh mechanisms to prevent users from getting logged out automatically after their token expiry. Handling token refresh was essential for maintaining a smooth and uninterrupted user experience, especially since we have real-time data updates and actions that require a valid session.
Another challenge was API sourcing and handling. Finding reliable and free APIs for weather, cryptocurrency, and news data took considerable effort because many APIs have strict rate limits or require payment for higher tiers. We carefully selected APIs like OpenWeatherMap, Visual Crossing, CoinCap, CoinDesk, and NewsData.io after evaluating their stability, data quality, and free tier limits. Proper error handling, retries, and fallback mechanisms had to be implemented to ensure that if any API failed temporarily, it wouldn't crash the dashboard.
When designing the dashboard page, our goal was to simulate Static Site Generation (SSG) to fetch fixed data like weather, crypto prices, and news at build time. This approach helped in optimizing the load time and making the page super fast, since all content was pre-rendered and cached. However, for dynamic pages like the city weather page, we wanted the current weather to feel live and updated. To achieve this, we used API polling every 1 hour to check for changes in temperature and condition, even though the page itself was statically built.
Building the notification logic also posed a challenge. We stored the current weather data in MongoDB and compared the polled data against the saved state in Redux. Based on any change detected, such as temperature rise or fall, we would trigger real-time notifications to the user, making the application more interactive. The addition of a "Favorite" button UI also had to be carefully thought out to make it intuitive and responsive, enhancing user personalization.
On the cryptocurrency page, setting up WebSocket connections to the Binance API to receive live price updates was crucial. Managing Redux state for comparing the previous and new live prices, and sending instant notifications for price changes, made the application highly dynamic. Additionally, we also needed to simulate historical data fetching using SSR from CoinDesk API, and render it in tabular and graphical formats using Recharts, offering users both a detailed and visual representation of market trends.
A significant part of the complexity arose from making both city weather pages and crypto pages as SSR, ensuring they fetch fresh data at each request while maintaining SEO friendliness and fast loading times.
Further challenges came while resolving build-time bugs due to Next.js 15’s new changes. Updates like the separation of server and client components, changes in handling dynamic routes, and stricter data fetching rules caused some regressions. We had to carefully debug issues such as improper hydration, missing environment variables during build, and dynamic imports failing on the server side. These bugs taught us how important it is to properly align client and server-side logic according to Next.js best practices.
Finally, deploying the project was also an important step. We needed to set environment variables correctly, handle CORS issues for WebSocket connections, and ensure the app was optimized for production, considering build sizes, server responses, and external API reliability.
In the end, each challenge helped us build a stronger, scalable, and performance-optimized application while giving us real-world experience on how to manage authentication, real-time data, dynamic rendering, notifications, state management, and smooth deployment in a modern Next.js 15 environment.
# Testing
During the development phase, we consistently performed unit testing using Postman and direct webpage testing to ensure the reliability and correctness of each module. For the dashboard page, we tested the weather API endpoints, crypto data fetching, and news data responses separately on Postman to verify the shape and quality of the data before integrating it into the UI. This helped us quickly catch issues like unexpected API responses, empty datasets, or authentication errors. For the login system, we thoroughly tested the Google OAuth flow on Postman by simulating authentication requests, verifying token generation, refreshing mechanisms, and checking secured routes access before moving onto full UI testing across pages to validate protected sessions. On the city weather page, we tested the current weather API, forecast API, and MongoDB storage operations independently, ensuring that the data was fetched, stored, and compared correctly before being displayed on the frontend. We used Postman to send mock polling requests and validate the notification logic as well. For the crypto page, we tested the WebSocket connection stability using local server mockups and verified live price updates manually on the webpage. Additionally, we validated historical data fetching from CoinDesk APIs on Postman to ensure accurate graph and table representations. Regular webpage testing was done to check how the actual UI responds to changes, to verify notifications, favorite button actions, and overall state management. This combined approach of Postman and browser testing helped maintain a robust, bug-free development cycle, ensuring that all functionalities were well-tested before moving into production.
Websocket Test
![image](https://github.com/user-attachments/assets/47a8303f-a0b8-46e7-a1db-6eb351ae2402)
API Test
![image](https://github.com/user-attachments/assets/3c1100cc-167f-4c05-9a34-a37fd26db0d6)

