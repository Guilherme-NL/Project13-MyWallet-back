import joi from "joi";
import dayjs from "dayjs";
import { db } from "../dbStrategy/mongo.js";

const day = dayjs().format("DD/MM");

export async function getBills(req, res) {
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
}

export async function postBills(req, res) {
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
}
