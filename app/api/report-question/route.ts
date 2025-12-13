import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const FILE_NAME = "reported-questions.json";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      !body ||
      typeof body.reason !== "string" ||
      body.reason.trim().length === 0 ||
      typeof body.question !== "object" ||
      body.question === null
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const rootDir = process.cwd();
    const dataDir = path.join(rootDir, "data");
    const filePath = path.join(dataDir, FILE_NAME);

    await fs.mkdir(dataDir, { recursive: true });

    let existing: unknown[] = [];
    try {
      const content = await fs.readFile(filePath, "utf-8");
      existing = JSON.parse(content);
      if (!Array.isArray(existing)) existing = [];
    } catch {
      existing = [];
    }

    const entry = {
      question: body.question,
      reason: body.reason.trim(),
      description:
        typeof body.description === "string" ? body.description.trim() : "",
      createdAt: new Date().toISOString(),
    };

    existing.push(entry);

    await fs.writeFile(filePath, JSON.stringify(existing, null, 2), "utf-8");

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Error saving reported question", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
