import joi from "joi";
import dayjs from "dayjs";
import { db } from "../dbStrategy/mongo.js";

const day = dayjs().format("DD/MM");

export async function getBills(req, res) {
  const session = res.locals.session;

  const bills = await db
    .collection("bills")
    .find({ email: session.email })
    .toArray();
  console.log(bills);

  res.send(bills);
}

export async function postBills(req, res) {
  const { value, description } = req.body;
  const session = res.locals.session;

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

  await db
    .collection("bills")
    .insertOne({ value, description, day, email: session.email });

  res.sendStatus(201);
}
