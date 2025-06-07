import { nanoid } from 'nanoid';
import { db } from '../drizzle/index';
import { linkTable, visitTable } from '../drizzle/schema';
import { ShortenUrlInput } from '../models/url';
import { v4 as uuidv4 } from "uuid";
import { eq, and, sql } from "drizzle-orm";

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


export async function getAllShortUrlsForUser(userid: string) {
    const links = await db.select().from(linkTable).where(eq(linkTable.createdby, userid));
    return links;
}

export async function deleteShortUrl(slug: string, id: string) {
    const links = await db.delete(linkTable).where(and(eq(linkTable.short_slug, slug), eq(linkTable.createdby, id)))
    return links;
}



export async function getUserClicksAnalysis(userId: string) {
    // Total clicks for all links created by the user
  const totalClicksResult = await db
    .select({
      totalClicks: sql<number>`SUM(${visitTable.id} IS NOT NULL)`.mapWith(Number),
    })
    .from(visitTable)
    .innerJoin(linkTable, eq(visitTable.link_id, linkTable.id))
    .where(eq(linkTable.createdby, userId));

  const totalClicks = totalClicksResult[0]?.totalClicks ?? 0;

  // The most clicked link by visit count
  const mostClickedLinkResult = await db
    .select({
      linkId: linkTable.id,
      originalUrl: linkTable.original_url,
      short_slug: linkTable.short_slug,
      clickCount: sql<number>`COUNT(${visitTable.id})`.mapWith(Number),
    })
    .from(visitTable)
    .innerJoin(linkTable, eq(visitTable.link_id, linkTable.id))
    .where(eq(linkTable.createdby, userId))
    .groupBy(linkTable.id, linkTable.original_url)
    .orderBy(sql`COUNT(${visitTable.id}) DESC`)
    .limit(1);

  const mostClickedLink = mostClickedLinkResult[0] ?? null;

  // The country with the most visits for this user's links
  const mostCountryResult = await db
    .select({
      country: visitTable.country,
      visitCount: sql<number>`COUNT(*)`.mapWith(Number),
    })
    .from(visitTable)
    .innerJoin(linkTable, eq(visitTable.link_id, linkTable.id))
    .where(eq(linkTable.createdby, userId))
    .groupBy(visitTable.country)
    .orderBy(sql`COUNT(*) DESC`)
    .limit(1);

  const mostCountry = mostCountryResult[0] ?? null;

  // The referrer with the most visits for this user's links
  const mostReferrerResult = await db
    .select({
      referrer: visitTable.referrer,
      visitCount: sql<number>`COUNT(*)`.mapWith(Number),
    })
    .from(visitTable)
    .innerJoin(linkTable, eq(visitTable.link_id, linkTable.id))
    .where(eq(linkTable.createdby, userId))
    .groupBy(visitTable.referrer)
    .orderBy(sql`COUNT(*) DESC`)
    .limit(1);

  const mostReferrer = mostReferrerResult[0] ?? null;

  return {
    totalClicks,
    mostClickedLink,
    mostCountry,
    mostReferrer,
  };
}