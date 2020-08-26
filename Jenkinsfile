
pipeline {
    /* In this step, you can define where your job can run.
     * In more advanced usages, you can have the entire build be run inside of a Docker containers
     * in order to use custom tools not natively supported by Jenkins.
     */
    agent any

    /* The tools this pipeline needs are defined here. The available versions are the same as those
     * available in maven or freestyle job.
     */
    tools {
        maven 'Maven-3.3.1'
        jdk 'JDK1.8.0'
    }

    environment {
        softwarePath="software.software1"
    }

    stages {


        /* This stage loads specified values from a yaml file, into specified environment variables
         */
        stage ('Load Values') {
            steps {
                // Send a notification using the CoDE:Jenkins bot to the SPARK_ROOM, indicating the build has started
                loadEnvs(
                    // Default is "values.yaml"
                    //yamlFile: "values.yaml",

                    // Used with the setLifecycleVariables parameter
                    softwarePath: "${softwarePath}",
                
                    // Injects ENABLED_ENV_NAME, DERIVED_ENV_NAME, DEV_ENABLED, STAGE_ENABLED, and PROD_ENABLED env variables. Default is true.
                    //setLifecycleVariables: true,
                  
                    // Loads the value at path 'jenkins.webexTeamsRoom'
                    envMapping: [
                        "SPARK_ROOM": "webexTeamsRoom",
                        "DOCKER_REPO": "${softwarePath}.image.containerRepo"
                    ]     
                )
                notifyBuildStart();
            }
        }

        /* In this stage, the code is being built/compiled, and the Docker image is being created and tagged.
         * Tests shouldn't been run in this stage, in order to speed up time to deployment.
         */
        stage ('Build') {
            steps {
                // Run the docker build command and tag the image with the git commit ID
                dockerBuild()

                // Authenticates with your remote Docker Repository, and pushes the value of "$DOCKER_PUSH_TAG",
                // which will exist if you used 'tagDocker' to tag your image, or set it manually. If you have done neither,
                // you can instead define your image using the 'image' parameter.
                // You can change the credentials used by using the 'authId' parameter.
                // The difference between this, and 'docker push $image', is that this handles 'docker login' for you.
                dockerPush()

                // Send Webex notification about docker push event status to the room defined in $SPARK_ROOM, using the
                // 'CoDE:ContainerHub' bot
                notifyDocker()
               


            }

        }

        /* In this stage, we're running several different sub-stages in parallel. This speeds up job time by running many different
         * steps (that don't necessarily need to be run in sequence) at the same time, speeding up your job runtime.
         */
        stage ('QA/Deployment') {

            // Run these stages in parallel
            parallel {

                /* This stage simply runs your Static Security Scan. Uncomment it and include your stack name to use it.
                 */
                /*stage ('Static Security Scan') {
                    when { environment name: 'DEV_ENABLED', value: 'true' }
                    steps {
                        // Behaves exactly like the Static Security Scan step you know and love in your Maven and Freestyle jobs.
                        //staticSecurityScan(sparkroomid: "$SPARK_ROOM", stackName: 'hcn-web-app-cd2-pipeline-beginner')
                    }

                }*/

                /* This steps runs your unit tests, and your SonarQube scan.
                 * This stage may vary heavily depending on your project language and structure.
                 */
                stage ('Test/Sonar') {
                    steps {

                        // Run your unit tests and prepare SonarQube output
                        // Here you'll add the appropriate commands to run tests and generate results for SonarQube to scan

                        // Run your sonar scan and upload results to your specific SonarQube instance, in this case, an instance simply titled 'Sonar'
                        // IMPORTANT: Make sure you update this to use the SonarQube instance for your Jenkins master. If you are not sure what that is,
                        // ask your Jenkins admin.
                        sonarScan('Sonar')
                    }


                    // Make test results visible in Jenkins UI if the install step completed successfully
                    post {
                        success {
                            junit testResults: 'target/surefire-reports/**/*.xml', allowEmptyResults: true
                        }
                    }
                }

                /* In this stage, you'll push your Docker image to your repository, and send a trigger to your Spinnaker URL to beginner
                 * your Spinnaker pipeline.
                 *
                 * To make sure you send the trigger event to the correct environment endpoint, you can specify a YAML file which will
                 * give simple details on each environement. An example file, in this case called "values.yaml" is included here:
                 * https://gitscm.cisco.com/projects/CD2-PIPELINE-BEGINNER/repos/hcn-web-app-cd2-pipeline-beginner/browse/values.yaml
                 *
                 * You can reference that if you are unsure of the format this information should be in.
                 * If you don't have that file, the trigger will look for "$SPINNAKER_URL" env variable, and try to use that instead.
                 * If it can find anything, the trigger will fail.
                 */
                stage ('Deployment') {
                    steps {

                        // Read the stage description above for a more complex explanation.
                        // This step will automatically include the docker image stored in env $DOCKER_PUSH_TAG, or you can specify the image
                        // parameter to this step to manually indicate the image.
                        triggerSpinnakerDeployment(
             
                            // This is where the stage will pull values from
                            valuesFile: "values.yaml",

                            includedKeys: [
                                "valueDelivered": "${softwarePath}.valueDelivered",
                                "applicationId": "application.businessApplication.id",
                                "releaseName":"application.releaseName",
                                "webexTeamsRoom":"webexTeamsRoom"
                            ],

                            // Use this parameter if you have tagged the image without using 'tagDocker', and have not specified the $DOCKER_PUSH_TAG
                            //image: "containers.cisco.com/myorganization/my_repo:my_version",

                            // The keys to your specific environments. The trigger will send info on the first
                            // object it finds that is marked as 'enabled'
                            environments: [
                                "${softwarePath}.environments.prod",
                                "${softwarePath}.environments.dev",
                                "${softwarePath}.environments.stage",
                            ],
                            // This secret is used to ensure only you can call the trigger. This is set up as constraint in your Spinnaker job.
                            // It sends with a key name of "secret".
                            // You MUST change this, or anyone might be able to trigger your pipeline.
                            // Additionally, we STRONGLY recommend that instead of using plain text, that you add a Jenkins credential,
                            // and use "withCredentials" step to safely pass that value into this step

                            secret: "2b6caae500756c935b8ea6ace231d882",

                            // You can optionally include extra files to send using this parameter, however if
                            // your Spinnaker pipeline is not configured to receive them, Spinnaker will just ignore them.
                            //yamlFiles: [
                            //
                            //]
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