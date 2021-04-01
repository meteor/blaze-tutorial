import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './Login.html';

Template.login.events({
  'submit .login-form'(event) {
    event.preventDefault();

    const { target } = event;

    const username = target.username.value;
    const password = target.password.value;

    Meteor.loginWithPassword(username, password);
  },
});
