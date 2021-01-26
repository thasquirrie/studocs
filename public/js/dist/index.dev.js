"use strict";

require("@babel/polyfill");

var _login = require("./login");

var _signup = require("./signup");

var _updateSettings = require("./updateSettings");

var loginBtn = document.querySelector('#login');
var signupBtn = document.querySelector('#signup');
var logoutBtn = document.querySelector('.logout');
var updateBtn = document.querySelector('.settings');
var updatePasswordBtn = document.querySelector('.form-user-settings');

if (signupBtn) {
  signupBtn.addEventListener('submit', function (e) {
    console.log('Signing up');
    e.preventDefault();
    var name = document.querySelector('#name').value;
    var email = document.querySelector('#email').value;
    var password = document.querySelector('#password').value;
    var confirmPassword = document.querySelector('#confirmPassword').value;
    console.log(name, email, password, confirmPassword);
    (0, _signup.signup)(name, email, password, confirmPassword);
  });
}

if (loginBtn) {
  loginBtn.addEventListener('submit', function (e) {
    console.log('The film is blue');
    e.preventDefault();
    var email = document.querySelector('#email').value;
    var password = document.querySelector('#password').value;
    (0, _login.login)(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', _login.logout);
}

if (updateBtn) {
  updateBtn.addEventListener('submit', function (e) {
    e.preventDefault();
    console.log('Yes we did it !');
    var form = new FormData();
    form.append('name', document.querySelector('#name').value);
    form.append('email', document.querySelector('#email').value);

    if (document.querySelector('#department')) {
      form.append('department', document.querySelector('#department').value);
    }

    form.append('photo', document.querySelector('#photo').files[0]);
    console.log(form);
    (0, _updateSettings.updateSettings)(form, 'data'); // const name = document.querySelector('#name').value;
    // const email = document.querySelector('#email').value;
    // const department = document.querySelector('#department').value;
    // console.log(name, email, department);
    // updateSettings({ name, email, department }, 'data');
  });
}

if (updatePasswordBtn) {
  updatePasswordBtn.addEventListener('submit', function _callee(e) {
    var currentPassword, password, confirmPassword;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            e.preventDefault();
            document.querySelector('.save--password').textContent = 'Updating passwords ...';
            currentPassword = document.querySelector('#password-current').value;
            password = document.querySelector('#password').value;
            confirmPassword = document.querySelector('#password-confirm').value;
            _context.next = 7;
            return regeneratorRuntime.awrap((0, _updateSettings.updateSettings)({
              currentPassword: currentPassword,
              password: password,
              confirmPassword: confirmPassword
            }, 'password'));

          case 7:
            document.querySelector('#password-current').value = '';
            document.querySelector('#password').value = '';
            document.querySelector('#password-confirm').value = '';
            document.querySelector('.save--password').textContent = 'Save password';

          case 11:
          case "end":
            return _context.stop();
        }
      }
    });
  });
}