import { Template } from 'meteor/templating';
import { TasksCollection } from "../api/TasksCollection";
import './App.html';
import './Task.js';

Template.body.helpers({
  tasks() {
    return TasksCollection.find({}, { sort: { createdAt: -1 } });
  },
});

Template.form.events({
  "submit .task-form"(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    // Insert a task into the collection
    TasksCollection.insert({
      text,
      createdAt: new Date(), // current time
    });

    // Clear form
    target.text.value = '';
  }
})