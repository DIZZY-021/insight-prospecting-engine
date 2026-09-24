const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
];

const CATEGORY_MAP = {
  restaurante: {
    key: 'amenity',
    value: 'restaurant',
  },

  hotel: {
    key: 'tourism',
    value: 'hotel',
  },

  clinica: {
    key: 'amenity',
    value: 'clinic',
  },

  cabeleireiro: {
    key: 'shop',
    value: 'hairdresser',
  },

  loja: {
    key: 'shop',
    value: null,
  },

  ginasio: {
    key: 'leisure',
    value: 'fitness_centre',
  },

  escola: {
    key: 'amenity',
    value: 'school',
  },

  farmacia: {
    key: 'amenity',
    value: 'pharmacy',
  },

  oficina: {
    key: 'shop',
    value: 'car_repair',
  },

  padaria: {
    key: 'shop',
    value: 'bakery',
  },

  supermercado: {
    key: 'shop',
    value: 'supermarket',
  },

  cafe: {
    key: 'amenity',
    value: 'cafe',
  },

  bar: {
    key: 'amenity',
    value: 'bar',
  },

  barbearia: {
    key: 'shop',
    value: 'hairdresser',
  },

  dentista: {
    key: 'amenity',
    value: 'dentist',
  },

  banco: {
    key: 'amenity',
    value: 'bank',
  },

  'posto de combustivel': {
    key: 'amenity',
    value: 'fuel',
  },

  'loja de roupas': {
    key: 'shop',
    value: 'clothes',
  },

  'loja de calcados': {
    key: 'shop',
    value: 'shoes',
  },

  papelaria: {
    key: 'shop',
    value: 'stationery',
  },

  talho: {
    key: 'shop',
    value: 'butcher',
  },

  peixaria: {
    key: 'shop',
    value: 'seafood',
  },

  mercearia: {
    key: 'shop',
    value: 'convenience',
  },

  pastelaria: {
    key: 'shop',
    value: 'pastry',
  },

  gelataria: {
    key: 'shop',
    value: 'ice_cream',
  },

  florista: {
    key: 'shop',
    value: 'florist',
  },

  joalharia: {
    key: 'shop',
    value: 'jewelry',
  },

  relojoaria: {
    key: 'shop',
    value: 'watches',
  },

  livraria: {
    key: 'shop',
    value: 'books',
  },

  'loja de moveis': {
    key: 'shop',
    value: 'furniture',
  },

  'loja de eletrodomesticos': {
    key: 'shop',
    value: 'appliance',
  },

  'loja de eletronica': {
    key: 'shop',
    value: 'electronics',
  },

  'loja de computadores': {
    key: 'shop',
    value: 'computer',
  },

  'loja de celulares': {
    key: 'shop',
    value: 'mobile_phone',
  },

  'loja de materiais de construcao': {
    key: 'shop',
    value: 'trade',
  },

  'loja de ferragens': {
    key: 'shop',
    value: 'hardware',
  },

  'loja de cosmeticos': {
    key: 'shop',
    value: 'beauty',
  },

  'loja de brinquedos': {
    key: 'shop',
    value: 'toys',
  },

  'loja de artigos esportivos': {
    key: 'shop',
    value: 'sports',
  },

  'loja de conveniencia': {
    key: 'shop',
    value: 'convenience',
  },

  optica: {
    key: 'shop',
    value: 'optician',
  },

  veterinario: {
    key: 'amenity',
    value: 'veterinary',
  },

  'pet shop': {
    key: 'shop',
    value: 'pet',
  },

  lavandaria: {
    key: 'shop',
    value: 'laundry',
  },

  'lavagem de carros': {
    key: 'amenity',
    value: 'car_wash',
  },

  pneus: {
    key: 'shop',
    value: 'tyres',
  },

  motocicletas: {
    key: 'shop',
    value: 'motorcycle',
  },

  'aluguer de carros': {
    key: 'shop',
    value: 'car',
  },

  'agencia de viagens': {
    key: 'shop',
    value: 'travel_agency',
  },

  imobiliaria: {
    key: 'office',
    value: 'estate_agent',
  },

  pousada: {
    key: 'tourism',
    value: 'guest_house',
  },

  'restaurante fast food': {
    key: 'amenity',
    value: 'fast_food',
  },

  'empresa de informatica': {
    key: 'office',
    value: 'it',
  },

  'assistencia tecnica': {
    key: 'shop',
    value: 'computer',
  },

  grafica: {
    key: 'shop',
    value: 'copyshop',
  },

  fotografia: {
    key: 'shop',
    value: 'photo',
  },

  estudio: {
    key: 'shop',
    value: 'studio',
  },

  consultorio: {
    key: 'amenity',
    value: 'doctors',
  },

  'escritorio de advocacia': {
    key: 'office',
    value: 'lawyer',
  },

  contabilidade: {
    key: 'office',
    value: 'accountant',
  },

  seguradora: {
    key: 'office',
    value: 'insurance',
  },

  'agencia de publicidade': {
    key: 'office',
    value: 'advertising_agency',
  },

  academia: {
    key: 'leisure',
    value: 'fitness_centre',
  },

  creche: {
    key: 'amenity',
    value: 'kindergarten',
  },

  universidade: {
    key: 'amenity',
    value: 'university',
  },

  'centro de formacao': {
    key: 'amenity',
    value: 'school',
  },

  igreja: {
    key: 'amenity',
    value: 'place_of_worship',
  },

  'salao de festas': {
    key: 'amenity',
    value: 'events_venue',
  },

  'espaco para eventos': {
    key: 'amenity',
    value: 'events_venue',
  },
};

