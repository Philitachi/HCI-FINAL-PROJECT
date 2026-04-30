export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    return res.status(500).json({ success: false, message: 'reCAPTCHA is not configured' });
  }

  const { token } = req.body || {};
  if (!token) {
    return res.status(400).json({ success: false, message: 'Missing reCAPTCHA token' });
  }

  const formData = new URLSearchParams();
  formData.append('secret', secretKey);
  formData.append('response', token);

  try {
    const verificationResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    const verificationResult = await verificationResponse.json();

    if (!verificationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Robot check failed. Please try again.',
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to verify robot check. Please try again.',
    });
  }
}
