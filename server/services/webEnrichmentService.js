function cleanText(value) {
  if (!value) return null;

  const text = String(value).trim();

  return text.length > 0 ? text : null;
}

function normalizeUrl(url) {
  if (!url) return null;

  let value = String(url).trim();

  if (!value) return null;

  value = value.replace(/[),.;]+$/g, '');

  if (
    value.startsWith('http://') ||
    value.startsWith('https://')
  ) {
    return value;
  }

  return `https://${value}`;
}

function extractEmails(html) {
  const matches = html.match(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  );

  if (!matches) return [];

  return [
    ...new Set(
      matches.map((email) => email.toLowerCase())
    ),
  ];
}

function extractPhones(html) {
  const matches = html.match(
    /(?:\+?\d[\d\s().-]{7,}\d)/g
  );

  if (!matches) return [];

  return [
    ...new Set(
      matches
        .map((phone) => phone.trim())
        .filter(
          (phone) =>
            phone.replace(/\D/g, '').length >= 8
        )
    ),
  ];
}

function extractSocialLinks(html) {
  const links = {
    instagram: null,
    facebook: null,
    whatsapp: null,
  };

  const hrefRegex =
    /href=["']([^"']+)["']/gi;

  let match;

  while (
    (match = hrefRegex.exec(html)) !== null
  ) {
    const url = match[1];

    if (!url) continue;

    const lowerUrl =
      url.toLowerCase();

    if (
      !links.instagram &&
      lowerUrl.includes('instagram.com')
    ) {
      links.instagram = url;
    }

    if (
      !links.facebook &&
      lowerUrl.includes('facebook.com')
    ) {
      links.facebook = url;
    }

    if (
      !links.whatsapp &&
      (
        lowerUrl.includes('wa.me') ||
        lowerUrl.includes('whatsapp.com')
      )
    ) {
      links.whatsapp = url;
    }
  }

  return links;
}

