# CI/CD pipeline for QA, Staging and Production

### With basic node app *simpleweb* 

## How it works

### Add some Credentials

1. DockerHub
2. Build Sources 

### Set Some Envoirnment Variables for Jenkins

1. simpleweb_prod (production server IP)
2. simpleweb_stag (staging server IP)
3. simpleweb_qa   (QA server IP)


### Configure ssh keys

> **_NOTE:_** Test connections from shell cmd before testing pipeline 
1. production
2. staging
3. qa

### Configure Jenkins Item

1. Create Multibranch Pipleline
2. Add Branch Sources 
3. Chose or Add Credentials
4. Chose or Add Repository Name
5. Check flags if you require any
6. Click Save



You are good to go.

> **_NOTE:_** App can be accessible at port 80 *just access url http://ip on your browser*
