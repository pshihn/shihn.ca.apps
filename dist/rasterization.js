!function(){"use strict";const t=new WeakMap,e=e=>"function"==typeof e&&t.has(e),i=void 0!==window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,s=(t,e,i=null,s=null)=>{for(;e!==i;){const i=e.nextSibling;t.insertBefore(e,s),e=i}},n=(t,e,i=null)=>{for(;e!==i;){const i=e.nextSibling;t.removeChild(e),e=i}},o={},r={},a=`{{lit-${String(Math.random()).slice(2)}}}`,l=`\x3c!--${a}--\x3e`,c=new RegExp(`${a}|${l}`),h="$lit$";class d{constructor(t,e){this.parts=[],this.element=e;const i=[],s=[],n=document.createTreeWalker(e.content,133,null,!1);let o=0,r=-1,l=0;const{strings:d,values:{length:u}}=t;for(;l<u;){const t=n.nextNode();if(null!==t){if(r++,1===t.nodeType){if(t.hasAttributes()){const e=t.attributes,{length:i}=e;let s=0;for(let t=0;t<i;t++)p(e[t].name,h)&&s++;for(;s-- >0;){const e=d[l],i=g.exec(e)[2],s=i.toLowerCase()+h,n=t.getAttribute(s);t.removeAttribute(s);const o=n.split(c);this.parts.push({type:"attribute",index:r,name:i,strings:o}),l+=o.length-1}}"TEMPLATE"===t.tagName&&(s.push(t),n.currentNode=t.content)}else if(3===t.nodeType){const e=t.data;if(e.indexOf(a)>=0){const s=t.parentNode,n=e.split(c),o=n.length-1;for(let e=0;e<o;e++){let i,o=n[e];if(""===o)i=f();else{const t=g.exec(o);null!==t&&p(t[2],h)&&(o=o.slice(0,t.index)+t[1]+t[2].slice(0,-h.length)+t[3]),i=document.createTextNode(o)}s.insertBefore(i,t),this.parts.push({type:"node",index:++r})}""===n[o]?(s.insertBefore(f(),t),i.push(t)):t.data=n[o],l+=o}}else if(8===t.nodeType)if(t.data===a){const e=t.parentNode;null!==t.previousSibling&&r!==o||(r++,e.insertBefore(f(),t)),o=r,this.parts.push({type:"node",index:r}),null===t.nextSibling?t.data="":(i.push(t),r--),l++}else{let e=-1;for(;-1!==(e=t.data.indexOf(a,e+1));)this.parts.push({type:"node",index:-1}),l++}}else n.currentNode=s.pop()}for(const t of i)t.parentNode.removeChild(t)}}const p=(t,e)=>{const i=t.length-e.length;return i>=0&&t.slice(i)===e},u=t=>-1!==t.index,f=()=>document.createComment(""),g=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;class y{constructor(t,e,i){this.__parts=[],this.template=t,this.processor=e,this.options=i}update(t){let e=0;for(const i of this.__parts)void 0!==i&&i.setValue(t[e]),e++;for(const t of this.__parts)void 0!==t&&t.commit()}_clone(){const t=i?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),e=[],s=this.template.parts,n=document.createTreeWalker(t,133,null,!1);let o,r=0,a=0,l=n.nextNode();for(;r<s.length;)if(o=s[r],u(o)){for(;a<o.index;)a++,"TEMPLATE"===l.nodeName&&(e.push(l),n.currentNode=l.content),null===(l=n.nextNode())&&(n.currentNode=e.pop(),l=n.nextNode());if("node"===o.type){const t=this.processor.handleTextExpression(this.options);t.insertAfterNode(l.previousSibling),this.__parts.push(t)}else this.__parts.push(...this.processor.handleAttributeExpressions(l,o.name,o.strings,this.options));r++}else this.__parts.push(void 0),r++;return i&&(document.adoptNode(t),customElements.upgrade(t)),t}}const m=` ${a} `;class b{constructor(t,e,i,s){this.strings=t,this.values=e,this.type=i,this.processor=s}getHTML(){const t=this.strings.length-1;let e="",i=!1;for(let s=0;s<t;s++){const t=this.strings[s],n=t.lastIndexOf("\x3c!--");i=(n>-1||i)&&-1===t.indexOf("--\x3e",n+1);const o=g.exec(t);e+=null===o?t+(i?m:l):t.substr(0,o.index)+o[1]+o[2]+h+o[3]+a}return e+=this.strings[t],e}getTemplateElement(){const t=document.createElement("template");return t.innerHTML=this.getHTML(),t}}class v extends b{getHTML(){return`<svg>${super.getHTML()}</svg>`}getTemplateElement(){const t=super.getTemplateElement(),e=t.content,i=e.firstChild;return e.removeChild(i),s(e,i.firstChild),t}}const x=t=>null===t||!("object"==typeof t||"function"==typeof t),w=t=>Array.isArray(t)||!(!t||!t[Symbol.iterator]);class _{constructor(t,e,i){this.dirty=!0,this.element=t,this.name=e,this.strings=i,this.parts=[];for(let t=0;t<i.length-1;t++)this.parts[t]=this._createPart()}_createPart(){return new S(this)}_getValue(){const t=this.strings,e=t.length-1;let i="";for(let s=0;s<e;s++){i+=t[s];const e=this.parts[s];if(void 0!==e){const t=e.value;if(x(t)||!w(t))i+="string"==typeof t?t:String(t);else for(const e of t)i+="string"==typeof e?e:String(e)}}return i+=t[e],i}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class S{constructor(t){this.value=void 0,this.committer=t}setValue(t){t===o||x(t)&&t===this.value||(this.value=t,e(t)||(this.committer.dirty=!0))}commit(){for(;e(this.value);){const t=this.value;this.value=o,t(this)}this.value!==o&&this.committer.commit()}}class P{constructor(t){this.value=void 0,this.__pendingValue=void 0,this.options=t}appendInto(t){this.startNode=t.appendChild(f()),this.endNode=t.appendChild(f())}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling}appendIntoPart(t){t.__insert(this.startNode=f()),t.__insert(this.endNode=f())}insertAfterPart(t){t.__insert(this.startNode=f()),this.endNode=t.endNode,t.endNode=this.startNode}setValue(t){this.__pendingValue=t}commit(){for(;e(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=o,t(this)}const t=this.__pendingValue;t!==o&&(x(t)?t!==this.value&&this.__commitText(t):t instanceof b?this.__commitTemplateResult(t):t instanceof Node?this.__commitNode(t):w(t)?this.__commitIterable(t):t===r?(this.value=r,this.clear()):this.__commitText(t))}__insert(t){this.endNode.parentNode.insertBefore(t,this.endNode)}__commitNode(t){this.value!==t&&(this.clear(),this.__insert(t),this.value=t)}__commitText(t){const e=this.startNode.nextSibling,i="string"==typeof(t=null==t?"":t)?t:String(t);e===this.endNode.previousSibling&&3===e.nodeType?e.data=i:this.__commitNode(document.createTextNode(i)),this.value=t}__commitTemplateResult(t){const e=this.options.templateFactory(t);if(this.value instanceof y&&this.value.template===e)this.value.update(t.values);else{const i=new y(e,t.processor,this.options),s=i._clone();i.update(t.values),this.__commitNode(s),this.value=i}}__commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());const e=this.value;let i,s=0;for(const n of t)i=e[s],void 0===i&&(i=new P(this.options),e.push(i),0===s?i.appendIntoPart(this):i.insertAfterPart(e[s-1])),i.setValue(n),i.commit(),s++;s<e.length&&(e.length=s,this.clear(i&&i.endNode))}clear(t=this.startNode){n(this.startNode.parentNode,t.nextSibling,this.endNode)}}class C{constructor(t,e,i){if(this.value=void 0,this.__pendingValue=void 0,2!==i.length||""!==i[0]||""!==i[1])throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=e,this.strings=i}setValue(t){this.__pendingValue=t}commit(){for(;e(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=o,t(this)}if(this.__pendingValue===o)return;const t=!!this.__pendingValue;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=t),this.__pendingValue=o}}class k extends _{constructor(t,e,i){super(t,e,i),this.single=2===i.length&&""===i[0]&&""===i[1]}_createPart(){return new $(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class $ extends S{}let j=!1;try{const t={get capture(){return j=!0,!1}};window.addEventListener("test",t,t),window.removeEventListener("test",t,t)}catch(t){}class E{constructor(t,e,i){this.value=void 0,this.__pendingValue=void 0,this.element=t,this.eventName=e,this.eventContext=i,this.__boundHandleEvent=t=>this.handleEvent(t)}setValue(t){this.__pendingValue=t}commit(){for(;e(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=o,t(this)}if(this.__pendingValue===o)return;const t=this.__pendingValue,i=this.value,s=null==t||null!=i&&(t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive),n=null!=t&&(null==i||s);s&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),n&&(this.__options=A(t),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=t,this.__pendingValue=o}handleEvent(t){"function"==typeof this.value?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t)}}const A=t=>t&&(j?{capture:t.capture,passive:t.passive,once:t.once}:t.capture);const N=new class{handleAttributeExpressions(t,e,i,s){const n=e[0];if("."===n){return new k(t,e.slice(1),i).parts}return"@"===n?[new E(t,e.slice(1),s.eventContext)]:"?"===n?[new C(t,e.slice(1),i)]:new _(t,e,i).parts}handleTextExpression(t){return new P(t)}};function M(t){let e=R.get(t.type);void 0===e&&(e={stringsArray:new WeakMap,keyString:new Map},R.set(t.type,e));let i=e.stringsArray.get(t.strings);if(void 0!==i)return i;const s=t.strings.join(a);return i=e.keyString.get(s),void 0===i&&(i=new d(t,t.getTemplateElement()),e.keyString.set(s,i)),e.stringsArray.set(t.strings,i),i}const R=new Map,T=new WeakMap;(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.1.2");const O=(t,...e)=>new b(t,e,"html",N),z=(t,...e)=>new v(t,e,"svg",N),L=133;function V(t,e){const{element:{content:i},parts:s}=t,n=document.createTreeWalker(i,L,null,!1);let o=H(s),r=s[o],a=-1,l=0;const c=[];let h=null;for(;n.nextNode();){a++;const t=n.currentNode;for(t.previousSibling===h&&(h=null),e.has(t)&&(c.push(t),null===h&&(h=t)),null!==h&&l++;void 0!==r&&r.index===a;)r.index=null!==h?-1:r.index-l,o=H(s,o),r=s[o]}c.forEach(t=>t.parentNode.removeChild(t))}const U=t=>{let e=11===t.nodeType?0:1;const i=document.createTreeWalker(t,L,null,!1);for(;i.nextNode();)e++;return e},H=(t,e=-1)=>{for(let i=e+1;i<t.length;i++){const e=t[i];if(u(e))return i}return-1};const D=(t,e)=>`${t}--${e}`;let B=!0;void 0===window.ShadyCSS?B=!1:void 0===window.ShadyCSS.prepareTemplateDom&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),B=!1);const q=t=>e=>{const i=D(e.type,t);let s=R.get(i);void 0===s&&(s={stringsArray:new WeakMap,keyString:new Map},R.set(i,s));let n=s.stringsArray.get(e.strings);if(void 0!==n)return n;const o=e.strings.join(a);if(n=s.keyString.get(o),void 0===n){const i=e.getTemplateElement();B&&window.ShadyCSS.prepareTemplateDom(i,t),n=new d(e,i),s.keyString.set(o,n)}return s.stringsArray.set(e.strings,n),n},I=["html","svg"],G=new Set,F=(t,e,i)=>{G.add(t);const s=i?i.element:document.createElement("template"),n=e.querySelectorAll("style"),{length:o}=n;if(0===o)return void window.ShadyCSS.prepareTemplateStyles(s,t);const r=document.createElement("style");for(let t=0;t<o;t++){const e=n[t];e.parentNode.removeChild(e),r.textContent+=e.textContent}(t=>{I.forEach(e=>{const i=R.get(D(e,t));void 0!==i&&i.keyString.forEach(t=>{const{element:{content:e}}=t,i=new Set;Array.from(e.querySelectorAll("style")).forEach(t=>{i.add(t)}),V(t,i)})})})(t);const a=s.content;i?function(t,e,i=null){const{element:{content:s},parts:n}=t;if(null==i)return void s.appendChild(e);const o=document.createTreeWalker(s,L,null,!1);let r=H(n),a=0,l=-1;for(;o.nextNode();){for(l++,o.currentNode===i&&(a=U(e),i.parentNode.insertBefore(e,i));-1!==r&&n[r].index===l;){if(a>0){for(;-1!==r;)n[r].index+=a,r=H(n,r);return}r=H(n,r)}}}(i,r,a.firstChild):a.insertBefore(r,a.firstChild),window.ShadyCSS.prepareTemplateStyles(s,t);const l=a.querySelector("style");if(window.ShadyCSS.nativeShadow&&null!==l)e.insertBefore(l.cloneNode(!0),e.firstChild);else if(i){a.insertBefore(r,a.firstChild);const t=new Set;t.add(r),V(i,t)}};window.JSCompiler_renameProperty=(t,e)=>t;const W={toAttribute(t,e){switch(e){case Boolean:return t?"":null;case Object:case Array:return null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){switch(e){case Boolean:return null!==t;case Number:return null===t?null:Number(t);case Object:case Array:return JSON.parse(t)}return t}},J=(t,e)=>e!==t&&(e==e||t==t),X={attribute:!0,type:String,converter:W,reflect:!1,hasChanged:J},Y=Promise.resolve(!0),Q=1,K=4,Z=8,tt=16,et=32,it="finalized";class st extends HTMLElement{constructor(){super(),this._updateState=0,this._instanceProperties=void 0,this._updatePromise=Y,this._hasConnectedResolver=void 0,this._changedProperties=new Map,this._reflectingProperties=void 0,this.initialize()}static get observedAttributes(){this.finalize();const t=[];return this._classProperties.forEach((e,i)=>{const s=this._attributeNameForProperty(i,e);void 0!==s&&(this._attributeToPropertyMap.set(s,i),t.push(s))}),t}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;const t=Object.getPrototypeOf(this)._classProperties;void 0!==t&&t.forEach((t,e)=>this._classProperties.set(e,t))}}static createProperty(t,e=X){if(this._ensureClassProperties(),this._classProperties.set(t,e),e.noAccessor||this.prototype.hasOwnProperty(t))return;const i="symbol"==typeof t?Symbol():`__${t}`;Object.defineProperty(this.prototype,t,{get(){return this[i]},set(e){const s=this[t];this[i]=e,this._requestUpdate(t,s)},configurable:!0,enumerable:!0})}static finalize(){const t=Object.getPrototypeOf(this);if(t.hasOwnProperty(it)||t.finalize(),this[it]=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){const t=this.properties,e=[...Object.getOwnPropertyNames(t),..."function"==typeof Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(t):[]];for(const i of e)this.createProperty(i,t[i])}}static _attributeNameForProperty(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}static _valueHasChanged(t,e,i=J){return i(t,e)}static _propertyValueFromAttribute(t,e){const i=e.type,s=e.converter||W,n="function"==typeof s?s:s.fromAttribute;return n?n(t,i):t}static _propertyValueToAttribute(t,e){if(void 0===e.reflect)return;const i=e.type,s=e.converter;return(s&&s.toAttribute||W.toAttribute)(t,i)}initialize(){this._saveInstanceProperties(),this._requestUpdate()}_saveInstanceProperties(){this.constructor._classProperties.forEach((t,e)=>{if(this.hasOwnProperty(e)){const t=this[e];delete this[e],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(e,t)}})}_applyInstanceProperties(){this._instanceProperties.forEach((t,e)=>this[e]=t),this._instanceProperties=void 0}connectedCallback(){this._updateState=this._updateState|et,this._hasConnectedResolver&&(this._hasConnectedResolver(),this._hasConnectedResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(t,e,i){e!==i&&this._attributeToProperty(t,i)}_propertyToAttribute(t,e,i=X){const s=this.constructor,n=s._attributeNameForProperty(t,i);if(void 0!==n){const t=s._propertyValueToAttribute(e,i);if(void 0===t)return;this._updateState=this._updateState|Z,null==t?this.removeAttribute(n):this.setAttribute(n,t),this._updateState=this._updateState&~Z}}_attributeToProperty(t,e){if(this._updateState&Z)return;const i=this.constructor,s=i._attributeToPropertyMap.get(t);if(void 0!==s){const t=i._classProperties.get(s)||X;this._updateState=this._updateState|tt,this[s]=i._propertyValueFromAttribute(e,t),this._updateState=this._updateState&~tt}}_requestUpdate(t,e){let i=!0;if(void 0!==t){const s=this.constructor,n=s._classProperties.get(t)||X;s._valueHasChanged(this[t],e,n.hasChanged)?(this._changedProperties.has(t)||this._changedProperties.set(t,e),!0!==n.reflect||this._updateState&tt||(void 0===this._reflectingProperties&&(this._reflectingProperties=new Map),this._reflectingProperties.set(t,n))):i=!1}!this._hasRequestedUpdate&&i&&this._enqueueUpdate()}requestUpdate(t,e){return this._requestUpdate(t,e),this.updateComplete}async _enqueueUpdate(){let t,e;this._updateState=this._updateState|K;const i=this._updatePromise;this._updatePromise=new Promise((i,s)=>{t=i,e=s});try{await i}catch(t){}this._hasConnected||await new Promise(t=>this._hasConnectedResolver=t);try{const t=this.performUpdate();null!=t&&await t}catch(t){e(t)}t(!this._hasRequestedUpdate)}get _hasConnected(){return this._updateState&et}get _hasRequestedUpdate(){return this._updateState&K}get hasUpdated(){return this._updateState&Q}performUpdate(){this._instanceProperties&&this._applyInstanceProperties();let t=!1;const e=this._changedProperties;try{t=this.shouldUpdate(e),t&&this.update(e)}catch(e){throw t=!1,e}finally{this._markUpdated()}t&&(this._updateState&Q||(this._updateState=this._updateState|Q,this.firstUpdated(e)),this.updated(e))}_markUpdated(){this._changedProperties=new Map,this._updateState=this._updateState&~K}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this._updatePromise}shouldUpdate(t){return!0}update(t){void 0!==this._reflectingProperties&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach((t,e)=>this._propertyToAttribute(e,this[e],t)),this._reflectingProperties=void 0)}updated(t){}firstUpdated(t){}}st[it]=!0;const nt=t=>e=>"function"==typeof e?((t,e)=>(window.customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:i,elements:s}=e;return{kind:i,elements:s,finisher(e){window.customElements.define(t,e)}}})(t,e),ot=(t,e)=>"method"!==e.kind||!e.descriptor||"value"in e.descriptor?{kind:"field",key:Symbol(),placement:"own",descriptor:{},initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(i){i.createProperty(e.key,t)}}:Object.assign({},e,{finisher(i){i.createProperty(e.key,t)}}),rt=(t,e,i)=>{e.constructor.createProperty(i,t)};function at(t){return(e,i)=>void 0!==i?rt(t,e,i):ot(t,e)}function lt(t){return(e,i)=>{const s={get(){return this.renderRoot.querySelector(t)},enumerable:!0,configurable:!0};return void 0!==i?ct(s,e,i):ht(s,e)}}const ct=(t,e,i)=>{Object.defineProperty(e,i,t)},ht=(t,e)=>({kind:"method",placement:"prototype",key:e.key,descriptor:t}),dt="adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,pt=Symbol();class ut{constructor(t,e){if(e!==pt)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){return void 0===this._styleSheet&&(dt?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}}const ft=(t,...e)=>{const i=e.reduce((e,i,s)=>e+(t=>{if(t instanceof ut)return t.cssText;if("number"==typeof t)return t;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${t}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`)})(i)+t[s+1],t[0]);return new ut(i,pt)};(window.litElementVersions||(window.litElementVersions=[])).push("2.2.1");const gt=t=>t.flat?t.flat(1/0):function t(e,i=[]){for(let s=0,n=e.length;s<n;s++){const n=e[s];Array.isArray(n)?t(n,i):i.push(n)}return i}(t);class yt extends st{static finalize(){super.finalize.call(this),this._styles=this.hasOwnProperty(JSCompiler_renameProperty("styles",this))?this._getUniqueStyles():this._styles||[]}static _getUniqueStyles(){const t=this.styles,e=[];if(Array.isArray(t)){gt(t).reduceRight((t,e)=>(t.add(e),t),new Set).forEach(t=>e.unshift(t))}else t&&e.push(t);return e}initialize(){super.initialize(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow({mode:"open"})}adoptStyles(){const t=this.constructor._styles;0!==t.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?dt?this.renderRoot.adoptedStyleSheets=t.map(t=>t.styleSheet):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(t.map(t=>t.cssText),this.localName))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}update(t){super.update(t);const e=this.render();e instanceof b&&this.constructor.render(e,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach(t=>{const e=document.createElement("style");e.textContent=t.cssText,this.renderRoot.appendChild(e)}))}render(){}}yt.finalized=!0,yt.render=(t,e,i)=>{if(!i||"object"!=typeof i||!i.scopeName)throw new Error("The `scopeName` option is required.");const s=i.scopeName,o=T.has(e),r=B&&11===e.nodeType&&!!e.host,a=r&&!G.has(s),l=a?document.createDocumentFragment():e;if(((t,e,i)=>{let s=T.get(e);void 0===s&&(n(e,e.firstChild),T.set(e,s=new P(Object.assign({templateFactory:M},i))),s.appendInto(e)),s.setValue(t),s.commit()})(t,l,Object.assign({templateFactory:q(s)},i)),a){const t=T.get(l);T.delete(l);const i=t.value instanceof y?t.value.template:void 0;F(s,l,i),n(e,e.firstChild),e.appendChild(l),T.set(e,t)}!o&&r&&window.ShadyCSS.styleElement(e.host)};const mt=ft`
.layout.horizontal,
.layout.vertical {
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
}
.layout.horizontal {
  -ms-flex-direction: row;
  -webkit-flex-direction: row;
  flex-direction: row;
}
.layout.vertical {
  -ms-flex-direction: column;
  -webkit-flex-direction: column;
  flex-direction: column;
}
.layout.center {
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}
.layout.wrap {
  -ms-flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
  flex-wrap: wrap;
}
.flex {
  -ms-flex: 1 1 0.000000001px;
  -webkit-flex: 1;
  flex: 1;
  -webkit-flex-basis: 0.000000001px;
  flex-basis: 0.000000001px;
}
`,bt=(t,e)=>{const i=t.startNode.parentNode,s=void 0===e?t.endNode:e.startNode,n=i.insertBefore(f(),s);i.insertBefore(f(),s);const o=new P(t.options);return o.insertAfterNode(n),o},vt=(t,e)=>(t.setValue(e),t.commit(),t),xt=(t,e,i)=>{const n=t.startNode.parentNode,o=i?i.startNode:t.endNode,r=e.endNode.nextSibling;r!==o&&s(n,e.startNode,r,o)},wt=t=>{n(t.startNode.parentNode,t.startNode,t.endNode.nextSibling)},_t=(t,e,i)=>{const s=new Map;for(let n=e;n<=i;n++)s.set(t[n],n);return s},St=new WeakMap,Pt=new WeakMap,Ct=(e=>(...i)=>{const s=e(...i);return t.set(s,!0),s})((t,e,i)=>{let s;return void 0===i?i=e:void 0!==e&&(s=e),e=>{if(!(e instanceof P))throw new Error("repeat can only be used in text bindings");const n=St.get(e)||[],o=Pt.get(e)||[],r=[],a=[],l=[];let c,h,d=0;for(const e of t)l[d]=s?s(e,d):d,a[d]=i(e,d),d++;let p=0,u=n.length-1,f=0,g=a.length-1;for(;p<=u&&f<=g;)if(null===n[p])p++;else if(null===n[u])u--;else if(o[p]===l[f])r[f]=vt(n[p],a[f]),p++,f++;else if(o[u]===l[g])r[g]=vt(n[u],a[g]),u--,g--;else if(o[p]===l[g])r[g]=vt(n[p],a[g]),xt(e,n[p],r[g+1]),p++,g--;else if(o[u]===l[f])r[f]=vt(n[u],a[f]),xt(e,n[u],n[p]),u--,f++;else if(void 0===c&&(c=_t(l,f,g),h=_t(o,p,u)),c.has(o[p]))if(c.has(o[u])){const t=h.get(l[f]),i=void 0!==t?n[t]:null;if(null===i){const t=bt(e,n[p]);vt(t,a[f]),r[f]=t}else r[f]=vt(i,a[f]),xt(e,i,n[p]),n[t]=null;f++}else wt(n[u]),u--;else wt(n[p]),p++;for(;f<=g;){const t=bt(e,r[g+1]);vt(t,a[f]),r[f++]=t}for(;p<=u;){const t=n[p++];null!==t&&wt(t)}St.set(e,r),Pt.set(e,l)}});class kt{constructor(t){this.id=-1,this.nativePointer=t,this.pageX=t.pageX,this.pageY=t.pageY,this.clientX=t.clientX,this.clientY=t.clientY,self.Touch&&t instanceof Touch?this.id=t.identifier:$t(t)&&(this.id=t.pointerId)}getCoalesced(){return"getCoalescedEvents"in this.nativePointer?this.nativePointer.getCoalescedEvents().map(t=>new kt(t)):[this]}}const $t=t=>self.PointerEvent&&t instanceof PointerEvent,jt=()=>{};class Et{constructor(t,e){this._element=t,this.startPointers=[],this.currentPointers=[];const{start:i=(()=>!0),move:s=jt,end:n=jt}=e;this._startCallback=i,this._moveCallback=s,this._endCallback=n,this._pointerStart=this._pointerStart.bind(this),this._touchStart=this._touchStart.bind(this),this._move=this._move.bind(this),this._triggerPointerEnd=this._triggerPointerEnd.bind(this),this._pointerEnd=this._pointerEnd.bind(this),this._touchEnd=this._touchEnd.bind(this),self.PointerEvent?this._element.addEventListener("pointerdown",this._pointerStart):(this._element.addEventListener("mousedown",this._pointerStart),this._element.addEventListener("touchstart",this._touchStart),this._element.addEventListener("touchmove",this._move),this._element.addEventListener("touchend",this._touchEnd))}_triggerPointerStart(t,e){return!!this._startCallback(t,e)&&(this.currentPointers.push(t),this.startPointers.push(t),!0)}_pointerStart(t){0===t.button&&this._triggerPointerStart(new kt(t),t)&&($t(t)?(this._element.setPointerCapture(t.pointerId),this._element.addEventListener("pointermove",this._move),this._element.addEventListener("pointerup",this._pointerEnd)):(window.addEventListener("mousemove",this._move),window.addEventListener("mouseup",this._pointerEnd)))}_touchStart(t){for(const e of Array.from(t.changedTouches))this._triggerPointerStart(new kt(e),t)}_move(t){const e=this.currentPointers.slice(),i="changedTouches"in t?Array.from(t.changedTouches).map(t=>new kt(t)):[new kt(t)],s=[];for(const t of i){const e=this.currentPointers.findIndex(e=>e.id===t.id);-1!==e&&(s.push(t),this.currentPointers[e]=t)}0!==s.length&&this._moveCallback(e,s,t)}_triggerPointerEnd(t,e){const i=this.currentPointers.findIndex(e=>e.id===t.id);return-1!==i&&(this.currentPointers.splice(i,1),this.startPointers.splice(i,1),this._endCallback(t,e),!0)}_pointerEnd(t){if(this._triggerPointerEnd(new kt(t),t))if($t(t)){if(this.currentPointers.length)return;this._element.removeEventListener("pointermove",this._move),this._element.removeEventListener("pointerup",this._pointerEnd)}else window.removeEventListener("mousemove",this._move),window.removeEventListener("mouseup",this._pointerEnd)}_touchEnd(t){for(const e of Array.from(t.changedTouches))this._triggerPointerEnd(new kt(e),t)}}var At=function(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r},Nt=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};const Mt="http://www.w3.org/2000/svg";let Rt=class extends yt{constructor(){super(...arguments),this.width=520,this.height=200,this.filler="",this.handles=[],this.cells=[],this.cellSize=20,this.cols=0,this.rows=0}render(){return O`
    <style>
      :host {
        display: block;
        margin: 0 auto;
      }
      svg {
        display: block;
        width: 100%;
        box-sizing: border-box;
      }
      #grid rect {
        fill: hsl(200,20%,90%);
      }
      #grid rect.filled {
        fill: rgba(216, 27, 96, 0.8);
      }
      #handles .handle {
        fill: rgba(255,255,255,0.8);
        stroke: black;
        stroke-width: 0.03px;
        pointer-events: all;
        cursor: move;
        touch-action: none;
      }
      #drawLayer > * {
        stroke: rgba(255,255,255,0.8);
        stroke-width: 1px;
        fill: none;
      }
      text {
        display: none;
      }
      text.filled {
        display: initial;
      }
      #emojiLayer {
        display: none;
      }

      svg.emojify {
        background: hsl(200,20%,90%);
      }
      .emojify #grid {
        display: none;
      }
      .emojify #emojiLayer {
        display: initial;
      }
      .emojify #handles .handle {
        fill: rgba(0,0,255,0.8);
      }
      .emojify #drawLayer > * {
        stroke: rgba(0,0,0,0);
      }
    </style>
    <svg viewBox="0,0,${this.width},${this.height}" class="${this.filler?"emojify":""}">
      <g id="grid" transform="translate(0.5, 0.5) scale(${this.cellSize}) translate(0.5, 0.5)">
      ${Ct(this.cells,t=>`${t.x},${t.y}`,t=>z`
        <rect class="${t.filled?"filled":""}" transform="translate(${t.x},${t.y}) translate(-0.5, -0.5)" width="0.95" height="0.95"></rect>
      `)}
      </g>
      <g id="emojiLayer">
      ${Ct(this.cells,t=>`${t.x},${t.y}`,t=>z`
        <text class="${t.filled?"filled":""}" style="font-size: ${this.cellSize}px;" x="0" y="0" transform="translate(${20*t.x}, ${20*t.y+18})">${this.filler}</text>
      `)}
      </g>
      <g id="drawLayer"></g>
      <g id="handles"></g>
    </svg>
    `}updated(t){(t.has("width")||t.has("height"))&&this.refreshGrid()}refreshGrid(){this.rows=Math.floor(this.height/this.cellSize),this.cols=Math.floor(this.width/this.cellSize),this.cells=[];for(let t=0;t<this.rows;t++)for(let e=0;e<this.cols;e++)this.cells.push({x:e,y:t,filled:!1})}pixelCoords(t){return[Math.floor(t[0]/this.cellSize),Math.floor(t[1]/this.cellSize)]}pixelCoordsInv(t){return[t[0]*this.cellSize+this.cellSize/2,t[1]*this.cellSize+this.cellSize/2]}setPixel(t,e,i){const s=this.cols*e+t,n=this.cells[s];n&&n.filled!==i&&(n.filled=i,this.requestUpdate())}draw(t,e){const i=this.drawLayer.ownerDocument.createElementNS(Mt,t);if(e)for(const[t,s]of e)i.setAttribute(t,s);return this.drawLayer.appendChild(i),i}addHandle(t,e,i,s=!1,n=!1){if(this.handlesGroup){const[o,r]=[e*this.cellSize+this.cellSize/2,i*this.cellSize+this.cellSize/2],a=this.handlesGroup.ownerDocument.createElementNS(Mt,"circle");a.setAttribute("class","handle"),a.setAttribute("r","5"),a.setAttribute("cx",`${o}`),a.setAttribute("cy",`${r}`),a.dataset.id=t,this.handlesGroup.appendChild(a);const l=this.svg;let c=l.createSVGPoint();c.x=o,c.y=r,c=c.matrixTransform(l.getScreenCTM());const h={id:t,circle:a,x:c.x,y:c.y,cx:o,cy:r};this.handles.push(h);const[d,p]=[this.width,this.height],u=()=>{this.dispatchEvent(new CustomEvent("handle-move",{bubbles:!0,composed:!0,detail:{handle:h}}))},f=new Et(a,{move(t,e){if(1===t.length&&1===e.length){const t=l.createSVGPoint();if(t.x=e[0].clientX,t.y=e[0].clientY,s){h.x=t.x;const e=t.matrixTransform(l.getScreenCTM().inverse());h.cx=Math.max(0,Math.min(d,e.x)),a.setAttribute("cx",`${h.cx}`)}else if(n){h.y=t.y;const e=t.matrixTransform(l.getScreenCTM().inverse());h.cy=Math.max(0,Math.min(p,e.y)),a.setAttribute("cy",`${h.cy}`)}else{h.x=t.x,h.y=t.y;const e=t.matrixTransform(l.getScreenCTM().inverse());[h.cx,h.cy]=[Math.max(0,Math.min(d,e.x)),Math.max(0,Math.min(p,e.y))],a.setAttribute("cx",`${h.cx}`),a.setAttribute("cy",`${h.cy}`)}u()}}});return a._tracker=f,a}return null}};At([at({type:Number}),Nt("design:type",Object)],Rt.prototype,"width",void 0),At([at({type:Number}),Nt("design:type",Object)],Rt.prototype,"height",void 0),At([at(),Nt("design:type",Object)],Rt.prototype,"filler",void 0),At([at(),Nt("design:type",Array)],Rt.prototype,"handles",void 0),At([at(),Nt("design:type",Array)],Rt.prototype,"cells",void 0),At([lt("#handles"),Nt("design:type",SVGGElement)],Rt.prototype,"handlesGroup",void 0),At([lt("svg"),Nt("design:type",SVGSVGElement)],Rt.prototype,"svg",void 0),At([lt("#drawLayer"),Nt("design:type",SVGSVGElement)],Rt.prototype,"drawLayer",void 0),Rt=At([nt("cell-canvas")],Rt);var Tt=function(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r},Ot=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let zt=class extends yt{constructor(){super(...arguments),this.checked=!1}static get styles(){return ft`
    :host {
      display: inline-block;
    }
    button {
      background: none;
      cursor: pointer;
      outline: none;
      border: none;
      padding: 10px;
      color: inherit;
      user-select: none;
      position: relative;
    }
    #track {
      box-sizing: border-box;
      width: 32px;
      height: 14px;
      opacity: 0.38;
      border-width: 1px;
      border-style: solid;
      border-color: initial;
      border-image: initial;
      border-radius: 7px;
      transition: opacity 90ms cubic-bezier(0.4, 0, 0.2, 1) 0s, background-color 90ms cubic-bezier(0.4, 0, 0.2, 1) 0s, border-color 90ms cubic-bezier(0.4, 0, 0.2, 1) 0s;
      background-color: var(--soso-switch-track-color, rgb(0, 0, 0));
      border-color: var(--soso-switch-track-color, rgb(0, 0, 0));
      pointer-events: none;
    }
    #thumb {
      position: relative;
      box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
      box-sizing: border-box;
      width: 20px;
      height: 20px;
      pointer-events: none;
      border-width: 10px;
      border-style: solid;
      border-color: initial;
      border-image: initial;
      border-radius: 50%;
      background-color: var(--soso-switch-thumb-off-color, rgb(255, 255, 255));
      border-color: var(--soso-switch-thumb-off-color, rgb(255, 255, 255));
      transition: background-color 90ms cubic-bezier(0.4, 0, 0.2, 1) 0s, border-color 90ms cubic-bezier(0.4, 0, 0.2, 1) 0s;
    }
    #thumbPanel {
      position: absolute;
      top: 7px;
      left: 0;
      transition: transform 90ms cubic-bezier(0.4, 0, 0.2, 1) 0s;
      transform: translateX(0px);
      will-change: transform;
    }
    #thumbPanel::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 40px;
      height: 40px;
      background-color: var(--soso-switch-track-color, rgb(0, 0, 0));
      opacity: 0;
      border-radius: 50%;
      transition: opacity 90ms cubic-bezier(0.4, 0, 0.2, 1) 0s, background-color 90ms cubic-bezier(0.4, 0, 0.2, 1) 0s;
      pointer-events: none;
    }

    button:focus #thumbPanel::before {
      opacity: 0.08;
    }
    button:active #thumbPanel::before {
      opacity: 0.22;
    }

    button.checked  #track {
      background-color: var(--soso-highlight-color, #018786);
      border-color: var(--soso-highlight-color, #018786);
      opacity: 0.54;
    }
    button.checked #thumb {
      background-color: var(--soso-highlight-color, #018786);
      border-color: var(--soso-highlight-color, #018786);
    }
    button.checked #thumbPanel {
      transform: translateX(32px);
    }
    button.checked #thumbPanel::before {
      background-color: var(--soso-highlight-color, #018786);
    }

    @media (hover: hover) {
      button:hover #thumbPanel::before {
        opacity: 0.06;
      }
      button:focus #thumbPanel::before {
        opacity: 0.08;
      }
      button:active #thumbPanel::before {
        opacity: 0.22;
      }
    }
    `}render(){return O`
    <button role="switch" class="${this.checked?"checked":"unchecked"}" @click="${this.toggle}">
      <div id="track"></div>
      <div id="thumbPanel">
        <div id="thumb"></div>
      </div>
    </button>
    `}toggle(){this.checked=!this.checked,function(t,e,i,s=!0,n=!0){if(e){const o={bubbles:"boolean"!=typeof s||s,composed:"boolean"!=typeof n||n};i&&(o.detail=i);const r=window.SlickCustomEvent||CustomEvent;t.dispatchEvent(new r(e,o))}}(this,"change",{checked:this.checked})}};Tt([at({type:Boolean}),Ot("design:type",Object)],zt.prototype,"checked",void 0),zt=Tt([nt("soso-switch")],zt);var Lt=function(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r},Vt=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let Ut=class extends yt{constructor(){super(...arguments),this.emojify=!1,this.points=[]}static get styles(){return mt}render(){return O`
    <style>
      :host {
        display: block;
        --soso-highlight-color: var(--highlight-blue);
      }
      .bar {
        padding: 6px 8px;
      }
      label {
        font-size: 13px;
        font-family: sans-serif;
        text-transform: capitalize;
        color: #808080;
        letter-spacing: 0.5px;
        font-weight: 400;
        margin-right: 12px;
      }
      #caption {
        padding: 8px;
        text-align: center;
        font-style: italic;
        font-family: sans-serif;
        font-size: 15px;
        font-weight: 300;
        color: #555;
      }
    </style>
    <div class="bar horizontal layout center">
      <div class="flex"></div>
      <label>Draw using emoji</label>
      <soso-switch @change="${t=>this.emojify=t.detail.checked}"></soso-switch>
    </div>
    <cell-canvas .filler="${this.emojify?"😀":""}" @handle-move="${this.updateLine}"></cell-canvas>
    <div id="caption">Move the endpoints to change the line</div>
    `}firstUpdated(){const t=this.canvas;t.updateComplete.then(()=>{t.addHandle("a",4,4),t.addHandle("b",10,4),this.line=t.draw("line"),this.updateLine()})}updateLine(){if(this.line){const t=this.canvas,e=t.handles,[i,s,n,o]=[e[0].cx,e[0].cy,e[1].cx,e[1].cy];this.line.setAttribute("x1",`${i}`),this.line.setAttribute("y1",`${s}`),this.line.setAttribute("x2",`${n}`),this.line.setAttribute("y2",`${o}`),this.drawLine(t.pixelCoords([i,s]),t.pixelCoords([n,o]))}}drawLine(t,e){const i=this.canvas;for(const t of this.points)i.setPixel(t[0],t[1],!1);const[s,n,o,r]=[...t,...e];this.points=[];const a=r-n,l=o-s,c=Math.max(Math.abs(l),Math.abs(a)),h=0===c?0:1/c,d=l*h,p=a*h;let u=s,f=n;this.points.push([Math.round(u),Math.round(f)]);for(let t=0;t<c;t++)u+=d,f+=p,this.points.push([Math.round(u),Math.round(f)]);for(const t of this.points)i.setPixel(t[0],t[1],!0)}};Lt([at(),Vt("design:type",Object)],Ut.prototype,"emojify",void 0),Lt([lt("cell-canvas"),Vt("design:type",Rt)],Ut.prototype,"canvas",void 0),Ut=Lt([nt("draw-line-canvas")],Ut);var Ht=function(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r},Dt=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let Bt=class extends yt{constructor(){super(...arguments),this.emojify=!1,this.fill=!1,this.lines=[],this.points=[]}static get styles(){return mt}render(){return O`
    <style>
      :host {
        display: block;
        --soso-highlight-color: var(--highlight-blue);
      }
      .bar {
        padding: 6px 8px;
      }
      label {
        font-size: 13px;
        font-family: sans-serif;
        text-transform: capitalize;
        color: #808080;
        letter-spacing: 0.5px;
        font-weight: 400;
        margin-right: 12px;
      }
      #caption {
        padding: 8px;
        text-align: center;
        font-style: italic;
        font-family: sans-serif;
        font-size: 15px;
        font-weight: 300;
        color: #555;
      }
    </style>
    <div class="bar horizontal layout center">
      <div class="flex"></div>
      <label>Draw using emoji</label>
      <soso-switch @change="${t=>this.emojify=t.detail.checked}"></soso-switch>
    </div>
    <cell-canvas .height="${300}" .filler="${this.emojify?"😀":""}" @handle-move="${this.updateLines}"></cell-canvas>
    <div id="caption">Move the vertices to change the polygon</div>
    `}firstUpdated(){const t=this.canvas;t.updateComplete.then(()=>{const e=[[1,9],[20,13],[24,2],[14,5],[7,1]];for(let i=0;i<e.length;i++){const s=e[i];t.addHandle(`v-${i}`,s[0],s[1])}this.lines=[];const i=new Map;for(let e=0;e<5;e++)this.lines.push(t.draw("line",i));this.updateLines()})}updateLines(){if(this.lines&&this.lines.length){const t=this.canvas,e=t.handles,i=[],s=[];for(let n=0;n<this.lines.length;n++){let o=n+1;o>=this.lines.length&&(o=0);const[r,a,l,c]=[e[n].cx,e[n].cy,e[o].cx,e[o].cy],h=this.lines[n];h.setAttribute("x1",`${r}`),h.setAttribute("y1",`${a}`),h.setAttribute("x2",`${l}`),h.setAttribute("y2",`${c}`),i.push([t.pixelCoords([r,a]),t.pixelCoords([l,c])]),s.push(t.pixelCoords([r,a]))}const n=[];this.renderLines(i,n),this.fill&&this.fillPolygon(s,n),this.drawPoints(n)}}fillPolygon(t,e){const i=[...t];i[0].join(",")!==i[i.length-1].join(",")&&i.push([i[0][0],i[0][1]]);const s=[];for(let t=0;t<i.length-1;t++){const e=i[t],n=i[t+1];if(e[1]!==n[1]){const t=Math.min(e[1],n[1]);s.push({ymin:t,ymax:Math.max(e[1],n[1]),x:t===e[1]?e[0]:n[0],islope:(n[0]-e[0])/(n[1]-e[1])})}}s.sort((t,e)=>t.ymin<e.ymin?-1:t.ymin>e.ymin?1:t.x<e.x?-1:t.x>e.x?1:t.ymax===e.ymax?0:(t.ymax-e.ymax)/Math.abs(t.ymax-e.ymax));let n=[],o=s[0].ymin;for(;n.length||s.length;){if(s.length){let t=-1;for(let e=0;e<s.length&&!(s[e].ymin>o);e++)t=e;s.splice(0,t+1).forEach(t=>{n.push({s:o,edge:t})})}if(n=n.filter(t=>t.edge.ymax!==o),n.sort((t,e)=>t.edge.x===e.edge.x?0:(t.edge.x-e.edge.x)/Math.abs(t.edge.x-e.edge.x)),n.length>1)for(let t=0;t<n.length;t+=2){const i=t+1;if(i>=n.length)break;const s=n[t].edge,r=n[i].edge;e.push(...this.linePoints(Math.round(s.x),o,Math.round(r.x),o))}o++,n.forEach(t=>{t.edge.x=t.edge.x+t.edge.islope})}}linePoints(t,e,i,s){const n=[],o=s-e,r=i-t,a=Math.max(Math.abs(r),Math.abs(o)),l=0===a?0:1/a,c=r*l,h=o*l;let d=t,p=e;n.push([Math.round(d),Math.round(p)]);for(let t=0;t<a;t++)d+=c,p+=h,n.push([Math.round(d),Math.round(p)]);return n}renderLines(t,e){for(const i of t){const[t,s]=i,[n,o,r,a]=[...t,...s];e.push(...this.linePoints(n,o,r,a))}}drawPoints(t){const e=this.canvas;for(const t of this.points)e.setPixel(t[0],t[1],!1);for(const i of t)e.setPixel(i[0],i[1],!0);this.points=t}};Ht([at(),Dt("design:type",Object)],Bt.prototype,"emojify",void 0),Ht([at({type:Boolean}),Dt("design:type",Object)],Bt.prototype,"fill",void 0),Ht([lt("cell-canvas"),Dt("design:type",Rt)],Bt.prototype,"canvas",void 0),Bt=Ht([nt("draw-polygon-canvas")],Bt);var qt=function(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r},It=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let Gt=class extends yt{constructor(){super(...arguments),this.emojify=!1,this.fill=!1,this.points=[]}static get styles(){return mt}render(){return O`
    <style>
      :host {
        display: block;
        --soso-highlight-color: var(--highlight-blue);
      }
      .bar {
        padding: 6px 8px;
      }
      label {
        font-size: 13px;
        font-family: sans-serif;
        text-transform: capitalize;
        color: #808080;
        letter-spacing: 0.5px;
        font-weight: 400;
        margin-right: 12px;
      }
      #caption {
        padding: 8px;
        text-align: center;
        font-style: italic;
        font-family: sans-serif;
        font-size: 15px;
        font-weight: 300;
        color: #555;
      }
    </style>
    <div class="bar horizontal layout center">
      <div class="flex"></div>
      <label>Draw using emoji</label>
      <soso-switch @change="${t=>this.emojify=t.detail.checked}"></soso-switch>
    </div>
    <cell-canvas .height="${300}" .filler="${this.emojify?"😀":""}" @handle-move="${this.updateCircle}"></cell-canvas>
    <div id="caption">Move the points to change the ellipse's dimentions</div>
    `}firstUpdated(){const t=this.canvas;t.updateComplete.then(()=>{t.addHandle("a",18,7,!0),t.addHandle("b",12,1,!1,!0),this.ellipse=t.draw("ellipse"),this.updateCircle()})}updateCircle(){if(this.ellipse){const t=this.canvas,e=t.handles,i=t.pixelCoordsInv([12,7]);let s=[0,0],n=[0,0];for(const t of e)"a"===t.id?s=[t.cx,t.cy]:"b"===t.id&&(n=[t.cx,t.cy]);const o=Math.abs(i[0]-s[0]),r=Math.abs(i[1]-n[1]);this.ellipse.setAttribute("cx",`${i[0]}`),this.ellipse.setAttribute("cy",`${i[1]}`),this.ellipse.setAttribute("rx",`${o}`),this.ellipse.setAttribute("ry",`${r}`);const a=t.pixelCoords([o,r]);this.drawEllipse(12,7,a[0],a[1])}}drawEllipse(t,e,i,s){let n=0,o=s;const r=i*i,a=s*s,l=-(r/4+i%2+a),c=-(a/4+s%2+r),h=-(a/4+s%2);let d=-r*o,p=2*a*n,u=-2*r*o;const f=2*a,g=2*r,y=()=>{n++,p+=f,d+=p},m=()=>{o--,u+=g,d+=u},b=[];if(this.fill){const p=[];let u=n,f=o,g=1,v=1;const x=(t,e,i,s)=>{s<0&&(e+=s+1,s=Math.abs(s)),p.push({x:t,y:e,width:i,height:s})};if(0===s)x(t-1,e,2*i+1,1);else{for(;o>=0&&n<=i;)d+a*n<=l||d+r*o<=h?(1===v||(2*f+1>2*(v-1)?(x(t-u,e-f,g,v-1),x(t-u,e+f,g,1-v),f-=v-1,v=1):(x(t-u,e-f,g,2*f+1),f-=f,v=1)),y(),u++,g+=2):d-r*o>c?(m(),v++):(2*f+1>2*v?(x(t-u,e-f,g,v),x(t-u,e+f,g,-v)):x(t-u,e-f,g,2*f+1),y(),m(),u++,g+=2,f-=v,v=1);f>v?(x(t-u,e-f,g,v),x(t-u,e+f+1,g,-v)):x(t-u,e-f,g,2*f+1)}p.forEach(t=>{t.height<0&&(t.y+=t.height+1,t.height=Math.abs(t.height))}),p.sort((t,e)=>t.y-e.y),p.forEach(t=>{const{x:e,y:i,width:s,height:n}=t;for(let t=0;t<s;t++)for(let s=0;s<n;s++)b.push([e+t,i+s])})}else for(;o>=0&&n<=i;)b.push([t+n,e+o]),0===n&&0===o||b.push([t-n,e-o]),0!==n&&0!==o&&(b.push([t+n,e-o]),b.push([t-n,e+o])),d+a*n<=l||d+r*o<=h?y():d-r*o>c?m():(y(),m());this.drawPoints(b)}drawPoints(t){const e=this.canvas;for(const t of this.points)e.setPixel(t[0],t[1],!1);for(const i of t)e.setPixel(i[0],i[1],!0);this.points=t}};qt([at(),It("design:type",Object)],Gt.prototype,"emojify",void 0),qt([at({type:Boolean}),It("design:type",Object)],Gt.prototype,"fill",void 0),qt([lt("cell-canvas"),It("design:type",Rt)],Gt.prototype,"canvas",void 0),Gt=qt([nt("draw-ellipse-canvas")],Gt);const Ft=[-.06405689286260563,.06405689286260563,-.1911188674736163,.1911188674736163,-.3150426796961634,.3150426796961634,-.4337935076260451,.4337935076260451,-.5454214713888396,.5454214713888396,-.6480936519369755,.6480936519369755,-.7401241915785544,.7401241915785544,-.820001985973903,.820001985973903,-.8864155270044011,.8864155270044011,-.9382745520027328,.9382745520027328,-.9747285559713095,.9747285559713095,-.9951872199970213,.9951872199970213],Wt=[.12793819534675216,.12793819534675216,.1258374563468283,.1258374563468283,.12167047292780339,.12167047292780339,.1155056680537256,.1155056680537256,.10744427011596563,.10744427011596563,.09761865210411388,.09761865210411388,.08619016153195327,.08619016153195327,.0733464814110803,.0733464814110803,.05929858491543678,.05929858491543678,.04427743881741981,.04427743881741981,.028531388628933663,.028531388628933663,.0123412297999872,.0123412297999872];function Jt(t,e){const i=e(t),s=i[0]*i[0]+i[1]*i[1];return Math.sqrt(s)}class Xt{constructor(t,e,i,s){this.points=[],this.dpoints=[],this._lut=[],this.order=3,this.points.push(t,e,i),s&&this.points.push(s),this.order=this.points.length-1,this.update()}update(){this._lut=[],this.dpoints=function(t){const e=[];for(let i=t,s=i.length,n=s-1;s>1;s--,n--){const t=[];let s=[0,0];for(let e=0;e<n;e++)s=[n*(i[e+1][0]-i[e][0]),n*(i[e+1][1]-i[e][1])],t.push(s);e.push(t),i=t}return e}(this.points)}length(){return function(t){let e=0;const i=Ft.length;for(let s=0;s<i;s++){const i=.5*Ft[s]+.5;e+=Wt[s]*Jt(i,t)}return.5*e}(this.derivative.bind(this))}derivative(t){const e=1-t;let i=0,s=0,n=0,o=this.dpoints[0];return 2===this.order?(o=[o[0],o[1],[0,0]],i=e,s=t):3===this.order&&(i=e*e,s=e*t*2,n=t*t),[i*o[0][0]+s*o[1][0]+n*o[2][0],i*o[0][1]+s*o[1][1]+n*o[2][1]]}getLUT(t=100){if(!t)return[];if(this._lut.length===t)return this._lut;this._lut=[],t--;for(let e=0;e<=t;e++)this._lut.push(this.compute(e/t));return this._lut}compute(t){return function(t,e){if(0===t)return e[0];const i=e.length-1;if(1===t)return e[i];let s=e;const n=1-t;if(0===i)return e[0];if(1===i){return[n*s[0][0]+t*s[1][0],n*s[0][1]+t*s[1][1]]}if(i<4){const e=n*n,o=t*t;let r=0,a=0,l=0,c=0;return 2===i?(s=[s[0],s[1],s[2],[0,0]],a=e,l=n*t*2,c=o):3===i&&(a=e*n,l=e*t*3,c=n*o*3,r=t*o),[a*s[0][0]+l*s[1][0]+c*s[2][0]+r*s[3][0],a*s[0][1]+l*s[1][1]+c*s[2][1]+r*s[3][1]]}const o=JSON.parse(JSON.stringify(e));for(;o.length>1;){for(let e=0;e<o.length-1;e++)o[e]=[o[e][0]+(o[e+1][0]-o[e][0])*t,o[e][1]+(o[e+1][1]-o[e][1])*t];o.splice(o.length-1,1)}return o[0]}(t,this.points)}}var Yt=function(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r},Qt=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let Kt=class extends yt{constructor(){super(...arguments),this.emojify=!1,this.fill=!1,this.points=[]}static get styles(){return mt}render(){return O`
    <style>
      :host {
        display: block;
        --soso-highlight-color: var(--highlight-blue);
      }
      .bar {
        padding: 6px 8px;
      }
      label {
        font-size: 13px;
        font-family: sans-serif;
        text-transform: capitalize;
        color: #808080;
        letter-spacing: 0.5px;
        font-weight: 400;
        margin-right: 12px;
      }
      #caption {
        padding: 8px;
        text-align: center;
        font-style: italic;
        font-family: sans-serif;
        font-size: 15px;
        font-weight: 300;
        color: #555;
      }
    </style>
    <div class="bar horizontal layout center">
      <div class="flex"></div>
      <label>Draw using emoji</label>
      <soso-switch @change="${t=>this.emojify=t.detail.checked}"></soso-switch>
    </div>
    <cell-canvas .height="${400}" .filler="${this.emojify?"😀":""}" @handle-move="${this.updateCircle}"></cell-canvas>
    <div id="caption">Move the end and control points to adjust the curve</div>
    `}firstUpdated(){const t=this.canvas;t.updateComplete.then(()=>{t.addHandle("a",1,18),t.addHandle("b",24,11);const e=t.addHandle("p1",10,1),i=t.addHandle("p2",24,1);this.line1=t.draw("line"),this.line2=t.draw("line"),this.path=t.draw("path"),this.line1.style.stroke="rgba(21, 101, 192, 0.8)",this.line2.style.stroke="rgba(21, 101, 192, 0.8)",e.style.fill="rgba(21, 101, 192, 0.8)",i.style.fill="rgba(21, 101, 192, 0.8)",this.updateCircle()})}updateCircle(){if(this.path&&this.line1&&this.line2){const t=this.canvas,e=t.handles;let i=[0,0],s=[0,0],n=[0,0],o=[0,0];for(const t of e)"a"===t.id?i=[t.cx,t.cy]:"b"===t.id?s=[t.cx,t.cy]:"p1"===t.id?n=[t.cx,t.cy]:"p2"===t.id&&(o=[t.cx,t.cy]);this.line1.setAttribute("x1",`${i[0]}`),this.line1.setAttribute("y1",`${i[1]}`),this.line1.setAttribute("x2",`${n[0]}`),this.line1.setAttribute("y2",`${n[1]}`),this.line2.setAttribute("x1",`${s[0]}`),this.line2.setAttribute("y1",`${s[1]}`),this.line2.setAttribute("x2",`${o[0]}`),this.line2.setAttribute("y2",`${o[1]}`),this.path.setAttribute("d",`M ${i[0]} ${i[1]} C ${n[0]} ${n[1]}, ${o[0]} ${o[1]}, ${s[0]} ${s[1]}`),this.drawCurve(t.pixelCoords(i),t.pixelCoords(n),t.pixelCoords(o),t.pixelCoords(s))}}drawCurve(t,e,i,s){const n=new Xt(t,e,i,s),o=n.getLUT(2*n.length()).map(t=>[Math.round(t[0]),Math.round(t[1])]);o.push(s),this.drawPoints(o)}drawPoints(t){const e=this.canvas;for(const t of this.points)e.setPixel(t[0],t[1],!1);for(const i of t)e.setPixel(i[0],i[1],!0);this.points=t}};Yt([at(),Qt("design:type",Object)],Kt.prototype,"emojify",void 0),Yt([at({type:Boolean}),Qt("design:type",Object)],Kt.prototype,"fill",void 0),Yt([lt("cell-canvas"),Qt("design:type",Rt)],Kt.prototype,"canvas",void 0),Kt=Yt([nt("draw-bezier-canvas")],Kt);var Zt=function(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r},te=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let ee=class extends yt{constructor(){super(...arguments),this.emojify=!1,this.fill=!1,this.points=[]}static get styles(){return mt}render(){return O`
    <style>
      :host {
        display: block;
        --soso-highlight-color: var(--highlight-blue);
      }
      .bar {
        padding: 6px 8px;
      }
      label {
        font-size: 13px;
        font-family: sans-serif;
        text-transform: capitalize;
        color: #808080;
        letter-spacing: 0.5px;
        font-weight: 400;
        margin-right: 12px;
      }
      #caption {
        padding: 8px;
        text-align: center;
        font-style: italic;
        font-family: sans-serif;
        font-size: 15px;
        font-weight: 300;
        color: #555;
      }
    </style>
    <div class="bar horizontal layout center">
      <div class="flex"></div>
      <label>Draw using emoji</label>
      <soso-switch @change="${t=>this.emojify=t.detail.checked}"></soso-switch>
    </div>
    <cell-canvas .height="${400}" .filler="${this.emojify?"😀":""}" @handle-move="${this.updateCircle}"></cell-canvas>
    <div id="caption">Move the control point and end points to adjust the curve</div>
    `}firstUpdated(){const t=this.canvas;t.updateComplete.then(()=>{t.addHandle("a",2,18),t.addHandle("b",2,1);const e=t.addHandle("p1",24,9);this.line1=t.draw("line"),this.line2=t.draw("line"),this.path=t.draw("path"),this.line1.style.stroke="rgba(21, 101, 192, 0.8)",this.line2.style.stroke="rgba(21, 101, 192, 0.8)",e.style.fill="rgba(21, 101, 192, 0.8)",this.updateCircle()})}updateCircle(){if(this.path&&this.line1&&this.line2){const t=this.canvas,e=t.handles;let i=[0,0],s=[0,0],n=[0,0];for(const t of e)"a"===t.id?i=[t.cx,t.cy]:"b"===t.id?s=[t.cx,t.cy]:"p1"===t.id&&(n=[t.cx,t.cy]);this.line1.setAttribute("x1",`${i[0]}`),this.line1.setAttribute("y1",`${i[1]}`),this.line1.setAttribute("x2",`${n[0]}`),this.line1.setAttribute("y2",`${n[1]}`),this.line2.setAttribute("x1",`${s[0]}`),this.line2.setAttribute("y1",`${s[1]}`),this.line2.setAttribute("x2",`${n[0]}`),this.line2.setAttribute("y2",`${n[1]}`),this.path.setAttribute("d",`M ${i[0]} ${i[1]} Q ${n[0]} ${n[1]}, ${s[0]} ${s[1]}`),this.drawCurve(t.pixelCoords(i),t.pixelCoords(n),t.pixelCoords(s))}}drawCurve(t,e,i){const s=new Xt(t,e,i),n=s.getLUT(2*s.length()).map(t=>[Math.round(t[0]),Math.round(t[1])]);n.push(i),this.drawPoints(n)}drawPoints(t){const e=this.canvas;for(const t of this.points)e.setPixel(t[0],t[1],!1);for(const i of t)e.setPixel(i[0],i[1],!0);this.points=t}};Zt([at(),te("design:type",Object)],ee.prototype,"emojify",void 0),Zt([at({type:Boolean}),te("design:type",Object)],ee.prototype,"fill",void 0),Zt([lt("cell-canvas"),te("design:type",Rt)],ee.prototype,"canvas",void 0),ee=Zt([nt("draw-quad-canvas")],ee);const ie=new class{constructor(){this.map=new Map,this.maps=new Map}get(t,e){const i=e?this.maps.get(e):this.map;return i&&i.has(t)?i.get(t):""}define(t,e){let i=this.map;e&&(this.maps.has(e)||this.maps.set(e,new Map),i=this.maps.get(e));for(const e in t)i.set(e,t[e])}};var se=function(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r},ne=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let oe=class extends yt{static get styles(){return ft`
      :host {
        display: -ms-inline-flexbox;
        display: -webkit-inline-flex;
        display: inline-flex;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        justify-content: center;
        position: relative;
        vertical-align: middle;
        fill: currentColor;
        stroke: none;
        width: 24px;
        height: 24px;
        box-sizing: initial;
      }
      svg {
        pointer-events: none;
        display: block;
        width: 100%;
        height: 100%;
      }
    `}render(){const t=this.icon||"",e=ie.get(t,this.iconkey);return O`
    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
      <g>
        <path d="${e}"></path>
      </g>
    </svg>
    `}};se([at({type:String}),ne("design:type",String)],oe.prototype,"icon",void 0),se([at({type:String}),ne("design:type",String)],oe.prototype,"iconkey",void 0),oe=se([nt("soso-icon")],oe);var re=function(t,e,i,s){var n,o=arguments.length,r=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,i,r):n(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r},ae=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};ie.define({right:"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z",down:"M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"},"collapsible-panel");let le=class extends yt{constructor(){super(...arguments),this.label="",this.collapsed=!0}static get styles(){return mt}render(){return O`
    <style>
      :host {
        display: block;
        padding: 12px;
        background: #f5f5f5;
        border-radius: 5px;
      }
      #outerPanel {
        position: relative;
        overflow: hidden;
        transition: height 0.3s ease;
      }
      #innerPanel {
        padding: var(--collapse-label-inner-padding, 8px 0 30px);
        box-sizing: border-box;
      }
      #header {
        color: #333;
        font-size: 15px;
        font-family: sans-serif;
        letter-spacing: 0.75px;
      }
      label {
        padding-left: 6px;
        cursor: pointer;
      }
      soso-icon {
        cursor: pointer;
      }
    </style>
    <div id="header" class="horizontal layout center">
      <soso-icon @click="${this.toggleCollapse}" .iconkey="${"collapsible-panel"}" .icon="${this.collapsed?"right":"down"}"></soso-icon>
      <label @click="${this.toggleCollapse}">${this.label}</label>
    </div>
    <div id="outerPanel">
      <div id="innerPanel"><slot></slot></div>
    </div>
    `}updated(){this.updateCollapsed()}updateCollapsed(){if(this.innerPanel&&this.outerPanel){const t=this.innerPanel.offsetHeight,e=this.outerPanel.style;this.collapsed?(e.height=`${t}px`,setTimeout(()=>{this.collapsed&&(e.height="0px")},5)):(e.height=`${t}px`,setTimeout(()=>{this.collapsed||(e.height="auto")},300))}}toggleCollapse(){this.collapsed=!this.collapsed}firstUpdated(){setTimeout(()=>this.style.display="block")}};re([at(),ae("design:type",Object)],le.prototype,"label",void 0),re([at(),ae("design:type",Object)],le.prototype,"collapsed",void 0),re([lt("#innerPanel"),ae("design:type",HTMLDivElement)],le.prototype,"innerPanel",void 0),re([lt("#outerPanel"),ae("design:type",HTMLDivElement)],le.prototype,"outerPanel",void 0),le=re([nt("collapsible-panel")],le)}();
