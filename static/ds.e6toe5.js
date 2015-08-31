(function(_W_) {
  var toString = {}.toString,
      slice = [].slice,
      UA = _W_.navigator.userAgent.toLowerCase();
  var CONFIG = {
    isDebug: false,
    rootUrl: '/',
    dcomRootUrl: 'static/dcom/'
  };
  var Ds = function() {
    "use strict";
    function Ds() {}
    return ($traceurRuntime.createClass)(Ds, {}, {});
  }();
  Object.assign(Ds, {
    VERSION: '2.0.0',
    CONFIG: CONFIG,
    guid: 0,
    Cache: {},
    Promise: Promise,
    getBrowerV: function() {
      if (!Ds.isEmpty(Ds._browerVersion)) {
        return Ds._browerVersion;
      }
      var b = Ds._browerVersion = {},
          u = UA;
      var s;
      (s = u.match(/msie ([\d.]+)/)) ? b.ie = s[1] : (s = u.match(/firefox\/([\d.]+)/)) ? b.firefox = s[1] : (s = u.match(/chrome\/([\d.]+)/)) ? b.chrome = s[1] : (s = u.match(/opera.([\d.]+)/)) ? b.opera = s[1] : (s = u.match(/version\/([\d.]+).*safari/)) ? b.safari = s[1] : 0;
      return b;
    },
    isIE8: function() {
      var v = Ds.getBrowerV();
      return v.ie ? (parseInt(v.ie) < 9 ? true : false) : false;
    },
    isIE7: function() {
      var v = Ds.getBrowerV();
      return v.ie ? (parseInt(v.ie) < 8 ? true : false) : false;
    },
    getGuid: function() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString();
      }).toUpperCase();
    },
    setG: function(key, value) {
      function P(r, k, v) {
        var ka = k.split(">");
        var len = ka.length;
        if (len == 1) {
          r[ka[0]] = v;
        } else if (len == 2) {
          r[ka[0]] ? '' : (r[ka[0]] = {});
          r[ka[0]][ka[1]] = v;
        }
      }
      if (typeof key == "string") {
        var K = key.split('/');
        var len = K.length;
        switch (len) {
          case 1:
            P(Ds.Cache, K[0], value);
            break;
          case 2:
            Ds.Cache[K[0]] ? '' : (Ds.Cache[K[0]] = {});
            P(Ds.Cache[K[0]], K[1], value);
            break;
          case 3:
            Ds.Cache[K[0]] ? '' : (Ds.Cache[K[0]] = {});
            Ds.Cache[K[0]][K[1]] ? '' : (Ds.Cache[K[0]][K[1]] = {});
            P(Ds.Cache[K[0]][K[1]], K[2], value);
            break;
        }
      }
    },
    getG: function(key) {
      if (typeof key == "string") {
        var K = key.split('/');
        var len = K.length;
        try {
          switch (len) {
            case 1:
              return Ds.Cache[K[0]];
              break;
            case 2:
              return Ds.Cache[K[0]][K[1]];
              break;
            case 3:
              return Ds.Cache[K[0]][K[1]][K[2]];
              break;
          }
        } catch (err) {
          return 'undefined';
        }
      }
    },
    _getGArr: function(key) {
      var arr = Ds.getG(key);
      if (Ds.isEmpty(arr) || !Ds.isArray(arr)) {
        arr = [];
      }
      return arr;
    },
    pushG: function(key, v) {
      var vs = Ds._getGArr(key);
      vs.push(v);
      Ds.setG(key, vs);
      return vs;
    },
    popG: function(key) {
      var vs = Ds._getGArr(key);
      vs.pop();
      Ds.setG(key, vs);
      return vs;
    },
    shiftG: function(key) {
      var vs = Ds._getGArr(key);
      vs.shift();
      Ds.setG(key, vs);
      return vs;
    },
    unshiftG: function(key, v) {
      var vs = Ds._getGArr(key);
      vs.unshift(v);
      Ds.setG(key, vs);
      return vs;
    },
    extend: function(target, source) {
      var stype = typeof source;
      if (typeof target !== "object" && !$.isFunction(target)) {
        target = {};
      }
      if (stype === 'undefined' || stype === 'boolean') {
        source = target;
        target = this;
      }
      for (var p in source) {
        if (source.hasOwnProperty(p)) {
          target[p] = source[p];
        }
      }
      return target;
    },
    isUndefined: function(v) {
      return toString.call(v) == '[object Undefined]';
    },
    isBoolean: function(v) {
      return toString.call(v) == '[object Boolean]';
    },
    isNumber: function(v) {
      return toString.call(v) == '[object Number]';
    },
    isString: function(v) {
      return toString.call(v) == '[object String]';
    },
    isArray: function(v) {
      return toString.call(v) == '[object Array]';
    },
    isFunction: function(v) {
      return toString.call(v) == '[object Function]';
    },
    isObject: function(v) {
      return toString.call(v) == '[object Object]';
    },
    isEmpty: function(at) {
      if (typeof at == "undefined") {
        true;
      }
      if (at == null) {
        return true;
      }
      if (typeof at == "string") {
        if (/^\s*$/g.test(at)) {
          return true;
        }
      }
      ;
      if (Ds.isArray(at)) {
        if (at.length == 0) {
          return true;
        }
      }
      if ($.isPlainObject(at)) {
        for (var i in at) {
          return false;
        }
        return true;
      }
    },
    removeFrom: function(obj, find) {
      if (Ds.isArray(obj)) {
        obj = obj.filter(function(x) {
          return x != find;
        });
      }
      return obj;
    },
    include: function(fs, cb) {
      var $__20;
      var $__18,
          $__19;
      var obj = arguments[2] !== (void 0) ? arguments[2] : Ds;
      fs = Ds.isArray(fs) ? fs : fs.split(',');
      var fa = [];
      var $__6 = true;
      var $__7 = false;
      var $__8 = undefined;
      try {
        for (var $__4 = void 0,
            $__3 = (fs)[$traceurRuntime.toProperty(Symbol.iterator)](); !($__6 = ($__4 = $__3.next()).done); $__6 = true) {
          var f = $__4.value;
          {
            var fr = [];
            if (f.includes(",")) {
              fr = f.split(',');
            } else {
              fr = [f];
            }
            ($__20 = fa).push.apply($__20, $traceurRuntime.spread(fr));
          }
        }
      } catch ($__9) {
        $__7 = true;
        $__8 = $__9;
      } finally {
        try {
          if (!$__6 && $__3.return != null) {
            $__3.return();
          }
        } finally {
          if ($__7) {
            throw $__8;
          }
        }
      }
      fa = fa.map(function(f) {
        if (f.indexOf(".js") != -1) {
          return {
            file: f,
            type: 'js'
          };
        } else if (f.indexOf(".css") != -1) {
          return {
            file: f,
            type: 'css'
          };
        } else {
          return {
            file: f + ".js",
            type: 'js'
          };
        }
      });
      if (Ds.isFunction(cb)) {
        var odoms = [];
        var _selfcall = function(fa) {
          var fn = fa.shift();
          if (Ds.isEmpty(fn)) {
            cb.call(obj, odoms);
            return;
          }
          var promise = Ds[fn.type == "css" ? "_loadCssFile" : "_loadJsFile"](fn.file, cb).then(function(odom) {
            if (!Ds.isUndefined(odom)) {
              odoms.push(odom);
            }
            ;
            return _selfcall(fa);
          });
          return promise;
        };
        _selfcall(fa);
      } else {
        var $__13 = true;
        var $__14 = false;
        var $__15 = undefined;
        try {
          for (var $__11 = void 0,
              $__10 = (fa.entries())[$traceurRuntime.toProperty(Symbol.iterator)](); !($__13 = ($__11 = $__10.next()).done); $__13 = true) {
            var $__17 = $__11.value,
                index = ($__18 = $__17[$traceurRuntime.toProperty(Symbol.iterator)](), ($__19 = $__18.next()).done ? void 0 : $__19.value),
                f$__21 = ($__19 = $__18.next()).done ? void 0 : $__19.value;
            {
              if (f$__21.type == "css") {
                Ds.addCssToHead(f$__21.file, cb, obj, index);
              } else {
                Ds.addJsToBodyLast(f$__21.file, cb, obj, index);
              }
            }
          }
        } catch ($__16) {
          $__14 = true;
          $__15 = $__16;
        } finally {
          try {
            if (!$__13 && $__10.return != null) {
              $__10.return();
            }
          } finally {
            if ($__14) {
              throw $__15;
            }
          }
        }
      }
    },
    debug: function(info) {
      var dom = Ds.E("g_debug");
      if (!dom) {
        dom = Ds.addDivToBody("g_debug");
        dom.style.display = "none";
      }
      if (Ds.isEmpty(info)) {
        info = null;
      }
      info === null ? $(dom).empty() : $(dom).append(info.toString());
    },
    addDivToBody: function(id, tag) {
      tag = tag || 'div';
      var oBody = document.getElementsByTagName('BODY').item(0);
      var odiv = document.createElement(tag);
      odiv.setAttribute('id', id);
      odiv.guid = Ds.guid++;
      oBody.appendChild(odiv);
      return odiv;
    },
    _putLoadFileToCache: function(fn) {
      var c = Ds._getGArr("includeFileCache/list");
      var tmpArr = [],
          isOverlap = false;
      if (Ds.isEmpty(c)) {
        tmpArr.push(fn);
      } else {
        c.map(function(f) {
          if (f['file'] == fn['file']) {
            isOverlap = true;
            return fn;
          }
          return f;
        });
        tmpArr = c;
        if (!isOverlap) {
          tmpArr.push(fn);
        }
      }
      Ds.setG("includeFileCache/list", tmpArr);
    },
    _inLoadedFileQuque: function(file) {
      var c = Ds._getGArr("includeFileCache/list");
      var isExist = false;
      c.forEach(function(f) {
        if (f['file'] == file) {
          isExist = true;
        }
      });
      return isExist;
    },
    _removeLoadFileFromCache: function(file) {
      var c = Ds._getGArr("includeFileCache/list");
      var tmpArr = [];
      c.forEach(function(f) {
        if (f['file'] != fn['file']) {
          tmpArr.push(f);
        }
      });
      c = tmpArr;
      Ds.setG("includeFileCache/list", c);
    },
    _setLoadFileStatus: function(file, isload) {
      var fn = {
        file: file,
        isload: isload
      };
      var c = Ds._getGArr("includeFileCache/list");
      c = c.map(function(f) {
        if (f['file'] == fn['file']) {
          f['isload'] = isload;
        }
        return f;
      });
      Ds.setG("includeFileCache/list", c);
    },
    _getLoadFileStatus: function(file) {
      var c = Ds._getGArr("includeFileCache/list");
      var isload = 0;
      c.forEach(function(f) {
        if (f['file'] != file) {
          isload = f['isload'] || 0;
          return;
        }
      });
      return isload;
    },
    _loadCssFile: function(css, func) {
      return Ds._dyLoadFile(css, func, 'css');
    },
    _loadJsFile: function(js, func) {
      return Ds._dyLoadFile(js, func, 'js');
    },
    _dyLoadFile: function(file, func, type) {
      var promise = null;
      return promise = new Ds.Promise(function(resolve, reject) {
        if (Ds._inLoadedFileQuque(file)) {
          var poll = null,
              btime = Ds.getTime();
          var polltimer = window.setTimeout(poll = function() {
            if (Ds._getLoadFileStatus(file) == 1) {
              resolve.call(promise);
              window.clearTimeout(polltimer);
              return;
            }
            var etime = Ds.getTime();
            if ((etime - btime) > 1000) {
              window.clearTimeout(polltimer);
              return;
            }
            window.setTimeout(poll, 10);
          }, 0);
          return;
        }
        Ds._putLoadFileToCache({
          file: file,
          isload: 0
        });
        if (type == "css") {
          var oHead = document.getElementsByTagName('HEAD').item(0);
          var ofile = document.createElement("link");
          ofile.type = "text/css";
          ofile.href = file;
          ofile.rel = "stylesheet";
          oHead.appendChild(ofile);
        } else {
          var oBody = document.getElementsByTagName('BODY').item(0);
          var ofile = document.createElement("script");
          ofile.type = "text/javascript";
          ofile.src = file;
          oBody.appendChild(ofile);
        }
        ofile.guid = Ds.getGuid();
        if (Ds.isFunction(func)) {
          ofile.onload = function() {
            resolve.call(promise, ofile);
            Ds._setLoadFileStatus(file, 1);
          };
        }
      });
      return promise;
    },
    addCssToHead: function(css, func, obj, param) {
      Ds._loadCssFile(css, func).then(function(ocss) {
        func.call(obj, ocss, param);
      });
    },
    addJsToBodyLast: function(js, func, obj, param) {
      Ds._loadJsFile(js, func).then(function(oscript) {
        func.call(obj, oscript, param);
      });
    },
    fetchObjByKeys: function(keys, obj) {
      if (Ds.isString(keys)) {
        keys = keys.split(',');
      }
      var tem = {};
      if (Ds.isArray(keys)) {
        for (var k in keys) {
          if (obj.hasOwnProperty(keys[k])) {
            tem[keys[k]] = obj[keys[k]];
          }
        }
      }
      obj = tem;
      return tem;
    },
    getViewSize: function(obj) {
      obj = typeof obj == "undefined" ? document.documentElement : (typeof obj == "string" ? document.getElementById(obj) : obj);
      var $__17 = obj,
          clientWidth = $__17.clientWidth,
          clientHeight = $__17.clientHeight,
          offsetWidth = $__17.offsetWidth,
          offsetHeight = $__17.offsetHeight,
          scrollWidth = $__17.scrollWidth,
          scrollHeight = $__17.scrollHeight,
          scrollTop = $__17.scrollTop,
          scrollLeft = $__17.scrollLeft;
      if (obj == document.documentElement) {
        scrollTop = scrollTop ? scrollTop : document.body.scrollTop;
        scrollLeft = scrollLeft ? scrollLeft : document.body.scrollLeft;
      }
      var screen = window.screen;
      return {
        clientWidth: clientWidth,
        clientHeight: clientHeight,
        screen: screen,
        offsetWidth: offsetWidth,
        offsetHeight: offsetHeight,
        scrollWidth: scrollWidth,
        scrollHeight: scrollHeight,
        scrollTop: scrollTop,
        scrollLeft: scrollLeft
      };
    },
    registGlobalEvent: function() {
      function _getregistnonamefunction(key) {
        return function(e) {
          var funcs = Ds.getG('Event/' + key);
          if (!$.isEmpty(funcs)) {
            for (var f in funcs) {
              if ($.isFunction(funcs[f])) {
                funcs[f].call(this, e);
              }
            }
          }
        };
      }
      if (Ds._isregistglobalevent) {
        return;
      }
      Ds._isregistglobalevent = true;
      $(window).bind("scroll", _getregistnonamefunction('scrollFunc')).bind("resize", _getregistnonamefunction('resizeFunc'));
      $(window).unload(_getregistnonamefunction('rootUnloadFunc'));
      $(document).bind("click", _getregistnonamefunction('rootclickFunc'));
      $(document).bind("mousedown", _getregistnonamefunction('rootmousedownFunc'));
      $(document).bind("mouseup", _getregistnonamefunction('rootmouseupFunc'));
      $(document).bind("keyup", _getregistnonamefunction('rootkeyupFunc'));
      $(document).bind("downup", _getregistnonamefunction('rootkeydownFunc'));
    },
    E: function(id) {
      if (typeof id == "string") {
        return document.getElementById(id);
      } else if (typeof id == "object") {
        return id;
      }
      return null;
    },
    Ajax: function(u, d, dt, t, s, a, b, c) {
      try {
        $.ajax({
          'url': u,
          data: d,
          dataType: dt,
          type: t,
          success: s,
          async: a,
          beforeSend: b,
          complete: c
        });
      } catch (e) {}
    },
    centerWindow: function(ob, w, h) {
      var sn = Ds.getViewSize();
      var bh = (sn['clientHeight'] - h) / 2;
      bh = bh < 0 ? 0 : bh;
      var scrolltop = sn['scrollTop'] + bh;
      var bw = Math.abs((sn['clientWidth'] - w) / 2);
      ob.style.left = bw + "px";
      ob.style.top = scrolltop + "px";
    },
    yzAvail: function(id, tip, maxw, svalue) {
      var minw = 1;
      if (typeof maxw == "string") {
        var mmarr = maxw.split('-');
        var minw = parseInt(mmarr[0]);
        var maxw = parseInt(mmarr[1]);
      } else {
        maxw = maxw || 100;
      }
      var txt = $(id).val();
      if ($.isEmpty(txt) || txt == svalue) {
        $.alert(tip + "不能为空", "error");
        $(id).focus();
        return false;
      } else if (/\<|\'/g.test(txt)) {
        $.alert(tip + "不能输入非法字符", "error");
        $(id).focus();
        return false;
      }
      var len = txt.length;
      if (len < minw) {
        $.alert(tip + "不能低于" + minw + "个字", "error");
        return;
      }
      if (len > maxw) {
        $.alert(tip + "不能超过" + maxw + "个字", "error");
        return false;
      }
      return true;
    },
    addHidenField: function(id, name, value, istextarea) {
      if (istextarea) {
        $(id).append('<textarea style="display:none;" name="' + name + '" >' + value + '</textarea>');
      } else {
        $(id).append('<input name="' + name + '" value="' + value + '" type="hidden" />');
      }
    },
    strToTime: function(date) {
      if (date === 0) {
        return 0;
      }
      if (date) {
        var datearr = date.split('-');
        if (datearr[1].substr(0, 1) == 0) {
          var moth = parseInt(datearr[1].substr(1, 1)) - 1;
        } else {
          var moth = parseInt(datearr[1]) - 1;
        }
        var d = new Date(datearr[0], moth, datearr[2]);
        return d.getTime();
      } else {
        var d = new Date();
        var year = d.getFullYear();
        var moth = d.getMonth();
        var day = d.getDate();
        d = new Date(year, moth, day);
        return d.getTime();
      }
    },
    getDJSformat: function(endtime) {
      if (!/^\d+$/g.test(endtime)) {
        endtime = Ds.strToTime(endtime);
      } else {
        endtime = endtime * 1000;
      }
      var d = new Date();
      var nowtime = d.getTime();
      if (nowtime > endtime) {
        return '已过期';
      }
      var cm = (endtime - nowtime) / 1000;
      var day = Math.floor(cm / (3600 * 24));
      if (day > 365 * 10) {
        return '不限天数';
      }
      cm = cm - day * 3600 * 24;
      var hour = Math.floor(cm / 3600);
      cm = cm - hour * 3600;
      var minute = Math.floor(cm / 60);
      cm = cm - minute * 60;
      var second = parseInt(cm);
      return day + '天' + hour + '时' + minute + '分' + second + '秒';
    },
    getImageSize: function(src, func) {
      var i = new Image();
      i.src = src;
      if ($.isFunction(func)) {
        if (i.complete) {
          func({
            w: i.width,
            h: i.height,
            src: src
          });
        } else {
          i.onload = function() {
            func({
              w: i.width,
              h: i.height,
              src: src
            });
          };
        }
      } else {
        return {
          w: i.width,
          h: i.height,
          src: src
        };
      }
    },
    GU: function(src, isecho) {
      if ($.isPlainObject(src)) {
        if (!src['m']) {
          return;
        }
        var g = src['g'] || 'index.php';
        src['g'] = null;
        src['r'] = src['r'] || '';
        src['o'] = src['o'] || '';
        var isrewrite = 3;
        var url = [];
        if (isrewrite == 3 && $.inArray(g, ["index.php", "index", "wap.php", "weixin", "wap", "weixin.php"]) != -1) {
          url[0] = src['m'];
          url[1] = src['r'];
          src['o'] ? url.push(src['o']) : '';
          src['m'] = null;
          src['r'] = null;
          src['o'] = null;
          for (var k in src) {
            if (src[k] != null && !$.isEmpty(src[k])) {
              url.push(k);
              url.push(encodeURIComponent(src[k]));
            }
          }
          url = url.join('/');
          g = g.split('.')[0];
          url = '/' + g + '/' + url;
        } else {
          for (var k in src) {
            if (src[k] != null && !$.isEmpty(src[k])) {
              url.push(k + '=' + encodeURIComponent(src[k]));
            }
          }
          url = url.join('&');
          url = '/' + g + "?" + url;
        }
      } else {
        url = src;
      }
      if (isecho) {
        document.write(url);
      } else {
        return url;
      }
    },
    getTime: function() {
      return (new Date()).getTime();
    }
  });
  Ds.Ui = {scrollPage: function(top, speed) {
      if (typeof top == "undefined") {
        top = 0;
      } else if (typeof top == "number") {} else if (typeof top == "string") {
        if (/^\d+$/.test(top)) {
          top = parseInt(top);
        } else {
          top = $(top).offset().top;
        }
      }
      speed = speed || 100;
      try {
        $(document.documentElement).animate({scrollTop: top}, speed);
        $(body).animate({scrollTop: top}, speed);
      } catch (err) {}
    }};
  Ds.attach = {};
  Ds.dcom = {
    registComs: {},
    callc: function(comname, func, param) {
      param = param || '';
      var comobj = Ds.dcom.getCom(comname);
      if (comobj != null) {
        if (Ds.isFunction(func)) {
          func.call(Ds.dcom);
        } else {
          try {
            comobj['callouti'](func, param);
          } catch (err) {
            alert("组件接口未实现" + err, "error");
          }
        }
      } else {
        var jsFile = Ds.CONFIG.dcomRootUrl + "dcom-" + comname + ".js";
        var cssFile = Ds.CONFIG.dcomRootUrl + "css/dcom-" + comname + ".css";
        if (Ds.CONFIG.isDebug) {
          var rdm = "?" + Math.random();
          jsFile += rdm;
          cssFile += rdm;
        }
        Ds.include([cssFile, jsFile], function(doms) {
          var comobj = Ds.dcom.getCom(comname);
          comobj.bindDoms = doms;
          if (Ds.isFunction(func)) {
            func.call(Ds.dcom);
          } else {
            try {
              comobj['callouti'](func, param);
            } catch (err) {
              alert("组件接口未实现" + err, "error");
            }
          }
        });
      }
    },
    addCom: function(comname, obj) {
      Ds.dcom.registComs["dcom-" + comname] = obj;
      obj.dcomobjstr = "Ds.dcom.registComs.dom-" + comname;
    },
    getCom: function(comname) {
      return Ds.dcom.registComs["dcom-" + comname] || null;
    },
    removeCom: function(comname) {
      var dcom = Ds.dcom.registComs["dcom-" + comname];
      if (dcom.bindDoms) {
        dcom.bindDoms.map(function(fd) {
          $(fd).remove();
        });
      }
      if (Ds.isFunction(dcom.distroy)) {
        dcom.distroy();
      }
      dcom = null;
    }
  };
  Ds.dlg = function(param) {
    return Ds.dcom.callc("sys-dlg", "open", param);
  };
  Ds.alert = function(tip, type, time, func) {
    return Ds.dcom.callc("sys-alert", "open", {
      tip: tip,
      type: type || '',
      time: time || 2000,
      func: func || null
    });
  };
  Ds.request = function(u, d, dt, t, s) {
    var a = arguments[5] !== (void 0) ? arguments[5] : true;
    var st = arguments[6] !== (void 0) ? arguments[6] : 1;
    return Ds.dcom.callc("sys-request", "open", {
      u: u,
      d: d || {},
      dt: dt || '',
      t: t || 'get',
      s: s || null,
      a: a,
      st: st
    });
  };
  Object.assign(_W_, {Ds: Ds});
})(window);
