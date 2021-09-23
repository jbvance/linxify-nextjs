import { hashPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";

async function handler(req, res) {
  // exit if it's not a POST request
  if (req.method !== "POST") {
    return;
  }

  const data = req.body;
  const { email, password } = data;

  if (
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 7
  ) {
    res.status(422).json({
      message:
        "Invalid input - please enter valid email and password with at least seven characters"
    });
    return;
  }

  const client = await connectToDatabase();
  const db = client.db();

  // check for an existing user with same email
  const existingUser = await db
    .collection("users")
    .findOne({ email: email.toLowerCase() });
  if (existingUser) {
    res.status(422).json({ message: "User already exists" });
    client.close();
    return;
  }

  // hash the password before storing
  const hashedPassword = await hashPassword(password);

  const result = await db.collection("users").insertOne({
    email: email.toLowerCase(),
    password: hashedPassword
  });
  res.status(201).json({ message: "Created user!" });
  client.close();
}

export default handler;
