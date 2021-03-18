import express, { response } from "express";
import bodyParser from "body-parser";
import Crypto from "./Crypto";
import MemoryDataStore from "./MemoryDataStore";

const crypto = new Crypto();
const dataStore = new MemoryDataStore();
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get("/tokens", async (req, res) => {
  const tokenQs = <string>req.query.t;
  const tokens = tokenQs.split(",");
  const response: { [token: string]: string } = {};
  for (const token of tokens) {
    response[token] = crypto.decrypt(await dataStore.get(token));
  }
  res.send(response);
});

app.post("/token", async (req, res) => {
  const secret = crypto.encrypt(req.body.secret);
  const token = crypto.generateToken();
  await dataStore.put(token, secret);
  res.send({
    token: token,
  });
});

app.put("/token/:token", async (req, res) => {
  const token = req.params.token;
  const secret = crypto.encrypt(req.body.secret);
  await dataStore.put(token, secret);
  res.send({
    token: token,
  });
});

app.delete("/token/:token", async (req, res) => {
  const token = req.params.token;
  await dataStore.delete(token);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`tokenization server listening at http://localhost:${port}`);
});
