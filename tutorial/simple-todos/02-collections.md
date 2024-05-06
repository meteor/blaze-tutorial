---
title: "2: Collections"
---

Meteor already sets up MongoDB for you. In order to use our database we need to create a _collection_, which is where we will store our _documents_, in our case our `tasks`.

> You can read more about collections [here](http://guide.meteor.com/collections.html).

In this step we will implement all the necessary code to have a basic collection for our tasks, up and running.

## 2.1: Create Tasks Collection

We can create a new collection to store our tasks by creating a new file at `imports/api/TasksCollection.js` which instantiates a new Mongo collection and exports it.

`imports/api/TasksCollection.js`
```js
import { Mongo } from 'meteor/mongo';
 
export const TasksCollection = new Mongo.Collection('tasks');
```

Notice that we stored the file in the `imports/api` directory, which is a place to store API-related code, like publications and methods. You can name this folder as you want, this is just an optional way to name it.

> You can read more about app structure and imports/exports [here](http://guide.meteor.com/structure.html).

## 2.2: Initialize Tasks Collection

For our collection to work, you need to import it into the server-side, so it sets some plumbing up.

You can either use `import "/imports/api/TasksCollection"` or `import { TasksCollection } from "/imports/api/TasksCollection"` if you are going to use it on the same file, just make sure it is imported.

Now it is easy to check if there is data or not in our collection. Otherwise, we can insert some sample data easily if need be.

You don't need to keep the old content of `server/main.js`.

`server/main.js`
```js
import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '/imports/api/TasksCollection';

const insertTask = taskText => TasksCollection.insert({ text: taskText });
 
Meteor.startup(() => {
  if (TasksCollection.find().count() === 0) {
    [
      'First Task',
      'Second Task',
      'Third Task',
      'Fourth Task',
      'Fifth Task',
      'Sixth Task',
      'Seventh Task'
    ].forEach(insertTask)
  }
});
```

So you are importing the `TasksCollection` and adding a few tasks on it over an array of strings, and for each string, calling a function to insert this string as our `text` field in our `task` document.

## 2.3: Render Tasks Collection

Now comes the fun part, you will render the `tasks` saved in our database with Blaze. That will be pretty simple.  

On your `App.js` file, import the `TasksCollection` file and, instead of returning a static array, return the tasks saved in the database:

`imports/ui/App.js`
```javascript
import { Template } from 'meteor/templating';
import { TasksCollection } from "../api/TasksCollection";
import './App.html';

Template.mainContainer.helpers({
  tasks() {
    return TasksCollection.find({});
  },
});
```

See how your app should look like now:

<img width="200px" src="/simple-todos/assets/step02-tasks-list.png"/>

You can change your data on MongoDB in the server, and your app will react and re-render for you.

You can connect to your MongoDB running `meteor mongo` in the terminal from your app folder or using a Mongo UI client. There are many great options like [NoSQLBooster](https://nosqlbooster.com/downloads), [Compass](https://www.mongodb.com/products/compass), and [Mingo](https://mingo.io/). Your embedded MongoDB is running in the port `3001`.

See how to connect to the DB using NoSQLBooster:

<img width="500px" src="/simple-todos/assets/step02-connect-mongo.png"/>

See your database:

<img width="500px" src="/simple-todos/assets/step02-see-your-db.png"/>

You can double-click your collection to see the documents stored on it:

<img width="500px" src="/simple-todos/assets/step02-see-your-collection.png"/>

"But wait, how are my tasks coming from the server to the client?"

We will explain this later in the step about Publications and Subscriptions. You need to know now that you are publishing all the data from the database to the client. We will resolve this later as we don’t want to publish all the data all the time.

> Review: you can check how your code should be in the end of this step [here](https://github.com/meteor/blaze-tutorial/tree/master/src/simple-todos/step02).

In the next step, we will create tasks using a form.
