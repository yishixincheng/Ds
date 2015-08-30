(function(_W_){

var Ds=function(){
	
};
Ds.extend=function(target, source){
	var stype=typeof source;
	if (typeof target!=="object"&&!$.isFunction(target) ) {
		target = {};
	}
	if(stype==='undefined'||stype ==='boolean'){
		source=target;
		target=this;	
	}
	for (var p in source) {
		if (source.hasOwnProperty(p)) {
			target[p] = source[p];
		}
	}
	return target;
};
Ds.extend({
	VERSION:'2.0.0',
	guid: 1,
	Cache: {},
	_obj_: {},
	SetG: function(key, value) {
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
	GetG: function(key) {
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
	addDivToBody: function(id, tag) {
		tag = tag || 'div';
		var oBody = document.getElementsByTagName('BODY').item(0);
		var odiv = document.createElement(tag);
		odiv.setAttribute('id', id);
		odiv.guid = Ds.guid++;
		oBody.appendChild(odiv);
		return odiv;
	},
	addCssToHead: function(css, func, obj) {
		try {
			var oHead = document.getElementsByTagName('HEAD').item(0);
			var ocss = document.createElement("link");
			ocss.type = "text/css";
			ocss.href = css;
			ocss.rel = "stylesheet";
			ocss.guid = Ds.guid++;
			oHead.appendChild(ocss);
			if (typeof func == "function") {
				obj = obj || window;
				if (!0) {
					ocss.onload = function() {
						func.call(obj);
					}
				} else {
					ocss.onreadystatechange = function() {
						if (ocss.readyState == 'loaded' || ocss.readyState == 'complete') {
							func.call(obj);
						}
					}
				}
			}
			return ocss;
		} catch (err) {}
		return null;
	},
	addJsToBodyLast: function(js, func, obj) {
		try {
			var oBody = document.getElementsByTagName('BODY').item(0);
			var oScript = document.createElement("script");
			oScript.type = "text/javascript";
			oScript.src = js;
			oBody.appendChild(oScript);
			if (typeof func == "function") {
				obj = obj || window;
				if (!0) {
					oScript.onload = function() {
						func.call(obj);
					}
				} else {
					oScript.onreadystatechange = function() {
						if (oScript.readyState == 'loaded' || oScript.readyState == 'complete') {
							func.call(obj);
						}
					}
				}
			}
			return oScript;
		} catch (err) {}
	},
	getViewSize: function(obj) {
		obj = typeof obj == "undefined" ? document.documentElement : (typeof obj == "string" ? document.getElementById(obj) : obj);
		var clientWidth = obj.clientWidth;
		var clientHeight = obj.clientHeight;
		var offsetWidth = obj.offsetWidth;
		var offsetHeight = obj.offsetHeight;
		var scrollWidth = obj.scrollWidth;
		var scrollHeight = obj.scrollHeight;
		var scrollTop = obj.scrollTop;
		var scrollLeft = obj.scrollLeft;
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
				var funcs = Ds.GetG('Event/' + key);
				if (!$.isEmpty(funcs)) {
					for (var f in funcs) {
						if ($.isFunction(funcs[f])) {
							funcs[f].call(this, e);
						}
					}
				}
			}
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
				}
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
	}
});

Ds.base = {
	scrollPage: function(top, speed) {
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
			$(document.documentElement).animate({
				scrollTop: top
			}, speed);
			$(body).animate({
				scrollTop: top
			}, speed);
		} catch (err) {}
	}
};
Ds.attach = {};
Ds.memory = {
	setvalue: function(key, value, time) {
		var mDate = new Date();
		var currtime = mDate.getTime();
		if (!time) {
			time = currtime + 3600 * 1000;
		} else {
			time = currtime + time * 1000;
		}
		if (time < currtime) {
			Ds.SetG('memory/' + key, null);
			return;
		}
		Ds.SetG('memory/' + key + '/value', value);
		Ds.SetG('memory/' + key + '/time', time);
	},
	getvalue: function(key) {
		var time = Ds.GetG('memory/' + key + '/time');
		if (!time) {
			return;
		}
		var mDate = new Date();
		currtime = mDate.getTime();
		if (currtime <= time) {
			return Ds.GetG('memory/' + key + '/value');
		}
	},
	dropvalue: function(key) {
		Ds.memory.setvalue(key, '', -3600);
	}
};
Ds.bindform = {
	i: 0,
	cache: [],
	select: function(domid) {
		return new Ds.bindform.op(domid);
	},
	geti: function() {
		this.i++;
		return this.i;
	},
	putcache: function(i) {
		if ($.inArray(i, Ds.bindform.cache) == -1) {
			Ds.bindform.cache.push(i);
		}
	},
	delcache: function(i) {
		var pos = $.inArray(i, Ds.bindform.cache);
		if (pos != -1) {
			Ds.bindform.cache.splice(pos, 1);
		}
	},
	op: function(domid) {
		var _t_ = this;
		_t_.left = 0;
		_t_.top = 0;
		_t_.tipzIndex = 25000;
		_t_._tid = $(domid);
		_t_.i = Ds.bindform.geti();
		Ds.bindform.putcache(_t_.i);
		_t_.settip = function(defaulttip) {
			_t_.defaulttip = defaulttip;
			return _t_;
		};
		_t_.setTipZindex = function(zindex) {
			_t_.tipzIndex = zindex || 2;
			return _t_;
		};
		_t_.setoffset = function(left, top) {
			_t_.left = left || 0;
			_t_.top = top || 0;
			return _t_;
		}, _t_.focus = function(callback) {
			_t_._tid.focus(function() {
				_t_._tid.addClass("g_formfocusborder");
				_t_._tid.removeClass("g_formerrorborder");
				if (_t_.defaulttip) {
					createTip(_t_._tid, _t_.defaulttip, "default", _t_.i);
				}
				if ($.isFunction(callback)) {
					callback.call(_t_._tid);
				}
			});
			return _t_;
		};
		_t_.blur = function(callback) {
			_t_._tid.blur(function() {
				_t_._tid.removeClass("g_formfocusborder");
				_t_._tid.attr("isvalueright", true);
				if ($.isFunction(callback)) {
					var r = callback.call(_t_._tid, setStatusTip);
					if (r) {
						var type = r['type'];
						var tip = r['tip'];
						if (type == "error") {
							_t_._tid.addClass("g_formerrorborder");
							_t_._tid.attr("isvalueright", false);
						} else if (type) {
							_t_._tid.removeClass("g_formerrorborder");
						}
						createTip(_t_._tid, tip, type, _t_.i);
					} else {
						removetip(_t_.i);
					}
				} else {
					if (_t_.defaulttip) {
						removetip(_t_.i);
					}
				}
			});
			return _t_;
		};
		_t_.listenDyndata = function(callback) {
			_t_._tid.keyup(function() {
				var txt = _t_._tid.val();
				callback.call(_t_._tid, setStatusTip);
			});
			return _t_;
		};

		function setStatusTip(r) {
			if (r) {
				var type = r['type'];
				var tip = r['tip'];
				if (type == "error") {
					_t_._tid.addClass("g_formerrorborder");
					_t_._tid.attr("isvalueright", false);
				} else if (type) {
					_t_._tid.removeClass("g_formerrorborder");
				}
				createTip(_t_._tid, tip, type, _t_.i);
			} else {
				removetip(_t_.i);
			}
		}
		_t_.listenCapsLock = function(callback) {
			_t_._tid.keypress(function(e) {
				var o = e.target || e.srcElement;
				var keyCode = e.keyCode || e.which;
				var isShift = e.shiftKey || (keyCode == 16) || false;
				if (((keyCode >= 65 && keyCode <= 90) && !isShift) || ((keyCode >= 97 && keyCode <= 122) && isShift)) {
					createCapsLockTip(_t_._tid);
				} else {
					removeCapsLockTip(_t_._tid);
				}
				if ($.isFunction(callback)) {
					callback.call(_t_._tid);
				}
			});
			_t_._tid.blur(function() {
				removeCapsLockTip(_t_._tid);
			});
			return _t_;
		};
		_t_.listenDropDown = function(getdata, syn, left, top, classname) {
			var prevalue = '';
			_t_._tid.attr("datalock", false);
			_t_._tid.keyup(function() {
				var txt = $(this).val();
				if (prevalue == txt) {
					return;
				}
				prevalue = txt;
				var datalock = _t_._tid.attr("datalock");
				if (datalock == "true") {
					_t_._tid.attr("datalock", false);
					return;
				}
				if ($.isFunction(getdata)) {
					if (!syn) {
						var datalist = getdata.call(_t_, txt, printDropDownList);
					} else {
						if (datalist) {
							printDropDownList(datalist, left, top, classname);
						} else {
							closeDropDownList();
						}
					}
				}
			}).keydown(function(e) {
				if (e.keyCode == 40) {
					moveDropDownListItme(1, _t_.i);
				} else if (e.keyCode == 38) {
					moveDropDownListItme(0, _t_.i);
				} else if (e.keyCode == 13) {
					clickDropDownListItme(_t_.i);
				}
			});
			$(document).click(function() {
				closeDropDownList();
			});
			return _t_;
		};
		var closeDropDownList = function() {
				var listid = Ds.E("g_dom_form_dropdownlist_" + _t_.i);;
				if (listid && listid.style.display != 'none') {
					listid.style.display = 'none';
				}
			}
		_t_.closeDropDownList = closeDropDownList;

		function printDropDownList(data, left, top, classname, onclickfunc) {
			left = left || 0;
			top = top || 0;
			classname = classname || '';
			var html = '';
			if ($.isArray(data)) {
				var A = ['<ul>'];
				for (var i in data) {
					var ocf = '';
					if (onclickfunc) {
						var ocfpm = "";
						for (var ii in data[i]) {
							ocfpm += ii + '="' + data[i][ii] + '"';
						}
						ocf = ' onClick="' + onclickfunc + '(this);return false; " ' + ocfpm;
					}
					A.push(['<li>', '<a ', ocf, ' href="', (data[i]['url'] ? data[i]['url'] : 'javascript:;'), '" ', (data[i]['blank'] ? 'target="_blank"' : ''), '>', data[i]['name'], '</a></li>'].join(''));
				}
				A.push('</ul>');
				html = A.join('');
			} else {
				html = data;
			}
			var id = _t_._tid;
			var oft = id.offset();
			var fw = id.width();
			var fh = id.height();
			var pleft = id.css("padding-left");
			pleft = parseInt(pleft || 0);
			var pright = id.css("padding-right");
			pright = parseInt(pright || 0);
			fw += pleft + pright;
			var ptop = id.css("padding-top");
			ptop = parseInt(ptop || 0);
			fh += 2 * ptop;
			var listid = Ds.E("g_dom_form_dropdownlist_" + _t_.i);
			if (!listid) {
				listid = Ds.addDivToBody("g_dom_form_dropdownlist_" + _t_.i);
				$(listid).addClass("g_dom_form_dropdownlist " + classname);
			}
			$(listid).empty().show().css({
				position: "absolute",
				zIndex: 90000,
				width: fw + "px"
			}).offset({
				left: (oft.left + left),
				top: (oft.top + fh + top)
			}).html(html);
			$(listid).children("ul").eq(0).children("li").click(function() {
				var txt = $(this).children("a").eq(0).text();
				_t_._tid.val(txt);
			});
		}

		function clickDropDownListItme(i) {
			var listid = Ds.E("g_dom_form_dropdownlist_" + i);
			if (!listid) {
				return;
			}
			if (listid.style.display != 'none') {
				if (typeof listid.sdindex == 'undefined') {
					listid.sdindex = 0;
				}
				var lis = $(listid).children("ul").eq(0).children("li");
				var target = lis.eq(listid.sdindex - 1).children("a").eq(0);
				var url = target.attr("href");
				if (!/javascript:/.test(url)) {
					window.location = lis.eq(listid.sdindex - 1).children("a").eq(0).attr("href");
				}
				_t_._tid.attr("datalock", true);
				_t_._tid.val(target.text());
				_t_._tid.focus().blur();
				listid.sdindex = 0;
				$(listid).hide();
				target.click();
			}
		}

		function moveDropDownListItme(direction, i) {
			var listid = Ds.E("g_dom_form_dropdownlist_" + i);
			if (!listid) {
				return;
			}
			if (listid.style.display != 'none') {
				if (typeof listid.sdindex == 'undefined') {
					listid.sdindex = 0;
				}
				var lis = $(listid).children("ul").eq(0).children("li");
				var alllen = lis.length;
				if (direction == 0) {
					listid.sdindex--;
					if (listid.sdindex < 0) {
						listid.sdindex = alllen;
					}
				} else {
					listid.sdindex++;
					if (listid.sdindex > alllen) {
						listid.sdindex = 0;
					}
				}
				lis.removeClass("currsddropli");
				if (listid.sdindex == 0) {
					_t_._tid.focus();
					return;
				}
				lis.eq(listid.sdindex - 1).addClass("currsddropli");
			} else {
				listid.sdindex = 0;
			}
		}

		function createCapsLockTip(id) {
			var oft = id.offset();
			var fw = id.width();
			var fh = id.height();
			var tipid = Ds.E("g_dom_capslock_tip");
			if (!tipid) {
				tipid = Ds.addDivToBody("g_dom_capslock_tip");
				$(tipid).addClass("g_dom_capslock_tip").html('<i></i><span>大写锁定已打开</span>');
			}
			$(tipid).css({
				position: "absolute",
				zIndex: _t_.tipzIndex
			}).offset({
				left: (oft.left),
				top: (oft.top + fh)
			});
		}

		function removeCapsLockTip(id) {
			var tipid = Ds.E("g_dom_capslock_tip");
			if (tipid) {
				$(tipid).remove();
			}
		}

		function createTip(id, tip, type, i) {
			var oft = id.offset();
			var fw = id.width();
			var fh = id.height();
			if (fh > 30) {
				fh = 30;
			}
			var tipid = Ds.E("g_dom_form_input_tip_" + i);
			if (!tipid) {
				tipid = Ds.addDivToBody("g_dom_form_input_tip_" + i);
			}
			if ($.isEmpty(tip)) {
				$(tipid).remove();
				return;
			}
			$(tipid).attr("class", "g_dom_form_input_tip").css({
				position: "absolute",
				zIndex: _t_.tipzIndex
			}).offset({
				left: (oft.left + fw + 10 + _t_.left),
				top: (oft.top + _t_.top)
			});
			$(tipid).html(['<a class="g_class_form_tip_ico_', type, '"></a><span class="g_class_form_tip_text_', type, '">', tip, '</span>'].join(''));
		}

		function removetip(i) {
			Ds.bindform.delcache(i);
			var tipid = Ds.E("g_dom_form_input_tip_" + i);

			if (tipid) {
				$(tipid).remove();
			}
		}
	},
	getValueIsValid: function(ids) {
		var r = 1;
		$(ids).each(function(index, element) {
			var cr = $(this).attr("isvalueright");
			if (typeof cr == "undefined") {
				cr = "true";
			}
			if (cr == "true") {
				cr = 1;
			} else {
				cr = 0;
			}
			r *= cr;
		});
		return r;
	},
	removeAllFormTip: function() {
		if ($.isArray(Ds.bindform.cache)) {
			for (var i in Ds.bindform.cache) {
				var tipid = Ds.E("g_dom_form_input_tip_" + Ds.bindform.cache[i]);
				if (tipid) {
					$(tipid).remove();
				}
			}
		}
	}
};
Ds.imager = {
	i: 0,
	obj: null,
	isinit: false,
	rypicids: [],
	geti: function() {
		this.i++;
		return this.i;
	},
	use: function(picid) {
		var pos = 0;
		if ((pos = $.inArray(picid, this.rypicids)) != -1) {
			this.rypicids.splice(pos, 1);
		}
	},
	addrypicid: function(picid) {
		if ($.inArray(picid, this.rypicids) == -1) {
			this.rypicids.push(picid);
		}
	},
	init: function() {
		if (Ds.isinit) {
			return;
		}
		Ds.isinit = true;
		Ds.registGlobalEvent();
		Ds.SetG("Event/rootUnloadFunc>_unloadtemppic", function() {
			if (Ds.imager.rypicids.length > 0) {
				$.Ajax(Ds.GU({
					m: 'plugs',
					r: 'pic',
					o: 'unload'
				}), {
					picids: Ds.imager.rypicids,
					FORMHASH: FORMHASH,
					uid: member['uid'],
					sessionkey: sessionkey
				}, '', 'post', function(d) {}, false);
			}
		});
	},
	select: function(domid) {
		Ds.imager.init();
		return new Ds.imager.op(domid);
	},
	op: function(domid) {
		var _t_ = this;
		_t_._udid = $(domid);
		_t_.i = Ds.imager.geti();
		_t_.picw = 0;
		_t_.pich = 0;
		_t_.prevw = 0;
		_t_.prevh = 0;
		_t_.optype = 0;
		_t_.tempsessionkey = '';
		_t_._picfileid = null;
		_t_._callback = null;
		_t_._beforefunc = null;
		_t_._mouseover = null;
		_t_._errorfunc = null;
		_t_._mouseout = null;
		_t_.zIndex = 25000;
		_t_.setparam = function(w, h, pw, ph, optype, tempsessionkey) {
			_t_.picw = w || 0;
			_t_.pich = h || 0;
			_t_.prevw = pw || 0;
			_t_.prevh = ph || 0;
			_t_.optype = optype || 0;
			_t_.tempsessionkey = tempsessionkey || '';
			return _t_;
		};
		_t_.mouseover = function(mo) {
			if ($.isFunction(mo)) {
				_t_._mouseover = mo;
			}
			return _t_;
		};
		_t_.setZindex = function(zindex) {
			_t_.zIndex = zindex;
			return _t_;
		};
		_t_.mouseout = function(mo) {
			if ($.isFunction(mo)) {
				_t_._mouseout = mo;
			}
			return _t_;
		};
		_t_.regist = function() {
			if (!_t_._udid) {
				return _t_;
			}
			_t_._udid.mouseenter(function() {
				var domform = Ds.E("g_id_imager_form_" + _t_.i);
				if (!domform) {
					var postiframe = Ds.E("g_id_post_iframe");
					if (!postiframe) {
						postiframe = Ds.addDivToBody("g_id_post_iframe");
						$(postiframe).html(['<iframe src="" name="g_name_post_iframe" style="display:none;"></iframe>'].join(''));
					}
					var domformbox = Ds.addDivToBody("g_id_imager_form_box_" + _t_.i);
					$(domformbox).html(['<form id="g_id_imager_form_' + _t_.i + '" enctype ="multipart/form-data" ><div style="display:none;" class="" id="g_id_imager_form_values_', _t_.i, '">', '</div>', '<input type="hidden" name="FORMHASH" value="', FORMHASH, '">', '<input type="file" id="g_id_imager_form_upload_button_', _t_.i, '" name="picfile" class="g_picfilecontrol"  ></form>'].join(''));
					domform = Ds.E("g_id_imager_form_" + _t_.i);
					_t_._picfileid = $("#g_id_imager_form_upload_button_" + _t_.i);
					_t_._picfileid.change(function() {
						if ($.isFunction(_t_._beforefunc)) {
							_t_._beforefunc.call(_t_);
						}
						_t_.upload(this);
						Ds.imager.obj = _t_;
					}).mouseover(function() {
						if (_t_._mouseover) {
							_t_._mouseover.call();
						}
					}).mouseout(function() {
						if (_t_._mouseout) {
							_t_._mouseout.call();
						}
					});
				}
				var oft = _t_._udid.offset();
				if ($.browser.msie) {
					oft = {
						left: oft.left - _t_._udid.width() * (1 / 2) + 30,
						top: oft.top
					};
				}
				$("#g_id_imager_form_upload_button_" + _t_.i).css({
					zIndex: _t_.zIndex
				}).offset(oft).width(_t_._udid.width()).height(_t_._udid.height());
			}).mouseleave(function() {});
			return _t_;
		};
		_t_.beforeupload = function(beforefunc) {
			_t_._beforefunc = beforefunc;
			return _t_;
		};
		_t_.errorfunc = function(func) {
			_t_._errorfunc = func;
			return _t_;
		};
		_t_.setkeyvals = function(keyvals, value, istextarea) {
			if (!keyvals) {
				return _t_;
			}
			if ($.isArray(keyvals)) {
				$("#g_id_imager_form_values_" + _t_.i).empty();
				for (var i in keyvals) {
					var v = keyvals[i];
					if (typeof v == "object") {
						Ds.addHidenField("#g_id_imager_form_values_" + _t_.i, v['name'], v['value'], v['istextarea']);
					}
				}
			} else {

				Ds.addHidenField("#g_id_imager_form_values_" + _t_.i, keyvals, value, istextarea);
			}
			return _t_;
		};
		_t_.upload = function(thisid) {
			var picpath = $(thisid).val();
			if ($.isEmpty(picpath)) {
				return;
			}
			if (!Ds.imager.getisimg(picpath)) {
				$.alert("请选择正确的图片格式", "error");
				return;
			}
			var picw = Ds.imager.getcontrolvalue(_t_.picw);
			var pich = Ds.imager.getcontrolvalue(_t_.pich);
			var optype = Ds.imager.getcontrolvalue(_t_.optype);
			var tempsessionkey = _t_.tempsessionkey;
			_t_.setkeyvals([{
				name: 'width',
				value: picw
			}, {
				name: 'height',
				value: pich
			}, {
				name: 'optype',
				value: optype
			}, {
				name: 'tempsessionkey',
				value: tempsessionkey
			}]);
			var domform = Ds.E("g_id_imager_form_" + _t_.i);
			domform.target = "g_name_post_iframe";
			domform.enctype = "multipart/form-data";
			domform.action = Ds.GU({
				m: 'plugs',
				r: 'upload'
			});
			domform.method = "post";
			domform.submit();
		};
		_t_.afterupload = function(callback) {
			_t_._callback = callback;
			return _t_;
		};
		_t_.callback = function(status, msg, picid, picurl, picaddress, width, height) {
			if (status == "fail") {
				$.alert(msg, "error");
				if ($.isFunction(_t_._errorfunc)) {
					_t_._errorfunc.call(_t_);
				}
				return;
			}
			$.alert("提交成功", "right");
			Ds.imager.addrypicid(picid);
			if ($.isFunction(_t_._callback)) {
				_t_._callback(picid, picurl, picaddress, width, height);
			}
		};
		_t_.removecontrol = function() {
			$("#g_id_imager_form_" + _t_.i).remove();
			return _t_;
		}
	},
	getcontrolvalue: function(cv) {
		if (typeof cv == "number") {
			return cv;
		}
		if (typeof cv == "string") {
			if (/^\d+/g.test(cv)) {
				return cv;
			}
		}
		return $(cv).val();
	},
	getisimg: function(path) {
		if (path) {
			var picarr = path.split('.');
			var filedot = picarr.pop();
			filedot = filedot.toLowerCase();
			if ($.inArray(filedot, ['exe', 'dll']) != -1) {
				return false;
			}
		}
		return true;
	},
	avatar: function(src, w, h, isdelay, attach) {
		src = src || '';
		w = w || 0;
		h = h || 0;
		isdelay = isdelay || false;
		attach = attach || '';
		if (!src) {
			src = site_url + avatar_src;
		}
		return Ds.imager.imager(src, 120, 120, w, h, 1, isdelay, attach);
	},
	imager: function(src, sw, sh, w, h, force, isdelay, attach) {
		src = src || '';
		w = w || 0;
		h = h || 0;
		isdelay = isdelay || false;
		attach = attach || '';
		force = force || 1;
		if (src.indexOf('/') === 0) {
			src = site_url + src;
		}
		if (!sw || !sh) {
			var ish = Ds.getImageSize(src);
			sw = ish['w'];
			sh = ish['h'];
		}
		var imagenode = '';
		if (isdelay) {
			var dotsrc = site_url + '/pic/dotpic.jpg';
			imagenode = ' picsrc="' + src + '" src="' + dotsrc + '" ';
		} else {
			imagenode = ' src="' + src + '" ';
		}
		if (force == 1) {
			imagenode += '  width="' + w + '" height="' + h + '" ';
		} else if (force == 2) {
			var sz = $.zoomsize(sw, sh, w, h);
			imagenode += '  width="' + sz['w'] + '" height="' + sz['h'] + '" ';
		} else {
			sz = $.zoomsize(w, h, sw, sh);
			imagenode += '  width="' + sz['w'] + '" height="' + sz['h'] + '" ';
		}
		if (attach) {
			imagenode + ' ' + attach + ' ';
		}
		return '<img ' + imagenode + ' >';
	},
	sGPicCache: function(picaddress) {
		if (!Ds.UploadPicCache) {
			Ds.UploadPicCache = [];
		}
		if (picaddress) {
			Ds.UploadPicCache.push(picaddress);
		} else {
			return Ds.UploadPicCache;
		}
	}
};
Ds.shopcart = {
	shopcartcount: 0,
	init: function() {
		this.getshopprocount();
	},
	dealprocountfromeserver: function(d) {
		if (d && d != 0) {
			this.setshopcartcount(d);
		}
	},
	getshopprocount: function(func) {
		$.Ajax('/index.php?m=shopcart&r=getcount', {
			rand: Math.random()
		}, '', 'post', function(d) {
			if (/^\d+$/.test(d)) {
				Ds.shopcart.dealprocountfromeserver(d);
				if ($.isFunction(func)) {
					func.call();
				}
			} else {
				if (d) {
					$.alert(d, "error");
				}
			}
		}, true);
	},
	setshopcartcount: function(count) {
		Ds.shopcart.shopcartcount = count;
		var domtip = Ds.E("_G_ShopCart_Count");
		var dom2tip = Ds.E("_G_RB_ShopCart_Count")
		var title = '购物车中有' + count + '件商品，赶快去结算吧';
		if (domtip) {
			if (domtip) {
				$(domtip).html(count).attr("title", title).show();
			}
		}
		if (dom2tip) {
			if (dom2tip) {
				$(dom2tip).html(count).attr("title", title);
			}
		} else {
			if (count > 999) {
				count = "999+";
			}
			var dom2box = Ds.E("_G_RB_ShopCart");
			if (dom2box) {
				$(dom2box).append(['<a id="_G_RB_ShopCart_Count" title="', title, '" class="g_rb_shopcart_count">', count, '</a>'].join(''));
			}
		}
	},
	addshopcart: function(data, func, bfile) {
		data['sessionkey'] = sessionkey || '';
		$.Ajax('/index.php?m=shopcart&r=add', data, 'json', 'post', function(d) {
			if (d) {
				if (d['status'] == 'success') {
					$.alert("恭喜您，已成功添加购物车中", "right");
					if ($.isFunction(func)) {
						func.call();
					} else {
						Ds.shopcart.getshopprocount();
					}
				} else {
					$.alert(d['msg'], "error");
				}
			} else {
				$.alert("添加失败,请确认你是否登录了", "error");
			}
		}, true);
	},
	moveprotoshopcart: function(domimg, func) {
		Ds.shopcart.move("#_G_ShopCart_Box", domimg, func);
	},
	move: function(dombox, domimg, func) {
		var src = $(domimg).attr("src");
		var w = $(domimg).width();
		var h = $(domimg).height();
		var of = $(domimg).offset();
		var tof = $(dombox).offset();
		var tw = $(dombox).width();
		var th = $(dombox).height();
		var movedom = Ds.addDivToBody("_Move_ShopCart_Pics_" + Ds.guid, 'img');
		$(movedom).css({
			position: 'absolute',
			zIndex: 2000,
			opacity: 0.5
		}).width(w).height(h).offset(of).attr("src", src).animate({
			width: tw + "px",
			height: th + "px",
			top: tof.top + "px",
			left: tof.left + "px"
		}, 800, function() {
			Ds.shopcart.getshopprocount(function() {
				if ($.isFunction(func)) {
					func.call();
				}
			});
			try {
				$(movedom).remove();
			} catch (err) {}
		});
	},
	selectmovetoshopcart: function(domimg, func) {
		if (!domimg) {
			Ds.shopcart.getshopprocount(function() {
				if ($.isFunction(func)) {
					func.call();
				}
			});
			return;
		}
		var domrbbox = Ds.E("_G_RB_Box");
		if (!domrbbox) {
			Ds.shopcart.move(Ds.E("_G_ShopCart_Box"), domimg, func);
			return;
		}
		if (domrbbox.style.display == 'none') {
			Ds.shopcart.move(Ds.E("_G_ShopCart_Box"), domimg, func);
		} else {
			Ds.shopcart.move(Ds.E("_G_RB_ShopCart"), domimg, func);
		}
	},
	shopshopcartpanel: function(button) {
		var dompanel = Ds.E("_G_Shopcart_Panel");
		if (!dompanel) {
			dompanel = Ds.addDivToBody("_G_Shopcart_Panel");
			$(dompanel).attr("class", "if_shopcart_panel_body").css({
				position: 'absolute',
				zIndex: 100
			}).html(['<div class="if_shopcart_panel_top">', '<a></a><span>恭喜您，成功加入购物车</span>', '</div>', '<div class="if_shopcart_panel_bottom">', '<span>共<em id="_G_Shopcart_Panel_Count">0</em>件商品</span>', '<a href="?m=buy&r=shopcart" target="_blank">去购物车结算</a>', '</div><a title="关闭" class="close" href="javascript:;" onClick="$(\'#_G_Shopcart_Panel\').hide();"></a>'].join(''));
		}
		$("#_G_Shopcart_Panel_Count").html(Ds.shopcart.shopcartcount);
		var ot = $(button).offset();
		var w = $(button).width();
		var h = $(button).height();
		var bw = $(dompanel).width();
		var left = parseInt(ot.left) + parseInt(w) - parseInt(bw);
		var top = parseInt(ot.top) + parseInt(h);
		$(dompanel).css({
			left: left + "px",
			top: top + "px"
		}).show();
	}
};
Ds.cpopcard = function(w, h, cardno, isclose, hideclose) {
	var t = this;
	t.init = function() {
		if (cardno) {
			t.index = cardno;
		} else {
			t.index = Ds.guid;
		}
	};
	t.createcard = function() {
		var popcard = Ds.E("_I_POPCARD" + t.index);
		var bgw = 0,
			bgh = 0,
			bgstyle = '';
		w = w || 0;
		h = h || 0;
		bgw = w + 10;
		bgh = h + 10;
		if (!popcard) {
			popcard = Ds.addDivToBody('_I_POPCARD' + t.index);
			popcard.className = "if_i_popcard_body";
			popcard.style.width = w + "px";
			popcard.style.height = h + "px";
			if (bgw != 0) {
				var bgstyle = 'style="width:' + bgw + 'px;height:' + bgh + 'px"';
			}
			var closew = '';
			if (isclose) {
				var closew = '<a class="if_p_card_close" title="关闭" onClick="Ds.cpopcard_static.closewindow(' + t.index + ');"></a>';
			}
			var A = ['<div class="if_i_popcard_container" id="_I_POPCARD_C', t.index, '"></div>', '<div class="if_i_popcard_bg" ', bgstyle, ' id="_I_POPCARD_BG', t.index, '" ></div>', '<div class="if_i_popcard_arrow" id="_I_POPCARD_A', t.index, '"></div>', closew];
			popcard.innerHTML = A.join('');
		} else {
			popcard.style.width = w + "px";
			popcard.style.height = h + "px";
			$(Ds.E('_I_POPCARD_BG' + t.index)).width(bgw).height(bgh);
		}
	};
	t.filldiv = function(div) {
		Ds.E("_I_POPCARD_C" + t.index).innerHTML = div;
	};
	t.setarrdirection = function(direction, left, top) {
		switch (direction) {
		case 'left':
			break;
		case 'right':
			break;
		case 'up':
			break;
		case 'down':
			break;
		default:
			$("#_I_POPCARD_A" + t.index).remove();
			return;
			break;
		}
		$("#_I_POPCARD_A" + t.index).addClass(direction).css({
			left: left + "px",
			top: top + "px"
		});
	};
	t.setcardposition = function(left, top) {
		$('#_I_POPCARD' + t.index).offset({
			left: left,
			top: top
		});
	};
	t.setcardwh = function(w, h) {
		var $_t = $('#_I_POPCARD' + t.index);
		if (w) {
			$_t.width(w);
		}
		if (h) {
			$_t.height(h);
		}
	};
	t.getindex = function() {
		return t.index;
	};
	t.closewindow = function(index) {
		index = index || t.index;
		if (Ds.E("_I_POPCARD" + index)) {
			$(Ds.E("_I_POPCARD" + index)).remove();
		}
	};
	t.init();
};
Ds.cpopcard_static = {
	closewindow: function(index) {
		$(Ds.E("_I_POPCARD" + index)).remove();
	}
};
Ds.plugs = {
	unlogin: function(url) {
		if (window.confirm("您确定退出吗")) {
			$.Ajax(Ds.GU({
				g: 'index.php',
				m: 'account',
				r: 'login',
				o: 'out'
			}), {
				FORMHASH: FORMHASH,
				sessionkey: sessionkey,
				uid: member['uid']
			}, 'json', 'post', function(d) {
				if (d) {
					if (d['status'] == 'success') {
						Ds.icomm && Ds.icomm.synunlogin({
							FORMHASH: FORMHASH
						});
						$.alert("退出成功,正在为您刷新请稍后...", "right", 3000, function() {
							if ($.isFunction(url)) {
								url.call();
							} else if (typeof url == "string") {
								window.location = url;
							} else {
								window.location.reload();
							}
						});
					} else {
						$.alert(d['msg'], 'error');
					}
				}
			}, true);
		}
	},
	tologin: function() {}
};
Ds.control = {
	uid: 0,
	_getuid: function() {
		Ds.control.uid++;
		return Ds.control.uid;
	},
	ctlswitch: function(onoff) {
		var uid = Ds.control._getuid();
		__this = this;
		if (onoff == "1" || onoff == "on") {
			var cls = 'class="on"';
			__this.onoff = 1;
		} else {
			var cls = 'class="off"';
			__this.onoff = 0;
		}
		var A = ['<a id="g_control_', uid, '" class="ctl_switch"><i ', cls, ' ></i></a>'].join('');
		__this.setContainer = function(container) {
			$(container).html(A);
			return __this;
		};
		__this.registEvent = function(callback) {
			var onoff = __this.onoff;
			$("#g_control_" + uid).click(function() {
				if (this.start == 1) {} else {
					__this.onoff = onoff;
					this.start = 1;
				}
				if (__this.onoff == 1) {
					$(this).children("i").attr("class", "off");
					__this.onoff = 0;
				} else {
					$(this).children("i").attr("class", "on");
					__this.onoff = 1;
				}
				if ($.isFunction(callback)) {
					callback(__this.onoff);
				}
			});
			return __this;
		}
	},
	ctlcheckbox: function(onoff) {
		var uid = Ds.control._getuid();
		__this = this;
		__this.container = null;
		__this.uid = uid;
		if (onoff == "1" || onoff == "on") {
			var cls = 'class="on"';
			__this.onoff = 1;
		} else {
			var cls = 'class="off"';
			__this.onoff = 0;
		}
		var A = ['<a id="g_control_', uid, '" class="ctl_checkbox"><i ', cls, ' ></i></a>'].join('');
		__this.setContainer = function(container) {
			$(container).html(A);
			__this.container = $(container).get(0);
			__this.container.checked = __this.onoff;
			return __this;
		};
		__this.registEvent = function(callback) {
			var onoff = __this.onoff;
			$("#g_control_" + uid).click(function() {
				if (this.start == 1) {} else {
					__this.onoff = onoff;
					this.start = 1;
				}
				if (__this.onoff == 1) {
					$(this).children("i").attr("class", "off");
					__this.onoff = 0;
					__this.container.checked = 0;
				} else {
					$(this).children("i").attr("class", "on");
					__this.onoff = 1;
					__this.container.checked = 1;
				}
				if ($.isFunction(callback)) {
					callback(__this.onoff);
				}
			});
			return __this;
		};
		__this.setOnoff = function(onoff) {
			if (onoff == 1 || onoff == "on") {
				$("#g_control_" + uid).children("i").attr("class", "on");
				__this.onoff = 1;
			} else {
				$("#g_control_" + uid).children("i").attr("class", "off");
				__this.onoff = 0;
			}
			return __this;
		};
		__this.getOnoff = function() {
			return __this.onoff;
		}
	}
};
Ds.poplayer = function(src, mode, nodefaultskin, isdiv) {
	var _t_ = this;
	_t_.init = function() {
		if (typeof mode == "undefined") {
			_t_.mode = true;
		} else {
			_t_.mode = mode;
		}
		if (!_t_.mode) {
			_t_.dlgindex = Ds.guid;
		} else {
			_t_.dlgindex = 0;
			Ds._obj_.poplayer = _t_;
		}
		_t_.src = src;
		if (nodefaultskin) {
			_t_.defaultskin = false;
		} else {
			_t_.defaultskin = true;
		}
		_t_.printHTML(isdiv);
	};
	_t_.printHTML = function(isdiv) {
		if (_t_.defaultskin) {
			var nh = ['<div class="graybg" id="DlgBgGray', _t_.dlgindex, '"></div>', '<div class="g_layerbody" id="GLobalPopLayer_Body', _t_.dlgindex, '">', '<div class="g_layercontainer" id="GLobalPopLayer_Container', _t_.dlgindex, '" style="border:1px solid #cecece;" ></div>', '<div class="g_layerbg" id="GLobalPopLayer_Bg', _t_.dlgindex, '"></div>', '<a class="g_layerclose" id="GLobalPopLayer_Close', _t_.dlgindex, '" href="javascript:;"></a>', '</div>'].join('');
		} else {
			var nh = ['<div class="graybg" id="DlgBgGray', _t_.dlgindex, '"></div>', '<div class="g_layerbody" id="GLobalPopLayer_Body', _t_.dlgindex, '" >', '</div>'].join('');
		}
		_t_.putintotooldlg(nh, "GLobalPopLayer_Body" + _t_.dlgindex);
		if (typeof isdiv == "undefined") {
			_t_.fillFrame();
		}
		if (_t_.defaultskin) {
			Ds.E("GLobalPopLayer_Close" + _t_.dlgindex).onclick = function() {
				_t_.closeWindow();
			};
		}
	};
	_t_.putintotooldlg = function(htmlbody, bodyid) {
		try {
			document.getElementById("GlobalPopToolDlg" + _t_.dlgindex).innerHTML = htmlbody;
		} catch (err) {
			var OD = Ds.addDivToBody('GlobalPopToolDlg' + _t_.dlgindex);
			OD.innerHTML = htmlbody;
		}
		Ds.E(bodyid).style.zIndex = 19999 + (_t_.dlgindex == 0 ? 0 : (_t_.dlgindex + 1));
		Ds.E(bodyid).style.position = "absolute";
		var grayId = Ds.E("DlgBgGray" + _t_.dlgindex);
		if (typeof grayId == "object") {
			var sh = document.documentElement.scrollHeight;
			grayId.style.height = sh + "px";
			if (!_t_.mode) {
				grayId.style.zIndex = 20000;
			}
		}
	};
	_t_.fillFrame = function() {
		if (_t_.src) {
			var nh = '<iframe scrolling="no" frameborder="0" id="GLobalPopLayer_IFrame' + _t_.dlgindex + '" src="" allowtransparency="true" ></iframe>';
			if (_t_.defaultskin) {
				Ds.E("GLobalPopLayer_Container" + _t_.dlgindex).innerHTML = nh;
			} else {
				Ds.E("GLobalPopLayer_Body" + _t_.dlgindex).innerHTML = nh;
			}
			var iframe = Ds.E('GLobalPopLayer_IFrame' + _t_.dlgindex);
			if (iframe.attachEvent) {
				iframe.attachEvent("onload", function() {
					_t_.ReinitIframe(iframe);
				});
			} else {
				iframe.onload = function() {
					_t_.ReinitIframe(iframe);
				}
			}
		}
		Ds.E("GLobalPopLayer_IFrame" + _t_.dlgindex).src = _t_.src;
	};
	_t_.fillDiv = function() {
		if (_t_.src) {
			Ds.E("GLobalPopLayer_Body" + _t_.dlgindex).innerHTML = src;
		}
	};
	_t_.closeWindow = function() {
		Ds.E("GlobalPopToolDlg" + _t_.dlgindex).innerHTML = '';
		if (!_t_.mode) {
			var target = Ds.E("GlobalPopToolDlg" + _t_.dlgindex);
			target.parentNode.removeChild(target);
		}
	};
	_t_.ReinitIframe = function(thisId) {
		var iframe = thisId;
		try {
			var iframec = iframe.contentWindow;
			this.iframeContent = iframec;
			var bHeight = iframec.document.body.scrollHeight;
			var dHeight = iframec.document.documentElement.scrollHeight;
			var bWidth = iframec.document.body.scrollWidth;
			var dWidth = iframec.document.documentElement.scrollWidth;
			var width = Math.max(bWidth, dWidth);
			var height = Math.max(bHeight, dHeight);
			iframe.height = height;
			iframe.width = width;
			iframe.parentNode.style.width = width + "px";
			if (_t_.defaultskin) {
				Ds.E("GLobalPopLayer_Container" + _t_.dlgindex).style.height = height + "px";
				Ds.E("GLobalPopLayer_Bg" + _t_.dlgindex).style.height = (height + 12) + "px";
				Ds.E("GLobalPopLayer_Body" + _t_.dlgindex).style.height = height + "px";
				Ds.E("GLobalPopLayer_Bg" + _t_.dlgindex).style.width = (width + 12) + "px";
				Ds.E("GLobalPopLayer_Body" + _t_.dlgindex).style.width = width + "px";
			} else {
				Ds.E("GLobalPopLayer_Body" + _t_.dlgindex).style.height = height + "px";
			}
			_t_.centerWindow();
		} catch (err) {}
	};
	_t_.centerWindow = function() {
		var bodyid = "GLobalPopLayer_Body" + _t_.dlgindex;
		var bh = (document.documentElement.clientHeight - Ds.E(bodyid).offsetHeight) / 2;
		bh = bh < 0 ? 0 : bh;
		var scrolltop = (document.documentElement.scrollTop || document.body.scrollTop) + bh;
		var bw = Math.abs((document.documentElement.clientWidth - Ds.E(bodyid).offsetWidth) / 2);
		Ds.E(bodyid).style.left = bw + "px";
		Ds.E(bodyid).style.top = scrolltop + "px";
	};
	_t_.ResizeWindow = function(height) {
		var iframe = Ds.E("GLobalPopLayer_IFrame" + _t_.dlgindex);
		if (typeof height == "number") {
			iframe.height = height;
			iframe.parentNode.style.height = height + "px";
			if (_t_.defaultskin) {
				Ds.E("GLobalPopLayer_Bg" + _t_.dlgindex).style.height = (height + 12) + "px";
				Ds.E("GLobalPopLayer_Body" + _t_.dlgindex).style.height = height + "px";
				var grayId = Ds.E("DlgBgGray" + _t_.dlgindex);
				if (typeof grayId == "object") {
					var sh = document.documentElement.scrollHeight;
					grayId.style.height = sh + "px";
				}
			}
			_t_.centerWindow();
		} else {
			_t_.ReinitIframe(iframe);
		}
	};
	_t_.setCloseButtonPosition = function(oft) {
		$("#GLobalPopLayer_Close" + _t_.dlgindex).css(oft);
	};
	_t_.setCallback = function(callback) {
		_t_._callback = callback;
	};
	_t_.CallBack = function(d, isclose) {
		if ($.isFunction(_t_._callback)) {
			_t_._callback(d);
		}
		if (typeof isclose == "undefined" || isclose) {
			_t_.closeWindow();
		}
	}
	_t_.init();
}
Ds.jsfenye = function() {
	var _t_ = this;
	_t_.print = function(cp, allp, callback, showp, param) {
		param = param || 0;
		var cp, allp, showp;
		cp = cp || 1, allp = allp || 1, showp = showp || 5;
		var spl = Math.floor(showp / 2);
		var b = cp - spl <= 0 ? 1 : (cp - spl);
		var e = cp + spl >= allp ? allp : (cp + spl);
		if ((cp + spl) >= allp) {
			b = allp - showp + 1;
		}
		b = b < 1 ? 1 : b;
		showp = showp > allp ? allp : showp;
		var ht = '<div class="if_fenye_body">';
		ht += cp > 1 ? '<a href="javascript:void(0)" onclick="eval(' + callback + '((' + cp + '-1),\'' + param + '\'))">上一页</a>' : "";
		if (b >= 2) {
			ht += '<a href="javascript:void(0)" onclick="eval(' + callback + '(1,\'' + param + '\'))">1</a>';
			if (b > 2) {
				ht += '<span>...</span>';
			}
		}
		for (b; b <= e; b++) {
			if (b == cp) {
				ht += '<a href="javascript:void(0)" class="if_fenye_curr">' + b + '</a>';
			} else {
				ht += '<a href="javascript:void(0)" onclick="eval(' + callback + '(' + b + ',\'' + param + '\'))">' + b + '</a>';
			}
		}
		if (e < allp - 1) {
			ht += '<span>...</span>';
			ht += '<a href="javascript:void(0)" onclick="eval(' + callback + '(' + allp + ',\'' + param + '\'))">' + allp + '</a>';
		}
		ht += cp < allp ? '<a href="javascript:void(0)" onclick="eval(' + callback + '((' + cp + '+1),\'' + param + '\'))">下一页</a>' : "";
		ht += '</div>';
		return ht;
	}
};
Ds.dcom = {
	registcoms: {},
	callc: function(comname, func, param) {
		param = param || '';
		var comobj = Ds.dcom.getcom(comname);
		if (comobj != null) {
			if ($.isFunction(func)) {
				func.call();
			} else {
				try {
					comobj['callouti'](func, param);
				} catch (err) {
					$.alert("组件错误", "error");
				}
			}
		} else {
			Ds.addJsToBodyLast("/static/js/dcoms/dcom_" + comname + ".js", function() {
				var comobj = Ds.dcom.getcom(comname);
				if ($.isFunction(func)) {
					func.call();
				} else {
					try {
						comobj['callouti'](func, param);
					} catch (err) {
						$.alert("组件错误", "error");
					}
				}
			});
		}
	},
	addcom: function(comname, obj) {
		Ds.dcom.registcoms["dom_" + comname] = obj;
		obj.dcomobjstr = "Ds.dcom.registcoms.dom_" + comname;
	},
	getcom: function(comname) {
		return Ds.dcom.registcoms["dom_" + comname] || null;
	},
	removecom: function(comname) {
		Ds.dcom.registcoms["dom_" + comname] = null;
	}
};

if(!$.isEmpty(_W_._)){
	Ds.extend({_:_W_._});
}
if(!$.isEmpty(_W_.Backbone)){
	Ds.extend({BMvc:_W_.Backbone});
}
_W_.Ds=Ds;
_W_.Ds=Ds;

})(window);

