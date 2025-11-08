// utils/geocode.ts
export async function geocodeAddress(address: string) {
  const encoded = encodeURIComponent(address);
  const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`;

  const res = await fetch(url,{
    headers: {
  "User-Agent": "NepaliPool/1.0 (support@nepalipool.com)",
  "Referer": "https://nepalipool.vercel.app",
}
  });
  const data = await res.json();

  if (!data || data.length === 0) return null;

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };
}
