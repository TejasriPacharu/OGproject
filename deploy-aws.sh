#!/bin/bash
set -e

# Configuration
APP_NAME="ojproject"
EB_ENV="ojproject-env"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    --region)
      AWS_REGION="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 --region <aws-region>"
      exit 1
      ;;
  esac
done

# Check required arguments
if [ -z "$AWS_REGION" ]; then
  echo "Error: AWS region is required"
  echo "Usage: $0 --region <aws-region>"
  exit 1
fi

# Get AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "AWS Account ID: $AWS_ACCOUNT_ID"
echo "AWS Region: $AWS_REGION"

# Create ECR repositories if they don't exist
echo "Creating ECR repositories if they don't exist..."
aws ecr describe-repositories --repository-names "$APP_NAME-backend" --region "$AWS_REGION" || \
  aws ecr create-repository --repository-name "$APP_NAME-backend" --region "$AWS_REGION"
aws ecr describe-repositories --repository-names "$APP_NAME-frontend" --region "$AWS_REGION" || \
  aws ecr create-repository --repository-name "$APP_NAME-frontend" --region "$AWS_REGION"

# Authenticate Docker to ECR
echo "Authenticating Docker with ECR..."
aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

# Build and push backend image
echo "Building and pushing backend image..."
cd backend
docker build -t "$APP_NAME-backend" .
docker tag "$APP_NAME-backend:latest" "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$APP_NAME-backend:latest"
docker push "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$APP_NAME-backend:latest"
cd ..

# Build and push frontend image
echo "Building and pushing frontend image..."
cd frontend
docker build -t "$APP_NAME-frontend" .
docker tag "$APP_NAME-frontend:latest" "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$APP_NAME-frontend:latest"
docker push "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$APP_NAME-frontend:latest"
cd ..

# Update Dockerrun.aws.json with account ID and region
echo "Updating Dockerrun.aws.json..."
sed -i "s/\${AWS_ACCOUNT_ID}/$AWS_ACCOUNT_ID/g" Dockerrun.aws.json
sed -i "s/\${AWS_REGION}/$AWS_REGION/g" Dockerrun.aws.json

# Initialize Elastic Beanstalk if not already done
if [ ! -d .elasticbeanstalk ]; then
  echo "Initializing Elastic Beanstalk..."
  eb init -p docker "$APP_NAME" --region "$AWS_REGION"
fi

# Create or update Elastic Beanstalk environment
if ! eb status "$EB_ENV" &>/dev/null; then
  echo "Creating Elastic Beanstalk environment..."
  eb create "$EB_ENV" --instance_type t2.small --single
else
  echo "Deploying to existing Elastic Beanstalk environment..."
  eb deploy "$EB_ENV"
fi

echo "Deployment completed successfully!"
echo "You can access your application at: $(eb status "$EB_ENV" | grep CNAME | awk '{print $2}')"
