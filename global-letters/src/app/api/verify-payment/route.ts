import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { orderID } = await req.json();

    if (!orderID) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret || clientId === "여기에_PAYPAL_CLIENT_ID를_붙여넣으세요") {
      console.warn("PayPal API Keys are missing. Returning mock verification success for development.");
      return NextResponse.json({ success: true, verified: true });
    }

    // 1. Get Access Token from PayPal
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const tokenResponse = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      throw new Error("Failed to get PayPal access token");
    }

    // 2. Verify the Order
    const orderResponse = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}`, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const orderData = await orderResponse.json();

    // Check if the order is completed and paid
    if (orderData.status === "COMPLETED") {
      return NextResponse.json({ success: true, verified: true });
    } else {
      return NextResponse.json({ success: false, verified: false, error: "Payment not completed" }, { status: 400 });
    }
  } catch (error) {
    console.error("PayPal verification error:", error);
    return NextResponse.json({ error: "Failed to verify payment." }, { status: 500 });
  }
}
