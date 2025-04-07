import CryptoPageClient from './CryptoPageClient';

interface Props {
  params: Promise<{ money?: string | string[] }>;
}

export default async function CryptoPage({ params }: Props) {
  const { money } = await params;
  const currency = Array.isArray(money) ? money[0] : money || 'bitcoin';

  console.log(`[CryptoPage] Fetching data for: ${currency}`);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/coin/${currency}`,
      { cache: 'no-store' }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[CryptoPage] API Error ${res.status}: ${errorText}`);
      throw new Error(`API responded with ${res.status}`);
    }

    const data = await res.json();
    return <CryptoPageClient money={currency} historicalData={data?.data?.Data || []} />;
  } catch (err) {
    console.error('[CryptoPage] Failed to fetch data:', err);
    return null;
  }
}