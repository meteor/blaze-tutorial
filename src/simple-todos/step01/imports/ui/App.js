import { Template } from 'meteor/templating';

import './App.html';

Template.mainContainer.helpers({
  tasks: [
    { text: 'This is task 1' },
    { text: 'This is task 2' },
    { text: 'This is task 3' },
  ],
});
