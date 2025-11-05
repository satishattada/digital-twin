# AWS Lambda Deployment Guide for BP API Proxy

## Prerequisites

1. **AWS Account**: You need an active AWS account
2. **AWS CLI**: Already installed (v2.31.8)
3. **Node.js**: Version 16 or higher (recommended: 18.x)
4. **Serverless Framework**: Already installed via npm

## Step 1: Configure AWS Credentials

You need to configure your AWS credentials. Choose one of these methods:

### Option A: Using AWS CLI Configure (Recommended)
```bash
aws configure
```

Enter your:
- AWS Access Key ID
- AWS Secret Access Key
- Default region name (use: us-east-1)
- Default output format (use: json)

### Option B: Using Environment Variables
```bash
export AWS_ACCESS_KEY_ID=your_access_key_here
export AWS_SECRET_ACCESS_KEY=your_secret_key_here
export AWS_DEFAULT_REGION=us-east-1
```

### Option C: Using AWS SSO (if your organization uses SSO)
```bash
aws configure sso
```

## Step 2: Verify AWS Credentials
```bash
aws sts get-caller-identity
```

You should see your AWS account details.

## Step 3: Deploy to AWS Lambda

### Deploy with default credentials
```bash
npm run deploy-safe
```

Or directly:
```bash
serverless deploy
```

### Deploy with verbose output
```bash
serverless deploy --verbose
```

### Deploy to specific stage
```bash
serverless deploy --stage production
```

## Step 4: Test the Deployment

After successful deployment, you'll see output like:
```
endpoints:
  ANY - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/{proxy+}
  ANY - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/
```

Test the health endpoint:
```bash
curl https://YOUR_API_URL/health
```

## Step 5: View Logs

```bash
npm run logs
```

Or:
```bash
serverless logs -f api --tail
```

## Environment Variables

The following environment variables are used (already configured in serverless.yml):

- `BP_CLIENT_ID`: BP API OAuth client ID
- `BP_CLIENT_SECRET`: BP API OAuth client secret
- `USE_REAL_BP_API`: Set to 'true' to use real BP API
- `NODE_ENV`: Set to 'production'

## Troubleshooting

### Error: "The security token included in the request is invalid"
- Your AWS credentials are not configured or have expired
- Run `aws configure` again

### Error: "Cannot find module 'lambda'"
- Make sure `lambda.js` exists in the bp-proxy-deploy folder
- This file has been created for you

### Error: Network or SSL issues
- If you're behind a corporate proxy, you may need to configure proxy settings
- Set `NODE_TLS_REJECT_UNAUTHORIZED=0` (only for development)

## Update Deployment

To update an existing deployment:
```bash
serverless deploy
```

## Remove Deployment

To remove all AWS resources:
```bash
npm run remove
```

Or:
```bash
serverless remove
```

## Cost Estimation

This deployment uses:
- AWS Lambda (free tier: 1M requests/month)
- API Gateway HTTP API (free tier: 1M requests/month)
- CloudWatch Logs (minimal cost)

Expected monthly cost: **$0 - $5** (depending on usage)

## Next Steps

1. Configure AWS credentials (Step 1)
2. Deploy the application (Step 3)
3. Update your frontend environment variables with the API Gateway URL
4. Test the endpoints

## Support

For issues or questions, refer to:
- [Serverless Framework Docs](https://www.serverless.com/framework/docs)
- [AWS Lambda Docs](https://docs.aws.amazon.com/lambda/)


AWS Access Key ID [None]: <your-access-key-id>
AWS Secret Access Key [None]: <your-secret-access-key>
Default region name [None]: us-east-1
Default output format [None]: json