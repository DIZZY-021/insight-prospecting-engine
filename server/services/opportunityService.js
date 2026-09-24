function getDigitalPresence(
  business
) {
  const hasWebsite =
    Boolean(
      business.website
    );

  const hasInstagram =
    Boolean(
      business.instagram
    );

  const hasFacebook =
    Boolean(
      business.facebook
    );

  const hasWhatsapp =
    Boolean(
      business.whatsapp
    );

  const hasGoogleMaps =
    Boolean(
      business.googleMaps
    );

  const socialCount = [
    hasInstagram,
    hasFacebook,
    hasWhatsapp,
  ].filter(Boolean).length;

  const presenceCount = [
    hasWebsite,
    hasGoogleMaps,
    hasInstagram,
    hasFacebook,
    hasWhatsapp,
  ].filter(Boolean).length;

  let level =
    'Muito baixa';

  if (presenceCount >= 5) {
    level =
      'Muito alta';
  } else if (presenceCount >= 3) {
    level =
      'Alta';
  } else if (presenceCount >= 2) {
    level =
      'Média';
  } else if (presenceCount === 1) {
    level =
      'Baixa';
  }

  return {
    hasWebsite,
    hasInstagram,
    hasFacebook,
    hasWhatsapp,
    hasGoogleMaps,
    hasSocialMedia:
      socialCount > 0,
    socialCount,
    presenceCount,
    level,
  };
}

function calculateOpportunityScore(
  business
) {
  let score = 0;

  const digital =
    getDigitalPresence(
      business
    );

  const website =
    business.websiteAnalysis ||
    {};

  if (!digital.hasWebsite) {
    score += 35;
  }

  /*
   * INSTAGRAM
   */

  if (!digital.hasInstagram) {
    score += 10;
  }

  /*
   * FACEBOOK
   */

  if (!digital.hasFacebook) {
    score += 10;
  }

  /*
   * WHATSAPP
   */

  if (!digital.hasWhatsapp) {
    score += 10;
  }


  if (digital.hasGoogleMaps) {
    score -= 5;
  }

  /*
   * WEBSITE INACESSÍVEL
   */

  if (
    digital.hasWebsite &&
    website.accessible === false
  ) {
    score += 20;
  }

  /*
   * WEBSITE DESATUALIZADO
   */

  if (
    Number.isFinite(
      Number(
        website.outdatedScore
      )
    )
  ) {
    score += Number(
      website.outdatedScore
    );
  }



  if (
    Number.isFinite(
      Number(business.rating)
    ) &&
    Number(business.rating) <= 3.5
  ) {
    score += 10;
  }

  

  if (
    Number.isFinite(
      Number(business.reviews)
    ) &&
    Number(business.reviews) < 10
  ) {
    score += 5;
  }

  return Math.max(
    0,
    Math.min(
      score,
      100
    )
  );
}

function classifyOpportunity(
  score
) {
  if (score >= 80) {
    return 'Muito alta';
  }

  if (score >= 60) {
    return 'Alta';
  }

  if (score >= 30) {
    return 'Média';
  }

  return 'Baixa';
}

