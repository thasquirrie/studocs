"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signup = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _alert = require("./alert");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var signup = function signup(name, email, password, confirmPassword) {
  var res;
  return regeneratorRuntime.async(function signup$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: 'POST',
            url: 'http://localhost:6000/api/v1/users/signup',
            data: {
              name: name,
              email: email,
              password: password,
              confirmPassword: confirmPassword
            }
          }));

        case 3:
          res = _context.sent;

          if (res.data.status === 'success') {
            (0, _alert.showAlert)('success', 'Signed up successfully');
            window.setTimeout(function () {
              (0, _alert.hideAlert)();
              location.replace(document.referrer);
            }, 1500);
          }

          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.log('Error:', _context.t0.response.data.message);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.signup = signup;