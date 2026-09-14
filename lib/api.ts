// lib/api.ts

// The `!` tells TypeScript: "trust me, this value exists."
// These values come from your .env.local file.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// ---------- Types for the data we get back from Supabase ----------

export type Region = {
  id: number
  name: string
}

// The data we need for each country in the list on the home page.
export type CountrySummary = {
  id: number
  name: string
  iso3: string
  regions: Region | null
}

// The full data we need on a country's detail page.
export type CountryDetail = {
  id: number
  name: string
  iso3: string
  surface_area_sq_km_2023: number | null
  regions: Region | null
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
// This is the only place that uses fetch directly.
// T is the type of the JSON we expect back.
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

// ---------- One typed function for each kind of data ----------

export async function getCountries(): Promise<CountrySummary[]> {
  return fetchFromSupabase<CountrySummary[]>(
    'countries?select=id,name,iso3,regions(name)&order=name.asc'
  )
}

export async function getCountry(id: number): Promise<CountryDetail | null> {
  const list = await fetchFromSupabase<CountryDetail[]>(
    `countries?id=eq.${id}&select=id,name,iso3,surface_area_sq_km_2023,regions(name)`
  )

  // PostgREST returns an array. Return the first item, or null if empty.
  if (list.length === 0) {
    return null
  }
  return list[0]
}

export async function getGdp(countryId: number): Promise<GdpRow[]> {
  return fetchFromSupabase<GdpRow[]>(
    `gdp?country_id=eq.${countryId}&select=year,gdp_usd_billion&order=year.asc`
  )
}

export async function getPopulation(countryId: number): Promise<PopulationRow[]> {
  return fetchFromSupabase<PopulationRow[]>(
    `population?country_id=eq.${countryId}&select=year,population&order=year.asc`
  )
}

export async function getExports(countryId: number): Promise<string[]> {
  const rows = await fetchFromSupabase<{ exports: { name: string } }[]>(
    `country_exports?country_id=eq.${countryId}&select=exports(name)`
  )
  return rows.map((row) => row.exports.name)
}

export async function getIndustries(countryId: number): Promise<string[]> {
  const rows = await fetchFromSupabase<{ industries: { name: string } }[]>(
    `country_industries?country_id=eq.${countryId}&select=industries(name)`
  )
  return rows.map((row) => row.industries.name)
}