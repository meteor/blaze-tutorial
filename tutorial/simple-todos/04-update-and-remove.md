---
title: '4: Update and Remove'
---

Up until now you have only inserted documents into our collection. Let's take a look at how you can update and remove them by interacting with the user interface.

## 4.1: Add Checkbox

First, you need to add a `checkbox` element to your `task` template.

Next, let's create a new file to our `task` template, so we can start to separate the logic in our app.

`imports/ui/Task.html`

```html
<template name="task">
    <li>
        <input type="checkbox" checked="{{checked}}" class="toggle-checked" />
        <span>{{text}}</span>
    </li>
</template>
```

Don't forget to remove the template also named `task` in `imports/ui/App.html`.

## 4.2: Toggle Checkbox

Now you can update your task document by toggling its `isChecked` field.

Create a new file called `Task.js` so we can have our handlers to the `task` template: 

`imports/ui/Task.js`

```js
import { Template } from 'meteor/templating';

import { TasksCollection } from "../api/TasksCollection";

import './Task.html';

Template.task.events({
  'click .toggle-checked'() {
    // Set the checked property to the opposite of its current value
    TasksCollection.update(this._id, {
      $set: { isChecked: !this.isChecked },
    });
  },
});
```

Now, let's import our new `Task.js` file inside `App.js`:

`imports/ui/App.js`

```js
import { Template } from 'meteor/templating';
import { TasksCollection } from "../api/TasksCollection";
import './App.html';
import './Task.js';

Template.mainContainer.helpers({

...
```

Now your app should look like this:

<img width="200px" src="/simple-todos/assets/step04-checkbox.png"/>

## 4.3: Remove tasks

You can remove tasks with just a few lines of code.

First add a button after text in your `task` template and receive:

`imports/ui/Task.html`

```html
<template name="task">
    <li>
        <input type="checkbox" checked="{{isChecked}}" class="toggle-checked" />
        <span>{{text}}</span>
        <button class="delete">&times;</button>
...
```

Now add the removal logic in the `Task.js`. It will be just a new event to the `task` template that is activated when the user clicks in a delete button, that is, any button with the class `delete`:

`imports/ui/Task.js`

```js
...

Template.task.events({
  ...,
  'click .delete'() {
    TasksCollection.remove(this._id);
  },
});
```

Your app should look like this:

<img width="200px" src="/simple-todos/assets/step04-delete-button.png"/>

## 4.4: Getting data in event handlers

Inside the event handlers, `this` refers to an individual task object. In a collection, every inserted document has a unique `_id` field that can be used to refer to that specific document. We can get the `_id` of the current task with `this._id` as well as any other field that are available in the client side. Once we have the `_id`, we can use, update, and remove the relevant task, and that's how our code do update and remove a task is working in our app.

> Review: you can check how your code should be in the end of this step [here](https://github.com/meteor/blaze-tutorial/tree/master/src/simple-todos/step04) 

In the next step we are going to improve the look of your app using CSS with Flexbox.
