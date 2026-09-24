import express from 'express';

import db from '../database/database.js';

const router = express.Router();

router.get('/dashboard', (req, res) => {
  try {

    // TOTAL DE EMPRESAS

    const totalBusinesses = db
      .prepare(`
        SELECT COUNT(*) AS total
        FROM businesses
      `)
      .get();

    // EMPRESAS SEM WEBSITE

    const businessesWithoutWebsite = db
      .prepare(`
        SELECT COUNT(*) AS total
        FROM businesses
        WHERE website IS NULL
           OR TRIM(website) = ''
      `)
      .get();

    // EMPRESAS COM ALTA OPORTUNIDADE

    const highOpportunity = db
      .prepare(`
        SELECT COUNT(*) AS total
        FROM businesses
        WHERE opportunity_level IN (
          'Alta',
          'Muito alta'
        )
      `)
      .get();

    //  MÉDIA DO OPPORTUNITY SCORE

    const averageScore = db
      .prepare(`
        SELECT AVG(opportunity_score) AS average
        FROM businesses
        WHERE opportunity_score IS NOT NULL
      `)
      .get();

    //  DISTRIBUIÇÃO DAS OPORTUNIDADES

    const opportunityDistribution = db
      .prepare(`
        SELECT
          opportunity_level,
          COUNT(*) AS total
        FROM businesses
        WHERE opportunity_level IS NOT NULL
        GROUP BY opportunity_level
      `)
      .all();

    // ESTATÍSTICAS POR CATEGORIA
  
    const statisticsByCategory = db
      .prepare(`
        SELECT
          category,
          COUNT(*) AS total,
          ROUND(AVG(opportunity_score), 1) AS average_score
        FROM businesses
        WHERE category IS NOT NULL
        GROUP BY category
        ORDER BY total DESC
      `)
      .all();

    // ESTATÍSTICAS POR CIDADE

    const statisticsByCity = db
      .prepare(`
        SELECT
          COALESCE(city, 'Não informado') AS city,
          COUNT(*) AS total,
          ROUND(AVG(opportunity_score), 1) AS average_score
        FROM businesses
        GROUP BY city
        ORDER BY total DESC
      `)
      .all();

    // RESPOSTA

    res.json({

      success: true,

      totalBusinesses:
        totalBusinesses.total,

      businessesWithoutWebsite:
        businessesWithoutWebsite.total,

      highOpportunity:
        highOpportunity.total,

      averageScore:
        Number(
          averageScore.average || 0
        ).toFixed(1),

      opportunityDistribution,

      statisticsByCategory,

      statisticsByCity

    });

  } catch (error) {

    console.error(
      'Erro ao carregar dashboard:',
      error
    );

    res.status(500).json({

      success: false,

      message:
        'Erro ao carregar dados do dashboard.',

      error:
        error.message

    });

  }
});

export default router;