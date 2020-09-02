pipeline {
    /* In this step, you can define where your job can run.
    
     * In more advanced usages, you can have the entire build be run inside of a Docker containers
     * in order to use custom tools not natively supported by Jenkins.
    
     */
    agent any
    
    
    /*
    * Uncomment this section if you want to use specific deploy or artifact record for build
    * 'codectl get deploy' and 'codectl get artifact' gives you the list of respective IDs
    environment{
        DEPLOY_ID=""
        ARTIFACT_ID=""
    }
    */


    stages {

        /* This stage runs pre-build tasks, such as loading variables or outputing start notifications
         */
        stage ('Pre-Build') {
            steps {
                notifyBuildStart()
                }
        }/* In this stage, the code is being built/compiled, and the Docker image is being created and tagged.
         * Tests shouldn't been run in this stage, in order to speed up time to deployment.
         */   
        stage ('Build') {
            steps {
                
				// Run the docker build command and tag the image with the git commit ID
				dockerBuild()
            }

        }

        
        /* In this stage, built images are being pushed
         */
        stage ('Push') {
            steps {
                
                
				// Authenticates with your remote Docker Repository, and pushes the value of "$DOCKER_PUSH_TAG",
				// which will exist if you used 'tagDocker' to tag your image, or set it manually. If you have done neither,
				// you can instead define your image using the 'image' parameter.
				// You can change the credentials used by using the 'authId' parameter.
				// The difference between this, and 'docker push $image', is that this handles 'docker login' for you.
				dockerPush()

				// Send Webex notification about docker push event status to the Webex room defined ID in the software details, using the
				// 'CoDE:ContainerHub' bot
				notifyDocker()
                
            }
        }
        

        

        /* In this stage, we're running several different sub-stages in parallel. This speeds up job time by running many different
         * steps (that don't necessarily need to be run in sequence) at the same time, speeding up your job runtime.
         */stage ('QA/Deployment') {
            // Run these stages in parallel
            parallel {

                /* This stage simply runs your Static Security Scan. Uncomment it and include your stack name to use it.
                 */
                /*stage ('Static Security Scan') {
                    steps {
                        // Behaves exactly like the Static Security Scan step you know and love in your Maven and Freestyle jobs.
                        //staticSecurityScan(sparkroomid: "$WEBEX_TEAMS_ROOM_ID", stackName: 'hcn-web-app-cd2-pipeline-beginner')
                    }

                }*/

                /* This steps runs your unit tests, and your SonarQube scan.
                 * This stage may vary heavily depending on your project language and structure.
                 */
                stage ('Test/Sonar') {
                    
					
					steps {

						// This particular implementation uses a Dockerfile called Dockerfile.test. When built, then run, it should output the test and coverage results
						// to a directory called "target". This may differ depending on how you choose to set up your tests.
						sh '''docker build . -f Dockerfile.test -t rbb-web-app:${BUILD_ID}'''
						sh "rm -rf target && mkdir target"

						// The '-u 50001255:25' flag is important here, it ensures that the docker container will create the files with the correct permissions
						sh '''docker run --rm -u 50001255:25 \
							-v "$PWD"/target:/usr/src/app/target \
							rbb-web-app:${BUILD_ID}
						'''

						// Removing the image to help free up space, as we will not need it for subsequent builds
						sh '''docker rmi rbb-web-app:${BUILD_ID}'''
                        sh '''sed -i "s|SF:/.*/app|SF:app|g" target/coverage/lcov.info'''
						// Run your sonar scan and upload results to your specific SonarQube instance, in this case, an instance simply titled 'Sonar'
						// IMPORTANT: Make sure you update this to use the SonarQube instance for your Jenkins master. If you are not sure what that is,
						// ask your Jenkins admin.
						sonarScan('Sonar')
					}


					// Make test results visible in Jenkins UI if the install step completed successfully
					post {
						success {
							junit testResults: 'target/test-results.xml', allowEmptyResults: true
						}
					}
                }
                
                /* You can use these stages if you would like to deploy to different dev environments depending on the current branch.
                 * To use this, simply uncomment the blocks, and add the branch pattern (ANT style path glob). Make sure you remove the 
                 * "Deploy All" stage as well, or you will do the deployments twice.
                 */
                /*stage ('Deploy Dev') {
                    when { branch "feature/*" }
                    steps {
                        triggerSpinnakerDevDeployment(environments: ["dev"], secret: "2b6caae500756c935b8ea6ace231d882")                        
                    }
                }*/

                

                stage ('Deploy All') {
                    steps {
                        
                        
                        // This step will automatically include the docker image stored in env $DOCKER_PUSH_TAG, or you can specify the image
                        // parameter to this step to manually indicate the image.
                        
                        triggerSpinnakerDevDeployment(

                            // The dev environments we are deploying to
                            environments: [
                                "dev",
                            ],
                        )                        
                    }
                }
            }
        }
    }
    post {
        always {
            notifyBuildEnd()
        }
    }
}

