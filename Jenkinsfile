// Folder on server where the backup of the old site saved
def backupFolder = '~/deploy-backups'

// Name of the folder where the new application is being prepared.
// Must not exist in the application that is being deployed.
def deployFolder = 'deployment'

// Name of the archive that contains the new application.
// Must not exist in the application that is being deployed.
def deployTar = 'deployment.tar.gz'

// Folder on server where the applications exist
def targetFolder = '~/webapps-data'

// Default configuration used for building other than deploy branches.
//  - config: An object that lists what values to set in the config/envspecific.js configuration file
def defaultBuildConfig = [
    config: [
        environment: 'dev',
        apiUrl: 'http://localhost:8080',
    ],
]

// A map of deployment environments.
// Each element is a map with the following keys:
//  - host: The host url in format user@some.server.com
//  - credentials: Name of credentials to use for ssh
//  - folder: The folder where the app is located on server
//  - siteUrl: The url where the site can be accessed
//  - config: The environment specific configuration for the given build
def deployBranches = [
    develop: [
        host: 'synergic@lutra.visionapps.cz',
        credentials: 'deploy_lutra',
        folder: 'ditt_client_dev',
        siteUrl: 'http://ditt-client.dev.visionapps.cz',
        config: [
            environment: 'dev',
            apiUrl: '.',
            // apiUrl: 'http://ditt-api.dev.visionapps.cz',
        ],
    ],
]



node {
    try {
        stage('Checkout code') {
           checkout scm
        }

        stage('Prepare docker containers') {
           sh 'docker-compose build node'
        }

        def commit = sh(
           returnStdout: true,
           script: 'git rev-parse HEAD 2> /dev/null || exit 0'
        ).trim()

        if (deployBranches.containsKey(env.BRANCH_NAME)) {
            stage("Build ${env.BRANCH_NAME}") {
                sh "sed -i \"s@__ASSET_VERSION__@${commit}@g\" public/index.html"
                build(
                    deployBranches[env.BRANCH_NAME].config.environment,
                    commit,
                    deployBranches[env.BRANCH_NAME].config.apiUrl,
                )
            }

            stage('Deploy') {
                createTar(deployTar)
                deploy(deployBranches[env.BRANCH_NAME], targetFolder, deployTar, deployFolder, backupFolder)
                checkStatus(deployBranches[env.BRANCH_NAME].siteUrl, 200)
                notifyOfDeploy(deployBranches, env.BRANCH_NAME)
            }
        }
        else {
            stage("Build ${env.BRANCH_NAME}") {
                build(
                    defaultBuildConfig.config.environment,
                    commit,
                    defaultBuildConfig.config.apiUrl,
                )
            }
        }
    } catch (err) {
        currentBuild.result = 'FAILURE'
        echo "DEPLOY ERROR: ${err.toString()}"
        emailext (
            recipientProviders: [[$class: 'DevelopersRecipientProvider']],
            subject: "Build ${env.JOB_NAME} [${env.BUILD_NUMBER}] failed",
            body: err.toString(),
            attachLog: true,
        )
        if (deployBranches.containsKey(env.BRANCH_NAME)) {
            slackSend(color: 'danger', message: 'DITT client: Build větve `${env.BRANCH_NAME}` selhal :thunder_cloud_and_rain:')
        }
    } finally {
        stage('Cleanup') {
            sh 'docker-compose stop'
            sh 'docker-compose rm --all --force'
        }
    }
}

def build(envName, commit, apiUrl) {
    sh 'rm -rf node_modules'
    sh 'rm -rf public/generated/bundle.js'
    sh 'rm -f config/envspecific.js'

    sh 'cp config/envspecific.example.js config/envspecific.js'
    for (confOption in [
        [orig: "export const ENVIRONMENT = 'dev';", new: "export const ENVIRONMENT = '${envName}';"],
        [orig: "export const COMMIT = 'commithash';", new: "export const COMMIT = '${commit}';"],
        [orig: "export const API_URL = 'http://localhost:8080';", new: "export const API_URL = '${apiUrl}';"],
    ]) {
        sh "sed -i \"s@${confOption.orig}@${confOption.new}@g\" config/envspecific.js"
    }

    sh 'docker-compose run node bash -c "sh /root/init-container.sh /workspace && su docker-container-user ./build.sh"'
}

def deploy(deployBranch, targetFolder, deployTar, deployFolder, backupFolder) {
    sshagent (credentials: [deployBranch.credentials]) {
        sh """ssh ${deployBranch.host} /bin/bash << EOF
            set -e
            cd ${targetFolder}/${deployBranch.folder}

            echo 'Creating deploy folder'
            rm -rf ${deployFolder}
            mkdir ${deployFolder}
            cp .htaccess ${deployFolder}/.htaccess 2>/dev/null || :
            cp .htpasswd ${deployFolder}/.htpasswd 2>/dev/null || :

            echo 'Moving deploy folder to targetFolder'
            rm -rf ${targetFolder}/${deployBranch.folder}.deploy
            mv ${targetFolder}/${deployBranch.folder}/${deployFolder} ${targetFolder}/${deployBranch.folder}.deploy
        """

        sh "scp public/${deployTar} ${deployBranch.host}:${targetFolder}/${deployBranch.folder}.deploy"

        sh """ssh ${deployBranch.host} /bin/bash << EOF
            set -e
            cd ${targetFolder}/${deployBranch.folder}.deploy

            echo 'Finalizing deploy'
            tar -mxzf ${deployTar}

            echo 'Backing up old deploy'
            rm -rf ${backupFolder}/${deployBranch.folder}
            mv ${targetFolder}/${deployBranch.folder} ${backupFolder}/${deployBranch.folder}

            echo 'Switching to new deploy'
            mv ${targetFolder}/${deployBranch.folder}.deploy ${targetFolder}/${deployBranch.folder}
            rm -f ${targetFolder}/${deployBranch.folder}/${deployTar}
        """
    }
}

def createTar(deployTar) {
    dir('public') {
        sh "rm -f ${deployTar}"
        sh "tar -zcf ${deployTar} *"
    }
}

def checkStatus(url, code) {
    echo 'Checking website status'
    sh """
        httpCode=\$(curl -sL --connect-timeout 50 -w "%{http_code}\\n" $url -o /dev/null)
        if [ \$httpCode -eq $code ]; then
            echo 'Website status check passed.'
            exit 0
        else
            echo 'Website status check failed.'
            exit 1
        fi
    """
}

def notifyOfDeploy(deployBranches, currentBranch) {
    echo 'DEPLOY SUCCESSFUL'
    slackSend(
        color: 'good',
        message: "DITT client: Větev `${currentBranch}` byla nasazena na: ${deployBranches[currentBranch].siteUrl} :sunny:"
    )
}
