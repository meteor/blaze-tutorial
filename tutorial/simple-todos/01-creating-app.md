---
title: "1: Creating the app"
---

## 1.1: Install Meteor
First we need to install Meteor.

If you running on OSX or Linux run this command in your terminal:
```shell
curl https://install.meteor.com/ | sh
```

If you are on Windows:
```shell
npm install --global meteor
```

> You can check more details about Meteor installation [here](https://www.meteor.com/install)

## 1.2: Create Meteor Project

The easiest way to setup Meteor with React is by using the command `meteor create` with the option `--blaze` and your project name:

```
meteor create --blaze simple-todos-blaze
```

Meteor will create all the necessary files for you. 

The files located in the `client` directory are setting up your client side (web), you can see for example `client/main.js` which is where your app begins on the client side.

Also, check the `server` directory where Meteor is setting up the server side (Node.js), you can see the `server/main.js`. If Meteor, you don't need to install MongoDB as Meteor provides an embedded version of it ready for you to use.

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

Don't worry, Meteor will keep your app in sync with all your changes from now on.

Take a quick look in all the files created by Meteor, you don't need to understand them now, but it's good to know where they are.

Here is a small summary of some files created:

```
client/main.js        # a JavaScript entry point loaded on the client
client/main.html      # an HTML file that defines view templates
client/main.css       # a CSS file to define your app's styles
server/main.js        # a JavaScript entry point loaded on the server
test/main.js          # a JavaScript entry point when running tests
package.json          # a control file for installing npm packages
package-lock.json     # describes the npm dependency tree
node_modules/         # packages installed by npm
.meteor/              # internal Meteor files
.gitignore            # a control file for git
```

## 1.3: Create Task Component

To start working on our todo list app, let's replace the code of the default starter app with the code below. Then we'll talk about what it does.

First, let's remove the body from our HTML entry-point (leaving just the `<head>` tag):

```html
<head>
  <title>Simple todo</title>
</head>
```

Create a new directory with the name `imports` inside `simple-todos-blaze` folder. Then we create some new files in the `imports/` directory:

`imports/ui/body.html`

```html
<body>
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
</body>

<template name="task">
    <li>{{text}}</li>
</template>
```

Now we need the data to render on this page. 

## 1.4: Create Sample Tasks

As you are not connecting to your server and your database yet let's define some sample data which will be used shortly to render a list of tasks. It will be an array, and you can call it `tasks`. Go ahead and create a new file called `body.js` on your file `ui` and type this code on it:

`imports/ui/body.js`

``` js
import { Template } from 'meteor/templating';
 
import './body.html';
 
Template.body.helpers({
  tasks: [
    { text: 'This is task 1' },
    { text: 'This is task 2' },
    { text: 'This is task 3' },
  ],
});
```

You can put anything as your `text` property on each task. Be creative!


Inside our front-end JavaScript entry-point file, `client/main.js`, we'll remove the rest of the code and import `imports/ui/body.js`:

``` js
import '../imports/ui/body.js';
```

You can read more about how imports work and how to structure your code in the [Application Structure article](https://guide.meteor.com/structure.html) of the Meteor Guide.

Now let's find out what all these bits of code are doing!

## 1.5: Rendering Data

Meteor parses HTML files and identifies three top-level tags: `<head>`, `<body>`, and `<template>`.

Everything inside any `<head>` tags is added to the head section of the HTML sent to the client, and everything inside `<body>` tags is added to the body section, just like in a regular HTML file.

Everything inside `<template>` tags is compiled into Meteor templates, which can be included inside HTML with `{% raw %}{{> templateName}}{% endraw %}` or referenced in your JavaScript with `Template.templateName`.

Also, the `body` section can be referenced in your JavaScript with `Template.body`. Think of it as a special "parent" template, that can include the other child templates.

All of the code in your HTML files is compiled with [Meteor's Spacebars compiler](http://blazejs.org/api/spacebars.html). Spacebars uses statements surrounded by double curly braces such as `{% raw %}{{#each}}{% endraw %}` and `{% raw %}{{#if}}{% endraw %}` to let you add logic and data to your views.

You can pass data into templates from your JavaScript code by defining helpers. In the code above, we defined a helper called `tasks` on `Template.body` that returns an array. Inside the body tag of the HTML, we can use `{% raw %}{{#each tasks}}{% endraw %}` to iterate over the array and insert a `task` template for each value. Inside the `#each` block, we can display the `text` property of each array item using `{% raw %}{{text}}{% endraw %}`.


## 1.6 Mobile look

Let's see how your app is looking on Mobile. You can simulate a mobile environment by `right clicking` your app in the browser (we are assuming you are using Google Chrome, as it is the most popular browser today) and then `inspect`, this will open a new window inside your browser called `Dev Tools`. In the `Dev Tools` you have a small icon showing a Mobile device and a Tablet:

<img width="500px" src="/simple-todos/assets/step01-dev-tools-mobile-toggle.png"/>

Click on it and then select the phone that you want to simulate and in the top bar.

> You can also check your app in your cellphone. To do so, connect to your App using your local IP in the navigation browser of your mobile browser.
>
> This command should print your local IP for you on Unix systems at least
`ifconfig | grep "inet " | grep -Fv 127.0.0.1 | awk '{print $2}'`

You will see something like this:

<img width="200px" src="/simple-todos/assets/step01-mobile-without-meta-tags.png"/>

As you can see everything is small as we are not adjusting the view port for mobile devices. You can fix this and other similar issues by adding these lines to your `client/main.html` file, inside the `head` tag, after the `title`.

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


> Review: you can check how your code should be in the end of this step [here](https://github.com/meteor/blaze-tutorial/tree/master/src/simple-todos/step01) 

In the next step we are going to work with our MongoDB database to store our tasks.