node {
	properties([disableConcurrentBuilds()])
	app = null
	stage('Checkout Repository') {
		checkout scm
		sh 'git rev-parse --short HEAD > .git/commit-id'
		env.COMMIT_ID = readFile('.git/commit-id').trim()
		env.PROJECT_NAME = (env.JOB_NAME.tokenize('/') as String[])[0]
		env.IMAGE_TAG = "usmanbaloch/${env.PROJECT_NAME}:${commit_id}"
		env.BUILD_TAG = "${env.PROJECT_NAME}-${commit_id}"
		env.LOCAL_IMAGE_PATH = "/usr/local/src/qa_images/"
		env.LOCAL_IMAGE = "${env.LOCAL_IMAGE_PATH}${env.PROJECT_NAME}_${commit_id}.tar.gz"
	}
	sh 'printenv'
	stage('Create Docker Image') {
		app = docker.build(env.IMAGE_TAG)
	}
	stage('Create Local Copy of Image'){
		sh "docker save -o ${env.LOCAL_IMAGE} ${env.IMAGE_TAG}"
	}
	if (env.BRANCH_NAME == 'master'){
		stage('Push Image to DockerHub'){
			docker.withRegistry('https://index.docker.io/v1/', 'docker_hub_login') {
				app.push()
				app.push("latest")
		    }
		}
		stage('Deploy To Staging'){
			sh "ssh root@$simpleweb_stag \"docker pull ${env.IMAGE_TAG}\""
			try {
				sh "ssh root@$simpleweb_stag \"docker stop simpleweb\""
				sh "ssh root@$simpleweb_stag \"docker rm simpleweb\""
			} catch (err) {
				echo: 'caught error: $err'
			}
			sh "ssh root@$simpleweb_stag \"docker run --restart always --name simpleweb -p 80:3000 -d ${env.IMAGE_TAG}\""	
		}
		stage('Deploy To Production'){
			input 'Deploy to Production?'
			milestone(1)
			sh "ssh root@$simpleweb_prod \"docker pull ${env.IMAGE_TAG}\""
			try {
				sh "ssh root@$simpleweb_prod \"docker stop simpleweb\""
				sh "ssh root@$simpleweb_prod \"docker rm simpleweb\""
			} catch (err) {
				echo: 'caught error: $err'
			}
				sh "ssh root@$simpleweb_prod \"docker run --restart always --name simpleweb -p 80:3000 -d ${env.IMAGE_TAG}\""
		}
		stage('Clear Old Images for Staging and Production'){
			try{
				sh "ssh root@$simpleweb_stag \"docker image prune -a --force --filter \"until=192h\"\""
				sh "ssh root@$simpleweb_prod \"docker image prune -a --force --filter \"until=192h\"\""

			}catch (err) {
				echo: 'caught error: $err'
			}
		}
	}
	else{
		stage('Deploy to QA'){
			sh "scp ${env.LOCAL_IMAGE} root@$simpleweb_qa:${env.LOCAL_IMAGE}"
			sh "ssh root@$simpleweb_qa \"docker load -i ${env.LOCAL_IMAGE}\""
			try {
				sh "ssh root@$simpleweb_qa \"docker stop simpleweb\""
				sh "ssh root@$simpleweb_qa \"docker rm simpleweb\""
			} catch (err) {
				echo: 'caught error: $err'
			}
			sh "ssh root@$simpleweb_qa \"docker run --restart always --name simpleweb -p 80:3000 -d ${env.PROJECT_NAME}:${commit_id}\""	
		}
	}
	stage('Clear Old Images for Jenkins and QA'){
		try{
			sh "ssh root@$simpleweb_qa \"docker image prune -a --force --filter \"until=192h\"\""
			sh "docker image prune -a --force --filter \"until=192h\""
			sh "ssh root@$simpleweb_qa \"find ${env.LOCAL_IMAGE_PATH} -name \"*.tar.gz\" -mtime +8 -delete > /dev/null\""
			sh "find ${env.LOCAL_IMAGE_PATH} -name \"*.tar.gz\" -mtime +8 -delete > /dev/null"

		}catch (err) {
			echo: 'caught error: $err'
		}
	}
}

void silent_sh(String script) {
	sh('#!/bin/sh -e\n' + script)
}
