import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const FILE_NAME = "proposed-questions.json";
const RATE_FILE = "propose-rate.json";
const COOLDOWN_SECONDS = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const rootDir = process.cwd();
    const dataDir = path.join(rootDir, "data");
    const ratePath = path.join(dataDir, RATE_FILE);
    await fs.mkdir(dataDir, { recursive: true });

    try {
      const rateContent = await fs.readFile(ratePath, "utf-8");
      const rates = JSON.parse(rateContent || "{}");
      const last = typeof rates[ip] === "number" ? rates[ip] : 0;
      const now = Date.now();
      const elapsed = Math.floor((now - last) / 1000);
      if (last && elapsed < COOLDOWN_SECONDS) {
        const retryAfter = COOLDOWN_SECONDS - elapsed;
        return NextResponse.json(
          { error: "Too many requests", retryAfter },
          { status: 429, headers: { "Retry-After": String(retryAfter) } }
        );
      }
    } catch {
      // ignore missing rate file
    }

    if (
      !body ||
      typeof body.category !== "string" ||
      typeof body.difficulty !== "string" ||
      typeof body.frequency !== "string" ||
      !body.translations ||
      !body.translations.en ||
      !body.translations.fr
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const filePath = path.join(rootDir, "data", FILE_NAME);

    let existing: unknown[] = [];
    try {
      const content = await fs.readFile(filePath, "utf-8");
      existing = JSON.parse(content);
      if (!Array.isArray(existing)) existing = [];
    } catch {
      existing = [];
    }

    const entry = {
      category: body.category,
      difficulty: body.difficulty,
      frequency: body.frequency,
      translations: body.translations,
      createdAt: new Date().toISOString(),
    };

    existing.push(entry);

    await fs.writeFile(filePath, JSON.stringify(existing, null, 2), "utf-8");

    try {
      const ratePath2 = path.join(rootDir, "data", RATE_FILE);
      let rates: Record<string, number> = {};
      try {
        const rc = await fs.readFile(ratePath2, "utf-8");
        rates = JSON.parse(rc || "{}");
      } catch {
        rates = {};
      }
      rates[ip] = Date.now();
      await fs.writeFile(ratePath2, JSON.stringify(rates, null, 2), "utf-8");
    } catch (e) {
      console.warn("Could not update rate file", e);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Error saving proposed question", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
