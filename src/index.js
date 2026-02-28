require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const invoiceRoutes = require('./routes/invoice.routes');
const clientRoutes = require('./routes/client.routes');
const productRoutes = require('./routes/product.routes');
const authRoutes = require('./routes/auth.routes');
const devisRoutes = require('./routes/devis.routes');
const fournisseurRoutes = require('./routes/fournisseur.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/products', productRoutes);
app.use('/api/devis', devisRoutes);
app.use('/api/fournisseurs', fournisseurRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Invoice API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Something went wrong!',
    error: err.message
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
