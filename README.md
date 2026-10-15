# Countlr

Countlr is a simple counter app for tracking repeated events over time.

## Monthly Google Play submission

The `Monthly Android submission` GitHub Actions workflow builds the default
branch on the first of each month at 09:17 UTC and submits that exact Android
App Bundle to Google Play's **internal testing** track. You can also run it from
the Actions tab with **Run workflow**. It waits for both the build and submission
and fails if either fails. It does not promote releases to production.

Before the first run:

1. Add an Expo access token with access to the `broothie/countlr` EAS project as
   the GitHub repository Actions secret `EXPO_TOKEN`.
2. With EAS CLI 24.14.0, run `eas credentials --platform android` interactively
   from this repository. Select the `monthly` profile and configure/reuse the
   Android signing keystore and Google Play service account key for EAS Submit.
   Grant that service account access to `com.broothie.countlr` in Play Console,
   including permission to release to testing tracks. Keep the key in EAS;
   do not commit it or put it in the workflow.
3. Configure `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` in
   the EAS project's **production** environment. These are bundled public app
   settings; use the Supabase anon key, never a service-role key.
4. Run `eas build:version:get --platform android --profile monthly` and check
   that the EAS remote version code is at least the highest code already uploaded
   to Play. If needed, use `eas build:version:set --platform android --profile monthly`
   to set that baseline. Every subsequent build automatically increments it.
5. Complete the app's initial Play Console setup and first manual upload if it
   has never been uploaded before. Clear any outstanding Play policy requirements,
   then run the workflow manually and check the internal release in Play Console.

EAS build quotas/billing and Google Play policy checks still apply. A successful
submission does not guarantee that Google clears an account inactivity warning;
check Policy status after the first release. GitHub can disable scheduled
workflows in public repositories after 60 days without repository activity;
re-enable it in Actions if that happens. Monthly builds alone do not guarantee
that the schedule stays enabled. Configure GitHub Actions failure notifications
so credential expiry or rejected submissions are visible.

## Play Store Short Description

Track event counts over time with quick taps and timeline insights.

## Play Store Full Description

Countlr helps you track how often important events happen in your day-to-day life.

Create custom events, increment counts with one tap, and review your activity over time. Whether you are tracking habits, routines, goals, or recurring tasks, Countlr gives you a fast and lightweight way to stay consistent.

### What you can do

- Create and manage custom events
- Increment event counts instantly
- View event totals at a glance
- Explore occurrence timelines by hour, day, week, month, or year
- Sign in securely to keep your data tied to your account

Countlr is designed to be clean, focused, and easy to use so you can spend less time logging and more time making progress.

## Account Deletion Requests

If you want your account and associated data deleted, please open a new issue in this repository and include the email address tied to your account.

Create a deletion request here: [Open a new issue](https://github.com/broothie/countlr/issues/new)
