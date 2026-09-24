import db from './database.js';

export function saveSearchAndBusinesses({
  country,
  city,
  businessType,
  limit,
  results,
}) {
  const insertSearch = db.prepare(`
    INSERT INTO searches (
      country,
      city,
      business_type,
      result_limit
    )
    VALUES (?, ?, ?, ?)
  `);

  const insertBusiness = db.prepare(`
    INSERT INTO businesses (
      search_id,
      osm_id,
      name,
      category,
      location,
      phone,
      email,
      website,
      instagram,
      facebook,
      whatsapp,
      rating,
      reviews,
      opening_hours,
      cuisine,
      brand,
      operator,
      description,
      wheelchair,
      payment_methods,
      stars,
      rooms,
      address,
      street,
      suburb,
      city,
      postcode,
      google_maps,
      osm_url,
      latitude,
      longitude,
      digital_presence,
      website_analysis,
      opportunity_score,
      opportunity_level,
      digital_problems,
      recommended_services,
      opportunity_summary,
      source
    )
    VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?
    )
  `);

  const saveTransaction = db.transaction(() => {
    const searchResult = insertSearch.run(
      country,
      city,
      businessType,
      Number(limit)
    );

    const searchId = searchResult.lastInsertRowid;

    for (const business of results) {
      insertBusiness.run(
        searchId,
        business.id ?? null,
        business.name ?? null,
        business.category ?? null,
        business.location ?? null,
        business.phone ?? null,
        business.email ?? null,
        business.website ?? null,
        business.instagram ?? null,
        business.facebook ?? null,
        business.whatsapp ?? null,
        business.rating ?? null,
        business.reviews ?? null,
        business.openingHours ?? null,
        business.cuisine ?? null,
        business.brand ?? null,
        business.operator ?? null,
        business.description ?? null,
        business.wheelchair ?? null,
        business.paymentMethods ?? null,
        business.stars ?? null,
        business.rooms ?? null,
        business.address ?? null,
        business.street ?? null,
        business.suburb ?? null,
        business.city ?? null,
        business.postcode ?? null,
        business.googleMaps ?? null,
        business.osmUrl ?? null,
        business.latitude ?? null,
        business.longitude ?? null,
        JSON.stringify(business.digitalPresence ?? null),
        JSON.stringify(business.websiteAnalysis ?? null),
        business.opportunityScore ?? null,
        business.opportunityLevel ?? null,
        JSON.stringify(business.digitalProblems ?? []),
        JSON.stringify(business.recommendedServices ?? []),
        business.opportunitySummary ?? null,
        business.source ?? null
      );
    }

    return searchId;
  });

  return saveTransaction();
}


// 🔎 Procura uma pesquisa recente igual
export function getCachedSearch({
  country,
  city,
  businessType,
  limit,
}) {
  const cachedSearch = db.prepare(`
    SELECT *
    FROM searches
    WHERE LOWER(TRIM(country)) = LOWER(TRIM(?))
      AND LOWER(TRIM(city)) = LOWER(TRIM(?))
      AND LOWER(TRIM(business_type)) = LOWER(TRIM(?))
      AND result_limit = ?
      AND datetime(created_at) >= datetime('now', '-30 minutes')
    ORDER BY id DESC
    LIMIT 1
  `).get(
    country,
    city,
    businessType,
    Number(limit)
  );

  if (!cachedSearch) {
    return null;
  }

  const businesses = db.prepare(`
    SELECT *
    FROM businesses
    WHERE search_id = ?
    ORDER BY id ASC
  `).all(cachedSearch.id);

  return {
    search: cachedSearch,
    businesses,
  };
}