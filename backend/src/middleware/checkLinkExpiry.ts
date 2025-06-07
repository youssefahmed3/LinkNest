import { Request, Response, NextFunction } from 'express';
import * as shortUrlService from '../services/shortUrl.service';
import { getIp } from '../utils/helpers';
import geoip from 'geoip-lite';

export async function checkLinkExpiry(req: Request, res: Response, next: NextFunction): Promise<void> {
    const slug = req.params.slug;
    const ip_address = await getIp(req) as string;
    const userAgent = req.headers['user-agent'] as string || 'Unknown'; 
    const referer = req.headers['referer'] || 'Unknown';

    const geo = geoip.lookup(ip_address);
    const country = geo ? geo.country : 'Unknown';

    const userInfo = {
        ip_address,
        userAgent,
        referer,
        country
    };

    try {
        const link = await shortUrlService.getShortUrl(slug, userInfo);

        if (!link || link.length === 0) {
            res.status(404).json({ message: 'Link not found' });
            return;
        }

        const { expireAt } = link[0];

        if (expireAt && new Date(expireAt) < new Date()) {
            res.status(410).json({ message: 'Link has expired' });
            return;
        }

        next();
    } catch (error) {
        console.error('Error checking link expiry:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
