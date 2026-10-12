pipeline {
    agent any
    environment {
        AWS_ACCOUNT_ID     = '123456789012' 
        AWS_DEFAULT_REGION = 'ap-south-1'
        IMAGE_REPO_NAME    = 'online-exam-repo'
        IMAGE_TAG          = "\${env.BUILD_NUMBER}"
    }
    stages {
        stage('1. Checkout Source Code') {
            steps {
                checkout scm
            }
        }
        stage('2. Amazon ECR Authentication') {
            steps {
                withAWS(credentials: 'aws-credentials-id', region: "\${AWS_DEFAULT_REGION}") {
                    sh "aws ecr get-login-password --region \${AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin \({AWS_ACCOUNT_ID}.dkr.ecr.\){AWS_DEFAULT_REGION}.amazonaws.com"
                }
            }
        }
        stage('3. Build Multi-Stage Docker Image') {
            steps {
                sh "docker build -t \({AWS_ACCOUNT_ID}.dkr.ecr.\){AWS_DEFAULT_REGION}://\({IMAGE_REPO_NAME}:\){IMAGE_TAG} ."
                sh "docker tag \${AWS_ACCOUNT_ID}.dkr.ecr.\({AWS_DEFAULT_REGION}://\){IMAGE_REPO_NAME}:\({IMAGE_TAG}\){AWS_ACCOUNT_ID}.dkr.ecr.\({AWS_DEFAULT_REGION}://\){IMAGE_REPO_NAME}:latest"
            }
        }
        stage('4. Push Container Image to AWS') {
            steps {
                sh "docker push \({AWS_ACCOUNT_ID}.dkr.ecr.\){AWS_DEFAULT_REGION}://\({IMAGE_REPO_NAME}:\){IMAGE_TAG}"
                sh "docker push \${AWS_ACCOUNT_ID}.dkr.ecr.\({AWS_DEFAULT_REGION}://\){IMAGE_REPO_NAME}:latest"
            }
        }
    }
}
