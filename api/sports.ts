/**
 * Serverless Endpoint for TheSportsDB Athletic Teams
 * GET /api/sports?team=Arsenal
 *
 * Upstream:
 * https://www.thesportsdb.com/api/v1/json/{API_KEY}/searchteams.php?t={team}
 */

export default async function handler(req: any, res?: any) {
  let team = 'Arsenal';

  if (req?.query?.team || req?.query?.t) {
    team = String(req.query.team || req.query.t);
  } else if (req?.url) {
    try {
      const url = new URL(req.url, 'http://localhost');
      if (url.searchParams.get('team')) team = url.searchParams.get('team')!;
      else if (url.searchParams.get('t')) team = url.searchParams.get('t')!;
    } catch {
      // Ignore
    }
  }

  // Not hardcoded: uses environment variable with free public tier 123 as fallback
  const apiKey = process.env.THESPORTSDB_API_KEY || '123';

  try {
    const targetUrl = `https://www.thesportsdb.com/api/v1/json/${encodeURIComponent(apiKey)}/searchteams.php?t=${encodeURIComponent(team)}`;

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
        message: 'TheSportsDB API error'
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
      message: 'Failed to fetch from TheSportsDB',
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
