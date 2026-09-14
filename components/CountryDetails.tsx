// components/CountryDetails.tsx
import type { CountryDetail, GdpRow, PopulationRow } from '@/lib/api'

type Props = {
  country: CountryDetail
  gdp: GdpRow[]
  population: PopulationRow[]
  exports: string[]
  industries: string[]
}

export default function CountryDetails({
  country,
  gdp,
  population,
  exports,
  industries,
}: Props) {
  return (
    <article>
      <h1>{country.name}</h1>
      <p>ISO code: {country.iso3}</p>
      <p>Region: {country.regions?.name}</p>
      <p>Surface area: {country.surface_area_sq_km_2023?.toLocaleString()} km²</p>

      <h2>GDP (USD billion)</h2>
      <ul>
        {gdp.map((row) => (
          <li key={row.year}>
            {row.year}: ${row.gdp_usd_billion}
          </li>
        ))}
      </ul>

      <h2>Population</h2>
      <ul>
        {population.map((row) => (
          <li key={row.year}>
            {row.year}: {row.population.toLocaleString()}
          </li>
        ))}
      </ul>

      <h2>Major exports</h2>
      <ul>
        {exports.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>

      <h2>Major industries</h2>
      <ul>
        {industries.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </article>
  )
}