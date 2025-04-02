pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'your-dockerhub-username'
        DOCKER_HUB_PASSWORD = credentials('docker-hub-credentials')
        REPO_NAME = 'your-repo-name'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/your-username/your-repo.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    sh 'cd backend && npm install'
                    sh 'cd frontend && npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    sh 'cd backend && npm test || true'
                    sh 'cd frontend && npm test || true'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    sh 'docker build -t $DOCKER_HUB_USER/backend:latest ./backend'
                    sh 'docker build -t $DOCKER_HUB_USER/frontend:latest ./frontend'
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    sh 'echo $DOCKER_HUB_PASSWORD | docker login -u $DOCKER_HUB_USER --password-stdin'
                    sh 'docker push $DOCKER_HUB_USER/backend:latest'
                    sh 'docker push $DOCKER_HUB_USER/frontend:latest'
                }
            }
        }

        stage('Deploy to Server') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no ubuntu@your-ec2-ip << 'EOF'
                    docker pull $DOCKER_HUB_USER/backend:latest
                    docker pull $DOCKER_HUB_USER/frontend:latest
                    docker stop backend || true
                    docker stop frontend || true
                    docker rm backend || true
                    docker rm frontend || true
                    docker run -d --name backend -p 4000:4000 $DOCKER_HUB_USER/backend:latest
                    docker run -d --name frontend -p 3000:3000 $DOCKER_HUB_USER/frontend:latest
                    EOF
                    '''
                }
            }
        }
    }
}
