---
title: '7: Adding User Accounts'
---

## 7.1: Password Authentication

Meteor already comes with a basic authentication and account management system out-of-the box, so you only need to add the `accounts-password` to enable username and password authentication:

```
meteor add accounts-password
```

> There are many more authentication methods supported. You can read more about the accounts system [here](https://docs.meteor.com/api/accounts.html).

We also recommend you to install `bcrypt` node module, otherwise you are going to see a warning saying that you are using pure-Javascript implementation.

```
meteor npm install --save bcrypt
```

> You should always use `meteor npm` instead of `npm` so you always use the `npm` version pinned by Meteor. This helps you to avoid problems due to different versions of npm installing different modules.

## 7.2: Create User Account

Now you can create a default user for our app, we are going to use `meteorite` as username, we just create a new user on server startup if we didn't find it in the database.

`server/main.js`

```js
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '/imports/api/TasksCollection';

..

const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';

Meteor.startup(() => {
  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }
  ..
});
```

You should not see anything different in your app UI yet.

## 7.3: Login Form

You need to provide a way for the users to input the credentials and authenticate, for that we need a form.

Our login form will be pretty simple, just two fields (username and password) and a button. You should use `Meteor.loginWithPassword(username, password);` to authenticate your user with the provided inputs.

`imports/ui/Login.html`

```html
<template name="login">
    <form class="login-form">
        <div>
            <label htmlFor="username">Username</label>

            <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    required
            />
        </div>

        <div>
            <label htmlFor="password">Password</label>

            <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    required
            />
        </div>
        <div>
            <button type="submit">Log In</button>
        </div>
    </form>
</template>
```

`imports/ui/Login.js`

```js
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './Login.html';

Template.login.events({
  'submit .login-form'(e) {
    e.preventDefault();

    const target = e.target;

    const username = target.username.value;
    const password = target.password.value;

    Meteor.loginWithPassword(username, password);
  }
});

```


Be sure to also import the login form in `App.js`.

`/imports/ui/App.js`

```js
import { Template } from "meteor/templating";
import { TasksCollection } from "../api/TasksCollection";
import { ReactiveDict } from "meteor/reactive-dict";
import "./App.html";
import "./Task.js";
import "./Login.js";
...
```

Now you have a form, it's time to use it.

## 7.4: Require Authentication

Our app should only allow an authenticated user to access its task management features.

We can accomplish that rendering the `Login` from template when we don't have an authenticated user, otherwise we return the form, filter, and list component.

To achieve this we will use a conditional test inside our main div on `App.html`: 

`imports/ui/App.html`

```html
...
                </div>
            </div>
        </header>

        <div class="main">
            {{#if isUserLogged}}

                {{> form }}

                <div class="filter">
                    <button id="hide-completed-button">
                        {{#if hideCompleted}}
                                Show All
                        {{else}}
                                Hide Completed
                        {{/if}}
                    </button>
                </div>

                <ul class="tasks">
                    {{#each tasks}}
                        {{> task}}
                    {{/each}}
                </ul>
            {{else}}
                {{> login }}
            {{/if}}
        </div>
...
```

As you can see, if the user is logged in, we render the whole app (`isUserLogged`), otherwise, we render the `Login` template. Let's now create our helper `isUserLogged`:

`imports/ui/App.js`

```js
...

const getUser = () => Meteor.user();
const isUserLogged = () => !!getUser();
...

Template.mainContainer.helpers({
  ...,
  isUserLogged() {
    return isUserLogged();
  }
});
```

## 7.5: Login Form style

Ok, let's style the login form now:

`client/main.css`

```css
.login-form {
  display: flex;
  flex-direction: column;
  height: 100%;

  justify-content: center;
  align-items: center;
}

.login-form > div {
  margin: 8px;
}

.login-form > div > label {
  font-weight: bold;
}

.login-form > div  > input {
  flex-grow: 1;
  box-sizing: border-box;
  padding: 10px 6px;
  background: transparent;
  border: 1px solid #aaa;
  width: 100%;
  font-size: 1em;
  margin-right: 16px;
  margin-top: 4px;
}

.login-form > div > input:focus {
  outline: 0;
}

.login-form > div > button {
  background-color: #62807e;
}
```

Now your login form should look beautiful and centralized.

## 7.6: Server startup

Every task should have an owner from now on. Go to your database, as you learnt before, and remove all the tasks from there:

`db.tasks.remove({});`

Change your `server/main.js` to add the seed tasks using your `meteorite` user as owner.

Make sure you restart the server after this change so `Meteor.startup` block can run again. This is probably going to happen automatically as you make changes in the server side code.

`server/main.js`

```js
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '/imports/api/TasksCollection';

const insertTask = (taskText, user) =>
  TasksCollection.insert({
    text: taskText,
    userId: user._id,
    createdAt: new Date(),
  });

const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';

Meteor.startup(() => {
  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }

  const user = Accounts.findUserByUsername(SEED_USERNAME);

  if (TasksCollection.find().count() === 0) {
    [
      'First Task',
      'Second Task',
      'Third Task',
      'Fourth Task',
      'Fifth Task',
      'Sixth Task',
      'Seventh Task',
    ].forEach(taskText => insertTask(taskText, user));
  }
});
```

You can see that we are using a new field called `userId` with our user `_id` field. We are also setting `createdAt` field.

## 7.7: Task owner

Now you can filter the tasks in the UI by the authenticated user. Use the user `_id` to add the field `userId` to your Mongo selector when getting the tasks from Mini Mongo.

`imports/ui/App.js`

```js
...
const getTasksFilter = () => {
  const user = getUser();

  const hideCompletedFilter = { isChecked: { $ne: true } };

  const userFilter = user ? { userId: user._id } : {};

  const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

  return { userFilter, pendingOnlyFilter };
}

...

Template.mainContainer.helpers({
  tasks() {
    const instance = Template.instance();
    const hideCompleted = instance.state.get(HIDE_COMPLETED_STRING);

    const { pendingOnlyFilter, userFilter } = getTasksFilter();

    if (!isUserLogged()) {
      return [];
    }

    return TasksCollection.find(hideCompleted ? pendingOnlyFilter : userFilter, {
      sort: { createdAt: -1 },
    }).fetch();
  },
  ...,
  incompleteCount() {
    if (!isUserLogged()) {
      return '';
    }

    const { pendingOnlyFilter } = getTasksFilter();

    const incompleteTasksCount = TasksCollection.find(pendingOnlyFilter).count();
    return incompleteTasksCount ? `(${incompleteTasksCount})` : '';
  },
  ...
});
```

Also, update the `insert` call to include the field `userId` when creating a new task: 

`imports/ui/App.js`
```js
...
Template.form.events({
  "submit .task-form"(event) {
   ...
    TasksCollection.insert({
      text,
      userId: getUser()._id,
      createdAt: new Date(), // current time
    });
   ...
  }
});
...
```

## 7.8: Log out

We can also organize our tasks by showing the username of the owner below our app bar. Let's add a new `div` where the user can click and log out from the app:


`imports/ui/App.html`

```html
...
        <div class="main">
            {{#if isUserLogged}}
                <div class="user">
                    {{getUser.username}} 🚪
                </div>
                {{> form }}

...
```

Now, let's create the `getUser` helper and implement the event that will log out the user when they click on this `div`. Logging out is simply done by calling the function `Meteor.logout()`:

`imports/ui/App.js`

```js
...

Template.mainContainer.events({
  ...,
  'click .user'() {
    Meteor.logout();
  }
});

...

Template.mainContainer.helpers({
  ...,
  getUser() {
    return getUser();
  }
});

...
```

Remember to style your user name as well.

`client/main.css`

```css
.user {
  display: flex;

  align-self: flex-end;

  margin: 8px 16px 0;
  font-weight: bold;
}
```

Phew! You have done quite a lot in this step. Authenticated the user, set the user in the tasks, and provided a way for the user to log out.

Your app should now look like this:

<img width="200px" src="/simple-todos/assets/step07-login.png"/>
<img width="200px" src="/simple-todos/assets/step07-logout.png"/>

> Review: you can check how your code should look like [here](https://github.com/meteor/blaze-tutorial/tree/master/src/simple-todos/step07) 

In the next step, we are going to start using Methods to change the data after checking some conditions.
