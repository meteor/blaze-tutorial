---
title: '12: Deploying'
---

Now your app is tested and ready to be published so anyone can use it.

[Galaxy](https://www.meteor.com/cloud) is the best place to run your Meteor app. Galaxy offers free deployment. Cool, right?

> If you have any trouble with this step, you should send an email to Galaxy support, and they are going to help you. Send your message to `support@meteor.com`. Try to explain in detail what the issue is, and you will receive help as soon as possible. Also, include the subject: `Blaze Tutorial` so you know from where you are coming.

## 12.1: Create your account

Do you have a Meteor Cloud Account? No? No problem!

Go to [cloud.meteor.com](https://cloud.meteor.com?isSignUp=true). You are going to see a form like this:

<img width="500px" src="/simple-todos/assets/step12-sign-up.png"/>

Sign up with GitHub and proceed from there. It will ask you for a username and password, which you will need to deploy your app.

Done, you created your account. You can use this account to access [atmospherejs.com](https://atmospherejs.com/), [Forums](https://forums.meteor.com), and much more, including Galaxy free deploy.

## 12.2: Deploy it

Now that you are ready to deploy, make sure you run `meteor npm install` before deploying to ensure you installed all your dependencies.

You also need to choose a sub-domain to publish your app. We will use the main domain `meteorapp.com`, which is free and included on any Galaxy plan.

In this example, we will use `blaze-tutorial.meteorapp.com` but make sure you choose a different domain name. Otherwise, you will receive an error saying it is already used.

> You can learn how to use custom domains on Galaxy [here](https://cloud-guide.meteor.com/custom-domains.html). Custom domains are available, starting with the Essentials plan.

Run the deploy command:

```shell script
meteor deploy blaze-tutorial.meteorapp.com --free --mongo
```

Make sure you replace `blaze-tutorial` by a custom name that you want as sub-domain.

You are going to see a log like this:

```shell script
meteor deploy blaze-tutorial.meteorapp.com --free --mongo
Talking to Galaxy servers at https://us-east-1.galaxy-deploy.meteor.com
Preparing to build your app...                
Preparing to upload your app... 
Uploaded app bundle for new app at blaze-tutorial.meteorapp.com.
Galaxy is building the app into a native image.
Waiting for deployment updates from Galaxy... 
Building app image...                         
Deploying app...                              
You have successfully deployed the first version of your app.

*** Your MongoDB shared instance database URI will be here as well ***

For details, visit https://galaxy.meteor.com/app/blaze-tutorial.meteorapp.com
```

This process usually takes around 5 minutes, but it depends on your internet speed as it will send your app bundle to Galaxy servers.

> Galaxy builds a new Docker image that contains your app bundle and then deploys containers using it. Read [more](https://cloud-guide.meteor.com/container-environment.html).

You can check your logs on Galaxy, including the part that Galaxy is building your Docker image and deploying it.

## 12.3: Access and enjoy

Now you should be able to access your Galaxy dashboard at `https://galaxy.meteor.com/app/blaze-tutorial.meteorapp.com` (replacing `blaze-tutorial` with your sub-domain)

And, of course, be able to access and use your app in the chosen domain, in our case here [blaze-tutorial.meteorapp.com](http://blaze-tutorial.meteorapp.com). Congrats!

> We deployed to Galaxy running in the US (us-east-1). We also have Galaxy running in other regions in the world. Check the list [here](https://cloud-guide.meteor.com/deploy-region.html).

This is huge. You have your Meteor app running on Galaxy, ready to be used by anyone in the world!

> Review: you can check how your code should be at the end of this step [here](https://github.com/meteor/blaze-tutorial/tree/master/src/simple-todos/step12).

In the next step, we will provide some ideas for you to continue developing your app.
