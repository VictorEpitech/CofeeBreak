import { Appwrite } from "appwrite";

const BASE_URL = process.env.NODE_ENV === "development" ? "http://localhost:4000" : "";

const client = new Appwrite().setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_URL).setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT)

const login = () => client.account.createOAuth2Session("microsoft", `${BASE_URL}/auth/success`, `${BASE_URL}/auth/failure`)

export { client, login }