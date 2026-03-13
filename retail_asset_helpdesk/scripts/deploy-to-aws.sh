#!/bin/bash

# Retail Asset Helpdesk - AWS Deployment Script
# This script automates the deployment of the application to AWS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_BACKEND_REPO="retail-helpdesk-backend"
ECR_FRONTEND_REPO="retail-helpdesk-frontend"
ECR_QDRANT_REPO="retail-helpdesk-qdrant"
ECS_CLUSTER="retail-helpdesk-cluster"
BACKEND_SERVICE="retail-helpdesk-backend-service"
FRONTEND_SERVICE="retail-helpdesk-frontend-service"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Retail Asset Helpdesk - AWS Deployment${NC}"
echo -e "${GREEN}========================================${NC}"

# Function to check if AWS CLI is configured
check_aws_config() {
    if ! aws sts get-caller-identity &> /dev/null; then
        echo -e "${RED}Error: AWS CLI is not configured properly${NC}"
        echo "Please run: aws configure"
        exit 1
    fi
    echo -e "${GREEN}✓ AWS CLI configured${NC}"
}

# Function to create ECR repositories
create_ecr_repos() {
    echo -e "\n${YELLOW}Creating ECR repositories...${NC}"
    
    for repo in $ECR_BACKEND_REPO $ECR_FRONTEND_REPO $ECR_QDRANT_REPO; do
        if aws ecr describe-repositories --repository-names $repo --region $AWS_REGION &> /dev/null; then
            echo -e "${GREEN}✓ Repository $repo already exists${NC}"
        else
            aws ecr create-repository \
                --repository-name $repo \
                --region $AWS_REGION \
                --image-scanning-configuration scanOnPush=true \
                --encryption-configuration encryptionType=AES256
            echo -e "${GREEN}✓ Created repository $repo${NC}"
        fi
    done
}

# Function to login to ECR
login_to_ecr() {
    echo -e "\n${YELLOW}Logging in to Amazon ECR...${NC}"
    aws ecr get-login-password --region $AWS_REGION | \
        docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
    echo -e "${GREEN}✓ Logged in to ECR${NC}"
}

# Function to build and push backend image
build_push_backend() {
    echo -e "\n${YELLOW}Building and pushing backend image...${NC}"
    
    cd backend
    docker build -f Dockerfile.prod -t $ECR_BACKEND_REPO:latest .
    docker tag $ECR_BACKEND_REPO:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_BACKEND_REPO:latest
    docker tag $ECR_BACKEND_REPO:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_BACKEND_REPO:$(git rev-parse --short HEAD)
    
    docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_BACKEND_REPO:latest
    docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_BACKEND_REPO:$(git rev-parse --short HEAD)
    
    cd ..
    echo -e "${GREEN}✓ Backend image pushed${NC}"
}

# Function to build and push frontend image
build_push_frontend() {
    echo -e "\n${YELLOW}Building and pushing frontend image...${NC}"
    
    cd frontend
    docker build \
        -f Dockerfile.prod \
        --build-arg NEXT_PUBLIC_API_URL=https://api.your-domain.com \
        -t $ECR_FRONTEND_REPO:latest .
    
    docker tag $ECR_FRONTEND_REPO:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_FRONTEND_REPO:latest
    docker tag $ECR_FRONTEND_REPO:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_FRONTEND_REPO:$(git rev-parse --short HEAD)
    
    docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_FRONTEND_REPO:latest
    docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_FRONTEND_REPO:$(git rev-parse --short HEAD)
    
    cd ..
    echo -e "${GREEN}✓ Frontend image pushed${NC}"
}

# Function to push Qdrant image
push_qdrant() {
    echo -e "\n${YELLOW}Pushing Qdrant image...${NC}"
    
    docker pull qdrant/qdrant:v1.16.3
    docker tag qdrant/qdrant:v1.16.3 $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_QDRANT_REPO:latest
    docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_QDRANT_REPO:latest
    
    echo -e "${GREEN}✓ Qdrant image pushed${NC}"
}

# Function to update ECS service
update_ecs_service() {
    local service_name=$1
    echo -e "\n${YELLOW}Updating ECS service: $service_name...${NC}"
    
    aws ecs update-service \
        --cluster $ECS_CLUSTER \
        --service $service_name \
        --force-new-deployment \
        --region $AWS_REGION
    
    echo -e "${GREEN}✓ Service update initiated${NC}"
}

# Main deployment flow
main() {
    check_aws_config
    
    echo -e "\n${YELLOW}What would you like to deploy?${NC}"
    echo "1) Backend only"
    echo "2) Frontend only"
    echo "3) Both (Full deployment)"
    echo "4) Setup (Create ECR repos only)"
    read -p "Enter your choice (1-4): " choice
    
    case $choice in
        1)
            create_ecr_repos
            login_to_ecr
            build_push_backend
            push_qdrant
            update_ecs_service $BACKEND_SERVICE
            ;;
        2)
            create_ecr_repos
            login_to_ecr
            build_push_frontend
            update_ecs_service $FRONTEND_SERVICE
            ;;
        3)
            create_ecr_repos
            login_to_ecr
            build_push_backend
            build_push_frontend
            push_qdrant
            update_ecs_service $BACKEND_SERVICE
            update_ecs_service $FRONTEND_SERVICE
            ;;
        4)
            create_ecr_repos
            echo -e "\n${GREEN}Setup complete!${NC}"
            echo -e "Next steps:"
            echo -e "1. Update task definitions in aws/ directory with your account ID"
            echo -e "2. Create ECS cluster and services using AWS Console or CLI"
            echo -e "3. Run this script again to deploy"
            ;;
        *)
            echo -e "${RED}Invalid choice${NC}"
            exit 1
            ;;
    esac
    
    echo -e "\n${GREEN}========================================${NC}"
    echo -e "${GREEN}Deployment Complete!${NC}"
    echo -e "${GREEN}========================================${NC}"
}

# Run main function
main
