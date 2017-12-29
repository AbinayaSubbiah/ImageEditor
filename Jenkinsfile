#!groovy

node('CloudEJ2') {
    try {
        deleteDir()
        stage('Import') {
            git url: 'https://gitlab.syncfusion.com/essential-studio/ej2-groovy-scripts.git', branch: 'master', credentialsId: env.JENKINS_CREDENTIAL_ID
            shared = load 'src/shared.groovy'
        }

        stage('Checkout') {
            checkout scm
            shared.getProjectDetails()
            shared.gitlabCommitStatus('running')
        }
        if(shared.checkCommitMessage()) {
            stage('Install') {
                shared.install()
            }

            stage('Themes') {
                shared.compile()
            }

            stage('Test') {
                shared.test()
            }
            
                stage('Publish') {
                    shared.publish()
                }            
        
            stage('SampleBrowser') {
                shared.triggerSampleBrowserBuild()
            }
        }

        shared.gitlabCommitStatus('success')
        deleteDir()
    }
    catch(Exception e) {
        shared.throwError(e)
    }
}