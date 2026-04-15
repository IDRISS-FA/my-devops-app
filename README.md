# My DevOps Test App

Simple Node.js app for testing CI/CD pipeline with:
- Jenkins CI
- Docker containerization  
- GitHub webhooks
- ArgoCD GitOps
- K3s Kubernetes

## Endpoints
- `GET /` - Web interface with counter
- `GET /health` - Health check
- `GET /version` - Version info

## Pipeline Flow
1. Push code → GitHub webhook
2. Jenkins builds and tests
3. Docker image pushed to Hub
4. Jenkins updates manifest in GitHub
5. ArgoCD auto-deploys to K3s
6. App accessible on port 30080
