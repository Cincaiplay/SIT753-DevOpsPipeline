pipeline {
    agent any

    environment {
        DOCKER_IMAGE_NAME = 'sit753-devopspipeline'
        CC_TEST_REPORTER_ID = '0ee07e8c6776e57c5ee7e1cddf598bd781ba4dced117c2ae9e2fbcf155a661e4'
        S3_BUCKET = 'first-devops-bucket-cy'
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

                    // Step 1: Start the server in the background
                    bat '''
                    docker run --rm -d -p 3040:3040 --name test-server sit753-devopspipeline:latest npm start
                    '''

                    // Step 2: Use Jenkins' built-in sleep to wait for the server to start
                    sleep(time: 5, unit: 'SECONDS')  // Sleep for 20 seconds to allow the server to fully start

                    // Step 3: Run the tests
                    bat '''
                    docker exec test-server npm test
                    '''

                    // Step 4: Stop the server after tests
                    bat '''
                    docker stop test-server
                    '''
                }
            }
        }



        // // Code Quality Analysis Stage: Use CodeClimate for code quality analysis
        // stage('Code Quality Analysis') {
        //     steps {
        //         script {
        //             echo "Running CodeClimate analysis..."
        //             // Convert Windows path to Docker-compatible path and avoid 'ro' flag for now
        //             bat """
        //             docker run --rm ^
        //             -e CODECLIMATE_CODE=%WORKSPACE% ^
        //             -v /c/ProgramData/Jenkins/.jenkins/workspace/SIT753_6.2HD_DevOpsPipeline:/code ^
        //             -v /var/run/docker.sock:/var/run/docker.sock ^
        //             codeclimate/codeclimate analyze
        //             """
        //         }
        //     }
        // }


        // Deploy Stage: Deploy to a Docker container or test environment
        stage('Deploy to Test Environment') {
            steps {
                script {
                    echo "Deploying the Docker image to local test environment..."
                    bat '''
                    docker stop test-app || echo "No container to stop"
                    docker rm test-app || echo "No container to remove"
                    docker run -d -p 4000:3040 --name test-app sit753-devopspipeline:latest || echo "Failed to run container"
                    '''
                }
            }
        }

        // // Release to Production with AWS CodeDeploy
        // stage('Release to Production with AWS CodeDeploy') {
        //     steps {
        //         script {
        //             // Fetch AWS credentials from Jenkins credentials store
        //             def awsCredentials = credentials('aws-credentials')

        //             // Set the AWS credentials as environment variables
        //             withEnv(["AWS_ACCESS_KEY_ID=${awsCredentials.username}", "AWS_SECRET_ACCESS_KEY=${awsCredentials.password}"]) {
        //                 echo "Deploying to production using AWS CodeDeploy..."
        //                 bat '''
        //                 aws deploy create-deployment ^
        //                 --application-name FirstCodeDeploy ^
        //                 --deployment-group-name FirstEc2InstanceCodeDeploy ^
        //                 --s3-location bucket=first-devops-bucket-cy,key=app.zip,bundleType=zip ^
        //                 --region ap-southeast-2
        //                 '''
        //             }
        //         }
        //     }
        // }




        // // Monitoring and Alerting Stage
        // stage('Monitoring and Alerting') {
        //     steps {
        //         script {
        //             echo "Notifying New Relic about the deployment..."
        //             newRelicDeployment(
        //                 apiKey: "${NEW_RELIC_API_KEY}",
        //                 applicationId: "${NEW_RELIC_APP_ID}",
        //                 description: "Deployment to production complete. Monitoring application in New Relic.",
        //                 user: "jenkins"
        //             )

        //             bat """
        //             curl -s --connect-timeout 5 ${APP_URL} || echo 'App is down, sending alert to New Relic'
        //             """
        //         }
        //     }
        // }
    }
}
