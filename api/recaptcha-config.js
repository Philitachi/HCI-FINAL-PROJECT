export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ siteKey: '', message: 'Method not allowed' });
  }

  return res.status(200).json({
    siteKey: process.env.VITE_RECAPTCHA_SITE_KEY || process.env.RECAPTCHA_SITE_KEY || '',
  });
}
