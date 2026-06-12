import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let webhookUrl = searchParams.get("url");

    if (!webhookUrl) {
      // Use the request's origin to auto-detect
      const host = request.headers.get("host") || "localhost:3000";
      const protocol = host.includes("localhost") ? "http" : "https";
      webhookUrl = `${protocol}://${host}/api/bot`;
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: "TELEGRAM_BOT_TOKEN environment variable is not set" },
        { status: 500 }
      );
    }

    const res = await fetch(
      `https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(webhookUrl)}&drop_pending_updates=true`,
      { method: "POST" }
    );

    const data = await res.json();

    return NextResponse.json({
      ok: data.ok,
      description: data.description,
      webhook_url: webhookUrl,
    });
  } catch (error) {
    console.error("Set webhook error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
