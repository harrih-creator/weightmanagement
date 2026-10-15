/**
 * Serverless Endpoint for TheMealDB Healthy Recipes
 * GET /api/meals?ingredient=chicken_breast
 *
 * Upstream:
 * https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast
 */

export default async function handler(req: any, res?: any) {
  let ingredient = 'chicken_breast';

  if (req?.query?.i || req?.query?.ingredient) {
    ingredient = String(req.query.i || req.query.ingredient);
  } else if (req?.url) {
    try {
      const url = new URL(req.url, 'http://localhost');
      if (url.searchParams.get('i')) ingredient = url.searchParams.get('i')!;
      else if (url.searchParams.get('ingredient')) ingredient = url.searchParams.get('ingredient')!;
    } catch {
      // Ignore
    }
  }

  try {
    const targetUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`;

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
        message: 'TheMealDB API error'
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
      message: 'Failed to fetch from TheMealDB',
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
