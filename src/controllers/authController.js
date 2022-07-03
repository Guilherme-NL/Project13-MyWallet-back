import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { db } from "../dbStrategy/mongo.js";

export async function postRegistration(req, res) {
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
}

export async function postLogin(req, res) {
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
}
