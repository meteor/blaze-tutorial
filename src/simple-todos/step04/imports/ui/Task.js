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
  'click .delete'() {
    TasksCollection.remove(this._id);
  },
});