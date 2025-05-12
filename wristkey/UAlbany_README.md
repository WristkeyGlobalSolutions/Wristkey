# Wristkey Global - May 2025

## Prerequisite Setup

### GitHub Repository

- URL: [https://github.com/WristkeyGlobalSolutions/Wristkey](https://github.com/WristkeyGlobalSolutions/Wristkey)

#### Clone the Repository

Via terminal:

```
git clone https://github.com/WristkeyGlobalSolutions/Wristkey.git
```

Or download as .zip via the green CODE button, then extract the contents.

----

### Next.js App Setup

Reference: https://nextjs.org/docs/app/getting-started/installation

Install base packages:

```
npm install next@latest react@latest react-dom@latest
```

Navigate into the project directory:

```
cd wristkey
```

Install project dependencies:

```
npm install
```

> This will install all dependencies, including Alchemy API and others. Initial installation may take time.

----

## Firebase Setup

Create a Firebase project and replace all relevant API keys in:

- .env.local
- firebaseConfig.ts

To create your local environment file, copy from example_env.txt and insert your project-specific data.

### Authentication (2FA Setup)

To enable MFA (TOTP) for your Firebase project, run this in a terminal (replace project_id):

```
$token = gcloud auth print-access-token
$headers = @{
  "Authorization" = "Bearer $token"
  "Content-Type" = "application/json"
  "X-Goog-User-Project" = "project_id"
}
$body = @"
{
  "mfa": {
    "providerConfigs": [{
      "state": "ENABLED",
      "totpProviderConfig": {
        "adjacentIntervals": 1
      }
    }]
  }
}
"@
Invoke-RestMethod `
  -Uri "https://identitytoolkit.googleapis.com/admin/v2/projects/project_id/config?updateMask=mfa" `
  -Method Patch `
  -Headers $headers `
  -Body $body `
  -ContentType "application/json"
```

### Firestore Rules

Copy the contents of firestoreRules.txt into your Firestore rules panel.

> When running the app, errors may prompt you to create indexes for notifications and conversations. Follow the prompts to complete these.

----

## Notes

- MetaMask is used in some features as a Web3 provider.
- It is recommended (but not required) for optimal MVP experience.

----

## Environment Setup

All API keys and sensitive data should go in .env.local.

Create this file in the root of your project (wristkey/) with values in the format:

```
VARIABLE_NAME=value
```

### Example Keys:

```
NEXT_PUBLIC_ALCHEMY_KEY=your_alchemy_key_here
NEXT_PUBLIC_ETHSCAN_KEY=your_etherscan_key_here
NEXT_PUBLIC_COINGECKO_URL=https://api.coingecko.com/api/v3/
NEXT_PUBLIC_MORALIS_KEY=your_moralis_key_here
```

> Copy example.env into .env.local and replace values with your own.

----

## Run the Application

To start the development server:

```
npm run dev
```

> The app will build and provide a local URL (usually http://localhost:3000) to access the site.

To stop the app:

```
Ctrl + C
```

----

## Known Issues / To-Do

- Swapping Flip Feature: Currently only flips UI dropdowns, not the tokens themselves.
- Swapping Logic: Not functional yet. Alchemy integration is broken.
  - Suggest using Uniswap API with token data from Alchemy.
- API Limits: Alchemy free tier has request limits (token cost data is rate-limited).
  - Token cost is only shown on Portfolio, Swap, and Token Detail pages.
  - Final implementation should add token cost data to Explore page CoinCards.

----

For questions or issues, refer to the GitHub repository or project collaborators.
