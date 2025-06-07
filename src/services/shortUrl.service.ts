import { nanoid } from 'nanoid';
import { db } from '../drizzle/index';
import { linkTable, visitTable } from '../drizzle/schema';
import { ShortenUrlInput } from '../models/url';
import { v4 as uuidv4 } from "uuid";
import { eq, and } from "drizzle-orm";

type userInfo = {
    ip_address: string,
    userAgent: string,
    referer: string,
    country: string
}


export async function shortenUrl(UrlData: ShortenUrlInput, userid: string) {
    const link = await db.insert(linkTable).values({
        id: uuidv4(),
        createdby: userid,
        original_url: UrlData.original_url,
        short_slug: nanoid(6),
        expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }).returning(
        {
            id: linkTable.id,
            original_url: linkTable.original_url,
            short_slug: linkTable.short_slug
        }
    );
    return link;
}

export async function getShortUrl(slug: string, userInfo: userInfo) {
    const { ip_address, userAgent, referer, country } = userInfo
    const original_url = await db
        .select()
        .from(linkTable)
        .where(eq(linkTable.short_slug, slug))
        .limit(1);

    if (!original_url || original_url.length === 0) {
        throw new Error("Link not found");
    }

    // Check if this user has already visited this URL
    const alreadyVisited = await db.select()
        .from(visitTable)
        .where(
            and(
                eq(visitTable.link_id, original_url[0].id),
                eq(visitTable.ip_address, ip_address),
                eq(visitTable.user_agent, userAgent)
            )
        )
        .limit(1);


    if (!alreadyVisited.length) {
        // Save this new unique visit
        await db.insert(visitTable).values({
            id: uuidv4(),
            ip_address: ip_address,
            user_agent: userAgent,
            link_id: original_url[0].id,
            referrer: referer,
            country: country,
            clickedAt: new Date().toISOString(),
        })

        await db
        .update(linkTable)
        .set({ click_count: original_url[0].click_count + 1 })
        .where(eq(linkTable.id, original_url[0].id))
    }


    return original_url;
}