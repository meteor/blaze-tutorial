---
title: "8: Methods"
---

Before this step, any user could edit any part of the database by making changes directly on the client-side. This is good for rapid prototyping, but real applications require control over data access.

In Meteor, the easiest way to make changes in the server safely is by declaring methods instead of calling insert, update, or remove directly in the client.

With methods, you can verify if the user is authenticated and authorized to perform specific actions and then change the database accordingly.

A Meteor Method is a way to communicate with your server using the function Meteor.call. You will need to provide the name of your method and the arguments.

> You can read more about Methods [here](https://guide.meteor.com/methods.html).

## 8.1: Disable Quick Prototyping

Every newly created Meteor project has the `insecure` package installed by default.

This package allows us to edit the database from the client, which is useful for quick prototyping.

We need to remove it, because as the name suggests it is `insecure`.

```
meteor remove insecure
```

Now your app changes won't work anymore as you have revoked all client-side database permissions. If you try to insert a new task, you are going to see `insert failed: Access denied` in your browser console.

## 8.2: Add Task Methods

Now you need to define methods.

You need one method for each database operation that we want to perform on the client.

Methods should be defined in code executed both in the client, and the server for Optimistic UI support.

### Optimistic UI

When we call a method on the client using `Meteor.call`, two things happen:

1. The client sends a request to the server to run the method in a secure environment.
2. A simulation of the method runs directly on the client trying to predict the outcome of the call.

This means that a newly created task actually appears on the screen before the result comes back from the server.

If the result matches the server, everything remains. Otherwise, the UI gets patched to reflect the actual state of the server.

> Meteor does all this work for you, you don’t need to worry about it, but it’s essential to understand what is happening. You can read more about Optimistic UI [here](https://blog.meteor.com/optimistic-ui-with-meteor-67b5a78c3fcf).

Now, you should add a new file called `tasksMethods` in your `imports/api` folder. In this file, for each operation you are doing in the client, we are going to call these methods from the client instead of using Mini Mongo operations directly.

Inside methods, you have a few special properties ready to be used on `this` object. For example, you have the `userId` of the authenticated user.

`imports/api/tasksMethods.js`
```js
import { check } from 'meteor/check';
import { TasksCollection } from './TasksCollection';
 
Meteor.methods({
  'tasks.insert'(text) {
    check(text, String);
 
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }
 
    TasksCollection.insert({
      text,
      createdAt: new Date,
      userId: this.userId,
    })
  },
 
  'tasks.remove'(taskId) {
    check(taskId, String);
 
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }
 
    TasksCollection.remove(taskId);
  },
 
  'tasks.setIsChecked'(taskId, isChecked) {
    check(taskId, String);
    check(isChecked, Boolean);
 
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }
 
    TasksCollection.update(taskId, {
      $set: {
        isChecked
      }
    });
  }
});
```

As you can see in the code, we are also using the `check` package to ensure we receive the expected types of input. This is important to make sure you know exactly what you are inserting or updating in your database.

The last part is to make sure your server is registering these methods. By importing this file, you can force the evaluation in the `server/main.js`.

`server/main.js`

```js
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '/imports/db/TasksCollection';
import '/imports/api/tasksMethods';
```

You don't need to get any symbol back from the import. You only need to ask your server to import the file so `Meteor.methods` will be evaluated and will register your methods on server startup.

## 8.3: Implement Method Calls

As you have defined your methods, you need to update the places we were operating the collection to use them instead.

In the `App.js` file you should call `Meteor.call('tasks.insert', text);` instead of `TasksCollection.insert`.

`imports/ui/App.js`

```js
...

Template.form.events({
  "submit .task-form"(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    // Insert a task into the collection
    Meteor.call('tasks.insert', text);

    // Clear form
    target.text.value = '';
  }
})
```

In the `Task.js` file you should call `Meteor.call('tasks.setIsChecked', _id, !isChecked);` instead of `TasksCollection.update` and `Meteor.call('tasks.remove', _id)` instead of `TasksCollection.remove`. Remember to remove the `TasksCollection` import as well.

`imports/ui/Task.js`

```js
import { Template } from 'meteor/templating';

import './Task.html';

Template.task.events({
  'click .toggle-checked'() {
    Meteor.call('tasks.setIsChecked', this._id, !this.isChecked);
  },
  'click .delete'() {
    Meteor.call('tasks.remove', this._id);
  },
});
```

Now your inputs and buttons will start working again. So what have you learned?

1. When we insert tasks into the database, we can securely verify that the user is authenticated; the `createdAt` field is correct; the `userId` is legitimate.
2. We can add extra validation logic to the methods later.
3. Our client code is more isolated from our database logic. Instead of much stuff happening in our event handlers, we have methods callable from anywhere.

## 8.4: api and db folders

Let's take a moment here to think. The collection file is located in the `api` folder, but API in your project means a communication layer between server and client. Still, the collection is not performing this role anymore. So you should move your `TasksCollection` file to a new folder called `db`.

This change is not required, but we recommend it to keep your names consistent.

Remember to fix your imports, you have 3 imports to `TasksCollection` in the following files:
- `imports/api/tasksMethods.js`
- `imports/ui/App.js`
- `server/main.js`

They should be changed from `import { TasksCollection } from '/imports/api/TasksCollection';` to `import { TasksCollection } from '/imports/db/TasksCollection';`.

Since we didn't change anything visible to the user in this step, your app should look exactly as before. You can use [Meteor DevTools](https://chrome.google.com/webstore/detail/meteor-devtools-evolved/ibniinmoafhgbifjojidlagmggecmpgf) to see the messages going to your server and the results coming back. This information is available in the `DDP` tab.

> DDP is the protocol behind the Meteor communication layer. You can learn more about it [here](https://github.com/meteor/meteor/blob/devel/packages/ddp/DDP.md).

We recommend that you change your `check` calls for wrong types to produce some errors, then you can understand what will happen in these cases as well.

> Review: check how your code should look like [here](https://github.com/meteor/blaze-tutorial/tree/master/src/simple-todos/step08).

In the next step, we will start using Publications to publish the necessary data on each case.
