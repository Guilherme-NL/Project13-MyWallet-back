import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import joi from "joi";
import dotenv from "dotenv";
dotenv.config();
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const day = dayjs().format("DD/MM");

const server = express();

server.use(cors());
server.use(express.json());

//Mongo connection
const mongoClient = new MongoClient(process.env.URL_CONNECT_MONGO);
let db;

mongoClient.connect().then(() => {
  db = mongoClient.db("MyWallet");
});

//routes
server.post("/registration", async (req, res) => {
  const user = req.body;
  console.log(user);

  //Validation joi
  const userSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
  });

  const { error } = userSchema.validate(user);

  if (error) {
    res.sendStatus(400);
    return;
  }

  //Email_validation
  const userValidation = await db
    .collection("users")
    .findOne({ email: user.email });

  if (userValidation !== null) {
    res.sendStatus(409);
    return;
  }

  const passwordCrypt = bcrypt.hashSync(user.password, 10);

  await db.collection("users").insertOne({ ...user, password: passwordCrypt });
  res.sendStatus(201);
});

server.post("/login", async (req, res) => {
  const user = req.body;

  //Validation joi
  const userSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  });

  const { error } = userSchema.validate(user);

  if (error) {
    res.sendStatus(422);
    return;
  }

  //user validation on mongodb
  const userValidation = await db
    .collection("users")
    .findOne({ email: user.email });

  if (userValidation === null) {
    return res.sendStatus(404);
  }

  //password validation
  const comparePassword = bcrypt.compareSync(
    user.password,
    userValidation.password
  );

  if (!comparePassword) {
    return res.status(401).send("Senha ou email incorretos!");
  }

  //Token generatioin
  const token = uuid();

  await db
    .collection("sessions")
    .insertOne({ token, email: userValidation.email, ID: userValidation._id });

  res.status(200).send({ token, name: userValidation.name });
});

server.get("/bills", async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  console.log(token);

  const session = await db.collection("sessions").findOne({ token });
  console.log(session);

  if (!session) {
    return res.sendStatus(401);
  }

  const bills = await db
    .collection("bills")
    .find({ email: session.email })
    .toArray();
  console.log(bills);

  res.send(bills);
});

server.post("/bills", async (req, res) => {
  const { value, description } = req.body;
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  //Validation joi
  const CapitalSchema = joi.object({
    value: joi.number().required(),
    description: joi.string().required(),
  });

  const { error } = CapitalSchema.validate(req.body);

  if (error) {
    res.sendStatus(400);
    return;
  }

  const session = await db.collection("sessions").findOne({ token });

  if (!session) {
    return res.sendStatus(401);
  }

  await db
    .collection("bills")
    .insertOne({ value, description, day, email: session.email });

  res.sendStatus(201);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT);
