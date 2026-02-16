# Deployment Guide - TriageFlow AI V2

## Production Deployment to Vercel

### Prerequisites
- GitHub repository: `https://github.com/ojhahemant/triageflow-ai-nhs.git`
- Vercel account
- OpenAI API key

---

## Quick Deploy to Vercel TEST

### Option 1: Deploy via Vercel Dashboard

1. **Go to Vercel**
   - Visit https://vercel.com
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository: `ojhahemant/triageflow-ai-nhs`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add: `OPENAI_API_KEY` = `your-actual-api-key`
   - Scope: Production, Preview, Development

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build
   - Visit your production URL

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# When prompted:
# - Link to existing project? No
# - Project name: triageflow-ai-nhs
# - Directory: ./
# - Want to override settings? No

# Set environment variable
vercel env add OPENAI_API_KEY production
# Paste your OpenAI API key when prompted

# Redeploy with environment variable
vercel --prod
```

---

## Environment Variables

### Required Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `OPENAI_API_KEY` | `sk-...` | Your OpenAI API key for AI analysis |

### Setting Environment Variables

**Via Vercel Dashboard:**
1. Go to your project → Settings → Environment Variables
2. Add `OPENAI_API_KEY`
3. Select all environments (Production, Preview, Development)
4. Save and redeploy

**Via CLI:**
```bash
vercel env add OPENAI_API_KEY production
vercel env add OPENAI_API_KEY preview
vercel env add OPENAI_API_KEY development
```

---

## Vercel Configuration

The project includes a `vercel.json` (if not, create it):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ]
}
```

---

## Post-Deployment Checklist

### 1. Verify Deployment
- [ ] Application loads successfully
- [ ] All 4 personas are accessible
- [ ] Persona switching works
- [ ] Patient data displays correctly

### 2. Test AI Functionality
- [ ] Select Clinician persona
- [ ] Choose a patient with "Triage Pending" status
- [ ] Click "AI Decision Support"
- [ ] Verify AI analysis appears
- [ ] Check OpenAI API usage in dashboard

### 3. Security Checks
- [ ] CORS configured correctly (not allowing all origins in production)
- [ ] Environment variables set properly
- [ ] `.env.local` not in repository
- [ ] API key not exposed in client bundle

### 4. Performance
- [ ] Page load time < 3 seconds
- [ ] Smooth persona transitions
- [ ] Widget rendering is fast
- [ ] No console errors

---

## Production Security Hardening

### 1. Update CORS Configuration

Edit `api/analyze.ts`:

```typescript
// Replace line 11 with:
const allowedOrigins = [
  'https://triageflow-ai-nhs.vercel.app',
  'https://your-custom-domain.com'
];

const origin = req.headers.origin || '';
if (allowedOrigins.includes(origin)) {
  res.setHeader('Access-Control-Allow-Origin', origin);
} else {
  return res.status(403).json({ error: 'Forbidden' });
}
```

### 2. Add Rate Limiting

Create `api/middleware/rateLimit.ts`:

```typescript
const rateLimit = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string, limit = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record || now > record.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}
```

Update `api/analyze.ts`:

```typescript
import { checkRateLimit } from './middleware/rateLimit';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const ip = (req.headers['x-forwarded-for'] as string) || 'unknown';

  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  // ... rest of code
}
```

### 3. Add Authentication (Optional)

For production NHS deployment, consider:
- NHS Identity integration
- OAuth 2.0 / OpenID Connect
- Session-based authentication
- Role-based access control (RBAC)

### 4. Monitoring & Logging

**Add Vercel Analytics:**
```bash
npm install @vercel/analytics
```

In `App.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

// Add to return statement:
<>
  <YourApp />
  <Analytics />
</>
```

