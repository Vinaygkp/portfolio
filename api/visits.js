import { Redis } from '@upstash/redis';

// Unified Redis storage keys across local development and production
const TOTAL_VIEWS_KEY = 'portfolio:views';
const UNIQUE_SET_KEY = 'portfolio:unique_visitors';

function getRedisInstance() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  return new Redis({
    url,
    token,
  });
}

// Get or initialize views count
async function getCurrentViewsCount(redis) {
  let count = await redis.get(TOTAL_VIEWS_KEY);
  if (count === null) {
    const legacyCount = await redis.get('portfolio:total_visitors');
    if (legacyCount !== null) {
      await redis.set(TOTAL_VIEWS_KEY, legacyCount);
      count = legacyCount;
    } else {
      const setCard = await redis.scard(UNIQUE_SET_KEY);
      count = setCard || 0;
      await redis.set(TOTAL_VIEWS_KEY, count);
    }
  }
  return Number(count);
}

// Basic bot detection to filter automated crawlers
function isBotRequest(userAgent) {
  if (!userAgent || typeof userAgent !== 'string') return false;
  return /bot|crawler|spider|slurp|lighthouse|headless|curl|wget|python|postman|pingdom/i.test(userAgent);
}

export default async function handler(req, res) {
  // CORS & Cache control headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  };

  const isEdge = !res || typeof res.status !== 'function';

  const sendEdgeResponse = (status, data) => {
    return new Response(JSON.stringify(data), {
      status,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  };

  const sendNodeResponse = (status, data) => {
    Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v));
    return res.status(status).json(data);
  };

  const respond = (status, data) => {
    if (isEdge) {
      return sendEdgeResponse(status, data);
    }
    return sendNodeResponse(status, data);
  };

  const method = req.method || 'GET';

  if (method === 'OPTIONS') {
    if (isEdge) {
      return new Response(null, { status: 200, headers });
    }
    Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v));
    return res.status(200).end();
  }

  const redis = getRedisInstance();

  if (!redis) {
    return respond(200, {
      success: false,
      configured: false,
      message: 'Upstash Redis environment variables are not configured yet.',
      totalVisits: null,
    });
  }

  try {
    const userAgent = isEdge ? req.headers.get('user-agent') : req.headers?.['user-agent'];

    if (method === 'POST') {
      // Discard bot automated increments
      if (isBotRequest(userAgent)) {
        const currentCount = await getCurrentViewsCount(redis);
        return respond(200, {
          success: true,
          isNewVisitor: false,
          totalVisits: currentCount,
        });
      }

      let body = {};
      if (isEdge && typeof req.json === 'function') {
        try {
          body = await req.json();
        } catch {
          body = {};
        }
      } else {
        body = req.body;
        if (typeof body === 'string') {
          try {
            body = JSON.parse(body);
          } catch {
            body = {};
          }
        }
      }

      const visitorId = body?.visitorId || body?.sessionId;

      // Unique Visitor Tracking: atomic Redis Set membership check
      if (visitorId && typeof visitorId === 'string' && visitorId.length >= 8 && visitorId.length <= 128) {
        // SADD returns 1 if member was newly added, 0 if it already existed in the set
        const isNewVisitor = await redis.sadd(UNIQUE_SET_KEY, visitorId);

        if (isNewVisitor === 1) {
          // Genuinely new visitor: increment total counter exactly once
          await getCurrentViewsCount(redis);
          const newCount = await redis.incr(TOTAL_VIEWS_KEY);
          return respond(200, {
            success: true,
            isNewVisitor: true,
            totalVisits: Number(newCount),
          });
        } else {
          // Returning visitor: already counted previously. Return current count without incrementing.
          const currentCount = await getCurrentViewsCount(redis);
          return respond(200, {
            success: true,
            isNewVisitor: false,
            totalVisits: currentCount,
          });
        }
      }

      // If no valid visitorId provided, do not increment arbitrarily
      const currentCount = await getCurrentViewsCount(redis);
      return respond(200, {
        success: true,
        isNewVisitor: false,
        totalVisits: currentCount,
      });
    }

    if (method === 'GET') {
      const currentCount = await getCurrentViewsCount(redis);
      return respond(200, {
        success: true,
        totalVisits: currentCount,
      });
    }

    return respond(405, {
      success: false,
      error: 'Method not allowed',
    });
  } catch (error) {
    console.error('Visitor counter API error:', error);
    return respond(500, {
      success: false,
      error: 'Failed to process visitor count',
      totalVisits: null,
    });
  }
}
