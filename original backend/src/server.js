//Last edited 18/08/2025
// Modules
const mongoose = require('mongoose');
const app = require('./app')
const dotenv = require('dotenv');

dotenv.config();
const PORT = process.env.PORT || 3000; // fallback for local/dev

// Connecting to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI environment variable.');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI, { })
  .then(() => {
    //console.log('MongoDB connected')

    //Starts the Server when mongodb is connected
    const server = app.listen(PORT, () => {
       //console.log(`Server running on http://localhost:${PORT}`);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      try {
        console.log(`Received ${signal}. Closing server...`);
        await mongoose.connection.close();
        server.close(() => process.exit(0));
      } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
      }
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('unhandledRejection', (reason) => {
      console.error('Unhandled Rejection:', reason);
      shutdown('unhandledRejection');
    });
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
      shutdown('uncaughtException');
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));