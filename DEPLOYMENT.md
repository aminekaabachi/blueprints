# Deployment Guide

This project is configured to automatically deploy to Netlify using GitHub Actions.

## Setup Instructions

### 1. Create a Netlify Site

1. Go to [Netlify](https://netlify.com) and sign in
2. Click "New site from Git" or "Add new site" > "Import an existing project"
3. Connect your GitHub repository
4. Set the build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Deploy the site

### 2. Get Netlify Credentials

After creating your site, you'll need two pieces of information:

#### Netlify Site ID
1. Go to your site's dashboard on Netlify
2. Navigate to **Site settings** > **General**
3. Copy the **Site ID** (it looks like: `abc12345-def6-7890-ghij-klmnopqrstuv`)

#### Netlify Auth Token
1. Go to [Netlify User Settings](https://app.netlify.com/user/applications#personal-access-tokens)
2. Click **New access token**
3. Give it a name (e.g., "GitHub Actions Deploy")
4. Copy the generated token

### 3. Add GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret** and add:
   - **Name**: `NETLIFY_AUTH_TOKEN`
   - **Value**: Your Netlify auth token from step 2
4. Click **New repository secret** again and add:
   - **Name**: `NETLIFY_SITE_ID`
   - **Value**: Your Netlify site ID from step 2

### 4. Deploy

Once the secrets are configured:

1. Push your code to the `main` or `master` branch
2. GitHub Actions will automatically:
   - Install dependencies
   - Build your Eleventy site
   - Deploy to Netlify
3. Check the **Actions** tab in your GitHub repository to monitor the deployment

## Workflow Details

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will:

- Trigger on pushes to `main`/`master` branches and pull requests
- Use Node.js 18 with npm caching for faster builds
- Run `npm ci` to install dependencies
- Run `npm run build` to build the Eleventy site
- Deploy the `dist` folder to Netlify
- Add deployment comments to commits and pull requests

## Troubleshooting

- **Build fails**: Check that your `package.json` has the correct build script
- **Deployment fails**: Verify your Netlify secrets are correctly set
- **Site not updating**: Check that you're pushing to the correct branch (`main` or `master`)

For more details, check the Actions tab in your GitHub repository for build logs. 