window['npm:@-ft/mode-codegen'] = (function (
  q,
  M,
  T,
  l,
  d,
  X,
  K,
  C,
  y,
  Y,
  m,
  t,
  H,
) {
  function x(_) {
    return _ == l || _ == d ? _ : X;
  }
  function s(_) {
    t = _;
    T.forEach(function (_) {
      _(t);
    });
    _ = document.querySelector('html').classList;
    if (t == d) _.add(y);
    else _.remove(y);
  }
  function S(_) {
    m = x(_);
    M.forEach(function (_) {
      _(m);
    });
    if (H) q.removeEventListener(C, H);
    H = 0;
    if (m == X) {
      H = h;
      q.addEventListener(C, H);
      s(m == X ? [l, d][+q.matches] : m);
    } else s(m);
    document.cookie = K + '=' + m + '; path=/';
  }
  function h(e) {
    s([l, d][+e.matches]);
  }
  S(
    (function (c, i) {
      for (; i < c.length; i++)
        if (!c[i].indexOf(K + '=')) return c[i].substring(6);
    })(document.cookie.split('; '), 0),
  );
  return {
    getMode: function () {
      return m;
    },
    getTheme: function () {
      return t;
    },
    setMode: S,
    watchMode: function (l, w) {
      w = function (_) {
        l(_);
      };
      w(m);
      M.push(w);
      return function (i) {
        i = M.indexOf(w);
        i >= 0 && M.splice(i, 1);
      };
    },
    watchTheme: function (l, w) {
      w = function (_) {
        l(_);
      };
      w(t);
      T.push(w);
      return function (i) {
        i = T.indexOf(w);
        i >= 0 && T.splice(i, 1);
      };
    },
  };
})(
  window.matchMedia('(prefers-color-scheme: dark)'),
  [],
  [],
  'light',
  'dark',
  'system',
  'theme',
  'change',
  'dark',
);