function identifyDigitalProblems(
  business
) {
  const problems = [];

  const digital =
    getDigitalPresence(
      business
    );

  const website =
    business.websiteAnalysis ||
    {};

  if (!digital.hasWebsite) {
    problems.push(
      'Website não encontrado após consulta às fontes públicas'
    );
  }

  if (!digital.hasInstagram) {
    problems.push(
      'Instagram não encontrado após consulta às fontes públicas'
    );
  }

  if (!digital.hasFacebook) {
    problems.push(
      'Facebook não encontrado após consulta às fontes públicas'
    );
  }

  if (!digital.hasWhatsapp) {
    problems.push(
      'WhatsApp não encontrado após consulta às fontes públicas'
    );
  }



  if (
    !digital.hasGoogleMaps
  ) {
    problems.push(
      'Google Maps não encontrado nas fontes consultadas'
    );
  }

  if (
    digital.hasWebsite &&
    website.accessible === false
  ) {
    problems.push(
      'Website não acessível'
    );
  }

  if (
    digital.hasWebsite &&
    website.https === false
  ) {
    problems.push(
      'Website sem HTTPS'
    );
  }

  if (
    digital.hasWebsite &&
    website.mobileFriendlySignal === false
  ) {
    problems.push(
      'Não foi encontrado sinal de configuração mobile'
    );
  }

  if (
    Array.isArray(
      website.outdatedSignals
    ) &&
    website.outdatedSignals.length > 0
  ) {
    problems.push(
      ...website.outdatedSignals
    );
  }

  if (
    Number.isFinite(
      Number(business.rating)
    ) &&
    Number(business.rating) <= 3.5
  ) {
    problems.push(
      'Avaliação média relativamente baixa'
    );
  }

  if (
    Number.isFinite(
      Number(business.reviews)
    ) &&
    Number(business.reviews) < 10
  ) {
    problems.push(
      'Poucas avaliações disponíveis'
    );
  }

  return [
    ...new Set(
      problems
    ),
  ];
}

function identifyRecommendedServices(
  problems
) {
  const services = [];

  const has =
    (text) =>
      problems.some(
        (problem) =>
          problem
            .toLowerCase()
            .includes(text)
      );

  if (
    has('website não encontrado')
  ) {
    services.push(
      'Criação de website'
    );
  }

  if (
    has('website não acessível')
  ) {
    services.push(
      'Manutenção e recuperação de website'
    );
  }

  if (
    has('https')
  ) {
    services.push(
      'Segurança e configuração do website'
    );
  }

  if (
    has('mobile')
  ) {
    services.push(
      'Otimização responsiva para dispositivos móveis'
    );
  }

  if (
    has('instagram') ||
    has('facebook') ||
    has('whatsapp')
  ) {
    services.push(
      'Gestão e melhoria da presença digital'
    );
  }

  if (
    has('google maps')
  ) {
    services.push(
      'Otimização da presença no Google Maps'
    );
  }

  if (
    has(
      'avaliação média relativamente baixa'
    ) ||
    has(
      'poucas avaliações'
    )
  ) {
    services.push(
      'Gestão da reputação digital'
    );
  }

  if (
    services.length === 0
  ) {
    services.push(
      'Manutenção e acompanhamento da presença digital'
    );
  }

  return [
    ...new Set(
      services
    ),
  ];
}

function generateOpportunitySummary(
  business,
  problems,
  services,
  level
) {
  const companyName =
    business.name ||
    'Esta empresa';

  if (
    problems.length === 0
  ) {
    return `${companyName} apresenta uma presença digital relativamente completa nas fontes consultadas. Recomenda-se acompanhamento e manutenção da presença online.`;
  }

  const mainProblems =
    problems
      .slice(0, 3)
      .join(', ');

  const mainServices =
    services
      .slice(0, 2)
      .join(' e ');

  return `${companyName} apresenta oportunidade digital de nível ${level.toLowerCase()}. Foram identificados: ${mainProblems}. Serviços que podem ser considerados: ${mainServices}.`;
}

export function analyzeOpportunity(
  business
) {


  const digitalPresence =
    getDigitalPresence(
      business
    );

  const businessWithPresence = {
    ...business,
    digitalPresence,
  };

  const opportunityScore =
    calculateOpportunityScore(
      businessWithPresence
    );

  const opportunityLevel =
    classifyOpportunity(
      opportunityScore
    );

  const digitalProblems =
    identifyDigitalProblems(
      businessWithPresence
    );

  const recommendedServices =
    identifyRecommendedServices(
      digitalProblems
    );

  const opportunitySummary =
    generateOpportunitySummary(
      businessWithPresence,
      digitalProblems,
      recommendedServices,
      opportunityLevel
    );

  return {
    ...businessWithPresence,

    opportunityScore,

    opportunityLevel,

    digitalProblems,

    recommendedServices,

    opportunitySummary,
  };
}