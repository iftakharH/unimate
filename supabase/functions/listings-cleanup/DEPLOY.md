# Deploying & Scheduling 'listings-cleanup'

This Edge Function handles the auto-deletion of listings older than 30 days and sends usage warnings 3 days prior.

## 1. Deploy the Function

Run the following command in your terminal (ensure you are logged in to Supabase CLI):

```bash
npx supabase functions deploy listings-cleanup --no-verify-jwt
```

## 2. Schedule the Cron Job

To run this function automatically every day, you need to set up a Cron Job in your Supabase project.

### Option A: SQL Editor (Recommended)
Go to the **SQL Editor** in your Supabase Dashboard and run:

```sql
select
  cron.schedule(
    'cleanup-every-day',
    '0 0 * * *', -- Runs at 00:00 (Midnight) every day
    $$
    select
      net.http_post(
          url:='https://<YOUR_PROJECT_ID>.supabase.co/functions/v1/listings-cleanup',
          headers:='{"Content-Type": "application/json", "Authorization": "Bearer <YOUR_SERVICE_ROLE_KEY>"}'::jsonb
      ) as request_id;
    $$
  );
```
**Important:**
- Replace `<YOUR_PROJECT_ID>` with your actual Supabase Project ID (found in URL).
- Replace `<YOUR_SERVICE_ROLE_KEY>` with your **Service Role Key** (found in Project Settings > API). **Do NOT use the Anon key.**

### Option B: config.toml
If you are managing config locally:

```toml
[functions.listings-cleanup]
verify_jwt = false
```

## 3. Verification

Once deployed and scheduled:
1. The function will run daily.
2. It will delete listings where `created_at` > 30 days.
3. It will insert a warning message into the `messages` table for listings expiring in 3 days.
