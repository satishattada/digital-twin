# AWS Deployment Guide

Complete guide for deploying the Retail Asset Helpdesk to AWS.

## Prerequisites

1. **AWS CLI** installed and configured
   ```bash
   aws configure
   ```

2. **Docker** installed

3. **Git** for version control

4. **OpenAI API Key** from https://platform.openai.com/api-keys

## Deployment Options

### Option 1: Quick Deployment (Recommended for Testing)

Use the automated deployment script:

```bash
chmod +x scripts/deploy-to-aws.sh
./scripts/deploy-to-aws.sh
```

### Option 2: Manual Step-by-Step Deployment

#### Step 1: Set Up Infrastructure with CloudFormation

```bash
# Create the infrastructure stack
aws cloudformation create-stack \
  --stack-name retail-helpdesk-infrastructure \
  --template-body file://aws/cloudformation/infrastructure.yml \
  --parameters ParameterKey=EnvironmentName,ParameterValue=production \
               ParameterKey=OpenAIApiKey,ParameterValue=sk-YOUR-KEY-HERE \
  --capabilities CAPABILITY_IAM \
  --region us-east-1

# Wait for stack creation (takes ~5-10 minutes)
aws cloudformation wait stack-create-complete \
  --stack-name retail-helpdesk-infrastructure \
  --region us-east-1

# Get outputs
aws cloudformation describe-stacks \
  --stack-name retail-helpdesk-infrastructure \
  --query 'Stacks[0].Outputs' \
  --region us-east-1
```

#### Step 2: Create ECR Repositories

```bash
# Get your AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Create repositories
aws ecr create-repository --repository-name retail-helpdesk-backend --region us-east-1
aws ecr create-repository --repository-name retail-helpdesk-frontend --region us-east-1
aws ecr create-repository --repository-name retail-helpdesk-qdrant --region us-east-1
```

#### Step 3: Build and Push Docker Images

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Build and push backend
cd backend
docker build -f Dockerfile.prod -t retail-helpdesk-backend:latest .
docker tag retail-helpdesk-backend:latest $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/retail-helpdesk-backend:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/retail-helpdesk-backend:latest
cd ..

# Build and push frontend
cd frontend
docker build -f Dockerfile.prod \
  --build-arg NEXT_PUBLIC_API_URL=http://YOUR-ALB-DNS/api \
  -t retail-helpdesk-frontend:latest .
docker tag retail-helpdesk-frontend:latest $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/retail-helpdesk-frontend:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/retail-helpdesk-frontend:latest
cd ..

# Push Qdrant image
docker pull qdrant/qdrant:v1.16.3
docker tag qdrant/qdrant:v1.16.3 $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/retail-helpdesk-qdrant:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/retail-helpdesk-qdrant:latest
```

#### Step 4: Update Task Definitions

Edit `aws/ecs-task-definition.json` and `aws/frontend-task-definition.json`:
- Replace `YOUR_ACCOUNT_ID` with your AWS account ID
- Replace `fs-XXXXXXXXX` with your EFS file system ID from CloudFormation output

#### Step 5: Register Task Definitions

```bash
# Update task definitions with your account ID and EFS ID
sed -i "s/YOUR_ACCOUNT_ID/$AWS_ACCOUNT_ID/g" aws/ecs-task-definition.json
sed -i "s/YOUR_ACCOUNT_ID/$AWS_ACCOUNT_ID/g" aws/frontend-task-definition.json

# Get EFS ID from CloudFormation
EFS_ID=$(aws cloudformation describe-stacks \
  --stack-name retail-helpdesk-infrastructure \
  --query 'Stacks[0].Outputs[?OutputKey==`EFSFileSystemId`].OutputValue' \
  --output text)

sed -i "s/fs-XXXXXXXXX/$EFS_ID/g" aws/ecs-task-definition.json

# Register task definitions
aws ecs register-task-definition \
  --cli-input-json file://aws/ecs-task-definition.json \
  --region us-east-1

aws ecs register-task-definition \
  --cli-input-json file://aws/frontend-task-definition.json \
  --region us-east-1
```

#### Step 6: Create ECS Services

```bash
# Get subnet IDs and security group from CloudFormation
SUBNET1=$(aws ec2 describe-subnets \
  --filters "Name=tag:Name,Values=production-public-subnet-1" \
  --query 'Subnets[0].SubnetId' \
  --output text)

SUBNET2=$(aws ec2 describe-subnets \
  --filters "Name=tag:Name,Values=production-public-subnet-2" \
  --query 'Subnets[0].SubnetId' \
  --output text)

SECURITY_GROUP=$(aws ec2 describe-security-groups \
  --filters "Name=tag:Name,Values=production-ecs-sg" \
  --query 'SecurityGroups[0].GroupId' \
  --output text)

BACKEND_TG=$(aws cloudformation describe-stacks \
  --stack-name retail-helpdesk-infrastructure \
  --query 'Stacks[0].Outputs[?OutputKey==`BackendTargetGroupArn`].OutputValue' \
  --output text)

FRONTEND_TG=$(aws cloudformation describe-stacks \
  --stack-name retail-helpdesk-infrastructure \
  --query 'Stacks[0].Outputs[?OutputKey==`FrontendTargetGroupArn`].OutputValue' \
  --output text)

