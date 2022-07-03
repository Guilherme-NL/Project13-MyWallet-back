import { db } from "../dbStrategy/mongo.js";

async function tokenValidate(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  const session = await db.collection("sessions").findOne({ token });

  if (!session) {
    return res.sendStatus(401);
  }

  res.locals.session = session;

  next();
}

export default tokenValidate;
