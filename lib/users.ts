import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_JSON = path.join(DATA_DIR, "users.json");

export type UserRole = "admin" | "editor";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export async function ensureUsersFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(USERS_JSON);
  } catch {
    await fs.writeFile(USERS_JSON, JSON.stringify([]));
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  await ensureUsersFile();
  const data = await fs.readFile(USERS_JSON, "utf-8");
  const users: User[] = JSON.parse(data);
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function findUserById(id: string): Promise<User | null> {
  await ensureUsersFile();
  const data = await fs.readFile(USERS_JSON, "utf-8");
  const users: User[] = JSON.parse(data);
  return users.find((u) => u.id === id) ?? null;
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash);
}

export async function createUser(
  name: string,
  email: string,
  password: string,
  role: UserRole = "editor"
): Promise<User> {
  await ensureUsersFile();
  const data = await fs.readFile(USERS_JSON, "utf-8");
  const users: User[] = JSON.parse(data);
  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) throw new Error("Email already exists");
  const id = `user-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const passwordHash = await bcrypt.hash(password, 10);
  const now = new Date().toISOString();
  const user: User = {
    id,
    name,
    email,
    passwordHash,
    role,
    createdAt: now,
    updatedAt: now,
  };
  users.push(user);
  await fs.writeFile(USERS_JSON, JSON.stringify(users, null, 2));
  return user;
}
