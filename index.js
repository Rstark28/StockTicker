const http = require('http');
const { MongoClient, ServerApiVersion } = require('mongodb');

// MongoDB connection URI
const uri = "mongodb+srv://robertstark:123@cluster0.ynfto.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create MongoDB client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const port = process.env.PORT || 3000;

// Function to test MongoDB connection
async function testMongoConnection() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Successfully connected to MongoDB!");

    // Optionally, list databases to verify connection
    const databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  } finally {
    await client.close();
  }
}

// Create a basic HTTP server
http.createServer(async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  if (req.url === '/test-db') {
    try {
      await testMongoConnection();
      res.end("MongoDB connection test passed! Check server logs for details.");
    } catch (err) {
      res.end("MongoDB connection test failed! Check server logs for details.");
    }
  } else {
    res.end("Hello! Visit /test-db to check MongoDB connection.");
  }
}).listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
