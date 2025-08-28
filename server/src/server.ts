import { server, initializeConnections } from "./app.js";

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    // Initialize database connections
    await initializeConnections();
    
    // Start the server
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