# Create backend service
aws ecs create-service \
  --cluster production-cluster \
  --service-name retail-helpdesk-backend-service \
  --task-definition retail-asset-helpdesk \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[$SUBNET1,$SUBNET2],securityGroups=[$SECURITY_GROUP],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=$BACKEND_TG,containerName=backend,containerPort=8000" \
  --region us-east-1

# Create frontend service
aws ecs create-service \
  --cluster production-cluster \
  --service-name retail-helpdesk-frontend-service \
  --task-definition retail-helpdesk-frontend \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[$SUBNET1,$SUBNET2],securityGroups=[$SECURITY_GROUP],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=$FRONTEND_TG,containerName=frontend,containerPort=3000" \
  --region us-east-1
```

#### Step 7: Access Your Application

```bash
# Get the ALB DNS name
ALB_DNS=$(aws cloudformation describe-stacks \
  --stack-name retail-helpdesk-infrastructure \
  --query 'Stacks[0].Outputs[?OutputKey==`LoadBalancerURL`].OutputValue' \
  --output text)

echo "Application URL: http://$ALB_DNS"
echo "Backend API: http://$ALB_DNS/api"
```

### Option 3: Using GitHub Actions (CI/CD)

1. Add secrets to your GitHub repository:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

2. Push to main branch - deployment happens automatically!

## Post-Deployment Tasks

### 1. Upload Documents to EFS

```bash
# Connect to a running backend task
TASK_ID=$(aws ecs list-tasks \
  --cluster production-cluster \
  --service-name retail-helpdesk-backend-service \
  --query 'taskArns[0]' \
  --output text | cut -d'/' -f3)

# Copy documents
aws ecs execute-command \
  --cluster production-cluster \
  --task $TASK_ID \
  --container backend \
  --command "/bin/bash" \
  --interactive

# Inside the container
# Upload your PDF files to /app/docs/
```

### 2. Ingest Documents

```bash
# Trigger ingestion
curl -X POST http://$ALB_DNS/api/ingest
```

### 3. Set Up Custom Domain (Optional)

1. Create Route 53 hosted zone
2. Request ACM certificate
3. Add HTTPS listener to ALB
4. Update DNS records

```bash
# Request certificate
aws acm request-certificate \
  --domain-name yourdomain.com \
  --validation-method DNS \
  --region us-east-1

# After validation, add HTTPS listener to ALB
# Update frontend NEXT_PUBLIC_API_URL to https://yourdomain.com/api
```

## Monitoring

### CloudWatch Logs

```bash
# View backend logs
aws logs tail /ecs/production-backend --follow

# View frontend logs
aws logs tail /ecs/production-frontend --follow
```

### Application Metrics

Access CloudWatch dashboard:
```bash
echo "https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:"
```

## Scaling

### Manual Scaling

```bash
# Scale backend
aws ecs update-service \
  --cluster production-cluster \
  --service retail-helpdesk-backend-service \
  --desired-count 2

# Scale frontend
aws ecs update-service \
  --cluster production-cluster \
  --service retail-helpdesk-frontend-service \
  --desired-count 2
```

### Auto Scaling (Optional)

```bash
# Register scalable target
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/production-cluster/retail-helpdesk-backend-service \
  --min-capacity 1 \
  --max-capacity 4

# Create scaling policy
aws application-autoscaling put-scaling-policy \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/production-cluster/retail-helpdesk-backend-service \
  --policy-name cpu-scaling \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration file://scaling-policy.json
```

## Cost Optimization

1. **Use Fargate Spot** for non-critical workloads (50-70% cheaper)
2. **Enable ALB access logs** only when debugging
3. **Set CloudWatch log retention** to 7 days
4. **Use EFS Infrequent Access** for old documents

## Troubleshooting

### Check Service Status
```bash
aws ecs describe-services \
  --cluster production-cluster \
  --services retail-helpdesk-backend-service retail-helpdesk-frontend-service
```

### View Task Details
```bash
aws ecs describe-tasks \
  --cluster production-cluster \
  --tasks $(aws ecs list-tasks --cluster production-cluster --service-name retail-helpdesk-backend-service --query 'taskArns[0]' --output text)
```

### Common Issues

1. **Tasks keep stopping**: Check CloudWatch logs for errors
2. **Can't access application**: Verify security groups allow traffic
3. **Health checks failing**: Check target group health check settings

## Cleanup

To delete all resources:

```bash
# Delete ECS services
aws ecs delete-service --cluster production-cluster --service retail-helpdesk-backend-service --force
aws ecs delete-service --cluster production-cluster --service retail-helpdesk-frontend-service --force

# Delete CloudFormation stack
aws cloudformation delete-stack --stack-name retail-helpdesk-infrastructure

# Delete ECR images
aws ecr batch-delete-image \
  --repository-name retail-helpdesk-backend \
  --image-ids imageTag=latest

# Delete repositories
aws ecr delete-repository --repository-name retail-helpdesk-backend --force
aws ecr delete-repository --repository-name retail-helpdesk-frontend --force
aws ecr delete-repository --repository-name retail-helpdesk-qdrant --force
```

## Cost Estimate

Monthly costs (us-east-1, low traffic):
- **Fargate (2 tasks)**: $30-50
- **Application Load Balancer**: $20
- **EFS Storage (10GB)**: $3
- **CloudWatch Logs**: $5
- **Data Transfer**: $5-10
- **Total**: ~$65-90/month

For production with auto-scaling: $150-300/month
