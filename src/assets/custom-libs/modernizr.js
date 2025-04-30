/*! modernizr 3.8.0 (Custom Build) | MIT *
 * https://modernizr.com/download/?-webp !*/
!(function (n, e, A) {
  function o(n, e) {
    return typeof n === e;
  }
  function a(n) {
    var e = f.className,
      A = Modernizr._config.classPrefix || "";
    if ((u && (e = e.baseVal), Modernizr._config.enableJSClass)) {
      var o = new RegExp("(^|\\s)" + A + "no-js(\\s|$)");
      e = e.replace(o, "$1" + A + "js$2");
    }
    Modernizr._config.enableClasses &&
      (n.length > 0 && (e += " " + A + n.join(" " + A)), u ? (f.className.baseVal = e) : (f.className = e));
  }
  function t(n, e) {
    if ("object" == typeof n) for (var A in n) r(n, A) && t(A, n[A]);
    else {
      n = n.toLowerCase();
      var o = n.split("."),
        i = Modernizr[o[0]];
      if ((2 === o.length && (i = i[o[1]]), void 0 !== i)) return Modernizr;
      (e = "function" == typeof e ? e() : e),
        1 === o.length
          ? (Modernizr[o[0]] = e)
          : (!Modernizr[o[0]] || Modernizr[o[0]] instanceof Boolean || (Modernizr[o[0]] = new Boolean(Modernizr[o[0]])),
            (Modernizr[o[0]][o[1]] = e)),
        a([(e && !1 !== e ? "" : "no-") + o.join("-")]),
        Modernizr._trigger(n, e);
    }
    return Modernizr;
  }
  var i = [],
    s = {
      _version: "3.8.0",
      _config: { classPrefix: "", enableClasses: !0, enableJSClass: !0, usePrefixes: !0 },
      _q: [],
      on: function (n, e) {
        var A = this;
        setTimeout(function () {
          e(A[n]);
        }, 0);
      },
      addTest: function (n, e, A) {
        i.push({ name: n, fn: e, options: A });
      },
      addAsyncTest: function (n) {
        i.push({ name: null, fn: n });
      },
    },
    Modernizr = function () {};
  (Modernizr.prototype = s), (Modernizr = new Modernizr());
  var r,
    l = [];
  !(function () {
    var n = {}.hasOwnProperty;
    r =
      o(n, "undefined") || o(n.call, "undefined")
        ? function (n, e) {
            return e in n && o(n.constructor.prototype[e], "undefined");
          }
        : function (e, A) {
            return n.call(e, A);
          };
  })();
  var f = e.documentElement,
    u = "svg" === f.nodeName.toLowerCase();
  (s._l = {}),
    (s.on = function (n, e) {
      this._l[n] || (this._l[n] = []),
        this._l[n].push(e),
        Modernizr.hasOwnProperty(n) &&
          setTimeout(function () {
            Modernizr._trigger(n, Modernizr[n]);
          }, 0);
    }),
    (s._trigger = function (n, e) {
      if (this._l[n]) {
        var A = this._l[n];
        setTimeout(function () {
          var n;
          for (n = 0; n < A.length; n++) (0, A[n])(e);
        }, 0),
          delete this._l[n];
      }
    }),
    Modernizr._q.push(function () {
      s.addTest = t;
    }),
    Modernizr.addAsyncTest(function () {
      function n(n, e, A) {
        function o(e) {
          var o = !(!e || "load" !== e.type) && 1 === a.width;
          t(n, "webp" === n && o ? new Boolean(o) : o), A && A(e);
        }
        var a = new Image();
        (a.onerror = o), (a.onload = o), (a.src = e);
      }
      var e = [
          { uri: "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=", name: "webp" },
          {
            uri: "data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA==",
            name: "webp.alpha",
          },
          {
            uri: "data:image/webp;base64,UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA",
            name: "webp.animation",
          },
          { uri: "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=", name: "webp.lossless" },
        ],
        A = e.shift();
      n(A.name, A.uri, function (A) {
        if (A && "load" === A.type) for (var o = 0; o < e.length; o++) n(e[o].name, e[o].uri);
      });
    }),
    (function () {
      var n, e, A, a, t, s, r;
      for (var f in i)
        if (i.hasOwnProperty(f)) {
          if (
            ((n = []),
            (e = i[f]),
            e.name && (n.push(e.name.toLowerCase()), e.options && e.options.aliases && e.options.aliases.length))
          )
            for (A = 0; A < e.options.aliases.length; A++) n.push(e.options.aliases[A].toLowerCase());
          for (a = o(e.fn, "function") ? e.fn() : e.fn, t = 0; t < n.length; t++)
            (s = n[t]),
              (r = s.split(".")),
              1 === r.length
                ? (Modernizr[r[0]] = a)
                : ((Modernizr[r[0]] && (!Modernizr[r[0]] || Modernizr[r[0]] instanceof Boolean)) ||
                    (Modernizr[r[0]] = new Boolean(Modernizr[r[0]])),
                  (Modernizr[r[0]][r[1]] = a)),
              l.push((a ? "" : "no-") + r.join("-"));
        }
    })(),
    delete s.addTest,
    delete s.addAsyncTest;
  for (var c = 0; c < Modernizr._q.length; c++) Modernizr._q[c]();
  n.Modernizr = Modernizr;
})(window, document);
