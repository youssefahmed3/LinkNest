import express from 'express';
import { deleteShortUrl, getAllShortUrlsForUser, getAnalyticsForUser, getShortUrl, getUserClicksAnalysis, shortenUrl } from '../controllers/shortUrl.controller';
import { shortenUrlRateLimiter } from '../middleware/rateLimiter';
import { checkLinkExpiry } from '../middleware/checkLinkExpiry';
import requireAuth from '../middleware/requireAuth';
const router = express.Router();

/* Routes */

router.get('/links', requireAuth ,getAllShortUrlsForUser) // gets all the generated links for a specific user

router.delete('/links/:slug', requireAuth, deleteShortUrl) // deletes a specific link

router.post('/shorten', shortenUrlRateLimiter, requireAuth, shortenUrl) // shortens a link

router.get('/Analytics', getUserClicksAnalysis)

router.get('/:slug', checkLinkExpiry, getShortUrl) // gets a specific link


export default router;