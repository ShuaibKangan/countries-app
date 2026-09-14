// lib/api.ts

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// ---------- Types that your frontend components expect ----------

export type CountrySummary = {
  id: number
  name: string
  iso3: string
  regions: { name: string } | null
}

export type CountryDetail = {
  id: number
  name: string
  iso3: string
  surface_area_sq_km_2023: number | null
  regions: { name: string } | null
}

export type GdpRow = {
  year: number
  gdp_usd_billion: number
}

export type PopulationRow = {
  year: number
  population: number
}

// ---------- Shared helper ----------
async function fetchFromSupabase<T>(path: string): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  })

  if (!res.ok) {
    throw new Error(`Supabase request failed with status ${res.status}`)
  }

  return res.json() as Promise<T>
}

// ---------- API Functions with Data Remapping Filters ----------

export async function getCountries(): Promise<CountrySummary[]> {
  const data = await fetchFromSupabase<{ id: number; name: string; iso3: string }[]>(
    'countries?select=id,name,iso3&order=name.asc'
  )
  // Inject a mock region block so your frontend interface won't break
  return data.map(item => ({ ...item, regions: null }))
}

export async function getCountry(id: number): Promise<CountryDetail | null> {
  const list = await fetchFromSupabase<{ id: number; name: string; iso3: string; surface_area_sq_km_2023: number | null }[]>(
    `countries?id=eq.${id}&select=id,name,iso3,surface_area_sq_km_2023`
  )

  if (list.length === 0) return null
  return { ...list[0], regions: null }
}

export async function getGdp(countryId: number): Promise<GdpRow[]> {
  const data = await fetchFromSupabase<{ gdp_2023_usd_billion: number | null }[]>(
    `gdp?id=eq.${countryId}&select=gdp_2023_usd_billion`
  )
  
  if (data.length === 0 || !data[0].gdp_2023_usd_billion) return []
  // Transform your 2023 column layout back into a single clean frontend timeline entry
  return [{ year: 2023, gdp_usd_billion: Number(data[0].gdp_2023_usd_billion) }]
}

export async function getPopulation(countryId: number): Promise<PopulationRow[]> {
  const data = await fetchFromSupabase<{ population_2023: number | null }[]>(
    `population?id=eq.${countryId}&select=population_2023`
  )
  
  if (data.length === 0 || !data[0].population_2023) return []
  // Remap your population_2023 table schema column safely into the expected population variable
  return [{ year: 2023, population: Number(data[0].population_2023) }]
}

export async function getExports(countryId: number): Promise<string[]> {
  return []
}

export async function getIndustries(countryId: number): Promise<string[]> {
  return []
}
