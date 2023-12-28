/**
 * @license Hyphenopoly 5.3.0 - client side hyphenation for webbrowsers
 * ©2023  Mathias Nater, Güttingen (mathiasnater at gmail dot com)
 * https://github.com/mnater/Hyphenopoly
 *
 * Released under the MIT license
 * http://mnater.github.io/Hyphenopoly/LICENSE
*/ ((e,u)=>{"use strict";let t=(t=>{let $=new Map([["afterElementHyphenation",[]],["beforeElementHyphenation",[]],["engineReady",[]],["error",[u=>{u.runDefault&&e.console.warn(u)}]],["hyphenopolyEnd",[]],["hyphenopolyStart",[]]]);if(t.hev){let n=new Map(u.entries(t.hev));$.forEach((e,u)=>{n.has(u)&&e.unshift(n.get(u))})}return{fire(e,u={}){u.runDefault=!0,u.preventDefault=()=>{u.runDefault=!1},$.get(e).forEach(e=>{e(u)})}}})(Hyphenopoly);function $(u){u.addEventListener("copy",u=>{u.preventDefault();let t=e.getSelection(),$=document.createElement("div");$.appendChild(t.getRangeAt(0).cloneContents()),u.clipboardData.setData("text/plain",t.toString().replace(RegExp("\xad","g"),"")),u.clipboardData.setData("text/html",$.innerHTML.replace(RegExp("\xad","g"),""))},!0)}(e=>{function t(e){let u=new Map;function t(t){return u.has(t)?u.get(t):e.get(t)}function $(e,t){u.set(e,t)}return new Proxy(e,{get:(e,u)=>"set"===u?$:"get"===u?t:t(u),ownKeys:()=>[...new Set([...e.keys(),...u.keys()])]})}let $=t(new Map([["defaultLanguage","en-us"],["dontHyphenate",t(new Map("abbr,acronym,audio,br,button,code,img,input,kbd,label,math,option,pre,samp,script,style,sub,sup,svg,textarea,var,video".split(",").map(e=>[e,!0])))],["dontHyphenateClass","donthyphenate"],["exceptions",new Map],["keepAlive",!0],["normalize",!1],["processShadows",!1],["safeCopy",!0],["substitute",new Map],["timeout",1e3]]));u.entries(e.s).forEach(([e,n])=>{switch(e){case"selectors":$.set("selectors",u.keys(n)),u.entries(n).forEach(([e,n])=>{let r=t(new Map([["compound","hyphen"],["hyphen","\xad"],["leftmin",0],["leftminPerLang",0],["minWordLength",6],["mixedCase",!0],["orphanControl",1],["rightmin",0],["rightminPerLang",0]]));u.entries(n).forEach(([e,t])=>{"object"==typeof t?r.set(e,new Map(u.entries(t))):r.set(e,t)}),$.set(e,r)});break;case"dontHyphenate":case"exceptions":u.entries(n).forEach(([u,t])=>{$.get(e).set(u,t)});break;case"substitute":u.entries(n).forEach(([e,t])=>{$.substitute.set(e,new Map(u.entries(t)))});break;default:$.set(e,n)}}),e.c=$})(Hyphenopoly),(n=>{let r=n.c,a=null;function o(){let e=new Map,u=[0];return{add:function t($,n,r){let a={element:$,selector:r};return e.has(n)||e.set(n,[]),e.get(n).push(a),u[0]+=1,a},counter:u,list:e,rem:function $(n){let a=0;e.has(n)&&(a=e.get(n).length,e.delete(n),u[0]-=a,0!==u[0]||(t.fire("hyphenopolyEnd"),r.keepAlive||(window.Hyphenopoly=null)))}}}function l(e,u="",t=!0){return(e=e.closest("[lang]:not([lang=''])"))&&e.lang?e.lang.toLowerCase():u||(t?a:null)}function _(a=null,_=null){let s=o(),i,h=(i="."+r.dontHyphenateClass,u.getOwnPropertyNames(r.dontHyphenate).forEach(e=>{r.dontHyphenate.get(e)&&(i+=","+e)}),i),c=r.selectors.join(",")+","+h;function g(e,u,a,o=!1){let _=l(e,u),i=n.cf.langs.get(_);"H9Y"===i?(s.add(e,_,a),!o&&r.safeCopy&&$(e)):i||"zxx"===_||t.fire("error",Error(`Element with '${_}' found, but '${_}.wasm' not loaded. Check language tags!`)),e.childNodes.forEach(e=>{1!==e.nodeType||e.matches(c)||g(e,_,a,!0)})}function f(e){r.selectors.forEach(u=>{e.querySelectorAll(u).forEach(e=>{g(e,l(e),u,!1)})})}return null===a?(r.processShadows&&e.document.querySelectorAll("*").forEach(e=>{e.shadowRoot&&f(e.shadowRoot)}),f(e.document)):g(a,l(a),_),s}t.fire("hyphenopolyStart");let s=new Map;function i(e,u,$){let n=u+"-"+$;if(s.has(n))return s.get(n);let a=r.get($);function o(n){let r=e.cache.get($).get(n);if(!r){if(e.exc.has(n))r=e.exc.get(n).replace(/-/g,a.hyphen);else{var o,l;if(!a.mixedCase&&[...o=n].map(e=>e===e.toLowerCase()).some((e,u,t)=>e!==t[0]))r=n;else if(-1===n.indexOf("-"))r=function $(n){if(n.length>61)t.fire("error",Error("Found word longer than 61 characters"));else if(!e.reNotAlphabet.test(n))return e.hyphenate(n,a.hyphen.charCodeAt(0),a.leftminPerLang.get(u),a.rightminPerLang.get(u));return n}(n);else{let _,s;r=(l=n,_=null,s=null,"auto"===a.compound||"all"===a.compound?(s=i(e,u,$),_=l.split("-").map(e=>e.length>=a.minWordLength?s(e):e),l="auto"===a.compound?_.join("-"):_.join("-​")):l=l.replace("-","-​"),l)}}e.cache.get($).set(n,r)}return r}return e.cache.set($,new Map),s.set(n,o),o}let h=new Map;function c(e){if(h.has(e))return h.get(e);let u=r.get(e);function t(e,t,$,n){return 3===u.orphanControl&&" "===t&&(t="\xa0"),t+$.replace(RegExp(u.hyphen,"g"),"")+n}return h.set(e,t),t}let g=new Map;function f(e,u,$){let a=n.languages.get(e),o=r.get(u),l=o.minWordLength,_=(()=>{let u=e+l;if(g.has(u))return g.get(u);let t=RegExp(`[${a.alphabet}a-z\u0300-\u036F\u0483-\u0487\u00DF-\u00F6\u00F8-\u00FE\u0101\u0103\u0105\u0107\u0109\u010D\u010F\u0111\u0113\u0117\u0119\u011B\u011D\u011F\u0123\u0125\u012B\u012F\u0131\u0135\u0137\u013C\u013E\u0142\u0144\u0146\u0148\u014D\u0151\u0153\u0155\u0159\u015B\u015D\u015F\u0161\u0165\u016B\u016D\u016F\u0171\u0173\u017A\u017C\u017E\u017F\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u0219\u021B\u02BC\u0390\u03AC-\u03CE\u03D0\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF\u03F2\u0430-\u044F\u0451-\u045C\u045E\u045F\u0491\u04AF\u04E9\u0561-\u0585\u0587\u0905-\u090C\u090F\u0910\u0913-\u0928\u092A-\u0930\u0932\u0933\u0935-\u0939\u093D\u0960\u0961\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A85-\u0A8B\u0A8F\u0A90\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AE0\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B60\u0B61\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB5\u0BB7-\u0BB9\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D28\u0D2A-\u0D39\u0D60\u0D61\u0D7A-\u0D7F\u0E01-\u0E2E\u0E30\u0E32\u0E33\u0E40-\u0E45\u10D0-\u10F0\u1200-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u1E0D\u1E37\u1E41\u1E43\u1E45\u1E47\u1E6D\u1F00-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB2-\u1FB4\u1FB6\u1FB7\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD2\u1FD3\u1FD6\u1FD7\u1FE2-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CC9\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\u00AD\u200B-\u200D-]{${l},}`,"gui");return g.set(u,t),t})();function s(t){r.normalize&&(t=t.normalize("NFC"));let $=t.replace(_,i(a,e,u));return 1!==o.orphanControl&&($=$.replace(/(\u0020*)(\S+)(\s*)$/,c(u))),$}let h=null;if("string"==typeof $)h=s($);else if($ instanceof HTMLElement){var f;f=$,t.fire("beforeElementHyphenation",{el:f,lang:e}),f.childNodes.forEach(e=>{3===e.nodeType&&/\S/.test(e.data)&&e.data.length>=l&&(e.data=s(e.data))}),n.res.els.counter[0]-=1,t.fire("afterElementHyphenation",{el:f,lang:e})}return h}function p(e){return(u,$=".hyphenate")=>("string"!=typeof u&&t.fire("error",Error("This use of hyphenators is deprecated. See https://mnater.github.io/Hyphenopoly/Hyphenators.html")),f(e,$,u))}function A(){return(e,u=".hyphenate")=>(_(e,u).list.forEach((e,u)=>{e.forEach(e=>{f(u,e.selector,e.element)})}),null)}function C(u,$){let a=$.list.get(u);a?a.forEach(e=>{f(u,e.selector,e.element)}):t.fire("error",Error(`Engine for language '${u}' loaded, but no elements found.`)),0!==$.counter[0]||(e.clearTimeout(n.timeOutHandler),n.hide(0,null),t.fire("hyphenopolyEnd"),r.keepAlive||(window.Hyphenopoly=null))}function d(e){let u="";return(r.exceptions.has(e)&&(u=r.exceptions.get(e)),r.exceptions.has("global")&&(""===u?u=r.exceptions.get("global"):u+=", "+r.exceptions.get("global")),""===u)?new Map:new Map(u.split(", ").map(e=>[e.replace(/-/g,""),e]))}function D(e,u,$,a,o){r.selectors.forEach(u=>{let t=r.get(u);0===t.leftminPerLang&&t.set("leftminPerLang",new Map),0===t.rightminPerLang&&t.set("rightminPerLang",new Map),t.leftminPerLang.set(e,Math.max(a,t.leftmin,Number(t.leftminPerLang.get(e))||0)),t.rightminPerLang.set(e,Math.max(o,t.rightmin,Number(t.rightminPerLang.get(e))||0))}),n.languages||(n.languages=new Map),$=$.replace(/\\*-/g,"\\-"),n.languages.set(e,{alphabet:$,cache:new Map,exc:d(e),hyphenate:u,ready:!0,reNotAlphabet:RegExp(`[^${$}]`,"i")}),n.hy6ors.get(e).resolve(p(e)),t.fire("engineReady",{lang:e}),n.res.els&&C(e,n.res.els)}n.unhyphenate=()=>(n.res.els.list.forEach(e=>{e.forEach(e=>{e.element.childNodes.forEach(u=>{3===u.nodeType&&(u.data=u.data.replace(RegExp(r[e.selector].hyphen,"g"),""))})})}),Promise.resolve(n.res.els));let B=(()=>{let e=new TextDecoder("utf-16le");return u=>e.decode(u)})();function E(e,u){let t=new Uint16Array(e,0,64);return($,n,r,a)=>{t.set([...[...$].map(e=>e.charCodeAt(0)),0]);let o=u(r,a,n);return o>0&&($=B(new Uint16Array(e,0,o))),$}}function m(e,u){let $=window.WebAssembly;e.w.then(e=>e.ok?$.instantiateStreaming&&"application/wasm"===e.headers.get("Content-Type")?$.instantiateStreaming(e):e.arrayBuffer().then(e=>$.instantiate(e)):Promise.reject(Error(`File ${u}.wasm can't be loaded from ${n.paths.patterndir}`))).then(function t(n){let a=n.instance.exports,o=$.Global?a.lct.value:a.lct;o=function e(t,$){if(r.substitute.has(u)){let n=r.substitute.get(u);n.forEach((e,u)=>{let n=u.toUpperCase(),r=n===u?0:n.charCodeAt(0);t=$.subst(u.charCodeAt(0),r,e.charCodeAt(0))})}return t}(o,a),e.l.forEach(e=>{D(e,E(a.mem.buffer,a.hyphenate),B(new Uint16Array(a.mem.buffer,1664,o)),$.Global?a.lmi.value:a.lmi,$.Global?a.rmi.value:a.rmi)})},e=>{t.fire("error",e),n.res.els.rem(u)})}n.main=()=>{n.res.DOM.then(()=>{(a=l(e.document.documentElement,"",!1))||""===r.defaultLanguage||(a=r.defaultLanguage);let u=_();n.res.els=u,u.list.forEach((e,t)=>{n.languages&&n.languages.has(t)&&n.languages.get(t).ready&&C(t,u)})}),n.res.he.forEach(m),Promise.all([...n.hy6ors.entries()].reduce((e,u)=>"HTML"!==u[0]?e.concat(u[1]):e,[]).concat(n.res.DOM)).then(()=>{n.hy6ors.get("HTML").resolve(A())},e=>{t.fire("error",e)})},n.main()})(Hyphenopoly)})(window,Object);