import { demoUser } from "@/mock/data";

export const demoCredentials = {
  email: "demo@kita.ch",
  password: "demo123",
};

export async function validateUser(email: string, password: string) {
  if (email === demoCredentials.email && password === demoCredentials.password) {
    return demoUser;
  }
  return null;
}
