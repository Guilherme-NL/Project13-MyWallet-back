import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

//Mongo connection
const mongoClient = new MongoClient(process.env.URL_CONNECT_MONGO);
let db;

mongoClient.connect().then(() => {
  db = mongoClient.db("MyWallet");
});

export { db };
