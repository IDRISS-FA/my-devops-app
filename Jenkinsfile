pipeline {
    agent any
    
    environment {
        // Docker Hub credentials (configured in Jenkins)
        DOCKER_CREDS = credentials('docker-hub-credentials')
        DOCKER_IMAGE = "${DOCKER_CREDS_USR}/my-devops-app:${BUILD_NUMBER}"
        DOCKER_LATEST = "${DOCKER_CREDS_USR}/my-devops-app:latest"
        
        // GitHub credentials (configured in Jenkins)
        GITHUB_CREDS = credentials('github-credentials')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "📦 Code checked out successfully"
            }
        }
        
        stage('Install Dependencies') {
    steps {
        sh 'docker run --rm -v $PWD:/app -w /app node:18-alpine npm ci'
        echo "📚 Dependencies installed"
    }
}

    stage('Run Tests') {
        steps {
            sh 'docker run --rm -v $PWD:/app -w /app node:18-alpine npm test'
            echo "✅ Tests passed"
    }
}
        
        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${DOCKER_IMAGE} -t ${DOCKER_LATEST} ."
                echo "🐳 Docker image built: ${DOCKER_IMAGE}"
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                sh '''
                    echo ${DOCKER_CREDS_PSW} | docker login -u ${DOCKER_CREDS_USR} --password-stdin
                    docker push ${DOCKER_IMAGE}
                    docker push ${DOCKER_LATEST}
                '''
                echo "📤 Image pushed to Docker Hub"
            }
        }
        
        stage('Update Kubernetes Manifest') {
            steps {
                // Update the image tag in deployment.yaml
                sh "sed -i 's|image:.*/my-devops-app:.*|image: ${DOCKER_IMAGE}|g' k8s/deployment.yaml"
                
                // Commit and push back to GitHub
                withCredentials([usernamePassword(
                    credentialsId: 'github-credentials',
                    usernameVariable: 'GITHUB_USER',
                    passwordVariable: 'GITHUB_TOKEN'
                )]) {
                    sh '''
                        git config user.email "jenkins@devops.local"
                        git config user.name "Jenkins CI Pipeline"
                        git remote set-url origin https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/${GITHUB_USER}/my-devops-app.git
                        git add k8s/deployment.yaml
                        git diff --cached --quiet || git commit -m "🚀 Update image to ${DOCKER_IMAGE} [skip ci]"
                        git push origin main
                    '''
                }
                echo "📝 Kubernetes manifest updated and pushed to GitHub"
            }
        }
    }
    
    post {
        success {
            echo "🎉 Pipeline completed successfully!"
            echo "📦 Image: ${DOCKER_IMAGE}"
            echo "🌐 Access your app at: http://10.144.103.197:30080"
        }
        failure {
            echo "❌ Pipeline failed. Check the logs above."
        }
    }
}
