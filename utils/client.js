import { Account, Client, Databases } from "appwrite";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://cofee-break.vercel.app";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_URL)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);
const account = new Account(client);
const database = new Databases(client, "default");
const login = () =>
  account.createOAuth2Session(
    "microsoft",
    `${BASE_URL}/auth/success`,
    `${BASE_URL}/auth/failure`
  );

export { client, login, account, database };
