# Google Apps Script test setup

Create the test version under the developer's personal Google account. For
launch, copy the finalized Sheet and script into Marie's business account and
create a new deployment owned and authorized by Marie.

## Create the test Sheet and script

1. Create a blank Google Sheet named `Build to Burn Leads - TEST`.
2. In the Sheet, open **Extensions → Apps Script**.
3. Replace `Code.gs` with the repository's `Code.gs` contents.
4. In **Project Settings**, enable **Show appsscript.json manifest file in
   editor**, then replace it with this directory's `appsscript.json`.
5. In **Project Settings → Script Properties**, add:
   - `SIGNUP_SHARED_SECRET`: a long random value matching Vercel.
   - `MARIE_NOTIFICATION_EMAIL`: use the developer's email during testing;
     change this to `mflemkul@gmail.com` only when Marie approves live tests.
   - `CONSULTATION_BOOKING_URL`: optional; omit until Marie supplies it.
6. Select `setupLeadsSheet` in the function menu and click **Run**. Review and
   authorize the requested Sheet and email-sending permissions. This stores the
   Sheet ID in Script Properties and creates/formats the `Leads` tab.

## Deploy the test endpoint

1. Choose **Deploy → New deployment → Web app**.
2. Set **Execute as** to the deploying account.
3. Set access to allow the Vercel Function to call the endpoint without an
   interactive Google login.
4. Deploy a version and copy the `/exec` URL.
5. Add the URL as `SIGNUP_WEB_APP_URL` in the Vercel Preview environment.
6. Add the same shared secret as `SIGNUP_SHARED_SECRET` in Vercel Preview.
7. Redeploy the preview and submit a controlled test lead.

Never put `SIGNUP_SHARED_SECRET` in frontend code or use a `VITE_` prefix.

## Production handoff

Repeat the setup in a Sheet and Apps Script project owned by Marie's business
Google account. Marie must authorize and deploy that production copy. Replace
the Vercel Production environment variables with Marie's new deployment URL
and its new shared secret, redeploy, and run one controlled end-to-end test.
