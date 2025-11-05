# Fix IAM Permission Issues for AWS Deployment

## Problem
Your AWS user `bp-proxy-deploy-user` lacks permissions to create API Gateway resources and other AWS services needed for Serverless deployment.

**Error Message:**
```
User: arn:aws:iam::084828565262:user/bp-proxy-deploy-user is not authorized to perform: apigateway:POST
```

---

## Solution: Add Required IAM Permissions

### **Option 1: Using AWS Console (Recommended)**

#### Step 1: Login to AWS Console
1. Go to: https://console.aws.amazon.com/iam/
2. Sign in with an account that has IAM admin permissions

#### Step 2: Attach Policy to User
1. Click **"Users"** in the left sidebar
2. Search for and click: **`bp-proxy-deploy-user`**
3. Click the **"Permissions"** tab
4. Click **"Add permissions"** → **"Attach policies directly"**
5. Search for and select these AWS managed policies:
   - ✅ **AWSLambda_FullAccess**
   - ✅ **AmazonAPIGatewayAdministrator**
   - ✅ **CloudWatchLogsFullAccess**
   - ✅ **AWSCloudFormationFullAccess**
   - ✅ **IAMFullAccess** (or IAMLimitedAccess if security is a concern)
6. Click **"Next"** → **"Add permissions"**

#### Step 3: Verify Permissions
```bash
aws iam list-attached-user-policies --user-name bp-proxy-deploy-user
```

---

### **Option 2: Using AWS CLI (Advanced)**

#### Attach Managed Policies:
```bash
# Lambda permissions
aws iam attach-user-policy \
  --user-name bp-proxy-deploy-user \
  --policy-arn arn:aws:iam::aws:policy/AWSLambda_FullAccess

# API Gateway permissions
aws iam attach-user-policy \
  --user-name bp-proxy-deploy-user \
  --policy-arn arn:aws:iam::aws:policy/AmazonAPIGatewayAdministrator

# CloudFormation permissions
aws iam attach-user-policy \
  --user-name bp-proxy-deploy-user \
  --policy-arn arn:aws:iam::aws:policy/AWSCloudFormationFullAccess

# CloudWatch Logs permissions
aws iam attach-user-policy \
  --user-name bp-proxy-deploy-user \
  --policy-arn arn:aws:iam::aws:policy/CloudWatchLogsFullAccess

# IAM permissions (for creating Lambda execution roles)
aws iam attach-user-policy \
  --user-name bp-proxy-deploy-user \
  --policy-arn arn:aws:iam::aws:policy/IAMFullAccess
```

---

### **Option 3: Create Custom Policy (Most Secure)**

#### Create the policy:
```bash
aws iam create-policy \
  --policy-name ServerlessDeploymentPolicy \
  --policy-document file://IAM_POLICY.json
```

#### Attach to user:
```bash
aws iam attach-user-policy \
  --user-name bp-proxy-deploy-user \
  --policy-arn arn:aws:iam::084828565262:policy/ServerlessDeploymentPolicy
```

The `IAM_POLICY.json` file has been created in this directory with all required permissions.

---

## After Adding Permissions

### 1. Verify the fix:
```bash
aws sts get-caller-identity
```

### 2. Try deployment again:
```bash
cd /Users/satishkumar.attada/Desktop/satish/digital-twin/bp-proxy-deploy
serverless deploy
```

### 3. If still failing, check:
```bash
# List all policies attached to the user
aws iam list-attached-user-policies --user-name bp-proxy-deploy-user

# Check if policies are attached
aws iam get-user-policy --user-name bp-proxy-deploy-user --policy-name <policy-name>
```

---

## Minimum Required Permissions

If you want to be more restrictive, at minimum you need:

1. **Lambda**: Create/Update/Delete functions
2. **API Gateway**: Create/Update/Delete APIs and resources
3. **CloudFormation**: Create/Update/Delete stacks
4. **IAM**: Create Lambda execution roles
5. **CloudWatch Logs**: Create log groups
6. **S3**: Store deployment artifacts

---

## Security Best Practice

For production deployments:
- Create a dedicated deployment user or service account
- Use least-privilege principle (only grant necessary permissions)
- Consider using AWS Organizations and SCPs
- Enable MFA for IAM users
- Rotate access keys regularly

---

## Troubleshooting

### Error persists after adding permissions?
- Wait 1-2 minutes for AWS IAM changes to propagate
- Clear any cached credentials: `aws sts get-caller-identity`
- Verify you're using the correct AWS profile

### Need help with specific permissions?
Check the CloudFormation events:
```bash
aws cloudformation describe-stack-events --stack-name bp-api-proxy-dev
```

---

## Next Steps

1. ✅ Add IAM permissions (choose Option 1, 2, or 3 above)
2. ✅ Wait 1-2 minutes for changes to propagate
3. ✅ Run: `serverless deploy`
4. ✅ Test your deployed API endpoint

---

**Your AWS Account ID:** `084828565262`  
**User:** `bp-proxy-deploy-user`  
**Region:** `us-east-1`
