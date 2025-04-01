pipeline {
    agent any

    tools {
        nodejs "NodeJS 18" // Use the installed NodeJS version from Jenkins
    }

    environment {
        BACKEND_DIR = "backend"
        FRONTEND_DIR = "frontend"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "Checking out code from GitHub..."
                git branch: 'main', url: 'https://github.com/Blazealfred/fullstack-ecommerce.git'
            }
        }

        stage('Build Backend') {
            steps {
                script {
                    echo "Building Backend..."
                    dir(BACKEND_DIR) {
                        sh '''
                        npm install
                        npm run build
                        '''
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    echo "Building Frontend..."
                    dir(FRONTEND_DIR) {
                        sh '''
                        npm install
                        npm run build
                        '''
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                echo "Deployment step (configure this as needed)..."
            }
        }
    }

    post {
        success {
            echo "✅ Build & Deployment Successful!"
        }
        failure {
            echo "❌ Build Failed! Check logs."
        }
    }
}
