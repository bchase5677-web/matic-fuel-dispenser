import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

let siteConfig = {
  name: 'Matic FUELTEC Ltd',
  address: '33 Idimu Road, Olorun Adaba Bus Stop, Lagos, Nigeria',
  phone: '09028813221',
  whatsapp: '2349028813221',
  email: 'Maticlimited@gmail.com'
};

let products = [
  { id: '1', name: 'Matic LFX Single Nozzle', price: 4500, category: 'Petrol', image: '/assets/images/luxury_fuel_dispenser_1782231192519.jpg' },
  { id: '2', name: 'Matic LFX Double Nozzle', price: 6200, category: 'Petrol/Diesel', image: '/assets/images/luxury_fuel_dispenser_1782231192519.jpg' },
  { id: '3', name: 'Matic Pro 4-Nozzle Multi-Product', price: 9800, category: 'Multi', image: '/assets/images/luxury_fuel_dispenser_1782231192519.jpg' },
  { id: '4', name: 'Matic High-Flow Diesel', price: 5100, category: 'Diesel', image: '/assets/images/luxury_fuel_dispenser_1782231192519.jpg' },
  { id: '5', name: 'Matic LPG Dual Dispenser', price: 7500, category: 'LPG', image: '/assets/images/luxury_fuel_dispenser_1782231192519.jpg' },
  { id: '6', name: 'Matic Compact EV Charger', price: 3200, category: 'EV', image: '/assets/images/luxury_fuel_dispenser_1782231192519.jpg' },
];

const visitors: Record<string, { id: string, page: string, ip: string, joinedAt: Date }> = {};

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: '*' }
  });
  const PORT = 3000;

  io.on('connection', (socket) => {
    visitors[socket.id] = { id: socket.id, page: 'home', ip: socket.handshake.address, joinedAt: new Date() };
    io.emit('visitors_update', Object.values(visitors));

    socket.on('page_view', (page) => {
      if (visitors[socket.id]) {
        visitors[socket.id].page = page;
        io.emit('visitors_update', Object.values(visitors));
      }
    });

    socket.on('disconnect', () => {
      delete visitors[socket.id];
      io.emit('visitors_update', Object.values(visitors));
    });
  });

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  app.get('/api/config', (req, res) => res.json(siteConfig));
  app.put('/api/config', (req, res) => {
    siteConfig = { ...siteConfig, ...req.body };
    res.json(siteConfig);
  });

  app.get('/api/products', (req, res) => res.json(products));
  app.post('/api/products', (req, res) => {
    const newProduct = { ...req.body, id: Date.now().toString() };
    products.push(newProduct);
    res.json(newProduct);
  });
  app.delete('/api/products/:id', (req, res) => {
    products = products.filter(p => p.id !== req.params.id);
    res.json({ success: true });
  });

  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const systemInstruction = `You are a helpful customer service AI for ${siteConfig.name}. 
Address: ${siteConfig.address}
Phone: ${siteConfig.phone}
Email: ${siteConfig.email}

You can recommend dispensers, explain features, diagnose faults, help book appointments, or request quotation details. Always direct them to contact details for complex issues or immediate support. Keep the tone premium and sophisticated.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          ...(history || []),
          { role: 'user', parts: [{ text: message }] }
        ],
        config: { systemInstruction }
      });

      res.json({ reply: response.text });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: 'Failed to process chat message' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
