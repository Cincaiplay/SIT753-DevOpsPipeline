pipeline {
    agent any

    environment {
        DOCKER_IMAGE_NAME = 'sit753-devopspipeline'
        CC_TEST_REPORTER_ID = '0ee07e8c6776e57c5ee7e1cddf598bd781ba4dced117c2ae9e2fbcf155a661e4'
        S3_BUCKET = 'your-s3-bucket-name'
        AWS_APPLICATION_NAME = 'FirstCodeDeploy'
        AWS_DEPLOYMENT_GROUP = 'FirstEc2InstanceCodeDeploy'
        AWS_REGION = 'ap-southeast-2'
        NEW_RELIC_API_KEY = credentials('new-relic-api-key')
        NEW_RELIC_APP_ID = '597668452'
        APP_URL = 'http://3.27.236.171:4000'
    }

    stages {
        // Build Stage: Build the Docker image and create the build artifact
        stage('Build') {
            steps {
                script {
                    echo "Building the Docker image..."
                    // Build the new Docker image
                    bat 'docker build --no-cache -t sit753-devopspipeline:latest .'
                }
            }
        }

        // Test Stage: Run automated tests inside a Docker container
        stage('Test') {
            steps {
                script {
                    echo "Running automated tests with Mocha inside Docker container..."

                    // Start the server in the background and run tests
                    bat '''
                    docker run --rm -d -p 3040:3040 --name test-server sit753-devopspipeline:latest npm start
                    sleep 10
                    docker exec test-server npm test
                    docker stop test-server
                    '''
                }
            }
        }


        // Code Quality Analysis Stage: Use CodeClimate for code quality analysis
        // stage('Code Quality Analysis') {
        //     steps {
        //         script {
        //             echo "Running CodeClimate analysis..."
        //             // Windows bat syntax for Docker + CodeClimate analysis
        //             bat """
        //             docker run --rm ^
        //             -e CODECLIMATE_CODE="%WORKSPACE%" ^
        //             -v "%WORKSPACE%":/code ^
        //             -v /var/run/docker.sock:/var/run/docker.sock ^
        //             codeclimate/codeclimate analyze
        //             """
        //         }
        //     }
        // }

        // // Packaging Stage: Zip the project and upload to S3
        // stage('Package and Upload') {
        //     steps {
        //         script {
        //             echo "Packaging the application..."
        //             // Windows command for zipping (PowerShell's Compress-Archive)
        //             bat 'powershell -command "Compress-Archive -Path * -DestinationPath app.zip"'

        //             echo "Uploading the package to S3..."
        //             // AWS CLI for Windows to upload to S3
        //             bat 'aws s3 cp app.zip s3://%S3_BUCKET%/app.zip --region %AWS_REGION%'
        //         }
        //     }
        // }

        // Package and Upload Stage
        stage('Package and Upload') {
            steps {
                script {
                    echo "Packaging the application..."
                    // Use PowerShell to compress the application
                    bat 'powershell -command "Compress-Archive -Path * -DestinationPath app.zip"'
                    
                    echo "Uploading the package to S3..."
                    // Upload the ZIP file to S3 using AWS CLI
                    bat 'aws s3 cp app.zip s3://first-devops-bucket-cy/app.zip --region ap-southeast-2'
                }
            }
        }


        // Deploy Stage: Deploy to a Docker container or test environment
        stage('Deploy to Test Environment') {
            steps {
                script {
                    echo "Deploying the Docker image to local test environment..."
                    bat 'docker stop test-app || echo "No container to stop"'
                    bat 'docker rm test-app || echo "No container to remove"'
                    bat 'docker run -d -p 4000:3040 --name test-app %DOCKER_IMAGE_NAME%:latest'
                }
            }
        }

        // Release to Production with AWS CodeDeploy
        stage('Release to Production with AWS CodeDeploy') {
            steps {
                script {
                    echo "Deploying to production using AWS CodeDeploy..."
                    // AWS CodeDeploy steps don't need modification as they apply to the Ubuntu instance
                    sh """
                    aws deploy create-deployment \
                    --application-name ${AWS_APPLICATION_NAME} \
                    --deployment-group-name ${AWS_DEPLOYMENT_GROUP} \
                    --s3-location bucket=${S3_BUCKET},key=app.zip,bundleType=zip \
                    --region ${AWS_REGION}
                    """
                }
            }
        }

        // Monitoring and Alerting Stage
        stage('Monitoring and Alerting') {
            steps {
                script {
                    echo "Notifying New Relic about the deployment..."
                    newRelicDeployment(
                        apiKey: "${NEW_RELIC_API_KEY}",
                        applicationId: "${NEW_RELIC_APP_ID}",
                        description: "Deployment to production complete. Monitoring application in New Relic.",
                        user: "jenkins"
                    )

                    bat """
                    curl -s --connect-timeout 5 ${APP_URL} || echo 'App is down, sending alert to New Relic'
                    """
                }
            }
        }
    }
}
