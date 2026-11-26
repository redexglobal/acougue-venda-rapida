// polyfills de DOM para TV antiga
(function(){
  function mk(nodes){ var f = document.createDocumentFragment(); for (var i = 0; i < nodes.length; i++){ var n = nodes[i]; f.appendChild(n instanceof Node ? n : document.createTextNode(String(n))); } return f; }
  [Element.prototype, Document.prototype, DocumentFragment.prototype].forEach(function(p){
    if (!p.append) p.append = function(){ this.appendChild(mk(arguments)); };
    if (!p.prepend) p.prepend = function(){ this.insertBefore(mk(arguments), this.firstChild); };
  });
  [Element.prototype, CharacterData.prototype].forEach(function(p){
    if (!p.remove) p.remove = function(){ if (this.parentNode) this.parentNode.removeChild(this); };
    if (!p.before) p.before = function(){ if (this.parentNode) this.parentNode.insertBefore(mk(arguments), this); };
    if (!p.after) p.after = function(){ if (this.parentNode) this.parentNode.insertBefore(mk(arguments), this.nextSibling); };
    if (!p.replaceWith) p.replaceWith = function(){ if (this.parentNode) this.parentNode.replaceChild(mk(arguments), this); };
  });
  if (window.NodeList && !NodeList.prototype.forEach) NodeList.prototype.forEach = Array.prototype.forEach;
  if (!Element.prototype.matches) Element.prototype.matches = Element.prototype.webkitMatchesSelector;
  if (!Element.prototype.closest) Element.prototype.closest = function(s){ var e = this; while (e && e.nodeType === 1){ if (e.matches(s)) return e; e = e.parentElement; } return null; };
  if (!Element.prototype.toggleAttribute) Element.prototype.toggleAttribute = function(n, f){ if (f === undefined) f = !this.hasAttribute(n); if (f) this.setAttribute(n, ''); else this.removeAttribute(n); return f; };
  if (!window.CSS) window.CSS = {}; if (!CSS.supports) CSS.supports = function(){ return false; };
  try { new Event('x'); } catch (e) { window.Event = function(t, o){ var ev = document.createEvent('Event'); ev.initEvent(t, !!(o && o.bubbles), !!(o && o.cancelable)); return ev; }; }
})();
