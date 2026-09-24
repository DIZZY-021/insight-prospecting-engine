import express from 'express';

import { searchBusinesses } from '../services/overpassService.js';
import { formatBusinesses } from '../services/businessService.js';
import { enrichBusiness } from '../services/webEnrichmentService.js';
import { analyzeOpportunity } from '../services/opportunityService.js';

import {
  saveSearchAndBusinesses,
  getCachedSearch
} from '../database/searchDatabase.js';

const router = express.Router();


// Converte os dados guardados no SQLite
// novamente para o formato usado pelo frontend.
function restoreBusiness(row) {
  return {
    id: row.osm_id,

    name: row.name,
    category: row.category,
    location: row.location,

    phone: row.phone,
    email: row.email,
    website: row.website,

    instagram: row.instagram,
    facebook: row.facebook,
    whatsapp: row.whatsapp,

    rating: row.rating,
    reviews: row.reviews,

    openingHours: row.opening_hours,
    cuisine: row.cuisine,
    brand: row.brand,
    operator: row.operator,
    description: row.description,

    wheelchair: row.wheelchair,
    paymentMethods: row.payment_methods,

    stars: row.stars,
    rooms: row.rooms,

    address: row.address,
    street: row.street,
    suburb: row.suburb,
    city: row.city,
    postcode: row.postcode,

    googleMaps: row.google_maps,
    osmUrl: row.osm_url,

    latitude: row.latitude,
    longitude: row.longitude,

    digitalPresence:
      row.digital_presence
        ? JSON.parse(row.digital_presence)
        : null,

    websiteAnalysis:
      row.website_analysis
        ? JSON.parse(row.website_analysis)
        : null,

    opportunityScore:
      row.opportunity_score,

    opportunityLevel:
      row.opportunity_level,

    digitalProblems:
      row.digital_problems
        ? JSON.parse(row.digital_problems)
        : [],

    recommendedServices:
      row.recommended_services
        ? JSON.parse(row.recommended_services)
        : [],

    opportunitySummary:
      row.opportunity_summary,

    source:
      row.source
  };
}


router.get('/search', async (req, res) => {

  const {
    country,
    city,
    businessType,
    limit
  } = req.query;

  if (
    !country ||
    !city ||
    !businessType ||
    !limit
  ) {
    return res.status(400).json({
      success: false,
      message:
        'Informe país, cidade, tipo de negócio e quantidade.'
    });
  }

  try {

    // VERIFICA CACHE

    const cached =
      getCachedSearch({
        country,
        city,
        businessType,
        limit
      });

    if (cached) {

      const cachedResults =
        cached.businesses.map(
          restoreBusiness
        );

      console.log(
        `Cache encontrado para ${city} - ${businessType} (${cachedResults.length} empresas)`
      );

      return res.json({

        success: true,

        cached: true,

        search: {
          id: cached.search.id,
          country,
          city,
          businessType,
          limit: Number(limit)
        },

        total:
          cachedResults.length,

        results:
          cachedResults
      });
    }

    // PESQUISA NO OPENSTREETMAP

    const businesses =
      await searchBusinesses(
        city,
        businessType,
        Number(limit),
        country
      );

    //  ORGANIZA OS DADOS

    const formattedBusinesses =
  formatBusinesses(
    businesses,
    city
  );

    //  ANALISA OS WEBSITES

    const enrichedBusinesses =
      await Promise.all(

        formattedBusinesses.map(
          async (business) => {

            try {

              return await enrichBusiness(
                business
              );

            } catch (error) {

              console.warn(
                `Erro ao enriquecer ${business.name}:`,
                error.message
              );

              return business;
            }
          }
        )
      );

    // CALCULA A OPORTUNIDADE

    const results =
      enrichedBusinesses.map(
        (business) =>
          analyzeOpportunity(
            business
          )
      );

    // GUARDA NO SQLITE

    const searchId =
      saveSearchAndBusinesses({

        country,
        city,
        businessType,

        limit:
          Number(limit),

        results
      });


    console.log(
      ` Pesquisa ${searchId} guardada com ${results.length} empresas.`
    );

    // DEVOLVE AO FRONTEND

    res.json({

      success: true,

      cached: false,

      search: {
        id:
          Number(searchId),

        country,
        city,
        businessType,

        limit:
          Number(limit)
      },

      total:
        results.length,

      results
    });

  } catch (error) {

    console.error(
      'Erro na pesquisa:',
      error
    );

    res.status(500).json({

      success: false,

      message:
        'Erro ao pesquisar empresas.',

      error:
        error.message
    });
  }
});

export default router;