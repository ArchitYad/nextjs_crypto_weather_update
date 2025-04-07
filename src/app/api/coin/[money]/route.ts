import { NextRequest, NextResponse } from 'next/server';

// Mapping of currency names to symbols
const currencyMap: Record<string, string> = {
  bitcoin: 'BTC',
  ethereum: 'ETH',
  litecoin: 'LTC',
  solana: 'SOL',
  binancecoin: 'BNB',
  xrp: 'XRP',
  cardano: 'ADA',
  dogecoin: 'DOGE',
  polygon: 'MATIC',
  polkadot: 'DOT',
  tron: 'TRX',
  avalanche: 'AVAX',
  shibainu: 'SHIB',
  chainlink: 'LINK',
  cosmos: 'ATOM'
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ money: string }>}) {
  const { money } = await params;

  console.log('[HISTORICAL API] Requested for:', money);

  if (!money) {
    return NextResponse.json({ error: 'Missing currency parameter' }, { status: 400 });
  }

  // Convert the currency name to its corresponding symbol
  const currencySymbol: string = currencyMap[money];

  console.log(currencySymbol);
  ;
  if (!currencySymbol) {
    return NextResponse.json({ error: `Unsupported currency: ${money}` }, { status: 400 });
  }

  const apiKey = process.env.COIN_DESK_API_KEY; // Get API key from environment variable

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
  }

  try {
    // Construct the URL with query parameters
    const url = `https://data-api.coindesk.com/index/cc/v1/historical/days?market=cadli&instrument=${currencySymbol}-USD&api=${apiKey}&limit=7&aggregate=1&fill=true&apply_mapping=true&response_format=JSON`;

    // Fetch the data from the CoinDesk API
    const res = await fetch(url, { method: 'GET', headers: { "Content-type": "application/json; charset=UTF-8" } });

    if (!res.ok) {
      console.error(`[CoinDesk API] Error ${res.status}: ${await res.text()}`);
      return NextResponse.json({ error: `Failed to fetch historical data: ${res.status}` }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error('[CoinDesk API] Request failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}