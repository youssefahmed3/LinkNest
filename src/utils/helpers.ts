import { Request } from "express";

export async function getIp(req: Request) {
    return req.headers['x-forwarded-for'] || req.socket.remoteAddress
}