---
title: "3: Forms and Events"
---

All apps need to allow the user to perform some type of interaction with the stored data. In our case, the first type of interaction is to insert new tasks. Without it, our To-Do app wouldn’t be very helpful.

One of the main ways a user can insert or edit data on a website is through forms. In most cases, using the `<form>` tag is a good idea since it gives semantic meaning to the elements inside it.

## 3.1: Create Task Form

First, we need to create a simple form component to encapsulate our logic.

Create a new template named `form` inside the `App.html` file, and inside of the new template, we’ll add an input field and a button:

`imports/ui/App.html`
```html

...

<template name="form">
    <form class="task-form">
        <input type="text" name="text" placeholder="Type to add new tasks" />
        <button type="submit">Add Task</button>
    </form>
</template>
```

## 3.2: Update the mainContainer template element

Then we can simply add this to our `mainContainer` template above your list of tasks:

`imports/ui/App.html`
```html

...

<template name="mainContainer">
    <div class="container">
        <header>
            <h1>Todo List</h1>
        </header>

        {{> form }}

        <ul>
            {{#each tasks}}
                {{> task}}
            {{/each}}
        </ul>
    </div>
</template>

...

```

We are rendering the `form` template that we created in the previous step, and we are iterating over each of the tasks and rendering them using the `task` template.

## 3.3: Update the Stylesheet

You also can style it as you wish. For now, we only need some margin at the top, so the form doesn’t seem off the mark. Add the CSS class .`task-form` to your `main.css` file. The same name must be used in your `className` attribute in the `form` component.

`client/main.css`
```css
.task-form {
  margin-top: 1rem;
}
```

## 3.4: Add Submit Listener

Now we need to add a listener to the `submit` event on the form:

`imports/ui/App.js`
```js
...
  tasks() {
    return TasksCollection.find({}, { sort: { createdAt: -1 } });
  },
});

Template.form.events({
  async 'submit .task-form'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const { target } = event;
    const text = target.text.value;

    // Insert a task into the collection
    await TasksCollection.insertAsync({
      text,
      createdAt: new Date(), // current time
    });

    // Clear form
    target.text.value = '';
  },
})
```

Also, insert a date attribute named `createdAt` in your `task` document to know when we create each task.

### Attaching events to templates

Event listeners are added to templates in much the same way as helpers are: by calling `Template.templateName.events(...)` with a dictionary. The keys describe the event to listen for, and the values are event handlers called when the event happens.

In our case above, we listen to the `submit` event on any element that matches the CSS selector `.task-form`. When this event is triggered by the user pressing enter inside the input field or the submit button, our event handler function is called.

The event handler gets an argument called `event` that has some information about the triggered event. In this case, `event.target` is our form element, and we can get the value of our input with `event.target.text.value`. You can see all the other properties of the event object by adding a `console.log(event)` and inspecting the object in your browser console.

Finally, in the last line of the event handler, we need to clear the input to prepare for another new task.

## 3.5: Show Newest Tasks First

All that is left now is to make one last change: we need to show the newest tasks first. We can accomplish this quite quickly by sorting our [Mongo](https://guide.meteor.com/collections.html#mongo-collections) query.

`imports/ui/App.js`
```js
...

Template.mainContainer.helpers({
  tasks() {
    return TasksCollection.find({}, { sort: { createdAt: -1 } });
  },
});

Template.form.events({

...

```

Now your app should look like this:

<img width="200px" src="/simple-todos/assets/step03-form-new-task.png"/>

<img width="200px" src="/simple-todos/assets/step03-new-task-on-list.png"/>

> Review: you can check how your code should be in the end of this step [here](https://github.com/meteor/blaze-tutorial/tree/master/src/simple-todos/step03).

In the next step, we will update your tasks state and provide a way for users to remove tasks.
