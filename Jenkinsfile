pipeline {
    agent any

    environment {
        NODEJS_VERSION = '18' // Adjust if needed
    }

    stages {
        stage('Setup Environment') {
            steps {
                script {
                    sh '''
                    echo "Installing Node.js, npm, and Nginx..."
                    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                    sudo apt-get install -y nodejs nginx
                    sudo npm install -g pm2
                    '''
                }
            }
        }

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
                    sudo rm -rf /var/www/html/*
                    sudo cp -r dist/* /var/www/html/
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

                    # Start the backend using pm2
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
                    sudo systemctl restart nginx
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
