import { Template } from 'meteor/templating';

import { TasksCollection } from '../api/TasksCollection';

import './Task.html';

Template.task.events({
  async 'click .toggle-checked'() {
    // Set the checked property to the opposite of its current value
    await TasksCollection.updateAsync(this._id, {
      $set: { isChecked: !this.isChecked },
    });
  },
  async 'click .delete'() {
    await TasksCollection.removeAsync(this._id);
  },
});
