self.props = {
	title: 'GDIndex',
	defaultRootId: 'root',
	client_id: '202264815644.apps.googleusercontent.com',
	client_secret: 'X4Z3ca8xfWDb1Voo-F9a7ZxJ',
	refresh_token: ''
};
(function () {
  'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
      return;
    }

    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  /*
   * XFetch.js modified
   * A extremely simple fetch extension inspired by sindresorhus/ky.
   */
  var xf = function () {
    var METHODS = ['get', 'post', 'put', 'patch', 'delete', 'head'];

    var HTTPError =
    /*#__PURE__*/
    function (_Error) {
      _inherits(HTTPError, _Error);

      function HTTPError(res) {
        var _this;

        _classCallCheck(this, HTTPError);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(HTTPError).call(this, res.statusText));
        _this.name = 'HTTPError';
        _this.response = res;
        return _this;
      }

      return HTTPError;
    }(_wrapNativeSuper(Error));

    var XResponsePromise =
    /*#__PURE__*/
    function (_Promise) {
      _inherits(XResponsePromise, _Promise);

      function XResponsePromise() {
        _classCallCheck(this, XResponsePromise);

        return _possibleConstructorReturn(this, _getPrototypeOf(XResponsePromise).apply(this, arguments));
      }

      return XResponsePromise;
    }(_wrapNativeSuper(Promise));

    var _loop2 = function _loop2() {
      var alias = _arr[_i];

      // alias for .json() .text() etc...
      XResponsePromise.prototype[alias] = function (fn) {
        return this.then(function (res) {
          return res[alias]();
        }).then(fn || function (x) {
          return x;
        });
      };
    };

    for (var _i = 0, _arr = ['arrayBuffer', 'blob', 'formData', 'json', 'text']; _i < _arr.length; _i++) {
      _loop2();
    }

    var assign = Object.assign;

    var fromEntries = function fromEntries(ent) {
      return ent.reduce(function (acc, _ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            k = _ref2[0],
            v = _ref2[1];

        return acc[k] = v, acc;
      }, {});
    };

    var typeis = function typeis() {
      for (var _len = arguments.length, types = new Array(_len), _key = 0; _key < _len; _key++) {
        types[_key] = arguments[_key];
      }

      return function (val) {
        return types.some(function (type) {
          return typeof type === 'string' ? _typeof(val) === type : val instanceof type;
        });
      };
    };

    var isstr = typeis('string');
    var isobj = typeis('object');

    var isstrorobj = function isstrorobj(v) {
      return isstr(v) || isobj(v);
    };

    var responseErrorThrower = function responseErrorThrower(res) {
      if (!res.ok) throw new HTTPError(res);
      return res;
    };

    var extend = function extend() {
      var defaultInit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var xfetch = function xfetch(input) {
        var init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        assign(init, defaultInit);

        var createQueryString = function createQueryString(o) {
          return new init.URLSearchParams(o).toString();
        };

        var parseQueryString = function parseQueryString(s) {
          return fromEntries(_toConsumableArray(new init.URLSearchParams(s).entries()));
        };

        var url = new init.URL(input, init.baseURI || undefined);

        if (!init.headers) {
          init.headers = {};
        } else if (typeis(init.Headers)(init.headers)) {
          // Transform into object if it is `Headers`
          init.headers = fromEntries(_toConsumableArray(init.headers.entries()));
        } // Add json or form on body


        if (init.json) {
          init.body = JSON.stringify(init.json);
          init.headers['Content-Type'] = 'application/json';
        } else if (isstrorobj(init.urlencoded)) {
          init.body = isstr(init.urlencoded) ? init.urlencoded : createQueryString(init.urlencoded);
          init.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        } else if (typeis(init.FormData, 'object')(init.formData)) {
          // init.formData is data passed by user, init.FormData is FormData constructor
          if (!typeis(init.FormData)(init.formData)) {
            var fd = new init.FormData();

            for (var _i2 = 0, _Object$entries = Object.entries(init.formData); _i2 < _Object$entries.length; _i2++) {
              var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
                  k = _Object$entries$_i[0],
                  v = _Object$entries$_i[1];

              fd.append(k, v);
            }

            init.formData = fd;
          }

          init.body = init.formData;
        } // Querystring


        if (init.qs) {
          if (isstr(init.qs)) init.qs = parseQueryString(init.qs);
          url.search = createQueryString(assign(fromEntries(_toConsumableArray(url.searchParams.entries())), init.qs));
        }

        return XResponsePromise.resolve(init.fetch(url, init).then(responseErrorThrower));
      };

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var method = _step.value;

          xfetch[method] = function (input) {
            var init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            init.method = method.toUpperCase();
            return xfetch(input, init);
          };
        };

        for (var _iterator = METHODS[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          _loop();
        } // Extra methods and classes

      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      xfetch.extend = function (newDefaultInit) {
        return extend(assign({}, defaultInit, newDefaultInit));
      };

      xfetch.HTTPError = HTTPError;
      return xfetch;
    };

    var isWindow = typeof document !== 'undefined';
    var isBrowser = typeof self !== 'undefined'; // works in both window & worker scope

    return isBrowser ? extend({
      fetch: fetch.bind(self),
      URL: URL,
      Response: Response,
      URLSearchParams: URLSearchParams,
      Headers: Headers,
      FormData: FormData,
      baseURI: isWindow ? document.baseURI : '' // since there is no document in webworkers

    }) : extend();
  }();

  function _await(value, then, direct) {
    if (direct) {
      return then ? then(value) : value;
    }

    if (!value || !value.then) {
      value = Promise.resolve(value);
    }

    return then ? value.then(then) : value;
  }

  var GoogleDrive =
  /*#__PURE__*/
  function () {
    function GoogleDrive(auth) {
      _classCallCheck(this, GoogleDrive);

      this.auth = auth;
      this.expires = 0;
      this._getIdCache = new Map();
    }

    _createClass(GoogleDrive, [{
      key: "initializeClient",
      value: function initializeClient() {
        try {
          var _this2 = this;

          // any method that do api call must call this beforehand
          if (Date.now() < _this2.expires) return;
          return _await(xf.post('https://www.googleapis.com/oauth2/v4/token', {
            urlencoded: {
              client_id: _this2.auth.client_id,
              client_secret: _this2.auth.client_secret,
              refresh_token: _this2.auth.refresh_token,
              grant_type: 'refresh_token'
            }
          }).json(), function (resp) {
            _this2.client = xf.extend({
              baseURI: 'https://www.googleapis.com/drive/v3/',
              headers: {
                Authorization: "Bearer ".concat(resp.access_token)
              }
            });
            _this2.expires = Date.now() + 3500 * 1000; // normally, it should expiers after 3600 seconds
          });
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }, {
      key: "listDrive",
      value: function listDrive() {
        try {
          var _this4 = this;

          return _await(_this4.initializeClient(), function () {
            return _this4.client.get('drives').json();
          });
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }, {
      key: "download",
      value: function download(id) {
        var range = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

        try {
          var _this6 = this;

          return _await(_this6.initializeClient(), function () {
            return _this6.client.get("files/".concat(id), {
              qs: {
                includeItemsFromAllDrives: true,
                supportsAllDrives: true,
                alt: 'media'
              },
              headers: {
                Range: range
              }
            });
          });
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }, {
      key: "downloadByPath",
      value: function downloadByPath(path) {
        var rootId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'root';
        var range = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

        try {
          var _this8 = this;

          return _await(_this8.getId(path, rootId), function (id) {
            return id ? _this8.download(id, range) : null;
          });
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }, {
      key: "getMeta",
      value: function getMeta(id) {
        try {
          var _this10 = this;

          return _await(_this10.initializeClient(), function () {
            return _this10.client.get("files/".concat(id), {
              qs: {
                includeItemsFromAllDrives: true,
                supportsAllDrives: true,
                fields: '*'
              }
            }).json();
          });
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }, {
      key: "getMetaByPath",
      value: function getMetaByPath(path) {
        var rootId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'root';

        try {
          var _this12 = this;

          return _await(_this12.getId(path, rootId), function (id) {
            return id ? _this12.getMeta(id) : null;
          });
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }, {
      key: "listFolder",
      value: function listFolder(id) {
        try {
          var _this14 = this;

          return _await(_this14.initializeClient(), function () {
            return _await(_this14.client.get('files', {
              qs: {
                includeItemsFromAllDrives: true,
                supportsAllDrives: true,
                q: "'".concat(id, "' in parents and trashed = false"),
                orderBy: 'folder,name,modifiedTime desc',
                fields: 'files(id, name, mimeType, size, modifiedTime)',
                pageSize: 1000
              }
            }).json());
          });
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }, {
      key: "listFolderByPath",
      value: function listFolderByPath(path) {
        var rootId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'root';

        try {
          var _this16 = this;

          return _await(_this16.getId(path, rootId), function (id) {
            return id ? _this16.listFolder(id) : null;
          });
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }, {
      key: "getId",
      value: function getId(path) {
        var rootId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'root';

        try {
          var _this18 = this;

          var toks = path.split('/').filter(Boolean);
          var id = rootId;
          return _continue(_forOf(toks, function (tok) {
            return _await(_this18._getId(id, tok), function (_this17$_getId) {
              id = _this17$_getId;
            });
          }), function () {
            return id;
          });
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }, {
      key: "_getId",
      value: function _getId(parentId, childName) {
        try {
          var _this20 = this;

          if (_this20._getIdCache.has(parentId + childName)) {
            return _this20._getIdCache.get(parentId + childName);
          }

          return _await(_this20.initializeClient(), function () {
            childName = childName.replace(/\'/g, "\\'"); // escape single quote

            return _await(_this20.client.get('files', {
              qs: {
                includeItemsFromAllDrives: true,
                supportsAllDrives: true,
                q: "'".concat(parentId, "' in parents and name = '").concat(childName, "'  and trashed = false"),
                fields: 'files(id)'
              }
            }).json()["catch"](function (e) {
              return {
                files: []
              };
            }), function (resp) {
              // if error, make it empty
              if (resp.files.length !== 1) {
                return null;
              }

              _this20._getIdCache.has(parentId + childName);

              return resp.files[0].id;
            });
          });
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }]);

    return GoogleDrive;
  }();

  var _iteratorSymbol =
  /*#__PURE__*/
  typeof Symbol !== "undefined" ? Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator")) : "@@iterator";

  function _settle(pact, state, value) {
    if (!pact.s) {
      if (value instanceof _Pact) {
        if (value.s) {
          if (state & 1) {
            state = value.s;
          }

          value = value.v;
        } else {
          value.o = _settle.bind(null, pact, state);
          return;
        }
      }

      if (value && value.then) {
        value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
        return;
      }

      pact.s = state;
      pact.v = value;
      var observer = pact.o;

      if (observer) {
        observer(pact);
      }
    }
  }

  var _Pact =
  /*#__PURE__*/
  function () {
    function _Pact() {}

    _Pact.prototype.then = function (onFulfilled, onRejected) {
      var result = new _Pact();
      var state = this.s;

      if (state) {
        var callback = state & 1 ? onFulfilled : onRejected;

        if (callback) {
          try {
            _settle(result, 1, callback(this.v));
          } catch (e) {
            _settle(result, 2, e);
          }

          return result;
        } else {
          return this;
        }
      }

      this.o = function (_this) {
        try {
          var value = _this.v;

          if (_this.s & 1) {
            _settle(result, 1, onFulfilled ? onFulfilled(value) : value);
          } else if (onRejected) {
            _settle(result, 1, onRejected(value));
          } else {
            _settle(result, 2, value);
          }
        } catch (e) {
          _settle(result, 2, e);
        }
      };

      return result;
    };

    return _Pact;
  }();

  function _isSettledPact(thenable) {
    return thenable instanceof _Pact && thenable.s & 1;
  }

  function _forTo(array, body, check) {
    var i = -1,
        pact,
        reject;

    function _cycle(result) {
      try {
        while (++i < array.length && (!check || !check())) {
          result = body(i);

          if (result && result.then) {
            if (_isSettledPact(result)) {
              result = result.v;
            } else {
              result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
              return;
            }
          }
        }

        if (pact) {
          _settle(pact, 1, result);
        } else {
          pact = result;
        }
      } catch (e) {
        _settle(pact || (pact = new _Pact()), 2, e);
      }
    }

    _cycle();

    return pact;
  }

  function _forOf(target, body, check) {
    if (typeof target[_iteratorSymbol] === "function") {
      var _cycle2 = function _cycle2(result) {
        try {
          while (!(step = iterator.next()).done && (!check || !check())) {
            result = body(step.value);

            if (result && result.then) {
              if (_isSettledPact(result)) {
                result = result.v;
              } else {
                result.then(_cycle2, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
                return;
              }
            }
          }

          if (pact) {
            _settle(pact, 1, result);
          } else {
            pact = result;
          }
        } catch (e) {
          _settle(pact || (pact = new _Pact()), 2, e);
        }
      };

      var iterator = target[_iteratorSymbol](),
          step,
          pact,
          reject;

      _cycle2();

      if (iterator["return"]) {
        var _fixup = function _fixup(value) {
          try {
            if (!step.done) {
              iterator["return"]();
            }
          } catch (e) {}

          return value;
        };

        if (pact && pact.then) {
          return pact.then(_fixup, function (e) {
            throw _fixup(e);
          });
        }

        _fixup();
      }

      return pact;
    } // No support for Symbol.iterator


    if (!("length" in target)) {
      throw new TypeError("Object is not iterable");
    } // Handle live collections properly


    var values = [];

    for (var i = 0; i < target.length; i++) {
      values.push(target[i]);
    }

    return _forTo(values, function (i) {
      return body(values[i]);
    }, check);
  }

  function _continue(value, then) {
    return value && value.then ? value.then(then) : then(value);
  }

  function _await$1(value, then, direct) {
    if (direct) {
      return then ? then(value) : value;
    }

    if (!value || !value.then) {
      value = Promise.resolve(value);
    }

    return then ? value.then(then) : value;
  }

  var handleRequest = _async(function (request) {
    request = Object.assign({}, request, new URL(request.url));
    var resp;
    return _invoke(function () {
      if (request.method === 'GET') return _await$1(onGet(request), function (_onGet) {
        resp = _onGet;
      });else return _invokeIgnored(function () {
        if (request.method === 'POST') return _await$1(onPost(request), function (_onPost) {
          resp = _onPost;
        });else resp = new Response('', {
          status: 405
        });
      });
    }, function () {
      var obj = Object.create(null);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = resp.headers.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              k = _step$value[0],
              v = _step$value[1];

          obj[k] = v;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return new Response(resp.body, {
        status: resp.status,
        statusText: resp.statusText,
        headers: Object.assign(obj, {
          'Access-Control-Allow-Origin': '*'
        })
      });
    });
  });

  function _async(f) {
    return function () {
      for (var args = [], i = 0; i < arguments.length; i++) {
        args[i] = arguments[i];
      }

      try {
        return Promise.resolve(f.apply(this, args));
      } catch (e) {
        return Promise.reject(e);
      }
    };
  }

  var onPost = _async(function (request) {
    var path = request.pathname;
    path = decodeURIComponent(path);
    var rootId = request.searchParams.get('rootId') || self.props.defaultRootId;

    if (path.substr(-1) === '/') {
      return _await$1(gd.listFolderByPath(path, rootId), function (_gd$listFolderByPath) {
        return new Response(JSON.stringify(_gd$listFolderByPath), {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      });
    } else {
      return _await$1(gd.getMetaByPath(path, rootId), function (result) {
        if (!result) {
          return new Response('null', {
            headers: {
              'Content-Type': 'application/json'
            },
            status: 404
          });
        }

        var isGoogleApps = result.mimeType.includes('vnd.google-apps');

        if (!isGoogleApps) {
          return gd.download(result.id, request.headers.get('Range'));
        } else {
          return Response.redirect(result.webViewLink, 302);
        }
      });
    }
  });

  function _empty() {}

  var onGet = _async(function (request) {
    var path = request.pathname;
    path = decodeURIComponent(path);
    var rootId = request.searchParams.get('rootId') || self.props.defaultRootId;

    if (path === '/~_~_gdindex.js') {
      return _await$1(fetch('https://raw.githubusercontent.com/maple3142/GDIndex/master/web/dist/js/app.js'), function (r) {
        return new Response(r.body, {
          headers: {
            'Content-Type': 'text/javascript; charset=utf-8'
          }
        });
      });
    } else if (path === '/~_~_gdindex.css') {
      return _await$1(fetch('https://raw.githubusercontent.com/maple3142/GDIndex/master/web/dist/js/app.css'), function (r) {
        return new Response(r.body, {
          headers: {
            'Content-Type': 'text/css; charset=utf-8'
          }
        });
      });
    } else if (path === '/~_~_gdindex/drives') {
      return _await$1(gd.listDrive(), function (_gd$listDrive) {
        return new Response(JSON.stringify(_gd$listDrive), {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      });
    } else if (path.substr(-1) === '/') {
      return new Response(HTML, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8'
        }
      });
    } else {
      return _await$1(gd.getMetaByPath(path, rootId), function (result) {
        if (!result) {
          return new Response('null', {
            headers: {
              'Content-Type': 'application/json'
            },
            status: 404
          });
        }

        var isGoogleApps = result.mimeType.includes('vnd.google-apps');

        if (!isGoogleApps) {
          return gd.download(result.id, request.headers.get('Range'));
        } else {
          return Response.redirect(result.webViewLink, 302);
        }
      });
    }
  });

  function _invokeIgnored(body) {
    var result = body();

    if (result && result.then) {
      return result.then(_empty);
    }
  }

  var gd = new GoogleDrive(self.props);

  function _invoke(body, then) {
    var result = body();

    if (result && result.then) {
      return result.then(then);
    }

    return then(result);
  }

  var HTML = "<!DOCTYPE html><html lang=en><head><meta charset=utf-8><meta http-equiv=X-UA-Compatible content=\"IE=edge\"><meta name=viewport content=\"width=device-width,initial-scale=1\"><title>".concat(self.props.title, "</title><link href=\"https://gh.maple3142.net/maple3142/GDIndex/master/web/dist/css/app.css\" rel=stylesheet></head><body><script>window.props = { title: '").concat(self.props.title, "', defaultRootId: '").concat(self.props.defaultRootId, "', api: location.protocol + '//' + location.host }</script><div id=app></div><script src=\"https://gh.maple3142.net/maple3142/GDIndex/master/web/dist/js/app.js\"></script></body></html>");
  addEventListener('fetch', function (event) {
    event.respondWith(handleRequest(event.request)["catch"](function (err) {
      console.error(err);
      new Response(JSON.stringify(err.stack), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }));
  });

}());
