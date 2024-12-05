const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://robertstark:123@cluster0.ynfto.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function main() {
    try {
        // Use connect method to connect to the server
        await client.connect();
        console.log('Connected successfully to server');

        // Get the admin database
        const adminDb = client.db().admin();

        // List databases
        const databasesList = await adminDb.listDatabases();

        console.log('Databases:');
        databasesList.databases.forEach(db => console.log(` - ${db.name}`));
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        // Close connection
        await client.close();
    }
}

main().catch(console.error);
