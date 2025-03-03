---
title: '9: Publications'
---

Now that we have moved all of our app's sensitive code into methods, we need to learn about the other half of Meteor's security story. We have worked assuming the entire database is present on the client, meaning if we call `Tasks.find()`, we will get every task in the collection. That's not good if our application users want to store private and sensitive data. We need to control which data Meteor sends to the client-side database.

## 9.1: autopublish

Like `insecure` in the last step, all new Meteor apps start with the `autopublish` package, which automatically synchronizes all the database contents to the client. Remove it by using the command line below:

```
meteor remove autopublish
```

When the app refreshes, the task list will be empty. Without the `autopublish` package, we will have to specify explicitly what the server sends to the client. The functions in Meteor that do this are `Meteor.publish` and `Meteor.subscribe`:

- `Meteor.publish`: allows the data to be published from the server to the client;
- `Meteor.subscribe`: allows the client code to ask for data.

## 9.2: Tasks Publication

You need to add first a publication to your server. This publication should publish all the tasks from the authenticated user. As in the `Methods`, you can also use `this.userId` in publication functions to get the authenticated `userId`.

Create a new file called `tasksPublications.js` in the `api` folder.

`imports/api/tasksPublications.js`

```js
import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '/imports/db/TasksCollection';

Meteor.publish('tasks', function publishTasks() {
  return TasksCollection.find({ userId: this.userId });
});
```

As you are using `this` inside this function, you should not use the `arrow function` (`=>`) as the arrow function does not provide a context for `this`. You need to use the function in the traditional way, using the `function` keyword.

The last part is to make sure your server is registering this publication. You can do this by importing the file to force the evaluation in the `server/main.js`.

`server/main.js`

```js
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '/imports/db/TasksCollection';
import '/imports/api/tasksMethods';
import '/imports/api/tasksPublications';
```

## 9.3: Tasks Subscription

From here, we can subscribe to that publication in the client.

As we want to receive changes from this publication, we will `subscribe` to it inside a `Tracker.autorun`.

`Tracker.autorun` run a function now and rerun it later whenever its dependencies change, which is perfect for us to know when our data is ready to be displayed to the user. You can learn more about the package `tracker` [here](https://docs.meteor.com/api/tracker.html).

`imports/ui/App.js`

```js
...
const IS_LOADING_STRING = "isLoading";
...

Template.mainContainer.onCreated(function mainContainerOnCreated() {
  this.state = new ReactiveDict();

  const handler = Meteor.subscribe('tasks');
  Tracker.autorun(() => {
    this.state.set(IS_LOADING_STRING, !handler.ready());
  });
});

...

Template.mainContainer.helpers({
  ...,
  isLoading() {
    const instance = Template.instance();
    return instance.state.get(IS_LOADING_STRING);
  }
});

...
```

## 9.4: Loading state

Now we can show the user when the data is loading. Let's use our new helper to show this:

`imports/ui/App.html`

```html
...
                <div class="filter">
                    <button id="hide-completed-button">
                        {{#if hideCompleted}}
                                Show All
                        {{else}}
                                Hide Completed
                        {{/if}}
                    </button>
                </div>

                {{#if isLoading}}
                    <div class="loading">loading...</div>
                {{/if}}
...
```

Let's style this loading a little as well:

`client/main.css`

```css
.loading {
  display: flex;
  flex-direction: column;
  height: 100%;

  justify-content: center;
  align-items: center;

  font-weight: bold;
}
```

Once you have done this, all the tasks will reappear.

Calling `Meteor.publish` on the server registers a publication named `tasks`. When `Meteor.subscribe` is called on the client with the publication name, the client subscribes to all the data from that publication, which in this case is all the tasks in the database for the authenticated user. 

## 9.5: Check User Permission

Only the owner of a task should be able to change certain things. You should change your methods to check if the authenticated user is the same user that created the tasks.

`imports/api/tasksMethods.js`

```js
...
    async 'tasks.remove'(taskId) {
      check(taskId, String);
    
      if (!this.userId) {
        throw new Meteor.Error('Not authorized.');
      }
    
      const task = await TasksCollection.findOneAsync({ _id: taskId, userId: this.userId });
    
      if (!task) {
        throw new Meteor.Error('Access denied.');
      }
    
      await TasksCollection.removeAsync(taskId);
    },

    async 'tasks.setIsChecked'(taskId, isChecked) {
      check(taskId, String);
      check(isChecked, Boolean);
    
      if (!this.userId) {
        throw new Meteor.Error('Not authorized.');
      }
    
      const task = await TasksCollection.findOneAsync({ _id: taskId, userId: this.userId });
    
      if (!task) {
        throw new Meteor.Error('Access denied.');
      }
    
      await TasksCollection.updateAsync(taskId, {
        $set: {
          isChecked,
        },
      });
    },
...
```

Why is this important if we are not returning tasks from other users in the client?

Because anyone can call Meteor `Methods` using the browser `console`. You can test this using your DevTools console tab and then type: `Meteor.call('tasks.remove', 'xtPTsNECC3KPuMnDu');` and hit enter. If you remove the validation from your remove Method and pass one valid task `_id` from your database, you will be able to remove it.

> Review: you can check how your code should be at the end of this step [here](https://github.com/meteor/blaze-tutorial/tree/master/src/simple-todos/step09).

In the next step, we will run the app on a mobile environment as a Native app.