function decodeHtmlEntities(text) {
  return String(text)
    .replace(/&amp;/gi, '&')
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function cleanSearchUrl(url) {
  if (!url) return null;

  const decoded =
    decodeHtmlEntities(url);

  try {
    const parsed =
      new URL(decoded);

    if (
      parsed.hostname
        .toLowerCase()
        .includes('duckduckgo.com')
    ) {
      const redirect =
        parsed.searchParams.get('uddg');

      if (redirect) {
        return decodeURIComponent(
          redirect
        );
      }
    }

    return parsed.href;
  } catch {
    return null;
  }
}

function normalizeName(name) {
  return String(name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(
      /\b(ltd|lda|limitada|sa|s\.a\.|eirl|ep)\b/gi,
      ''
    )
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getImportantWords(name) {
  const normalized =
    normalizeName(name);

  const ignoredWords = new Set([
    'lda',
    'ltd',
    'limitada',
    'sa',
    's',
    'a',
    'ep',
    'empresa',
    'companhia',
    'company',
    'grupo',
    'group',
    'banco',
    'bank',
  ]);

  return normalized
    .split(/\s+/)
    .filter(
      (word) =>
        word.length >= 3 &&
        !ignoredWords.has(word)
    );
}

function getDomain(url) {
  try {
    return new URL(url)
      .hostname
      .toLowerCase()
      .replace(/^www\./, '');
  } catch {
    return '';
  }
}

function isSocialUrl(url) {
  if (!url) return false;

  const lower =
    url.toLowerCase();

  return (
    lower.includes('instagram.com') ||
    lower.includes('facebook.com') ||
    lower.includes('wa.me') ||
    lower.includes('whatsapp.com') ||
    lower.includes('linkedin.com') ||
    lower.includes('youtube.com')
  );
}

function isExcludedDomain(url) {
  if (!url) return true;

  try {
    const hostname =
      new URL(url)
        .hostname
        .toLowerCase()
        .replace(/^www\./, '');

    const excludedDomains = [
      'duckduckgo.com',
      'google.com',
      'google.co.mz',
      'google.co.za',
      'bing.com',
      'facebook.com',
      'instagram.com',
      'linkedin.com',
      'youtube.com',
      'tripadvisor.com',
      'booking.com',
      'wikipedia.org',
      'openstreetmap.org',
      'mapcarta.com',
      'mapquest.com',
      'yelp.com',
      'yellowpages.com',
    ];

    return excludedDomains.some(
      (domain) =>
        hostname === domain ||
        hostname.endsWith(`.${domain}`)
    );
  } catch {
    return true;
  }
}

function calculateNameMatch(
  businessName,
  url,
  title = '',
  snippet = ''
) {
  const words =
    getImportantWords(
      businessName
    );

  if (words.length === 0) {
    return 0;
  }

  const text =
    `${getDomain(url)} ${title} ${snippet}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  let matches = 0;

  for (const word of words) {
    if (text.includes(word)) {
      matches++;
    }
  }

  return matches / words.length;
}

function calculateResultScore(
  business,
  result
) {
  const name =
    business.name || '';

  const match =
    calculateNameMatch(
      name,
      result.url,
      result.title,
      result.snippet
    );

  let score =
    match * 70;

  const lowerTitle =
    `${result.title} ${result.snippet}`
      .toLowerCase();

  const city =
    normalizeName(
      business.city ||
      business.location ||
      ''
    );

  if (
    city &&
    lowerTitle.includes(city)
  ) {
    score += 15;
  }

  const country =
    normalizeName(
      business.country || ''
    );

  if (
    country &&
    lowerTitle.includes(country)
  ) {
    score += 10;
  }

  const domain =
    getDomain(result.url);

  if (
    domain.endsWith('.mz') ||
    domain.endsWith('.co.mz')
  ) {
    score += 10;
  }

  if (
    lowerTitle.includes('official') ||
    lowerTitle.includes('oficial')
  ) {
    score += 10;
  }

  if (
    isSocialUrl(result.url)
  ) {
    score += 5;
  }

  return score;
}

async function searchDuckDuckGo(
  query
) {
  const url =
    `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;

  const response =
    await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml',
      },
      signal:
        AbortSignal.timeout(7000),
    });

  if (!response.ok) {
    throw new Error(
      `Pesquisa web respondeu ${response.status}`
    );
  }

  const html =
    await response.text();

  const results = [];

  const resultRegex =
    /<a[^>]+class=["'][^"']*result__a[^"']*["'][^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;

  let match;

  while (
    (match =
      resultRegex.exec(html)) !== null
  ) {
    const resultUrl =
      cleanSearchUrl(
        match[1]
      );

    const title =
      match[2]
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    if (!resultUrl) continue;

    results.push({
      url: resultUrl,
      title,
      snippet: '',
    });
  }

  return results;
}

async function runSearches(
  business
) {
  const name =
    cleanText(
      business.name
    );

  if (!name) {
    return [];
  }

  const city =
    cleanText(
      business.city ||
      business.location
    );

  const country =
    cleanText(
      business.country
    );

  const location =
    [city, country]
      .filter(Boolean)
      .join(' ');

  const queries = [
    `"${name}" ${location}`,
    `"${name}" ${city || ''} official`,
    `"${name}" ${location} website`,
    `"${name}" ${city || ''} Instagram`,
    `"${name}" ${city || ''} Facebook`,
    `"${name}" ${city || ''} WhatsApp`,
  ];

  const allResults = [];

  for (
    const query of queries
  ) {
    try {
      console.log(
        ` Pesquisa digital: ${query}`
      );

      const results =
        await searchDuckDuckGo(
          query
        );

      allResults.push(
        ...results
      );
    } catch (error) {
      console.warn(
        ` Falha na pesquisa "${query}":`,
        error.message
      );
    }
  }

  const uniqueResults =
    allResults.filter(
      (result, index, array) =>
        array.findIndex(
          (item) =>
            item.url === result.url
        ) === index
    );

  return uniqueResults;
}

function findBestWebsite(
  business,
  results
) {
  const candidates =
    results
      .filter(
        (result) =>
          !isSocialUrl(result.url) &&
          !isExcludedDomain(result.url)
      )
      .map(
        (result) => ({
          ...result,
          score:
            calculateResultScore(
              business,
              result
            ),
        })
      )
      .sort(
        (a, b) =>
          b.score - a.score
      );

  if (
    candidates.length === 0
  ) {
    return null;
  }

  const best =
    candidates[0];

  if (best.score < 35) {
    return null;
  }

  return best;
}

function findSocial(
  business,
  results,
  type
) {
  const candidates =
    results
      .filter(
        (result) => {
          const lower =
            result.url
              .toLowerCase();

          if (
            type === 'instagram'
          ) {
            return lower.includes(
              'instagram.com'
            );
          }

          if (
            type === 'facebook'
          ) {
            return lower.includes(
              'facebook.com'
            );
          }

          if (
            type === 'whatsapp'
          ) {
            return (
              lower.includes(
                'wa.me'
              ) ||
              lower.includes(
                'whatsapp.com'
              )
            );
          }

          return false;
        }
      )
      .map(
        (result) => ({
          ...result,
          score:
            calculateResultScore(
              business,
              result
            ),
        })
      )
      .sort(
        (a, b) =>
          b.score - a.score
      );

  if (
    candidates.length === 0
  ) {
    return null;
  }

  if (
    candidates[0].score < 20
  ) {
    return null;
  }

  return candidates[0].url;
}

async function discoverDigitalPresence(
  business
) {
  const discovered = {
    website: null,
    instagram: null,
    facebook: null,
    whatsapp: null,

    websiteConfidence: 0,

    searched: true,
    source:
      'Pesquisa web pública',
  };

  const results =
    await runSearches(
      business
    );

  if (
    results.length === 0
  ) {
    return discovered;
  }

  const bestWebsite =
    findBestWebsite(
      business,
      results
    );

  if (bestWebsite) {
    discovered.website =
      normalizeUrl(
        bestWebsite.url
      );

    discovered.websiteConfidence =
      Math.min(
        bestWebsite.score / 100,
        1
      );
  }

  discovered.instagram =
    findSocial(
      business,
      results,
      'instagram'
    );

  discovered.facebook =
    findSocial(
      business,
      results,
      'facebook'
    );

  discovered.whatsapp =
    findSocial(
      business,
      results,
      'whatsapp'
    );

  return discovered;
}

async function analyzeWebsite(
  website,
  result
) {
  try {
    const response =
      await fetch(
        website,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (InsightProspectingEngine/1.0)',
          },
          signal:
            AbortSignal.timeout(5000),
        }
      );

    const accessible =
      response.ok;

    const finalUrl =
      response.url ||
      website;

    const https =
      finalUrl.startsWith(
        'https://'
      );

    if (!accessible) {
      result.websiteAnalysis = {
        accessible: false,
        https,
        mobileFriendlySignal:
          null,
        outdatedSignals: [
          'Website respondeu com erro ao ser acedido',
        ],
        outdatedScore: 1,
      };

      return;
    }

    const html =
      await response.text();

    const emails =
      extractEmails(html);

    const phones =
      extractPhones(html);

    const socialLinks =
      extractSocialLinks(
        html
      );

    result.email =
      result.email ||
      cleanText(
        emails[0]
      );

    result.phone =
      result.phone ||
      cleanText(
        phones[0]
      );

    result.instagram =
      result.instagram ||
      socialLinks.instagram;

    result.facebook =
      result.facebook ||
      socialLinks.facebook;

    result.whatsapp =
      result.whatsapp ||
      socialLinks.whatsapp;

    const outdatedSignals =
      [];

    if (
      !html
        .toLowerCase()
        .includes(
          'viewport'
        )
    ) {
      outdatedSignals.push(
        'Sem meta viewport (possível falta de adaptação mobile)'
      );
    }

    if (
      html.length > 0 &&
      html.length < 500
    ) {
      outdatedSignals.push(
        'Página com muito pouco conteúdo'
      );
    }

    result.websiteAnalysis = {
      accessible: true,
      https,
      mobileFriendlySignal:
        html
          .toLowerCase()
          .includes(
            'viewport'
          ),
      outdatedSignals,
      outdatedScore:
        outdatedSignals.length,
    };

    result.enrichment =
      {
        source:
          result.enrichment.source ||
          finalUrl,
        found: true,
        discovered:
          result.enrichment.discovered ||
          false,
      };
  } catch (error) {
    console.warn(
      `Não foi possível analisar o website de ${result.name}:`,
      error.message
    );

    result.websiteAnalysis = {
      accessible: false,
      https:
        website.startsWith(
          'https://'
        ),
      mobileFriendlySignal:
        null,
      outdatedSignals: [
        'Website não respondeu dentro do tempo esperado',
      ],
      outdatedScore: 1,
    };
  }
}

