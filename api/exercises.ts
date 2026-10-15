/**
 * Serverless Endpoint for Wger Exercise Database
 * GET /api/exercises?language=2&limit=20
 *
 * Upstream:
 * https://wger.de/api/v2/exerciseinfo/?language=2&limit=20
 */

export default async function handler(req: any, res?: any) {
  let language = '2'; // 2 = English
  let limit = '20';

  if (req?.query) {
    if (req.query.language) language = String(req.query.language);
    if (req.query.limit) limit = String(req.query.limit);
  } else if (req?.url) {
    try {
      const url = new URL(req.url, 'http://localhost');
      if (url.searchParams.get('language')) language = url.searchParams.get('language')!;
      if (url.searchParams.get('limit')) limit = url.searchParams.get('limit')!;
    } catch {
      // Ignore
    }
  }

  try {
    const targetUrl = `https://wger.de/api/v2/exerciseinfo/?language=${encodeURIComponent(language)}&limit=${encodeURIComponent(limit)}`;

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = {
        status: 'error',
        statusCode: response.status,
        message: 'Wger API responded with error'
      };

      if (res && typeof res.status === 'function') {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(response.status).json(errorData);
      }

      return new Response(JSON.stringify(errorData), {
        status: response.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const data = await response.json();

    if (res && typeof res.status === 'function') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(200).json(data);
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error: any) {
    const errorPayload = {
      status: 'error',
      message: 'Failed to fetch from Wger API',
      error: error?.message || String(error)
    };

    if (res && typeof res.status === 'function') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(500).json(errorPayload);
    }

    return new Response(JSON.stringify(errorPayload), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
