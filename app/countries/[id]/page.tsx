// app/countries/[id]/page.tsx
import Link from 'next/link'
import {
  getCountry,
  getGdp,
  getPopulation,
  getExports,
  getIndustries,
} from '@/lib/api'
import CountryDetails from '@/components/CountryDetails'

export default async function CountryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params // Next.js 15: params is a Promise
  const countryId = Number(id) // the URL gives us a string; the DB column is a number

  try {
    const country = await getCountry(countryId)

    if (!country) {
      return (
        <main>
          <p>Country not found.</p>
          <Link href="/">← Back to all countries</Link>
        </main>
      )
    }

    const gdp = await getGdp(countryId)
    const population = await getPopulation(countryId)
    const exports = await getExports(countryId)
    const industries = await getIndustries(countryId)

    return (
      <main>
        <Link href="/">← Back to all countries</Link>
        <CountryDetails
          country={country}
          gdp={gdp}
          population={population}
          exports={exports}
          industries={industries}
        />
      </main>
    )
  } catch {
    return <p>Could not load this country. Check your Supabase setup.</p>
  }
}