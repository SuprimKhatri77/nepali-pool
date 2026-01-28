export type CitiesByCountryResponse = {
  error: boolean;
  msg: string;
  data: string[];
};


export async function getAllCitiesByCountry(
  country: string
): Promise<string[]> {
  const res = await fetch("https://countriesnow.space/api/v0.1/countries/cities", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ country }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch cities");
  }

  const result: CitiesByCountryResponse = await res.json();
  return result.data;
}

