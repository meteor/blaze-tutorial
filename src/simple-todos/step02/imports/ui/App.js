import { Template } from 'meteor/templating';
import { TasksCollection } from "../api/TasksCollection";
import './App.html';

Template.body.helpers({
  tasks() {
    return TasksCollection.find({});
  },
});