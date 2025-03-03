import { Template } from 'meteor/templating';
import { TasksCollection } from '../api/TasksCollection';
import './App.html';

Template.mainContainer.helpers({
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
});
