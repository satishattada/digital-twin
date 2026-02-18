#!/bin/bash

# Quick Fix Script for IAM Permissions
# This script attaches the necessary AWS managed policies to your deployment user

echo "🔧 Fixing IAM Permissions for bp-proxy-deploy-user..."
echo ""

USER_NAME="bp-proxy-deploy-user"

# Function to attach policy
attach_policy() {
  local policy_name=$1
  local policy_arn=$2
  
  echo "📌 Attaching $policy_name..."
  aws iam attach-user-policy \
    --user-name $USER_NAME \
    --policy-arn $policy_arn 2>&1
  
  if [ $? -eq 0 ]; then
    echo "   ✅ $policy_name attached successfully"
  else
    echo "   ⚠️  Failed to attach $policy_name (may already be attached or permission denied)"
  fi
  echo ""
}

# Attach required policies
attach_policy "AWSLambda_FullAccess" "arn:aws:iam::aws:policy/AWSLambda_FullAccess"
attach_policy "AmazonAPIGatewayAdministrator" "arn:aws:iam::aws:policy/AmazonAPIGatewayAdministrator"
attach_policy "AWSCloudFormationFullAccess" "arn:aws:iam::aws:policy/AWSCloudFormationFullAccess"
attach_policy "CloudWatchLogsFullAccess" "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
attach_policy "IAMFullAccess" "arn:aws:iam::aws:policy/IAMFullAccess"

echo "🔍 Verifying attached policies..."
echo ""
aws iam list-attached-user-policies --user-name $USER_NAME

echo ""
echo "✅ Done! Wait 1-2 minutes for IAM changes to propagate, then run:"
echo "   serverless deploy"
