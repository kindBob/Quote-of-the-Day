/**
 * @license Hyphenopoly_Loader 5.3.0 - client side hyphenation
 * ©2023  Mathias Nater, Güttingen (mathiasnater at gmail dot com)
 * https://github.com/mnater/Hyphenopoly
 *
 * Released under the MIT license
 * http://mnater.github.io/Hyphenopoly/LICENSE
*/ window.Hyphenopoly={},((e,t,l,s)=>{"use strict";let n=e=>new Map(e),a="Hyphenopoly_Loader.js",r=t.currentScript.src,c=sessionStorage,i=!1,o=()=>{let r={ac:"appendChild",ce:"createElement",ct:"createTextNode"},o=()=>{let e=null,t=null,l=new Promise((l,s)=>{e=l,t=s});return l.resolve=e,l.reject=t,l};l.ac=new AbortController;let h={credentials:l.s.CORScredentials,signal:l.ac.signal},p=null;l.hide=(e,n)=>{if(e){let a="{visibility:hidden!important}";p=t[r.ce]("style");let c="";0===n?c="html"+a:-1!==n&&(2===n&&(a="{color:transparent!important}"),s.keys(l.s.selectors).forEach(e=>{c+=e+a})),p[r.ac](t[r.ct](c)),t.head[r.ac](p)}else p&&p.remove()};let d=(()=>{let e=null;return{ap:()=>e?(t.documentElement[r.ac](e),e):null,cl(){e&&e.remove()},cr(s){if(l.cf.langs.has(s))return;e=e||t[r.ce]("body");let n=t[r.ce]("div"),a="hyphens:auto";n.lang=s,n.style.cssText=`visibility:hidden;-webkit-${a};-ms-${a};${a};width:48px;font-size:12px;line-height:12px;border:none;padding:0;word-wrap:normal`,n[r.ac](t[r.ct](l.lrq.get(s).wo.toLowerCase())),e[r.ac](n)}}})(),f=e=>{let t=e.hyphens||e.webkitHyphens||e.msHyphens;return"auto"===t};l.res={he:n()};let g=t=>{let s=l.lrq.get(t).fn;l.cf.pf=!0,l.cf.langs.set(t,"H9Y"),l.res.he.has(s)?l.res.he.get(s).l.push(t):l.res.he.set(s,{l:[t],w:e.fetch(l.paths.patterndir+s+".wasm",h)})};l.lrq.forEach((e,t)=>{"FORCEHYPHENOPOLY"===e.wo||"H9Y"===l.cf.langs.get(t)?g(t):d.cr(t)});let y=d.ap();y&&(y.querySelectorAll("div").forEach(e=>{f(e.style)&&e.offsetHeight>12?l.cf.langs.set(e.lang,"CSS"):g(e.lang)}),d.cl());let u=l.hev;l.cf.pf?(l.res.DOM=new Promise(e=>{"loading"===t.readyState?t.addEventListener("DOMContentLoaded",e,{once:!0,passive:!0}):e()}),l.hide(1,l.s.hide),l.timeOutHandler=e.setTimeout(()=>{l.hide(0,null),1&l.s.timeout&&l.ac.abort(),console.info(a+" timed out.")},l.s.timeout),i?l.main():fetch(l.paths.maindir+"Hyphenopoly.js",h).then(e=>{e.ok&&e.blob().then(e=>{let l=t[r.ce]("script");l.src=URL.createObjectURL(e),t.head[r.ac](l),i=!0,URL.revokeObjectURL(l.src)})}),l.hy6ors=n(),l.cf.langs.forEach((e,t)=>{"H9Y"===e&&l.hy6ors.set(t,o())}),l.hy6ors.set("HTML",o()),l.hyphenators=new Proxy(l.hy6ors,{get:(e,t)=>e.get(t),set:()=>!0}),u&&u.polyfill&&u.polyfill()):(u&&u.tearDown&&u.tearDown(),e.Hyphenopoly=null),l.cft&&c.setItem(a,JSON.stringify({langs:[...l.cf.langs.entries()],pf:l.cf.pf}))};l.config=e=>{let t=(e,t)=>e?(s.entries(t).forEach(([t,l])=>{e[t]=e[t]||l}),e):t;l.cft=Boolean(e.cacheFeatureTests),l.cft&&c.getItem(a)?(l.cf=JSON.parse(c.getItem(a)),l.cf.langs=n(l.cf.langs)):l.cf={langs:n(),pf:!1};let i=r.slice(0,r.lastIndexOf("/")+1),h=i+"patterns/";l.paths=t(e.paths,{maindir:i,patterndir:h}),l.s=t(e.setup,{CORScredentials:"include",hide:"all",selectors:{".hyphenate":{}},timeout:1e3}),l.s.hide=["all","element","text"].indexOf(l.s.hide),e.handleEvent&&(l.hev=e.handleEvent);let p=n(s.entries(e.fallbacks||{}));l.lrq=n(),s.entries(e.require).forEach(([e,t])=>{l.lrq.set(e.toLowerCase(),{fn:p.get(e)||e,wo:t})}),o()}})(window,document,Hyphenopoly,Object);