/**
 * Serverless Endpoint for Singapore LTA DataMall Bus Arrival
 * GET /api/busarrival?busStopCode=28009&serviceNo=198
 *
 * Official LTA DataMall endpoint:
 * https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode={BusStopCode}
 * Header: AccountKey: process.env.LTA_DATAMALL_KEY
 */

export default async function handler(req: any, res?: any) {
  // Support both Node HTTP / Vercel req.query and Web Fetch URL searchParams
  let busStopCode = '28009'; // Default ActiveSG / Jurong East sports hub stop
  let serviceNo = '';

  if (req?.query) {
    if (req.query.busStopCode) busStopCode = String(req.query.busStopCode);
    if (req.query.serviceNo) serviceNo = String(req.query.serviceNo);
  } else if (req?.url) {
    try {
      const url = new URL(req.url, 'http://localhost');
      if (url.searchParams.get('busStopCode')) {
        busStopCode = url.searchParams.get('busStopCode')!;
      }
      if (url.searchParams.get('serviceNo')) {
        serviceNo = url.searchParams.get('serviceNo')!;
      }
    } catch {
      // Ignore URL parse error
    }
  }

  // Retrieve LTA DataMall API Key from environment variable (NOT hardcoded)
  const ltaAccountKey =
    process.env.LTA_DATAMALL_KEY ||
    process.env.LTA_ACCOUNT_KEY ||
    process.env.LTA_API_KEY;

  if (!ltaAccountKey) {
    // Graceful response when user hasn't added the key to .env yet
    const placeholderResponse = {
      status: 'pending_key_configuration',
      message: 'LTA DataMall API key is not yet configured. Please set LTA_DATAMALL_KEY in your environment variables.',
      busStopCode,
      serviceNo: serviceNo || 'ALL',
      documentation: 'Register for a free key at https://datamall.lta.gov.sg/content/datamall/en/request-api.html',
      sampleServices: [
        {
          ServiceNo: '198',
          Operator: 'SBST',
          NextBus: {
            EstimatedArrival: new Date(Date.now() + 4 * 60 * 1000).toISOString(),
            Latitude: '1.3331',
            Longitude: '103.7423',
            Load: 'SEA', // Seats Available
            Feature: 'WAB', // Wheelchair Accessible
            Type: 'DD' // Double Decker
          },
          NextBus2: {
            EstimatedArrival: new Date(Date.now() + 12 * 60 * 1000).toISOString(),
            Load: 'SDA', // Standing Available
            Feature: 'WAB',
            Type: 'SD'
          }
        },
        {
          ServiceNo: '66',
          Operator: 'TTS',
          NextBus: {
            EstimatedArrival: new Date(Date.now() + 7 * 60 * 1000).toISOString(),
            Load: 'SEA',
            Feature: 'WAB',
            Type: 'SD'
          }
        }
      ]
    };

    if (res && typeof res.status === 'function') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(200).json(placeholderResponse);
    }

    return new Response(JSON.stringify(placeholderResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  try {
    let targetUrl = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${encodeURIComponent(busStopCode)}`;
    if (serviceNo) {
      targetUrl += `&ServiceNo=${encodeURIComponent(serviceNo)}`;
    }

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        AccountKey: ltaAccountKey,
        accept: 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      const errorData = {
        status: 'error',
        statusCode: response.status,
        message: 'LTA DataMall API responded with an error.',
        details: errorText
      };

      if (res && typeof res.status === 'function') {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.status(response.status).json(errorData);
      }

      return new Response(JSON.stringify(errorData), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
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
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error: any) {
    const errorPayload = {
      status: 'error',
      message: 'Failed to fetch from LTA DataMall',
      error: error?.message || String(error)
    };

    if (res && typeof res.status === 'function') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(500).json(errorPayload);
    }

    return new Response(JSON.stringify(errorPayload), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
