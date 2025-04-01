pipeline {
    agent any

    environment {
        NODEJS_VERSION = '18' // Assuming Node.js 18 is already installed
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', credentialsId: 'github-credentials', url: 'https://github.com/Blazealfred/fullstack-ecommerce.git'
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    sh '''
                    echo "Building frontend..."
                    cd frontend
                    npm install
                    npm run build
                    rm -rf /var/www/html/*
                    cp -r dist/* /var/www/html/
                    '''
                }
            }
        }

        stage('Build Backend') {
            steps {
                script {
                    sh '''
                    echo "Building backend..."
                    cd backend
                    npm install

                    # Check if .env file exists (MongoDB might need this)
                    if [ ! -f ".env" ]; then
                        echo "⚠️ WARNING: No .env file found! Backend may fail to connect to MongoDB."
                    fi

                    # Restart backend with pm2
                    pm2 stop backend || true
                    pm2 start server.js --name backend
                    '''
                }
            }
        }

        stage('Restart Nginx') {
            steps {
                script {
                    sh '''
                    echo "Restarting Nginx..."
                    systemctl restart nginx || true
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment Successful!"
        }
        failure {
            echo "❌ Deployment Failed! Check logs."
        }
    }
}
