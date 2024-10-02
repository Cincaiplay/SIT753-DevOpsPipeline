pipeline {
    agent any

    environment {
        DOCKER_IMAGE_NAME = 'sit753-devopspipeline'
        CC_TEST_REPORTER_ID = '0ee07e8c6776e57c5ee7e1cddf598bd781ba4dced117c2ae9e2fbcf155a661e4'
        S3_BUCKET = 'first-devops-bucket-cy'  // Replace with your S3 bucket name
        AWS_APPLICATION_NAME = 'FirstCodeDeploy'  // AWS CodeDeploy app name
        AWS_DEPLOYMENT_GROUP = 'FirstEc2InstanceCodeDeploy'  // AWS CodeDeploy deployment group
        AWS_REGION = 'ap-southeast-2'  // Your AWS region
        NEW_RELIC_API_KEY = credentials('new-relic-api-key')
        NEW_RELIC_APP_ID = '597668452'
        APP_URL = 'http://3.27.236.171:4000'  // Production URL (Added http for valid URL format)
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

        // Additional: Packaging Stage: Zip the project and upload to S3
        stage('Package and Upload') {
            steps {
                script {
                    echo "Packaging the application..."
                    // Zip the entire project folder
                    sh 'zip -r app.zip *'
                    echo "Uploading the package to S3..."
                    // Upload the ZIP file to S3
                    sh """
                    aws s3 cp app.zip s3://${S3_BUCKET}/app.zip --region ${AWS_REGION}
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

        // Additional Stage: Check if the deployment in test environment is successful
        stage('Integration Tests on Test Environment') {
            steps {
                script {
                    // Logging a message to indicate the start of the integration test stage
                    echo "Running integration tests on the test environment..."
                    
                    // This command runs the "integration-test" script defined in your package.json.
                    // It will execute the tests against the deployed application running in the test environment.
                    sh 'npm run integration-test'
                }
            }
        }


        // Release Stage: Promote to production environment
        stage('Release to Production with AWS CodeDeploy') {
            steps {
                script {
                    echo "Deploying to production using AWS CodeDeploy..."

                    // Assuming the build artifacts are already uploaded to S3
                    sh """
                    aws deploy create-deployment \
                    --application-name ${AWS_APPLICATION_NAME} \
                    --deployment-group-name ${AWS_DEPLOYMENT_GROUP} \
                    --s3-location bucket=${S3_BUCKET},key=your-app-package.zip,bundleType=zip \
                    --region ${AWS_REGION}
                    """
                }
            }
        }

        // Monitoring and Alerting Stage: Set up monitoring for production environment
        stage('Monitoring and Alerting') {
            steps {
                script {
                    echo "Notifying New Relic about the deployment..."

                    // Notify New Relic of the deployment
                    newRelicDeployment(
                        apiKey: "${NEW_RELIC_API_KEY}",
                        applicationId: "${NEW_RELIC_APP_ID}",
                        description: "Deployment to production complete. Monitoring application in New Relic.",
                        user: "jenkins"
                    )

                    // Optionally, check the health of the production application
                    sh """
                    curl -s --connect-timeout 5 ${APP_URL} || newRelicNotify(
                        apiKey: "${NEW_RELIC_API_KEY}",
                        title: "Production App Down",
                        text: "The production app is unreachable.",
                        priority: 'high',
                        alertType: 'error'
                    )
                    """
                }
            }
        }
    }
}
