import "dotenv/config";
import { ShortenUrlSchemaInput } from '../models/url';
import * as shortUrlService from '../services/shortUrl.service';
import geoip from 'geoip-lite';
import { getIp } from "../utils/helpers";
import QRCode from "qrcode";
import { auth } from "../utils/auth";
import { fromNodeHeaders } from "better-auth/node";

export async function shortenUrl(req: any, res: any) {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });




    const parseResult = ShortenUrlSchemaInput.safeParse(req.body);

    if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.format() });
    }

    const UrlData = parseResult.data;

    const link = await shortUrlService.shortenUrl(UrlData, session?.user.id as string);
    const shortUrl = `${process.env.BASE_URL}/shortUrl/${link[0].short_slug}`
    const qrCodeImage = await QRCode.toDataURL(shortUrl);
    /* Return the link */
    res.status(201).json({ shortUrl, qrCodeImage });
}

export async function getShortUrl(req: any, res: any) {
    const slug = req.params.slug;

    const ip_address = await getIp(req) as string;
    const userAgent = req.headers['user-agent'];
    const referer = req.headers['referer'] || 'Unknown';

    var geo = geoip.lookup(ip_address as string)
    const country = geo ? geo.country : 'Unknown';

    const userInfo: { ip_address: string, userAgent: string, referer: string, country: string } = {
        ip_address,
        userAgent,
        referer,
        country
    }
    console.log(userInfo);

    const link = await shortUrlService.getShortUrl(slug, userInfo);
    // res.status(200).json(link[0].original_url);
    res.redirect(link[0].original_url);
}