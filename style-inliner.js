(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['sizzle'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('sizzle'));
  } else {
    root.styleInliner = factory(root.Sizzle);
  }
}(this, function(sizzle) {

  function parseQueries(str) {
    return str.replace(/\n/g, '').match(/[^{}]+(?=\{)/g);
  }

  function parseStyles(str) {
    return str.replace(/\n/g, '').match(/[^{}]+(?=\})/g);
  }

  function buildStylesObject(queries, styles) {
    var stylesObj = {};
    for (var i = queries.length - 1; i >= 0; i--) {
      stylesObj[queries[i]] = styles[i];
    }
    return stylesObj;
  }

  function makeStylesInline(stylesObj) {
    for (var query in stylesObj) {
      if (stylesObj.hasOwnProperty(query)) {
        var elements = sizzle(query);
        for (var i = elements.length - 1; i >= 0; i--) {
          elements[i].style.cssText = stylesObj[query];
        }
      }
    }
  }

  function styleInliner(el) {
    var css = sizzle(el)[0].innerHTML,
        queries = parseQueries(css),
        styles = parseStyles(css),
        stylesObj = buildStylesObject(queries, styles);

    makeStylesInline(stylesObj);
    return stylesObj;
  }

  return styleInliner;

}));