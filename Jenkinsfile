pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Blazealfred/fullstack-ecommerce.git'
            }
        }

        stage('Build Backend') {
            steps {
                script {
                    sh '''
                    echo "Building Backend..."
                    cd backend
                    npm install
                    npm run build
                    cd ..
                    '''
                }
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    sh '''
                    echo "Building Frontend..."
                    cd frontend
                    npm install
                    npm run build
                    cd ..
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deployment step goes here (e.g., Docker, SSH, AWS, etc.)'
            }
        }
    }
}
