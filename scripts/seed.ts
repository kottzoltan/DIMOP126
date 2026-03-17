/**
 * Seed 2 demo companies
 */
import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const COMPANIES_JSON = path.join(DATA_DIR, "companies.json");
const TEMPLATE = path.join(process.cwd(), "template", "DIMOP126B végleges, kalkulátor_v1.xlsx");

const DEMO_COMPANIES = [
  {
    id: "demo-1",
    name: "Gipsz Jakab Kft.",
    slug: "gipsz-jakab-kft",
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-2",
    name: "Tech Innováció Zrt.",
    slug: "tech-innovacio-zrt",
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function seed() {
  await fs.mkdir(path.join(DATA_DIR, "companies"), { recursive: true });
  await fs.writeFile(COMPANIES_JSON, JSON.stringify(DEMO_COMPANIES, null, 2));

  for (const c of DEMO_COMPANIES) {
    const dir = path.join(DATA_DIR, "companies", c.id);
    await fs.mkdir(dir, { recursive: true });
    const wbPath = path.join(dir, "application.xlsx");
    await fs.copyFile(TEMPLATE, wbPath);

    const formData: Record<string, unknown> = {
      alap_dii_felmérés: true,
      alap_alkalmazotti_letszam: 5,
      alap_projekt_honap: 12,
      alap_30mbps: true,
      alap_tavoli_hozzaferes: true,
      hw_szamitogep: 1,
      hw_monitor: 2,
      hw_laptop: 1,
      sw_figyelembe_7: "Pályázatból szerzi be",
      sw_mennyiseg_7: 3,
      sw_figyelembe_10: "Pályázatból szerzi be",
      sw_mennyiseg_10: 1,
    };
    await fs.writeFile(
      path.join(dir, "form-data.json"),
      JSON.stringify(formData, null, 2)
    );
  }

  console.log("Seed done. 2 demo companies created.");
}

seed().catch(console.error);
