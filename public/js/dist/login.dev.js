"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logout = exports.login = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _alert = require("./alert");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var login = function login(email, password) {
  var res;
  return regeneratorRuntime.async(function login$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: 'POST',
            url: 'http://localhost:6000/api/v1/users/login',
            data: {
              email: email,
              password: password
            }
          }));

        case 3:
          res = _context.sent;
          console.log(res);

          if (res.data.status === 'success') {
            (0, _alert.showAlert)('success', 'Logged in successfully');
            window.setTimeout(function () {
              (0, _alert.hideAlert)();
              location.replace(document.referrer);
            }, 1500);
          }

          _context.next = 13;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0.response.data.message);
          (0, _alert.showAlert)('error', _context.t0.response.data.message);
          console.log(_context.t0);

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.login = login;

var logout = function logout() {
  var res;
  return regeneratorRuntime.async(function logout$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: 'GET',
            url: 'http://localhost:6000/api/v1/users/logout'
          }));

        case 3:
          res = _context2.sent;
          console.log(res);

          if (res.data.status === 'success') {
            (0, _alert.showAlert)('success', 'Logged out successfully!');
            location.assign('/');
          }

          _context2.next = 12;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0.response);
          (0, _alert.showAlert)('error', 'An error occured. Try again');

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.logout = logout;