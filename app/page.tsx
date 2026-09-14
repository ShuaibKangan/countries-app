// app/page.tsx
import { getCountries } from '@/lib/api'
import type { CountrySummary } from '@/lib/api'
import CountryCard from '@/components/CountryCard'

export default async function HomePage() {
  let countries: CountrySummary[] = []

  try {
    countries = await getCountries()
  } catch {
    return <p>Could not load countries. Check your Supabase setup.</p>
  }

  return (
    <main>
      <h1>Countries</h1>
      <ul>
        {countries.map((country) => (
          <CountryCard key={country.id} country={country} />
        ))}
      </ul>
    </main>
  )
}