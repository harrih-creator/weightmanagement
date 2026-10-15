/**
 * Serverless Health & Diagnostics Endpoint
 * GET /api/health
 */

export default async function handler(req: any, res?: any) {
  const startTime = Date.now();

  const healthData = {
    status: 'ok',
    service: 'VitalPact Serverless API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime ? process.uptime() : 0,
    environment: process.env.NODE_ENV || 'development',
    availableEndpoints: [
      { path: '/api/health', method: 'GET', description: 'API health and diagnostics check' },
      { path: '/api/busarrival', method: 'GET', description: 'Live Singapore LTA DataMall bus arrivals' },
      { path: '/api/openfoodfacts', method: 'GET', description: 'OpenFoodFacts product nutrition & Nutri-Score' },
      { path: '/api/exercises', method: 'GET', description: 'Wger exercise database' },
      { path: '/api/meals', method: 'GET', description: 'TheMealDB healthy recipes' },
      { path: '/api/medlineplus', method: 'GET', description: 'MedlinePlus clinical health reference' },
      { path: '/api/sports', method: 'GET', description: 'TheSportsDB athletic team data' }
    ],
    configuredKeys: {
      ltaDatamall: Boolean(process.env.LTA_DATAMALL_KEY || process.env.LTA_ACCOUNT_KEY),
      theSportsDb: Boolean(process.env.THESPORTSDB_API_KEY)
    },
    latencyMs: Date.now() - startTime
  };

  if (res && typeof res.status === 'function') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(healthData);
  }

  return new Response(JSON.stringify(healthData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
