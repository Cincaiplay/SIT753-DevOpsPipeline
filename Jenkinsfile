pipeline {
    agent any

    environment {
        DOCKER_IMAGE_NAME = 'sit753-devopspipeline'  // Replace with your desired image name
    }

    stages {
        stage('Build') {
            steps {
                script {
                    echo "Building the Docker image locally..."
                    // Build the Docker image from the Dockerfile in the root of the project
                    sh 'docker build -t ${DOCKER_IMAGE_NAME}:latest .'
                }
            }
        }
        stage('Test') {
            steps {
                script {
                    echo "Running tests inside Docker container..."
                    // Optionally, run tests inside a Docker container
                    sh 'docker run --rm ${DOCKER_IMAGE_NAME}:latest npm test'  // Replace with your test command
                }
            }
        }
        stage('Deploy to Staging') {
            steps {
                script {
                    echo "Deploying the Docker image to local staging environment..."
                    // Stop and remove any existing staging container
                    sh 'docker stop staging-app || true && docker rm staging-app || true'
                    // Run the new Docker container as a staging environment, mapping port 4000 to 3040
                    sh 'docker run -d -p 4000:3040 --name staging-app ${DOCKER_IMAGE_NAME}:latest'
                }
            }
        }
        stage('Integration Tests on Staging') {
            steps {
                script {
                    echo "Running integration tests on the local staging environment..."
                    // Add commands to run integration tests on the staging container
                }
            }
        }
        stage('Deploy to Production') {
            steps {
                script {
                    echo "Deploying the Docker image to local production environment..."
                    // Stop and remove any existing production container
                    sh 'docker stop production-app || true && docker rm production-app || true'
                    // Run the new Docker container as a production environment, mapping port 5000 to 3040
                    sh 'docker run -d -p 5000:3040 --name production-app ${DOCKER_IMAGE_NAME}:latest'
                }
            }
        }
    }
}
