import express from 'express';
import { getShortUrl, shortenUrl } from '../controllers/shortUrl.controller';
import { shortenUrlRateLimiter } from '../middleware/rateLimiter';
import { checkLinkExpiry } from '../middleware/checkLinkExpiry';
import requireAuth from '../middleware/requireAuth';
const router = express.Router();

/* Routes */

router.post('/shorten', shortenUrlRateLimiter, requireAuth, shortenUrl)
router.get('/:slug', checkLinkExpiry, getShortUrl)


export default router;