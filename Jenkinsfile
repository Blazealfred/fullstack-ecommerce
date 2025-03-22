pipeline {
    agent any

    environment {
        AWS_REGION = "us-east-1"
        AWS_ACCOUNT_ID = "485496110386"  // ✅ Update with your actual AWS account ID
        FRONTEND_ECR = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/frontend"
        BACKEND_ECR = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/backend"
        EC2_PUBLIC_IP = "52.22.36.25"  // ✅ Update with your latest EC2 Public IP
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Blazealfred/fullstack-ecommerce.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                docker build -t ecommerce-frontend ./frontend
                docker build -t ecommerce-backend ./backend
                '''
            }
        }

        stage('Push to AWS ECR') {
            steps {
                withCredentials([aws(credentialsId: 'aws-credentials', region: "$AWS_REGION")]) {
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
        }

        stage('Deploy to AWS EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {  // ✅ Add your SSH key to Jenkins credentials
                    sh '''
                    ssh -o StrictHostKeyChecking=no ec2-user@$EC2_PUBLIC_IP << EOF
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
