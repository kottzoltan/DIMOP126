#!/usr/bin/env tsx
/**
 * Seed demo admin user
 * Email: admin@dimop.local
 * Password: demo123
 */
import path from "path";
import fs from "fs/promises";
import bcrypt from "bcryptjs";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_JSON = path.join(DATA_DIR, "users.json");

async function seedUsers() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  let users: Array<{
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  }> = [];
  try {
    const data = await fs.readFile(USERS_JSON, "utf-8");
    users = JSON.parse(data);
  } catch {
    users = [];
  }
  const existing = users.find((u) => u.email === "admin@dimop.local");
  if (existing) {
    console.log("Admin user already exists.");
    return;
  }
  const passwordHash = await bcrypt.hash("demo123", 10);
  const now = new Date().toISOString();
  users.push({
    id: "user-admin-demo",
    name: "Demo Admin",
    email: "admin@dimop.local",
    passwordHash,
    role: "admin",
    createdAt: now,
    updatedAt: now,
  });
  await fs.writeFile(USERS_JSON, JSON.stringify(users, null, 2));
  console.log("Demo admin user created: admin@dimop.local / demo123");
}

seedUsers().catch(console.error);
