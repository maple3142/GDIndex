	self.props = {
		title: 'GDIndex',
		default_root_id: 'root',
		client_id: '202264815644.apps.googleusercontent.com',
		client_secret: 'X4Z3ca8xfWDb1Voo-F9a7ZxJ',
		refresh_token: '',
		service_account: false,
		service_account_json: {},
		auth: false,
		user: '',
		pass: '',
		upload: false,
		lite: false
	};
(function (mime, workersJwt) {
	'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

	var mime__default = /*#__PURE__*/_interopDefaultLegacy(mime);

	/*
	 * XFetch.js modified
	 * A extremely simple fetch extension inspired by sindresorhus/ky.
	 */
	const xf = (() => {
	  const METHODS = ['get', 'post', 'put', 'patch', 'delete', 'head'];

	  class HTTPError extends Error {
	    constructor(res) {
	      super(res.statusText);
	      this.name = 'HTTPError';
	      this.response = res;
	    }

	  }

	  class XResponsePromise extends Promise {}

	  for (const alias of ['arrayBuffer', 'blob', 'formData', 'json', 'text']) {
	    // alias for .json() .text() etc...
	    XResponsePromise.prototype[alias] = function (fn) {
	      return this.then(res => res[alias]()).then(fn || (x => x));
	    };
	  }

	  const {
	    assign
	  } = Object;

	  function mergeDeep(target, source) {
	    const isObject = obj => obj && typeof obj === 'object';

	    if (!isObject(target) || !isObject(source)) {
	      return source;
	    }

	    Object.keys(source).forEach(key => {
	      const targetValue = target[key];
	      const sourceValue = source[key];

	      if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
	        target[key] = targetValue.concat(sourceValue);
	      } else if (isObject(targetValue) && isObject(sourceValue)) {
	        target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue);
	      } else {
	        target[key] = sourceValue;
	      }
	    });
	    return target;
	  }

	  const fromEntries = ent => ent.reduce((acc, [k, v]) => (acc[k] = v, acc), {});

	  const typeis = (...types) => val => types.some(type => typeof type === 'string' ? typeof val === type : val instanceof type);

	  const isstr = typeis('string');
	  const isobj = typeis('object');

	  const isstrorobj = v => isstr(v) || isobj(v);

	  const responseErrorThrower = res => {
	    if (!res.ok) throw new HTTPError(res);
	    return res;
	  };

	  const extend = (defaultInit = {}) => {
	    const xfetch = (input, init = {}) => {
	      mergeDeep(init, defaultInit);

	      const createQueryString = o => new init.URLSearchParams(o).toString();

	      const parseQueryString = s => fromEntries([...new init.URLSearchParams(s).entries()]);

	      const url = new init.URL(input, init.baseURI || undefined);

	      if (!init.headers) {
	        init.headers = {};
	      } else if (typeis(init.Headers)(init.headers)) {
	        // Transform into object if it is `Headers`
	        init.headers = fromEntries([...init.headers.entries()]);
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
	          const fd = new init.FormData();

	          for (const [k, v] of Object.entries(init.formData)) {
	            fd.append(k, v);
	          }

	          init.formData = fd;
	        }

	        init.body = init.formData;
	      } // Querystring


	      if (init.qs) {
	        if (isstr(init.qs)) init.qs = parseQueryString(init.qs);
	        url.search = createQueryString(assign(fromEntries([...url.searchParams.entries()]), init.qs));
	      }

	      return XResponsePromise.resolve(init.fetch(url, init).then(responseErrorThrower));
	    };

	    for (const method of METHODS) {
	      xfetch[method] = (input, init = {}) => {
	        init.method = method.toUpperCase();
	        return xfetch(input, init);
	      };
	    } // Extra methods and classes


	    xfetch.extend = newDefaultInit => extend(assign({}, defaultInit, newDefaultInit));

	    xfetch.HTTPError = HTTPError;
	    return xfetch;
	  };

	  const isWindow = typeof document !== 'undefined';
	  const isBrowser = typeof self !== 'undefined'; // works in both window & worker scope

	  return isBrowser ? extend({
	    fetch: fetch.bind(self),
	    URL,
	    Response,
	    URLSearchParams,
	    Headers,
	    FormData,
	    baseURI: isWindow ? document.baseURI : '' // since there is no document in webworkers

	  }) : extend();
	})();

	class GoogleDrive {
	  constructor(auth) {
	    this.auth = auth;
	    this.expires = 0;
	    this._getIdCache = new Map();
	  }

	  async initializeClient() {
	    // any method that do api call must call this beforehand
	    if (Date.now() < this.expires) return;

	    if (this.auth.service_account && typeof this.auth.service_account_json != 'undefined') {
	      const aud = this.auth.service_account_json.token_uri;
	      const serviceAccountJSON = this.auth.service_account_json;
	      const jwttoken = await workersJwt.getTokenFromGCPServiceAccount({
	        serviceAccountJSON,
	        aud,
	        payloadAdditions: {
	          scope: 'https://www.googleapis.com/auth/drive'
	        }
	      });
	      const resp = await xf.post(serviceAccountJSON.token_uri, {
	        urlencoded: {
	          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
	          assertion: jwttoken
	        }
	      }).json();
	      this.client = xf.extend({
	        baseURI: 'https://www.googleapis.com/drive/v3/',
	        headers: {
	          Authorization: `Bearer ${resp.access_token}`
	        }
	      });
	    } else {
	      const resp = await xf.post('https://www.googleapis.com/oauth2/v4/token', {
	        urlencoded: {
	          client_id: this.auth.client_id,
	          client_secret: this.auth.client_secret,
	          refresh_token: this.auth.refresh_token,
	          grant_type: 'refresh_token'
	        }
	      }).json();
	      this.client = xf.extend({
	        baseURI: 'https://www.googleapis.com/drive/v3/',
	        headers: {
	          Authorization: `Bearer ${resp.access_token}`
	        }
	      });
	    }

	    this.expires = Date.now() + 3500 * 1000; // normally, it should expiers after 3600 seconds
	  }

	  async listDrive() {
	    await this.initializeClient();
	    return this.client.get('drives').json();
	  }

	  async download(id, range = '') {
	    await this.initializeClient();
	    return this.client.get(`files/${id}`, {
	      qs: {
	        includeItemsFromAllDrives: true,
	        supportsAllDrives: true,
	        alt: 'media'
	      },
	      headers: {
	        Range: range
	      }
	    });
	  }

	  async downloadByPath(path, rootId = 'root', range = '') {
	    const id = await this.getId(path, rootId);
	    if (!id) return null;
	    return this.download(id, range);
	  }

	  async getMeta(id) {
	    await this.initializeClient();
	    return this.client.get(`files/${id}`, {
	      qs: {
	        includeItemsFromAllDrives: true,
	        supportsAllDrives: true,
	        fields: '*'
	      }
	    }).json();
	  }

	  async getMetaByPath(path, rootId = 'root') {
	    const id = await this.getId(path, rootId);
	    if (!id) return null;
	    return this.getMeta(id);
	  }

	  async listFolder(id) {
	    await this.initializeClient();

	    const getList = pageToken => {
	      const qs = {
	        includeItemsFromAllDrives: true,
	        supportsAllDrives: true,
	        q: `'${id}' in parents and trashed = false`,
	        orderBy: 'folder,name,modifiedTime desc',
	        fields: 'files(id,name,mimeType,size,modifiedTime),nextPageToken',
	        pageSize: 1000
	      };

	      if (pageToken) {
	        qs.pageToken = pageToken;
	      }

	      return this.client.get('files', {
	        qs
	      }).json();
	    };

	    const files = [];
	    let pageToken;

	    do {
	      const resp = await getList(pageToken);
	      files.push(...resp.files);
	      pageToken = resp.nextPageToken;
	    } while (pageToken);

	    return {
	      files
	    };
	  }

	  async listFolderByPath(path, rootId = 'root') {
	    const id = await this.getId(path, rootId);
	    if (!id) return null;
	    return this.listFolder(id);
	  }

	  async getId(path, rootId = 'root') {
	    const toks = path.split('/').filter(Boolean);
	    let id = rootId;

	    for (const tok of toks) {
	      id = await this._getId(id, tok);
	    }

	    return id;
	  }

	  async _getId(parentId, childName) {
	    if (this._getIdCache.has(parentId + childName)) {
	      return this._getIdCache.get(parentId + childName);
	    }

	    await this.initializeClient();
	    childName = childName.replace(/\'/g, `\\'`); // escape single quote

	    const resp = await this.client.get('files', {
	      qs: {
	        includeItemsFromAllDrives: true,
	        supportsAllDrives: true,
	        q: `'${parentId}' in parents and name = '${childName}'  and trashed = false`,
	        fields: 'files(id)'
	      }
	    }).json().catch(e => ({
	      files: []
	    })); // if error, make it empty

	    if (resp.files.length === 0) {
	      return null;
	    }

	    this._getIdCache.has(parentId + childName);

	    return resp.files[0].id; // when there are more than 1 items, simply return the first one
	  }

	  async upload(parentId, name, file) {
	    await this.initializeClient();
	    const createResp = await this.client.post('https://www.googleapis.com/upload/drive/v3/files', {
	      qs: {
	        uploadType: 'resumable',
	        supportsAllDrives: true
	      },
	      json: {
	        name,
	        parents: [parentId]
	      }
	    });
	    const putUrl = createResp.headers.get('Location');
	    return this.client.put(putUrl, {
	      body: file
	    }).json();
	  }

	  async uploadByPath(path, name, file, rootId = 'root') {
	    const id = await this.getId(path, rootId);
	    if (!id) return null;
	    return this.upload(id, name, file);
	  }

	  async delete(fileId) {
	    return this.client.delete(`files/${fileId}`);
	  }

	  async deleteByPath(path, rootId = 'root') {
	    const id = await this.getId(path, rootId);
	    if (!id) return null;
	    return this.delete(id);
	  }

	}

	const gd = new GoogleDrive(self.props);
	const HTML = `<!DOCTYPE html><html lang=en><head><meta charset=utf-8><meta http-equiv=X-UA-Compatible content="IE=edge"><meta name=viewport content="width=device-width,initial-scale=1"><title>${self.props.title}</title><link href="/~_~_gdindex/resources/css/app.css" rel=stylesheet></head><body><script>window.props = { title: '${self.props.title}', default_root_id: '${self.props.default_root_id}', api: location.protocol + '//' + location.host, upload: ${self.props.upload} }<\/script><div id=app></div><script src="/~_~_gdindex/resources/js/app.js"><\/script></body></html>`;

	async function onGet(request) {
	  let {
	    pathname: path
	  } = request;
	  const rootId = request.searchParams.get('rootId') || self.props.default_root_id;

	  if (path.startsWith('/~_~_gdindex/resources/')) {
	    const remain = path.replace('/~_~_gdindex/resources/', '');
	    const r = await fetch(`https://raw.githubusercontent.com/maple3142/GDIndex/master/web/dist/${remain}`);
	    return new Response(r.body, {
	      headers: {
	        'Content-Type': mime__default['default'].getType(remain) + '; charset=utf-8',
	        'Cache-Control': 'max-age=600'
	      }
	    });
	  } else if (path === '/~_~_gdindex/drives') {
	    return new Response(JSON.stringify(await gd.listDrive()), {
	      headers: {
	        'Content-Type': 'application/json'
	      }
	    });
	  } else if (path.substr(-1) === '/' || path.startsWith('/~viewer')) {
	    return new Response(HTML, {
	      headers: {
	        'Content-Type': 'text/html; charset=utf-8'
	      }
	    });
	  } else {
	    const result = await gd.getMetaByPath(path, rootId);

	    if (!result) {
	      return new Response('null', {
	        headers: {
	          'Content-Type': 'application/json'
	        },
	        status: 404
	      });
	    }

	    const isGoogleApps = result.mimeType.includes('vnd.google-apps');

	    if (!isGoogleApps) {
	      const r = await gd.download(result.id, request.headers.get('Range'));
	      const h = new Headers(r.headers);
	      h.set('Content-Disposition', `inline; filename*=UTF-8''${encodeURIComponent(result.name)}`);
	      return new Response(r.body, {
	        status: r.status,
	        headers: h
	      });
	    } else {
	      return Response.redirect(result.webViewLink, 302);
	    }
	  }
	}

	async function onPost(request) {
	  let {
	    pathname: path
	  } = request;
	  const rootId = request.searchParams.get('rootId') || self.props.default_root_id;

	  if (path.substr(-1) === '/') {
	    return new Response(JSON.stringify(await gd.listFolderByPath(path, rootId)), {
	      headers: {
	        'Content-Type': 'application/json'
	      }
	    });
	  } else {
	    const result = await gd.getMetaByPath(path, rootId);

	    if (!result) {
	      return new Response('null', {
	        headers: {
	          'Content-Type': 'application/json'
	        },
	        status: 404
	      });
	    }

	    const isGoogleApps = result.mimeType.includes('vnd.google-apps');

	    if (!isGoogleApps) {
	      const r = await gd.download(result.id, request.headers.get('Range'));
	      const h = new Headers(r.headers);
	      h.set('Content-Disposition', `inline; filename*=UTF-8''${encodeURIComponent(result.name)}`);
	      return new Response(r.body, {
	        status: r.status,
	        headers: h
	      });
	    } else {
	      return Response.redirect(result.webViewLink, 302);
	    }
	  }
	}

	async function onPut(request) {
	  if (!self.props.upload) {
	    return new Response("Upload isn't enabled.", {
	      headers: {
	        'Content-Type': 'text/plain'
	      },
	      status: 405
	    });
	  }

	  let {
	    pathname: path
	  } = request;

	  if (path.substr(-1) === '/') {
	    return new Response(null, {
	      headers: {
	        'Content-Type': 'application/json'
	      },
	      status: 405
	    });
	  }

	  const url = request.searchParams.get('url');
	  let fileBody;

	  if (url) {
	    const u = new URL(url);
	    const Referer = u.href;
	    const Origin = u.protocol + '//' + u.host;
	    fileBody = (await fetch(url, {
	      headers: {
	        Referer,
	        Origin
	      }
	    })).body;
	  } else {
	    fileBody = request.body;
	  }

	  const tok = path.split('/');
	  const name = tok.pop();
	  const parent = tok.join('/');
	  const rootId = request.searchParams.get('rootId') || self.props.default_root_id;
	  return new Response(JSON.stringify(await gd.uploadByPath(parent, name, fileBody, rootId)), {
	    headers: {
	      'Content-Type': 'application/json'
	    }
	  });
	}

	function unauthorized() {
	  return new Response('Unauthorized', {
	    headers: {
	      'WWW-Authenticate': 'Basic realm="goindex"',
	      'Access-Control-Allow-Origin': '*'
	    },
	    status: 401
	  });
	}

	function parseBasicAuth(auth) {
	  try {
	    return atob(auth.split(' ').pop()).split(':');
	  } catch (e) {
	    return [];
	  }
	}

	function doBasicAuth(request) {
	  const auth = request.headers.get('Authorization');

	  if (!auth || !/^Basic [A-Za-z0-9._~+/-]+=*$/i.test(auth)) {
	    return false;
	  }

	  const [user, pass] = parseBasicAuth(auth);
	  return user === self.props.user && pass === self.props.pass;
	}

	function encodePathComponent(path) {
	  return path.split('/').map(encodeURIComponent).join('/');
	}

	async function handleRequest(request) {
	  if (request.method === 'OPTIONS') // allow preflight request
	    return new Response('', {
	      status: 200,
	      headers: {
	        'Access-Control-Allow-Origin': '*',
	        'Access-Control-Allow-Headers': '*',
	        'Access-Control-Allow-Methods': 'GET, POST, PUT, HEAD, OPTIONS'
	      }
	    });

	  if (self.props.auth && !doBasicAuth(request)) {
	    return unauthorized();
	  }

	  request = Object.assign({}, request, new URL(request.url));
	  request.pathname = request.pathname.split('/').map(decodeURIComponent).map(decodeURIComponent) // for some super special cases, browser will force encode it...   eg: +αあるふぁきゅん。 - +♂.mp3
	  .join('/');

	  if ((self.props.lite || request.headers.get('x-lite') == 'true') && request.pathname.endsWith('/')) {
	    // lite mode
	    const path = request.pathname;
	    let parent = encodePathComponent(path.split('/').slice(0, -2).join('/') + '/');
	    const {
	      files
	    } = await gd.listFolderByPath(path, self.props.default_root_id);
	    let fileht = '';

	    for (const f of files) {
	      const isf = f.mimeType === 'application/vnd.google-apps.folder';
	      const p = encodePathComponent(path + f.name);
	      fileht += `<li><a href="${p + (isf ? '/' : '')}">${f.name}</a></li>`;
	    }

	    const ht = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
<html>
<head>
<title>Index of ${path}</title>
</head>
<body>
<h1>Index of ${path}</h1>
<ul>
<li><a href="${parent}"> Parent Directory</a></li>
${fileht}
</ul>
</body>
</html>`;
	    return new Response(ht, {
	      status: 200,
	      headers: {
	        'Content-Type': 'text/html; charset=utf-8'
	      }
	    });
	  }

	  let resp;
	  if (request.method === 'GET') resp = await onGet(request);else if (request.method === 'POST') resp = await onPost(request);else if (request.method === 'PUT') resp = await onPut(request);else resp = new Response('', {
	    status: 405
	  });
	  const obj = Object.create(null);

	  for (const [k, v] of resp.headers.entries()) {
	    obj[k] = v;
	  }

	  return new Response(resp.body, {
	    status: resp.status,
	    statusText: resp.statusText,
	    headers: Object.assign(obj, {
	      'Access-Control-Allow-Origin': '*'
	    })
	  });
	}

	addEventListener('fetch', event => {
	  event.respondWith(handleRequest(event.request).catch(err => {
	    console.error(err);
	    return new Response(JSON.stringify(err.stack), {
	      status: 500,
	      headers: {
	        'Content-Type': 'application/json'
	      }
	    });
	  }));
	});

}(mime, workersJwt));
