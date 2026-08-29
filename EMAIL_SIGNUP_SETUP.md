# Email signup setup

The React form submits to the same-origin Vercel Function at `/api/subscribe`.
That function validates and normalizes the intake fields before forwarding them
to Google Apps Script. The Apps Script URL and shared secret are server-only and
must not use a `VITE_` prefix.

## Vercel configuration

Add this environment variable to the Vercel project for Production, Preview,
and Development:

```text
SIGNUP_WEB_APP_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
SIGNUP_SHARED_SECRET=YOUR_LONG_RANDOM_SHARED_SECRET
```

Redeploy after adding or changing the variable.

For local end-to-end testing, install the Vercel CLI and run `vercel dev` with
the same variable in `.env.local`. A plain `vite` dev server does not execute
files in `api/`.

## Apps Script behavior

The complete Apps Script implementation is versioned in `google-apps-script/`.
Its `doPost(e)` handler:

1. Verifies the server-to-server shared secret.
2. Validates and normalizes the intake data.
3. Suppresses duplicate normalized email addresses.
4. Appends new leads to the configured Sheet.
5. Sends an immediate visitor acknowledgment and a new-lead notification.
6. Records email-delivery status in the lead row.
7. Returns structured JSON to the Vercel Function.

Supported success response:

```json
{ "status": "subscribed" }
```

Supported duplicate responses:

```json
{ "status": "duplicate" }
```

or

```json
{ "duplicate": true }
```

Supported failure response:

```json
{ "status": "error" }
```

The Vercel Function intentionally does not expose provider response details to
visitors. Provider failures are logged in Vercel and returned as a generic,
retryable form error.

## External setup still required

Follow `google-apps-script/README.md` to create the Sheet, configure Script
Properties, authorize email sending, and deploy the test web app. Then test with
a controlled address and verify the stored row and both delivered emails.
