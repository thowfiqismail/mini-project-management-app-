pipeline {
  agent any

  environment {
    DOCKER_IMAGE = "thowfiqismail/mini-project-app"
    DOCKER_TAG = "latest"
  }

  stages {
    stage('Clone Repo') {
      steps {
        git 'https://github.com/thowfiqismail/mini-project-management-app-'
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
        }
      }
    }

    stage('Push Docker Image') {
      steps {
        withDockerRegistry([ credentialsId: 'dockerhub-creds', url: '' ]) {
          script {
            docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push()
          }
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        sh 'kubectl apply -f deployment.yaml'
      }
    }
  }
}
