# TrustVC Actions

A lightweight redirect handler for TrustVC document actions. It parses an encoded action from the URL query string, validates the redirect domain against a whitelist, and redirects the user after a short countdown.

## How it works

The app expects a `?q=` query parameter containing a URI-encoded JSON action:

```json
{
  "type": "DOCUMENT",
  "payload": {
    "uri": "https://...",
    "permittedActions": ["VIEW", "STORE"],
    "redirect": "https://ref.tradetrust.io",
    "chainId": 101010
  }
}
```

- If the `redirect` domain is in the whitelist (`tradetrust.io`), the user is shown a countdown and redirected.
- If the domain is not whitelisted, an error message is shown and no redirect occurs.
- If no `redirect` is specified, "No platform specified" is shown.

## Development

```bash
npm install
npm run dev
```

## Testing

Integration tests use TestCafe with a headless Chrome browser. Build the app first, then run:

```bash
npm run build
npm run integration:headless
```

## Deployment

Deploys are **manual only**. Trigger via GitHub → Actions → choose the workflow → Run workflow:

- **Deploy to AWS (production)** → deploys to the **production** environment
- **Deploy to AWS (develop)** → deploys to the **develop** environment

Deployment uses AWS S3 + CloudFront, authenticated with an IAM user's access keys.

AWS region is hardcoded to `ap-southeast-1` (Singapore) in both workflows.

Required **repository secrets** (Settings → Secrets and variables → Actions):

- `AWS_ACCESS_KEY_ID_PROD` / `AWS_SECRET_ACCESS_KEY_PROD`
- `AWS_ACCESS_KEY_ID_DEV` / `AWS_SECRET_ACCESS_KEY_DEV`
- `AWS_S3_BUCKET_PROD` / `AWS_S3_BUCKET_DEV`
- `AWS_CLOUDFRONT_DISTRIBUTION_ID_PROD` / `AWS_CLOUDFRONT_DISTRIBUTION_ID_DEV`
