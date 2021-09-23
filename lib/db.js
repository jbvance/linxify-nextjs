import { MongoClient } from "mongodb";
export async function connectToDatabase() {
  console.log("DB", process.env.DB_CONNECT);
  const client = MongoClient.connect(process.env.DB_CONNECT);

  return client;
}
