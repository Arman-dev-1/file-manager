import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Get full body
    console.log("Received Data:", body);

    if (!body.name || !body.size || !body.type || !body.content) {
      return NextResponse.json({ message: "Invalid file data" }, { status: 400 });
    }

    await client.connect();
    const database = client.db("documents");
    const collection = database.collection("data");

    const file = {
      name: body.name,
      size: body.size,
      type: body.type,
      content: body.content, // Make sure content is structured correctly
      uploadedAt: new Date(),
    };

    const result = await collection.insertOne(file);

    return NextResponse.json({ message: "Document saved successfully", id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Error saving document:", error);
    return NextResponse.json({ message: "Failed to save document" }, { status: 500 });
  }
}
