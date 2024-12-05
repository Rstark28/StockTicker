const http = require('http');
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://robertstark:123@cluster0.ynfto.mongodb.net/?retryWrites=true&w=majority&ssl=true";
const port = process.env.PORT || 3000;

async function testMongoConnection() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB!");
    await client.close();
    return "MongoDB connection successful!";
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    return `MongoDB connection failed: ${error.message}`;
  }
}

http.createServer(async (req, res) => {
  if (req.url === "/test-db") {
    const message = await testMongoConnection();
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(message);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
}).listen(port, () => console.log(`Server running on port ${port}`));
