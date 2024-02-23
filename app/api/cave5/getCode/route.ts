import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const apiKey = searchParams.get("apiKey");
    const orderId = searchParams.get("orderId");
    const response = await fetch(`https://give-sms.com/api/v1/?method=getcode&order_id=${orderId}&userkey=${apiKey}`);
    const data = await response.json();
    return NextResponse.json({ data: data, message: "success" });
}

export async function POST(request: NextRequest) {
    const req = await request.json();
    try {
        const activate = req.status==='cancel' ? await fetch(`https://give-sms.com/stubs/handler_api.php?action=setStatus&status=8&id=${req.order_id}&api_key=${req.apiKey}`) : await fetch(`https://give-sms.com/api/v1/?method=wrongcode&order_id=${req.order_id}&userkey=${req.apiKey}&last_id=${req.order_id}`);
        if (!activate.ok) {
            throw new Error(`Failed to set status: ${activate.statusText}`);
        }
        const data = activate.json();
        return NextResponse.json({data: data, message: "success"});
    } catch (error) {
        return NextResponse.json({ message: "error", error: error });
    }
}