**Add Error Tracking:**
Consider integrating:
- Sentry (https://sentry.io)
- LogRocket (https://logrocket.com)
- Vercel's built-in logs

---

## Custom Domain Setup

### 1. Add Domain in Vercel
1. Go to Project Settings → Domains
2. Add your domain (e.g., `triageflow.nhs.uk`)
3. Follow DNS configuration instructions

### 2. Configure DNS
Add these records to your DNS provider:

```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

### 3. Enable HTTPS
- Automatically handled by Vercel
- SSL certificate provisioned within minutes

---

## CI/CD Pipeline

Vercel automatically deploys on:
- **Production:** Push to `main` branch
- **Preview:** Push to any branch or pull request

### Customize Deployment

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm test
```

---

## Monitoring Production

### Vercel Dashboard Metrics
- Visit https://vercel.com/dashboard
- Select your project
- View Analytics tab for:
  - Page views
  - Unique visitors
  - Performance metrics
  - Error rates

### OpenAI Usage Monitoring
1. Go to https://platform.openai.com/usage
2. Set up usage alerts
3. Monitor spending
4. Set monthly budget limits

### Recommended Alerts
- API error rate > 5%
- Response time > 3 seconds
- OpenAI spending > £100/month
- Failed deployments

---

## Troubleshooting

### Build Fails
```bash
# Check build logs in Vercel dashboard
# Common issues:
# - Missing dependencies
# - TypeScript errors
# - Environment variables not set
```

**Solution:**
```bash
# Test build locally first
npm run build

# If it works locally but fails on Vercel:
# - Check Node version matches
# - Ensure all files committed to Git
# - Verify package.json dependencies
```

### API Key Not Working
```bash
# Verify environment variable is set
vercel env ls

# If missing, add it
vercel env add OPENAI_API_KEY production

# Redeploy
vercel --prod
```

### CORS Errors
```typescript
// Check api/analyze.ts CORS headers
res.setHeader('Access-Control-Allow-Origin', 'your-domain.com');

// For debugging only, temporarily use:
res.setHeader('Access-Control-Allow-Origin', '*');
// Then fix to specific domain
```

### AI Analysis Not Working
1. Check OpenAI API key is valid
2. Verify API key has credits
3. Check Vercel function logs
4. Test `/api/analyze` endpoint directly

```bash
# Test API endpoint
curl -X POST https://your-app.vercel.app/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"patient": {...}}'
```

---

## Rollback Strategy

### Instant Rollback
1. Go to Vercel Dashboard → Deployments
2. Find previous successful deployment
3. Click "..." → "Promote to Production"
4. Confirm rollback

### Via Git
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <commit-hash>
git push -f origin main  # Use with caution
```

---

## Cost Estimation

### Vercel Costs
- **Hobby Plan:** Free
  - 100 GB bandwidth/month
  - Serverless function executions included

- **Pro Plan:** $20/month
  - Unlimited bandwidth
  - Advanced analytics
  - Team collaboration

### OpenAI Costs
- **Model:** GPT-4o-mini
- **Estimated Cost:** ~$0.001 per analysis
- **Monthly (1000 analyses):** ~$1-5

### Total Estimated Cost
- **Hobby/Testing:** Free (Vercel) + $1-5 (OpenAI)
- **Production:** $20/month (Vercel) + variable (OpenAI)

---

## NHS-Specific Considerations

### Data Protection
- ⚠️ This is a **prototype** using mock data
- For production NHS deployment:
  - Conduct DPIA (Data Protection Impact Assessment)
  - Ensure GDPR compliance
  - Implement NHS Data Security and Protection Toolkit requirements
  - Use NHS Identity for authentication
  - Deploy on NHS-approved infrastructure

### Clinical Safety
- ⚠️ This is **decision support**, not diagnostic software
- Requires clinical safety classification (DCB 0129/0160)
- Clinician must review all AI recommendations
- Clear disclaimers about AI limitations

### Information Governance
- Implement audit logging
- Track all patient data access
- Maintain data retention policies
- Establish data breach procedures

---

## Support & Resources

### Documentation
- Architecture: `ARCHITECTURE.md`
- Migration: `MIGRATION_GUIDE.md`
- GitHub: https://github.com/ojhahemant/triageflow-ai-nhs

### External Resources
- Vercel Docs: https://vercel.com/docs
- OpenAI API: https://platform.openai.com/docs
- TheraForge: https://github.com/TheraForge/Getting-Started

---

## Next Steps After Deployment

1. **Share Production URL** with stakeholders
2. **Gather User Feedback** from each persona
3. **Monitor Usage** and performance metrics
4. **Iterate** based on real-world usage
5. **Plan Clinical Safety** assessment for NHS deployment

---

**Your deployment is ready! 🚀**

Repository: https://github.com/ojhahemant/triageflow-ai-nhs
Ready to deploy to Vercel with one click.
