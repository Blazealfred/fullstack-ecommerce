pipeline {
    agent any

    environment {
        NODE_VERSION = '18.17.0'  // Set desired Node.js version
    }

    stages {
        stage('Install Node.js if Missing') {
            steps {
                script {
                    def nodeInstalled = sh(script: "node -v || echo 'not_installed'", returnStdout: true).trim()
                    if (nodeInstalled == "not_installed") {
                        echo "⚠️ Node.js not found! Installing Node.js..."
                        sh """
                            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                            sudo apt-get install -y nodejs
                        """
                    } else {
                        echo "✅ Node.js is already installed: ${nodeInstalled}"
                    }
                }
            }
        }

        stage('Checkout Code') {
            steps {
                git branch: 'main', credentialsId: 'github-credentials', url: 'https://github.com/Blazealfred/fullstack-ecommerce.git'
            }
        }

        stage('Build Backend') {
            steps {
                script {
                    echo "🚀 Building Backend..."
                    dir('backend') {
                        sh 'npm install'
                        def packageJson = readJSON(file: 'package.json')
                        if (packageJson.scripts?.build) {
                            sh 'npm run build'
                        } else {
                            echo "⚠️ No 'build' script found in backend package.json. Skipping build."
                        }
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    echo "🚀 Building Frontend..."
                    dir('frontend') {
                        sh 'npm install'
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                echo "🚀 Deploying application..."
                // Add deployment steps (e.g., copying files to a server, restarting services)
                sh """
                    echo "Frontend & Backend Deployment Placeholder"
                """
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
