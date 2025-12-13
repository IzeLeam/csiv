import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const FILE_NAME = "proposed-questions.json";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const rootDir = process.cwd();
    const dataDir = path.join(rootDir, "data");
    await fs.mkdir(dataDir, { recursive: true });

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

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Error saving proposed question", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
