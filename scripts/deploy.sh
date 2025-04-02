#!/bin/bash

# 项目部署脚本

# 环境变量
APP_NAME="mcp-server"
DOCKER_REGISTRY="your-registry.com"
DOCKER_TAG="latest"

# 构建Docker镜像
echo "Building Docker image: $APP_NAME:$DOCKER_TAG"
docker build -t $APP_NAME:$DOCKER_TAG .

# 登录Docker镜像仓库（如果需要）
# echo "Logging in to Docker registry"
# docker login $DOCKER_REGISTRY -u $DOCKER_USERNAME -p $DOCKER_PASSWORD

# 标记镜像
echo "Tagging image: $DOCKER_REGISTRY/$APP_NAME:$DOCKER_TAG"
docker tag $APP_NAME:$DOCKER_TAG $DOCKER_REGISTRY/$APP_NAME:$DOCKER_TAG

# 推送镜像到仓库
echo "Pushing image to registry"
docker push $DOCKER_REGISTRY/$APP_NAME:$DOCKER_TAG

# 部署到Kubernetes（如果需要）
echo "Deploying to Kubernetes"
# kubectl apply -f k8s/deployment.yaml

echo "Deployment completed successfully!" 