const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COACHING_INTERESTS = new Set([
  'personal-training',
  'group-training',
  'online-coaching',
  'not-sure',
]);

const sendJson = (response, statusCode, body) => {
  response.status(statusCode).json(body);
};

export default async function subscribe(request, response) {
  response.setHeader('Cache-Control', 'no-store');

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    sendJson(response, 405, { status: 'error', message: 'Method not allowed.' });
    return;
  }

  const email = typeof request.body?.email === 'string'
    ? request.body.email.trim().toLowerCase()
    : '';
  const firstName = typeof request.body?.firstName === 'string'
    ? request.body.firstName.trim()
    : '';
  const phone = typeof request.body?.phone === 'string' ? request.body.phone.trim() : '';
  const coachingInterest = request.body?.coachingInterest;
  const goals = typeof request.body?.goals === 'string' ? request.body.goals.trim() : '';

  if (request.body?.website) {
    sendJson(response, 201, { status: 'subscribed' });
    return;
  }

  if (
    !firstName
    || firstName.length > 80
    || !EMAIL_PATTERN.test(email)
    || email.length > 254
    || phone.length > 30
    || !COACHING_INTERESTS.has(coachingInterest)
    || goals.length > 1000
  ) {
    sendJson(response, 400, { status: 'invalid', message: 'Check the form fields and try again.' });
    return;
  }

  const signupWebAppUrl = process.env.SIGNUP_WEB_APP_URL;
  const signupSharedSecret = process.env.SIGNUP_SHARED_SECRET;

  if (!signupWebAppUrl || !signupSharedSecret) {
    console.error('Email signup environment variables are not configured.');
    sendJson(response, 503, { status: 'error', message: 'Signup is temporarily unavailable.' });
    return;
  }

  try {
    const providerResponse = await fetch(signupWebAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: signupSharedSecret,
        firstName,
        email,
        phone,
        coachingInterest,
        goals,
        source: typeof request.body?.source === 'string' ? request.body.source : 'buildtoburn.com',
        submittedAt: new Date().toISOString(),
      }),
      redirect: 'follow',
    });

    if (!providerResponse.ok) {
      console.error(`Signup provider returned ${providerResponse.status}.`);
      sendJson(response, 502, { status: 'error', message: 'The signup provider rejected the request.' });
      return;
    }

    const providerResult = await providerResponse.json().catch(() => null);
    const providerStatus = providerResult?.status ?? providerResult?.result;

    if (providerStatus === 'duplicate' || providerResult?.duplicate === true) {
      sendJson(response, 409, { status: 'duplicate' });
      return;
    }

    if (
      providerResult?.success === true
      || providerStatus === 'success'
      || providerStatus === 'subscribed'
    ) {
      sendJson(response, 201, { status: 'subscribed' });
      return;
    }

    console.error('Signup provider returned an unrecognized response.');
    sendJson(response, 502, { status: 'error', message: 'The signup provider returned an invalid response.' });
  } catch (error) {
    console.error('Signup provider request failed.', error);
    sendJson(response, 502, { status: 'error', message: 'Could not reach the signup provider.' });
  }
}
