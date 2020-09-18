###Milestones

------------

Record your achievements and keep track of your noteworthy accomplishments with the Milestones app. A node js monolith built with tailwind css and mongo db as the database engine. View the live application [here](www.milestonesapp.xyz "here").

To run this application locally, there are a number of prerequisites which are

- A mongo db atlas cluster. [Sign up](https://www.mongodb.com/cloud/atlas/register "Sign up") on Atlas and [login](https://account.mongodb.com/account/login?nds=true "login") to create your cluster. Add a new user with **readWrite** privileges in the Database Access Tab. Also, grant access to the cluster from any location by adding an IP address of **0.0.0.0**. Do this in the Network Access tab. Take note of the preformatted connection string from the **connect to cluster** option.

- AWS access credentials.  [Create](https://portal.aws.amazon.com/billing/signup "Create") an AWS account and add your credit card to enable you make use of the free tier or if you have cash(baller!) make use of the paid tier. Create an IAM user and take note of the unique access key id and the secret access key. This is especially important as you will not be able to view it again. Finally, enable S3 permissions for this IAM user. If there are any issues, check out this [guide](https://docs.aws.amazon.com/directoryservice/latest/admin-guide/setting_up_create_iam_user.html "guide").

- An S3 bucket. Log into the [S3 console](https://console.aws.amazon.com/s3/home "S3 console") and create a new S3 bucket.  Note the **bucket name** and the **region** in the name and region tab. Make sure to untick the **block public options** in the set permissions tab. This is needed to make sure that you can access objects in the bucket from the application.

- Mailgun credentials to enable the sending of mails in the app. [Create](https://signup.mailgun.com/new/signup "Create") a mailgun account and [login](https://login.mailgun.com/login/ "login") to your mailgun dashboard. Seeing as the application will be running locally/is not live, you need to create a sandbox domain for testing mail functionality locally. Do that [here](https://app.mailgun.com/app/sending/domains "here"). Take note of the domain name with the **sandbox prefix** and the **private api key** for the domain. Find the api key [here](https://app.mailgun.com/app/sending/domains "here"). For the sandbox domain, you need to verify an email address you have access to for the domain. This is the only email(s) you will be able to send mails to from the app making use of the sandbox domain. Do this from the created sandbox domain tab.

- Finally, node. Get node [here](https://nodejs.org "here").

Open up the terminal and navigate to a directory of your choice and run

```
git clone -b clone --single-branch https://github.com/olamileke/milestones.git
```


This will clone the clone(sorry, double entendre!) branch onto your system. The clone branch contains the scrubbed config.js file into which you will enter your mongo db, aws and mailgun credentials to run the application.

Navigate into the  application root directory by running

```
cd milestones
```

At this point, we need to install all the packages needed by the app to run. Do this by running

```
npm install
```

After all the packages are done installing, open up the config.js file in the /utils subdirectory and do the following

- Set the connectionString option to the mongo db preformatted connection string obtained earlier from your cluster. Remember to swap out the password placeholder with your actual password .

- Set the API_KEY option to key-api_key with api_key being your private mailgun api key.

- Set DOMAIN to the mailgun sandbox domain with the sandbox prefix.

- Set aws_access_key_id to the access key id of the IAM(AWS) user created earlier.

- Set aws_secret_key to the secret access key of the IAM(AWS) user created earlier.

- Set aws_region to the region of the S3 bucket created. 

- Set aws_bucket_name to the name of the S3 bucket created earlier.

- Set s3_file_link to https://s3-**aws-region**.amazonaws.com/**bucket-name**/ with aws-region being the region of the S3 bucket and bucket-name being the name of the bucket. Make sure to remove the asterisks(*).

- Finally, set the **to** property in the mail object to the verified email of your mailgun sandbox domain.

Start the application by running

```
npm start

```
The application will be available at http://localhost:4000
