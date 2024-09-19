---
title: "1: Creating the app"
---

## 1.1: Install Meteor
First, we need to install Meteor.

Install the latest official Meteor release [following the steps in our docs](https://docs.meteor.com/about/install.html).

## 1.2: Create Meteor Project

The easiest way to set up Meteor with Blaze is by using the command `meteor create` with the option `--blaze` and your project name:

```
meteor create --blaze simple-todos-blaze --prototype
```

After this, Meteor will create all the necessary files for you.

The files located in the `client` directory are setting up your client side (web), you can see for example `client/main.js` which is where your app begins on the client side.

Also, check the `server` directory where Meteor is setting up the server side (Node.js), you can see the `server/main.js`. In Meteor, you don't need to install MongoDB as Meteor provides an embedded version of it ready for you to use.

You can define which are the main files (client and server) on your `package.json` like this:

```json
{
  ..,
  "meteor": {
    "mainModule": {
      "client": "client/main.js",
      "server": "server/main.js"
    }
  }
} 
```

You can now run your Meteor app using:

```shell
cd simple-todos-blaze
meteor run
```

Don’t worry, Meteor will keep your app in sync with all your changes from now on.

Take a quick look at all the files created by Meteor, you don't need to understand them now, but it's good to know where they are.

Here is a small summary of some files created:

```
client/main.js        # a JavaScript entry point loaded on the client
client/main.html      # an HTML file that defines view templates
client/main.css       # a CSS file to define your app's styles
server/main.js        # a JavaScript entry point loaded on the server
tests/main.js          # a JavaScript entry point when running tests
package.json          # a control file for installing npm packages
package-lock.json     # describes the npm dependency tree
node_modules/         # packages installed by npm
.meteor/              # internal Meteor files
.gitignore            # a control file for git
```

## 1.3: Create Task Component

To start working on our todo list app, let's replace the code of the default starter app with the code below. From there, we'll talk about what it does.

First, let's remove the body from our HTML entry-point (leaving just the `<head>` tag):

`client/main.html`

```html
<head>
  <title>Simple todo</title>
</head>
```

Create a new directory named `imports` inside the `simple-todos-blaze` folder. In the `imports` folder, create another directory with the name `ui` and add an `App.html` file inside of it with the content below:

`imports/ui/App.html`

```html
<body>
    {{> mainContainer }}
</body>

<template name="mainContainer">
    <div class="container">
        <header>
            <h1>Todo List</h1>
        </header>

        <ul>
            {{#each tasks}}
                {{> task}}
            {{/each}}
        </ul>
    </div>
</template>

<template name="task">
    <li>{{text}}</li>
</template>
```

We just created two templates, the `mainContainer`, which will be rendered in the body of our app, and it will show a header and a list of tasks that will render each item using the `task` template. Now, we need some data to present sample tasks on this page.

## 1.4: Create Sample Tasks

Create a new file called `App.js` in your `ui` folder. Inside your entry-point `main.js` file, remove all the previous content and just add the code below to import the new file `imports/ui/App.js`:

`client/main.js`

``` js
import '../imports/ui/App.js';
```

As you are not connecting to your server and database yet, let’s define some sample data, which we will use shortly to render a list of tasks. Add the code below to the `App.js` file:

`imports/ui/App.js`

``` js
import { Template } from 'meteor/templating';
 
import './App.html';
 
Template.mainContainer.helpers({
  tasks: [
    { text: 'This is task 1' },
    { text: 'This is task 2' },
    { text: 'This is task 3' },
  ],
});
```

Adding a helper to the `mainContainer` template, you are able to define the array of tasks. When the app starts, the client-side entry-point will import the `App.js` file, which will also import the `App.html` template we created in the previous step.

You can read about how imports work and how to structure your code in this [Application Structure article](https://guide.meteor.com/structure.html).

All right! Let's find out what all these bits of code are doing!

## 1.5: Rendering Data

Meteor parses HTML files and identifies three top-level tags: `<head>`, `<body>`, and `<template>`.

Everything inside any `<head>` tags is added to the head section of the HTML sent to the client, and everything inside `<body>` tags is added to the body section, just like in a regular HTML file.

Everything inside `<template>` tags is compiled into Meteor templates, which can be included inside HTML with `{% raw %}{{> templateName}}{% endraw %}` or referenced in your JavaScript with `Template.templateName`.

Also, the `body` section can be referenced in your JavaScript with `Template.body`. Think of it as a special "parent" template, that can include the other child templates.

All of the code in your HTML files will be compiled with [Meteor's Spacebars compiler](http://blazejs.org/api/spacebars.html). Spacebars uses statements surrounded by double curly braces such as `{% raw %}{{#each}}{% endraw %}` and `{% raw %}{{#if}}{% endraw %}` to let you add logic and data to your views.

You can pass data into templates from your JavaScript code by defining helpers. In the code above, we defined a helper called `tasks` on `Template.mainContainer` that returns an array. Inside the template tag of the HTML, we can use `{% raw %}{{#each tasks}}{% endraw %}` to iterate over the array and insert a `task` template for each value. Inside the `#each` block, we can display the `text` property of each array item using `{% raw %}{{text}}{% endraw %}`.


## 1.6 Mobile look

Let's see how your app is looking on mobile. You can simulate a mobile environment by `right clicking` your app in the browser (we are assuming you are using Google Chrome, as it is the most popular browser) and then `inspect`, this will open a new window inside your browser called `Dev Tools`. In the `Dev Tools` you have a small icon showing a Mobile device and a Tablet:

<img width="500px" src="/simple-todos/assets/step01-dev-tools-mobile-toggle.png"/>

Click on it and then select the phone that you want to simulate and in the top nav bar.

> You can also check your app in your personal cellphone. To do so, connect to your App using your local IP in the navigation browser of your mobile browser.
>
> This command should print your local IP for you on Unix systems
`ifconfig | grep "inet " | grep -Fv 127.0.0.1 | awk '{print $2}'`

You should see the following:

<img width="200px" src="/simple-todos/assets/step01-mobile-without-meta-tags.png"/>

As you can see, everything is small, as we are not adjusting the view port for mobile devices. You can fix this and other similar issues by adding these lines to your `client/main.html` file, inside the `head` tag, after the `title`.

`client/main.html`
```html
  <meta charset="utf-8"/>
  <meta http-equiv="x-ua-compatible" content="ie=edge"/>
  <meta
      name="viewport"
      content="width=device-width, height=device-height, viewport-fit=cover, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
  />
  <meta name="mobile-web-app-capable" content="yes"/>
  <meta name="apple-mobile-web-app-capable" content="yes"/>
```

Now your app should look like this:

<img width="200px" src="/simple-todos/assets/step01-mobile-with-meta-tags.png"/>


## 1.7 Hot Module Replacement

By default, when using Blaze with Meteor, a package called `hot-module-replacement` is already added for you. This package updates the javascript modules in a running app that were modified during a rebuild. Reduces the feedback cycle while developing, so you can view and test changes quicker (it even updates the app before the build has finished). You are also not going to lose the state, your app code will be updated, and your state will be the same.

You should also add the package [`dev-error-overlay`](https://atmospherejs.com/meteor/dev-error-overlay) at this point, so you can see the errors in your web browser.

```shell
meteor add dev-error-overlay
```

You can try to make some mistakes and then you are going to see the errors in the browser and not only in the console.

> Review: you can check how your code should look in the end of this step [here](https://github.com/meteor/blaze-tutorial/tree/master/src/simple-todos/step01).

In the next step we are going to work with our MongoDB database to be able to store our tasks.
