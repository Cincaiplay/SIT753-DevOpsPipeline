pipeline {
    agent any

    environment {
        DOCKER_IMAGE_NAME = 'sit753-devopspipeline'  // 0ee07e8c6776e57c5ee7e1cddf598bd781ba4dced117c2ae9e2fbcf155a661e4
        CC_TEST_REPORTER_ID = '0ee07e8c6776e57c5ee7e1cddf598bd781ba4dced117c2ae9e2fbcf155a661e4'  // Replace with your CodeClimate Test Reporter ID
    }

    stages {
        // Build Stage: Build the Docker image and create the build artifact
        stage('Build') {
            steps {
                script {
                    echo "Building the Docker image..."
                    // Build the Docker image using the Dockerfile
                    sh 'docker build -t ${DOCKER_IMAGE_NAME}:latest .'
                }
            }
        }

        // Test Stage: Run automated tests inside a Docker container
        stage('Test') {
            steps {
                script {
                    echo "Running automated tests with Mocha inside Docker container..."
                    // Run tests inside the Docker container
                    sh 'docker run --rm ${DOCKER_IMAGE_NAME}:latest npm test'  // This runs npm test inside the container
                }
            }
        }

        // Code Quality Analysis Stage: Use SonarQube for code quality analysis
        stage('Code Quality Analysis') {
            steps {
                script {
                    echo "Running CodeClimate analysis..."
                    // Pull the CodeClimate Docker image and run the analysis
                    sh """
                    docker run --rm \
                    -e CODECLIMATE_CODE="${WORKSPACE}" \
                    -v "${WORKSPACE}":/code \
                    -v /var/run/docker.sock:/var/run/docker.sock \
                    codeclimate/codeclimate analyze
                    """
                }
            }
        }

        // Deploy Stage: Deploy to a Docker container or test environment
        stage('Deploy to Test Environment') {
            steps {
                script {
                    echo "Deploying the Docker image to local test environment..."
                    // Stop and remove any existing test environment container
                    sh 'docker stop test-app || true && docker rm test-app || true'
                    // Run the new Docker container for the test environment
                    sh 'docker run -d -p 4000:3040 --name test-app ${DOCKER_IMAGE_NAME}:latest'
                }
            }
        }

        // Additional Stage: 
        stage('Integration Tests on Test Environment') {
            steps {
                script {
                    echo "Running integration tests on the test environment..."
                    // Example test command, replace with your actual test suite
                    sh 'npm run integration-test'  // Ensure you have an integration test script
                }
            }
        }

        // Release Stage: Promote to production environment
        stage('Deploy to Production Environment') {
            steps {
                script {
                    echo "Deploying Docker image to the production environment..."
                    // Stop and remove any existing production container
                    sh 'docker stop production-app || true && docker rm production-app || true'
                    // Run the new Docker container as the production environment
                    sh 'docker run -d -p 5000:3040 --name production-app ${DOCKER_IMAGE_NAME}:latest'
                }
            }
        }

        // Monitoring and Alerting Stage: Set up monitoring for production environment
        stage('Monitoring and Alerting') {
            steps {
                script {
                    echo "Setting up monitoring for the production environment..."
                    // Use monitoring tools like Datadog or New Relic
                    // Example: sh 'datadog-agent monitor ${DOCKER_IMAGE_NAME}'
                }
            }
        }
    }
}
