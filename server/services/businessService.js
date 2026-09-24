const CATEGORY_LABELS = {
  restaurant: 'Restaurante',
  hotel: 'Hotel',
  clinic: 'Clínica',
  hairdresser: 'Cabeleireiro',
  fitness_centre: 'Ginásio',
  school: 'Escola',
  pharmacy: 'Farmácia',
  car_repair: 'Oficina',
};

function firstValue(tags, keys) {
  for (const key of keys) {
    if (tags[key]) {
      const value = String(tags[key]).trim();

      if (value) {
        return value;
      }
    }
  }

  return null;
}

function normalizeUrl(value) {
  if (!value) return null;

  const url = String(value).trim();

  if (!url) return null;

  if (
    url.startsWith('http://') ||
    url.startsWith('https://')
  ) {
    return url;
  }

  return `https://${url}`;
}

function analyzeDigitalPresence({
  website,
  instagram,
  facebook,
  whatsapp,
}) {
  const hasWebsite = Boolean(website);
  const hasInstagram = Boolean(instagram);
  const hasFacebook = Boolean(facebook);
  const hasWhatsapp = Boolean(whatsapp);

  const socialCount = [
    hasInstagram,
    hasFacebook,
    hasWhatsapp,
  ].filter(Boolean).length;

  let level = 'Baixa';

  if (hasWebsite && socialCount >= 2) {
    level = 'Alta';
  } else if (hasWebsite || socialCount >= 1) {
    level = 'Média';
  }

  return {
    hasWebsite,
    hasInstagram,
    hasFacebook,
    hasWhatsapp,
    hasSocialMedia: socialCount > 0,
    socialCount,
    level,
  };
}

export function formatBusinesses(elements, searchedCity) {
  return elements.map((element) => {
    const tags = element.tags || {};

    const lat = element.lat ?? element.center?.lat ?? null;
    const lon = element.lon ?? element.center?.lon ?? null;

    const rawCategory =
      tags.amenity ||
      tags.shop ||
      tags.tourism ||
      tags.leisure ||
      null;

    const locationParts = [
      tags['addr:street'],
      tags['addr:housenumber'],
      tags['addr:suburb'],
      tags['addr:neighbourhood'],
      tags['addr:city'],
      tags['addr:postcode'],
    ].filter(Boolean);

    const website = normalizeUrl(
      firstValue(tags, [
        'website',
        'contact:website',
        'url',
        'contact:url',
      ])
    );

    const phone = firstValue(tags, [
      'phone',
      'contact:phone',
      'mobile',
      'contact:mobile',
    ]);

    const email = firstValue(tags, [
      'email',
      'contact:email',
    ]);

    const instagram = firstValue(tags, [
      'instagram',
      'contact:instagram',
      'contact:instagram:url',
    ]);

    const facebook = firstValue(tags, [
      'facebook',
      'contact:facebook',
      'contact:facebook:url',
    ]);

    const whatsapp = firstValue(tags, [
      'whatsapp',
      'contact:whatsapp',
    ]);

    const ratingValue = firstValue(tags, [
      'rating',
      'stars',
      'rating:average',
    ]);

    const reviewsValue = firstValue(tags, [
      'reviews',
      'review_count',
      'rating:count',
      'stars:count',
    ]);

    const rating = ratingValue
      ? Number.parseFloat(ratingValue)
      : null;

    const reviews = reviewsValue
      ? Number.parseInt(reviewsValue, 10)
      : null;

    const googleMaps =
      lat !== null && lon !== null
        ? `https://www.google.com/maps?q=${lat},${lon}`
        : null;

    const osmUrl =
      `https://www.openstreetmap.org/${element.type}/${element.id}`;

    const digitalPresence = analyzeDigitalPresence({
      website,
      instagram,
      facebook,
      whatsapp,
    });

    return {
      id: element.id,

      name:
        tags.name ||
        tags['name:pt'] ||
        'Empresa sem nome',

      category:
        CATEGORY_LABELS[rawCategory] ||
        rawCategory ||
        'Não informado',

      location:
        locationParts.length > 0
          ? locationParts.join(', ')
          : 'Localização não encontrada',

      phone,
      email,
      website,

      instagram,
      facebook,
      whatsapp,

      digitalPresence,

      rating:
        Number.isFinite(rating)
          ? rating
          : null,

      reviews:
        Number.isFinite(reviews)
          ? reviews
          : null,

      openingHours:
        tags.opening_hours ||
        null,

      cuisine:
        tags.cuisine ||
        null,

      brand:
        tags.brand ||
        null,

      operator:
        tags.operator ||
        null,

      description:
        tags.description ||
        null,

      wheelchair:
        tags.wheelchair ||
        null,

      paymentMethods:
        tags.payment ||
        null,

      stars:
        tags.stars ||
        null,

      rooms:
        tags.rooms ||
        null,

      address:
        tags['addr:housenumber'] ||
        null,

      street:
        tags['addr:street'] ||
        null,

      suburb:
        tags['addr:suburb'] ||
        tags['addr:neighbourhood'] ||
        null,

       city:
      tags['addr:city'] ||
      tags['addr:town'] ||
      tags['addr:municipality'] ||
      tags['is_in:city'] ||
      searchedCity ||
      null,

      postcode:
        tags['addr:postcode'] ||
        null,

      googleMaps,
      osmUrl,

      latitude: lat,
      longitude: lon,

      source: 'OpenStreetMap',
    };
  });
}