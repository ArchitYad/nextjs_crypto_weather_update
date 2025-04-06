export async function GET(req: Request, { params }: { params: { money: string } }) {
    const res = await fetch(`https://api.coincap.io/v2/assets/${params.money}`);
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  }  