"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateSettings = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _alert = require("./alert");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// export const updateUser = async (name, email, department) => {
var updateSettings = function updateSettings(data, type) {
  var url, res;
  return regeneratorRuntime.async(function updateSettings$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          url = type === 'password' ? 'http://localhost:6000/api/v1/users/updatePassword' : 'http://localhost:6000/api/v1/users/updateMe';
          console.log(url);
          _context.next = 5;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: 'PATCH',
            url: url,
            data: data
          }));

        case 5:
          res = _context.sent;
          // console.log({ status, updatedUser });
          console.log(res.data);

          if (res.data.status === 'success') {
            (0, _alert.showAlert)('success', "".concat(type.toUpperCase(), " updated successfully"));
            window.setTimeout(function () {
              (0, _alert.hideAlert)(); // location.replace(document.referrer);
            }, 1500);
          }

          _context.next = 15;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0.response.data.message);
          (0, _alert.showAlert)('error', _context.t0.response.data.message);
          console.log(_context.t0);

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.updateSettings = updateSettings;