function normalize(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function resolveCategory(businessType) {
  const slug = normalize(businessType);

  return (
    CATEGORY_MAP[slug] || {
      key: 'name',
      value: slug,
    }
  );
}

async function geocodeCity(city, country) {
  const query = new URLSearchParams({
    format: 'json',
    limit: '1',
    q: `${city}, ${country}`,
  });

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?${query}`,
    {
      headers: {
        'User-Agent':
          'InsightProspectingEngine/1.0 (projeto educacional)',
      },
      signal: AbortSignal.timeout(5000),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Nominatim respondeu ${response.status} ao procurar "${city}".`
    );
  }

  const data = await response.json();

  if (!data.length) {
    throw new Error(
      `Cidade "${city}" não foi encontrada.`
    );
  }

  const [
    south,
    north,
    west,
    east,
  ] = data[0].boundingbox.map(Number);

  return {
    south,
    north,
    west,
    east,
  };
}

function buildQuery(
  bbox,
  category,
  limit
) {
  const box =
    `${bbox.south},${bbox.west},${bbox.north},${bbox.east}`;

  const cap =
    Math.max(Number(limit) + 3, Number(limit));

  let filter;

  if (category.key === 'name') {
    filter = `["name"~"${category.value}",i]`;
  } else if (category.value) {
    filter = `["${category.key}"="${category.value}"]`;
  } else {
    filter = `["${category.key}"]`;
  }

  return `
    [out:json][timeout:10];
    (
      nwr${filter}(${box});
    );
    out center tags ${cap};
  `;
}

async function queryEndpoint(
  url,
  query
) {
  const response = await fetch(
    url,
    {
      method: 'POST',
      headers: {
        'Content-Type':
          'application/x-www-form-urlencoded',
        'User-Agent':
          'InsightProspectingEngine/1.0 (projeto educacional)',
      },
      body:
        `data=${encodeURIComponent(query)}`,
      signal:
        AbortSignal.timeout(12000),
    }
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      `Overpass (${url}) respondeu ${response.status}: ${errorText.slice(0, 300)}`
    );
  }

  return response.json();
}

export async function searchBusinesses(
  city,
  businessType,
  limit,
  country
) {
  const startTime =
    Date.now();

  const bbox =
    await geocodeCity(
      city,
      country
    );

  console.log(
    `📍 Cidade encontrada em ${Date.now() - startTime}ms`
  );

  const category =
    resolveCategory(
      businessType
    );

  console.log(
    `🏷️ Categoria: ${businessType} → ${category.key}=${category.value}`
  );

  const query =
    buildQuery(
      bbox,
      category,
      limit
    );

  let lastError = null;

  for (
    const endpoint
    of OVERPASS_ENDPOINTS
  ) {
    const overpassStart =
      Date.now();

    try {
      console.log(
        `🔎 Consultando Overpass: ${endpoint}`
      );

      const data =
        await queryEndpoint(
          endpoint,
          query
        );

      console.log(
        `⚡ Overpass respondeu em ${Date.now() - overpassStart}ms`
      );

      return data.elements
        .slice(
          0,
          Number(limit)
        );
    } catch (error) {
      lastError =
        error;

      console.warn(
        `⚠️ ${error.message}`
      );
    }
  }

  throw lastError;
}