export async function enrichBusiness(
  business
) {
  const result = {
    ...business,

    websiteAnalysis:
      null,

    enrichment: {
      source: null,
      found: false,
      discovered: false,
      websiteConfidence: 0,
      searched: false,
    },
  };


  if (
    result.website ||
    result.instagram ||
    result.facebook ||
    result.whatsapp
  ) {
    result.enrichment = {
      source:
        'OpenStreetMap',
      found: true,
      discovered: false,
      websiteConfidence:
        result.website
          ? 1
          : 0,
      searched: false,
    };
  }

  try {
    const discovered =
      await discoverDigitalPresence(
        result
      );

    result.enrichment.searched =
      true;

    if (
      !result.website &&
      discovered.website
    ) {
      result.website =
        discovered.website;

      result.enrichment.source =
        discovered.source;

      result.enrichment.discovered =
        true;

      result.enrichment.found =
        true;

      result.enrichment.websiteConfidence =
        discovered.websiteConfidence;
    }

    if (
      !result.instagram &&
      discovered.instagram
    ) {
      result.instagram =
        discovered.instagram;

      result.enrichment.found =
        true;

      result.enrichment.discovered =
        true;
    }

    if (
      !result.facebook &&
      discovered.facebook
    ) {
      result.facebook =
        discovered.facebook;

      result.enrichment.found =
        true;

      result.enrichment.discovered =
        true;
    }

    if (
      !result.whatsapp &&
      discovered.whatsapp
    ) {
      result.whatsapp =
        discovered.whatsapp;

      result.enrichment.found =
        true;

      result.enrichment.discovered =
        true;
    }
  } catch (error) {
    console.warn(
      ` Não foi possível descobrir presença digital de ${result.name}:`,
      error.message
    );

    result.enrichment.searched =
      true;
  }

 

  if (result.website) {
    result.website =
      normalizeUrl(
        result.website
      );

    await analyzeWebsite(
      result.website,
      result
    );

    result.enrichment.found =
      true;
  } else {
    result.websiteAnalysis =
      null;
  }

  return result;
}