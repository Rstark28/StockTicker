var http = require("http");
var url = require("url");
var fs = require("fs");
const { MongoClient, ServerApiVersion } = require("mongodb");
const querystring = require("querystring");

const uri =
  "mongodb+srv://djangoproj210:123@cluster0.ghk5p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const db = "Stock";
const collection = "PublicCompanies";

const port = process.env.PORT || 3000;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function searchCompanies(query, type) {
  try {
    // Connect to MongoDB
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // Select the db and collection
    const database = client.db(db);
    const companies = database.collection(collection);

    // Search for companies
    // Regex allows for partial matches (e.g. Blizzard -> Blizzard, Activision Blizzard)
    if (type === "ticker") {
      return await companies
        .find({ Ticker: { $regex: query, $options: "i" } })
        .toArray();
    } else if (type === "company") {
      return await companies
        .find({ Company: { $regex: query, $options: "i" } })
        .toArray();
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching data from MongoDB");
  } finally {
    await client.close();
  }
}

http
  .createServer(async function (req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    var urlObj = url.parse(req.url, true);
    var path = urlObj.pathname;

    // If the path is /, read the home.html file
    if (path == "/") {
      fs.readFile("views/home.html", function (err, data) {
        if (err) {
          res.write("Error reading html");
          return res.end();
        } else {
          res.write(data);
          return res.end();
        }
      });
    }
    // If the path is /process, process the search query
    else if (path == "/process") {
      const query = urlObj.query.query;
      const type = urlObj.query.type;

      try {
        const companies = await searchCompanies(query, type);

        // Log info in console for debugging
        companies.forEach((company) => {
          console.log(
            `Name: ${company.Company}, Ticker: ${company.Ticker}, Price: $${company.Price}`
          );
        });

        // Create the HTML content
        let companyHtml = companies
          .map((company) => {
            return `<div>
                          <h3>${company.Company}</h3>
                          <p>Ticker: ${company.Ticker}</p>
                          <p>Price: $${company.Price}</p>
                        </div>`;
          })
          .join("");

        // Read and add data to process.html
        const data = fs.readFileSync("views/process.html", "utf8");
        const htmlContent = data.replace(
          "<!-- data -->",
          companyHtml
        );
        res.write(htmlContent);
        return res.end();
      } catch (error) {
        console.error(error);
        return res.end();
      }
    }
  })
  .listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
