# Quick Start Deployment Guide

**Your AWS Account:** 084828565262  
**Current User:** bp-proxy-deploy-user  
**Region:** us-east-1

## Current Situation

Your AWS user has limited permissions. You'll need to work with your AWS administrator or use the AWS Console.

## Option A: AWS Console Deployment (Recommended for your setup)

### 1. Create ECR Repositories

Go to [ECR Console](https://us-east-1.console.aws.amazon.com/ecr/repositories) and create three repositories:
- `retail-helpdesk-backend`
- `retail-helpdesk-frontend`
- `retail-helpdesk-qdrant`

Settings for each:
- ✅ Enable scan on push
- ✅ Enable encryption (AES256)
- ✅ Enable tag immutability (optional)

### 2. Build and Push Docker Images Locally

Once ECR repos are created, run:

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin 084828565262.dkr.ecr.us-east-1.amazonaws.com

# Build and push backend
cd backend
docker build -f Dockerfile.prod -t retail-helpdesk-backend:latest .
docker tag retail-helpdesk-backend:latest 084828565262.dkr.ecr.us-east-1.amazonaws.com/retail-helpdesk-backend:latest
docker push 084828565262.dkr.ecr.us-east-1.amazonaws.com/retail-helpdesk-backend:latest
cd ..

# Build and push frontend (update API URL first!)
cd frontend
docker build -f Dockerfile.prod \
  --build-arg NEXT_PUBLIC_API_URL=http://YOUR-ALB-DNS/api \
  -t retail-helpdesk-frontend:latest .
docker tag retail-helpdesk-frontend:latest 084828565262.dkr.ecr.us-east-1.amazonaws.com/retail-helpdesk-frontend:latest
docker push 084828565262.dkr.ecr.us-east-1.amazonaws.com/retail-helpdesk-frontend:latest
cd ..

# Push Qdrant
docker pull qdrant/qdrant:v1.16.3
docker tag qdrant/qdrant:v1.16.3 084828565262.dkr.ecr.us-east-1.amazonaws.com/retail-helpdesk-qdrant:latest
docker push 084828565262.dkr.ecr.us-east-1.amazonaws.com/retail-helpdesk-qdrant:latest
```

### 3. Create Infrastructure with CloudFormation

Go to [CloudFormation Console](https://us-east-1.console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/create)

1. Click "Create stack" → "With new resources"
2. Choose "Upload a template file"
3. Upload: `aws/cloudformation/infrastructure.yml`
4. Stack name: `retail-helpdesk-infrastructure`
5. Parameters:
   - EnvironmentName: `production`
   - OpenAIApiKey: `sk-your-openai-api-key`
6. Click through and create (takes 5-10 minutes)

### 4. Create ECS Task Definitions

Go to [ECS Console → Task Definitions](https://us-east-1.console.aws.amazon.com/ecs/v2/task-definitions)

**For Backend:**
1. Click "Create new task definition" → "Create new task definition with JSON"
2. Copy contents from `aws/ecs-task-definition.json`
3. Replace `fs-XXXXXXXXX` with your EFS ID from CloudFormation outputs
4. Click "Create"

**For Frontend:**
1. Repeat with `aws/frontend-task-definition.json`

### 5. Create ECS Services

Go to your ECS Cluster → Services → Create

**Backend Service:**
- Launch type: Fargate
- Task definition: retail-asset-helpdesk (latest)
- Service name: `retail-helpdesk-backend-service`
- Desired tasks: 1
- VPC: Select the one from CloudFormation
- Subnets: Select both public subnets
- Security group: Select ECS security group
- Load balancer: Application Load Balancer
  - Target group: backend-targets
  - Container: backend:8000

**Frontend Service:**
- Same settings but:
  - Service name: `retail-helpdesk-frontend-service`
  - Task definition: retail-helpdesk-frontend
  - Target group: frontend-targets
  - Container: frontend:3000

### 6. Access Your Application

Get ALB DNS from CloudFormation outputs:
```bash
aws cloudformation describe-stacks \
  --stack-name retail-helpdesk-infrastructure \
  --query 'Stacks[0].Outputs[?OutputKey==`LoadBalancerURL`].OutputValue' \
  --output text
```

Visit: `http://YOUR-ALB-DNS`

## Option B: Request Admin Access

Ask your AWS administrator to grant these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:*",
        "ecs:*",
        "ec2:*",
        "elasticloadbalancing:*",
        "iam:PassRole",
        "cloudformation:*",
        "logs:*",
        "secretsmanager:*",
        "elasticfilesystem:*"
      ],
      "Resource": "*"
    }
  ]
}
```

Then you can use the automated script:
```bash
./scripts/deploy-to-aws.sh
```

## Option C: Local Testing Only

Keep using Docker Compose locally:
```bash
docker-compose up -d
```

Access at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Qdrant: http://localhost:6333

## Troubleshooting

### Check your current permissions:
```bash
aws iam get-user
aws iam list-attached-user-policies --user-name bp-proxy-deploy-user
```

### Test ECR access:
```bash
aws ecr describe-repositories --region us-east-1
```

### View CloudFormation events:
```bash
aws cloudformation describe-stack-events \
  --stack-name retail-helpdesk-infrastructure \
  --max-items 10
```

## Next Steps After Deployment

1. **Upload PDFs to EFS** - Connect to backend container and upload to `/app/docs/`
2. **Trigger ingestion** - `curl -X POST http://YOUR-ALB-DNS/api/ingest`
3. **Set up custom domain** (optional) - Use Route 53 + ACM certificate
4. **Configure auto-scaling** - Based on CPU/memory metrics
5. **Set up monitoring** - CloudWatch dashboards and alarms

## Cost Monitoring

```bash
# View current month's costs
aws ce get-cost-and-usage \
  --time-period Start=2026-02-01,End=2026-02-19 \
  --granularity MONTHLY \
  --metrics BlendedCost
```

Expected monthly cost: **$65-90** for low traffic development environment
