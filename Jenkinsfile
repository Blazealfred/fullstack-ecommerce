pipeline {
    agent any

    environment {
        AWS_REGION = "us-east-1"
        AWS_ACCOUNT_ID = "422657065666"
        FRONTEND_ECR = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/frontend"
        BACKEND_ECR = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/backend"
        EC2_PUBLIC_IP = "98.80.94.144"  // Update with your latest EC2 IP
    }

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

        stage('Push to AWS ECR') {
            steps {
                sh '''
                aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $FRONTEND_ECR
                aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $BACKEND_ECR
                
                docker tag ecommerce-frontend:latest $FRONTEND_ECR:latest
                docker tag ecommerce-backend:latest $BACKEND_ECR:latest
                
                docker push $FRONTEND_ECR:latest
                docker push $BACKEND_ECR:latest
                '''
            }
        }

        stage('Deploy to AWS EC2') {
            steps {
                sh '''
                ssh -o StrictHostKeyChecking=no -i "ecommercekey.pem" ec2-user@$EC2_PUBLIC_IP << EOF
                aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $FRONTEND_ECR
                aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $BACKEND_ECR
                
                docker pull $FRONTEND_ECR:latest
                docker pull $BACKEND_ECR:latest
                
                docker stop frontend || true
                docker stop backend || true
                docker rm frontend || true
                docker rm backend || true
                
                docker run -d -p 80:80 --name frontend $FRONTEND_ECR:latest
                docker run -d -p 5000:5000 --name backend $BACKEND_ECR:latest
                EOF
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Deployment Successful!'
        }
        failure {
            echo '❌ Deployment Failed! Check logs for errors.'
        }
    }
}
