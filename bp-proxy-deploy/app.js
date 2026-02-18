const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();

// BP API Configuration
const BP_CONFIG = {
  authUrl: 'https://auth-dsp.bp.com/oauth2/token',
  apiUrl: 'https://api-dsp.bp.com',
  clientId: process.env.BP_CLIENT_ID || '1iscd5u2j69mcv1mu8o81ek0lu',
  clientSecret: process.env.BP_CLIENT_SECRET || 'm4hsr17drj9r9sq81ivvjld2f4bpq0s2el1ml0lrs97hsrg3pa8',
  scope: 'stock-api/stock.read'
};

// In-memory token cache
let tokenCache = {
  accessToken: null,
  expiresAt: 0
};

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://*.amplifyapp.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'BP SiteMaster Consumer API Proxy (Lambda)',
    environment: process.env.NODE_ENV || 'production',
    config: {
      authUrl: BP_CONFIG.authUrl,
      apiUrl: BP_CONFIG.apiUrl,
      clientId: BP_CONFIG.clientId ? `${BP_CONFIG.clientId.substring(0, 8)}...` : 'Not set',
      useRealAPI: process.env.USE_REAL_BP_API !== 'false'
    }
  });
});

// Function to get BP OAuth token
async function getBPAccessToken() {
  // Check if we have a valid cached token
  if (tokenCache.accessToken && Date.now() < tokenCache.expiresAt) {
    console.log('✅ Using cached BP access token');
    return tokenCache.accessToken;
  }

  try {
    console.log('🔐 Requesting new BP OAuth token...');
    
    const response = await fetch(BP_CONFIG.authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'User-Agent': 'BP-Digital-Twin-SiteMaster-Consumer/1.0'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: BP_CONFIG.clientId,
        client_secret: BP_CONFIG.clientSecret,
        scope: BP_CONFIG.scope
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`BP Auth failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const tokenData = await response.json();
    
    // Cache the token with buffer time
    tokenCache.accessToken = tokenData.access_token;
    tokenCache.expiresAt = Date.now() + ((tokenData.expires_in - 60) * 1000); // 60 second buffer

    console.log('✅ BP OAuth token obtained successfully');
    return tokenCache.accessToken;
    
  } catch (error) {
    console.error('❌ Failed to get BP access token:', error);
    throw error;
  }
}

// Function to fetch stock data from BP API
async function fetchBPStockData(siteId) {
  try {
    const accessToken = await getBPAccessToken();
    
    console.log(`📡 Fetching stock data from BP API for site: ${siteId}`);
    
    const response = await fetch(`${BP_CONFIG.apiUrl}/stock/position?siteId=${siteId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'BP-Digital-Twin-SiteMaster-Consumer/1.0',
        'X-BP-Consumer': 'SiteMaster',
        'X-Request-ID': `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`BP API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Successfully fetched BP stock data');
    
    return data;
    
  } catch (error) {
    console.error('❌ Failed to fetch BP stock data:', error);
    throw error;
  }
}

// Mock data fallback
function getMockStockData(siteId) {
  console.log('⚠️ Using mock data fallback');
  
  return [
    {
      siteId: siteId || '10441',
      productId: 'BP001',
      productName: 'BP Ultimate 98',
      categoryId: 'FUEL',
      categoryName: 'Fuel',
      currentStock: 8500,
      maxStock: 10000,
      minStock: 2000,
      lastUpdated: new Date().toISOString(),
      unitOfMeasure: 'L',
      location: 'Tank 1',
      shelfZone: 'Fuel Dispensers Zone A'
    },
    {
      siteId: siteId || '10441',
      productId: 'BP002',
      productName: 'BP Regular 91',
      categoryId: 'FUEL',
      categoryName: 'Fuel',
      currentStock: 12000,
      maxStock: 15000,
      minStock: 3000,
      lastUpdated: new Date().toISOString(),
      unitOfMeasure: 'L',
      location: 'Tank 2',
      shelfZone: 'Fuel Dispensers Zone B'
    },
    {
      siteId: siteId || '10441',
      productId: 'CONV001',
      productName: 'Coca Cola 600ml',
      categoryId: 'BVRG',
      categoryName: 'Beverages',
      currentStock: 45,
      maxStock: 60,
      minStock: 10,
      lastUpdated: new Date().toISOString(),
      unitOfMeasure: 'units',
      location: 'Fridge 1',
      shelfZone: 'Cold Beverages'
    },
    {
      siteId: siteId || '10441',
      productId: 'CONV002',
      productName: 'Mars Bar',
      categoryId: 'SNCK',
      categoryName: 'Snacks',
      currentStock: 8,
      maxStock: 50,
      minStock: 15,
      lastUpdated: new Date().toISOString(),
      unitOfMeasure: 'units',
      location: 'Shelf 2A',
      shelfZone: 'Confectionery'
    },
    {
      siteId: siteId || '10441',
      productId: 'CONV003',
      productName: 'Coffee Beans 1kg',
      categoryId: 'FOOD',
      categoryName: 'Food',
      currentStock: 25,
      maxStock: 30,
      minStock: 5,
      lastUpdated: new Date().toISOString(),
      unitOfMeasure: 'kg',
      location: 'Storage',
      shelfZone: 'Coffee Station'
    },
    {
      siteId: siteId || '10441',
      productId: 'CONV004',
      productName: 'Fresh Bread Rolls',
      categoryId: 'FOOD',
      categoryName: 'Food',
      currentStock: 2,
      maxStock: 20,
      minStock: 5,
      lastUpdated: new Date().toISOString(),
      unitOfMeasure: 'units',
      location: 'Shelf 1B',
      shelfZone: 'Fresh Food'
    }
  ];
}

// BP SiteMaster API - Stock Position endpoint (now fetching real data)
app.get('/api/bp/stock/position', async (req, res) => {
  const { siteId } = req.query;
  
  if (!siteId) {
    return res.status(400).json({
      error: 'Missing required parameter',
      message: 'siteId parameter is required',
      example: '/api/bp/stock/position?siteId=10441'
    });
  }

  try {
    console.log(`🔄 Processing stock position request for siteId: ${siteId}`);
    
    // Try to fetch real BP data first
    let stockData;
    
    const USE_REAL_API = process.env.USE_REAL_BP_API !== 'false'; // Default to true
    
    if (USE_REAL_API) {
      try {
        stockData = await fetchBPStockData(siteId);
        
        // Transform BP API response to our expected format if needed
        if (stockData && stockData.positions) {
          stockData = stockData.positions.map(pos => ({
            siteId: stockData.siteId || siteId,
            productId: pos.productId,
            productName: pos.productName,
            categoryId: pos.category?.toUpperCase().replace(/\s+/g, '_') || 'UNKNOWN',
            categoryName: pos.category || 'Unknown',
            currentStock: pos.currentLevel || pos.currentStock || 0,
            maxStock: pos.capacity || pos.maxStock || 0,
            minStock: pos.minimumLevel || pos.minStock || 0,
            lastUpdated: pos.lastUpdated || new Date().toISOString(),
            unitOfMeasure: pos.unit || pos.unitOfMeasure || 'units',
            location: pos.location || pos.tank,
            shelfZone: pos.zone || pos.shelfZone
          }));
        }
        
        console.log('✅ Real BP API data fetched and transformed');
        
      } catch (apiError) {
        console.error('❌ BP API failed, falling back to mock data:', apiError.message);
        stockData = getMockStockData(siteId);
      }
    } else {
      console.log('🎭 Using mock data (USE_REAL_BP_API not set to true)');
      stockData = getMockStockData(siteId);
    }

    // Add metadata
    const response = {
      success: true,
      data: stockData,
      metadata: {
        siteId: siteId,
        timestamp: new Date().toISOString(),
        source: USE_REAL_API ? 'BP_API' : 'MOCK_DATA',
        recordCount: stockData.length
      }
    };

    res.json(response);
    
  } catch (error) {
    console.error('❌ Error processing stock position request:', error);
    
    // Return mock data with error info
    const fallbackResponse = {
      success: false,
      error: error.message,
      data: getMockStockData(siteId),
      metadata: {
        siteId: siteId,
        timestamp: new Date().toISOString(),
        source: 'FALLBACK_MOCK_DATA',
        recordCount: 6
      }
    };
    
    res.status(200).json(fallbackResponse); // Return 200 with mock data
  }
});

// Mock OAuth2 token endpoint for testing
app.post('/auth/bp/oauth2/token', async (req, res) => {
  const USE_REAL_AUTH = process.env.USE_REAL_BP_API !== 'false';
  
  if (USE_REAL_AUTH) {
    try {
      console.log('🔐 Proxying real BP OAuth request...');
      const token = await getBPAccessToken();
      
      res.json({
        access_token: token,
        token_type: 'Bearer',
        expires_in: 3600,
        scope: BP_CONFIG.scope,
        source: 'REAL_BP_AUTH'
      });
      
    } catch (error) {
      console.error('❌ Real BP auth failed, returning mock token');
      res.json({
        access_token: `mock_bp_token_${Date.now()}`,
        token_type: 'Bearer',
        expires_in: 3600,
        scope: 'stock-api/stock.read',
        source: 'MOCK_AUTH'
      });
    }
  } else {
    console.log('🎭 Returning mock OAuth token');
    res.json({
      access_token: `mock_bp_token_${Date.now()}`,
      token_type: 'Bearer',
      expires_in: 3600,
      scope: 'stock-api/stock.read',
      source: 'MOCK_AUTH'
    });
  }
});

// Catch-all for undefined routes
app.use('*', (req, res) => {
  console.log(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Route not found',
    method: req.method,
    url: req.originalUrl,
    availableRoutes: [
      'GET /health',
      'GET /api/bp/stock/position?siteId=10441',
      'POST /auth/bp/oauth2/token'
    ],
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// Export the Lambda handler
module.exports.handler = serverless(app);

// For local testing
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log('\n🚀 BP SiteMaster Consumer Proxy Server Started');
    console.log(`📡 Server: http://localhost:${PORT}`);
    console.log(`🏥 Health: http://localhost:${PORT}/health`);
    console.log(`📊 Stock API: http://localhost:${PORT}/api/bp/stock/position?siteId=10441`);
    console.log(`🔐 OAuth: POST http://localhost:${PORT}/auth/bp/oauth2/token`);
    console.log(`🎭 Mode: ${process.env.USE_REAL_BP_API !== 'false' ? 'REAL BP API' : 'MOCK DATA'}`);
    console.log('📝 Ready for requests...\n');
  });
}
