import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const apiKey = searchParams.get("api_key");
    const response = await fetch(`http://api1.5sim.net/stubs/handler_api.php?api_key=${apiKey}&action=getBalance`);
    const data = await response.text();
    return NextResponse.json({ data: data, message: "success" });
}

export async function POST(request: NextRequest) {
    try {
        const req = await request.json();
        const response = await fetch(`http://api1.5sim.net/stubs/handler_api.php?api_key=${req.apiKey}&action=getNumber&service=${req.service}&operator=${req.operator}&country=${req.country}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data = await response.text();
        if (data !== "") {
            const accessnumber = data.split(':');
            const activate = await fetch(`http://api1.5sim.net/stubs/handler_api.php?api_key=${req.apiKey}&action=setStatus&status=1&id=${accessnumber[1]}`);
            if (!activate.ok) {
                throw new Error(`Failed to set status: ${activate.statusText}`);
            }
        }
        return NextResponse.json({ data: data, message: "success" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "error", error: error });
    }
}
