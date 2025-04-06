import CryptoPageClient from './CryptoPageClient';

interface Props {
  params: { money?: string | string[] };
}

export default async function CryptoPage({ params }: Props) {
  const money = Array.isArray(params.money) ? params.money[0] : params.money || 'bitcoin'; 
  
  console.log(`[CryptoPage] Fetching data for: ${money}`);

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/coin/${money}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`[CryptoPage] API Error ${res.status}: ${await res.text()}`);
      throw new Error(`API responded with ${res.status}`);
    }

    const data = await res.json();
    return <CryptoPageClient money={money} historicalData={data?.data?.Data || []} />;
  } catch (err) {
    console.error('[CryptoPage] Failed to fetch data:', err);
    return <CryptoPageClient money={money} historicalData={[]} />;
  }
}