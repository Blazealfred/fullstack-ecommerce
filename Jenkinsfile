pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Blazealfred/fullstack-ecommerce.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker build -t ecommerce-frontend ./frontend'
                sh 'docker build -t ecommerce-backend ./backend'
            }
        }

        stage('Push to ECR') {
            steps {
                sh '''
                aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 422657065666.dkr.ecr.us-east-1.amazonaws.com
                docker tag ecommerce-frontend:latest 422657065666.dkr.ecr.us-east-1.amazonaws.com/frontend:latest
                docker tag ecommerce-backend:latest 422657065666.dkr.ecr.us-east-1.amazonaws.com/backend:latest
                docker push 422657065666.dkr.ecr.us-east-1.amazonaws.com/frontend:latest
                docker push 422657065666.dkr.ecr.us-east-1.amazonaws.com/backend:latest
                '''
            }
        }

        stage('Deploy to EC2') {
            steps {
                sh '''
                ssh -i "ecommercekey.pem" ec2-user@98.80.94.144 << EOF
                docker pull 422657065666.dkr.ecr.us-east-1.amazonaws.com/frontend:latest
                docker pull 422657065666.dkr.ecr.us-east-1.amazonaws.com/backend:latest
                docker stop frontend || true
                docker stop backend || true
                docker rm frontend || true
                docker rm backend || true
                docker run -d -p 80:80 --name frontend 422657065666.dkr.ecr.us-east-1.amazonaws.com/frontend:latest
                docker run -d -p 5000:5000 --name backend 422657065666.dkr.ecr.us-east-1.amazonaws.com/backend:latest
                EOF
                '''
            }
        }
    }
}
