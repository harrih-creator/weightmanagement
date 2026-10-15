/**
 * Serverless Endpoint for MedlinePlus Clinical & Diabetes Reference
 * GET /api/medlineplus?code=E11&lang=es
 *
 * Upstream:
 * https://connect.medlineplus.gov/service?mainSearchCriteria.v.cs=2.16.840.1.113883.6.90&mainSearchCriteria.v.c=E11&knowledgeResponseType=application/json&informationRecipient.languageCode.c=es
 */

export default async function handler(req: any, res?: any) {
  let code = 'E11'; // ICD-10 for Type 2 diabetes mellitus
  let lang = 'es'; // Spanish as requested, or can be en

  if (req?.query) {
    if (req.query.code) code = String(req.query.code);
    if (req.query.lang) lang = String(req.query.lang);
  } else if (req?.url) {
    try {
      const url = new URL(req.url, 'http://localhost');
      if (url.searchParams.get('code')) code = url.searchParams.get('code')!;
      if (url.searchParams.get('lang')) lang = url.searchParams.get('lang')!;
    } catch {
      // Ignore
    }
  }

  try {
    const targetUrl = `https://connect.medlineplus.gov/service?mainSearchCriteria.v.cs=2.16.840.1.113883.6.90&mainSearchCriteria.v.c=${encodeURIComponent(code)}&knowledgeResponseType=application/json&informationRecipient.languageCode.c=${encodeURIComponent(lang)}`;

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
        message: 'MedlinePlus API error'
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
      message: 'Failed to fetch from MedlinePlus',
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
