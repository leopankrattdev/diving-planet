(function(){
var L=I18N,lang=localStorage.getItem('lang')||'en';
var box=document.getElementById('lang'),btn=box.querySelector('.lang-btn'),items=[].slice.call(box.querySelectorAll('li'));
function waUrl(text){return 'https://wa.me/'+WHATSAPP_NUMBER+'?text='+encodeURIComponent(text)}
var modal=document.getElementById('book'),form=document.getElementById('bform'),mclose=document.getElementById('mclose'),bdone=document.getElementById('bdone'),lastFocus=null;
function render(){
 var t=L[lang];document.documentElement.lang=lang;document.documentElement.dir=t.dir;
 document.querySelectorAll('[data-k]').forEach(function(e){var v=t;e.dataset.k.split('.').forEach(function(k){v=v&&v[k]});if(typeof v==='string')e.textContent=v});
 document.querySelectorAll('[data-s]').forEach(function(e){var s=t.s[e.dataset.s];e.querySelector('h2').textContent=s[0];e.querySelector('.lead').textContent=s[1]});
 mclose.setAttribute('aria-label',t.f.close);
 document.querySelectorAll('.days').forEach(function(e){e.textContent=e.dataset.n+' '+t.days});
 document.getElementById('lcur').textContent=lang.toUpperCase();
 items.forEach(function(li){li.setAttribute('aria-selected',li.dataset.l===lang)});
 localStorage.setItem('lang',lang);fitSnap()}
function setOpen(o){box.classList.toggle('open',o);btn.setAttribute('aria-expanded',o);if(o){(box.querySelector('[aria-selected=true]')||items[0]).focus()}}
btn.onclick=function(){setOpen(!box.classList.contains('open'))};
items.forEach(function(li,i){
 li.onclick=function(){lang=li.dataset.l;render();setOpen(false);btn.focus()};
 li.onkeydown=function(e){
  if(e.key==='Enter'||e.key===' '){e.preventDefault();li.click()}
  else if(e.key==='ArrowDown'){e.preventDefault();items[(i+1)%items.length].focus()}
  else if(e.key==='ArrowUp'){e.preventDefault();items[(i+items.length-1)%items.length].focus()}}});
document.addEventListener('click',function(e){if(!box.contains(e.target))setOpen(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){if(!modal.hidden){closeModal();return}setOpen(false);btn.focus()}});
document.getElementById('burger').onclick=function(){document.body.classList.toggle('menu')};
document.querySelectorAll('nav a').forEach(function(a){a.onclick=function(){document.body.classList.remove('menu')}});
// reveal on scroll
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var r=e.target.querySelector('.rv');if(r)r.classList.add('in');io.unobserve(e.target)}})},{threshold:.2});
document.querySelectorAll('.hero,.sec').forEach(function(s){io.observe(s)});
// smooth section-by-section scrolling (desktop / mouse / trackpad)
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,touch=matchMedia('(pointer:coarse)').matches;
if(!reduce&&!touch){
 var S=[].slice.call(document.querySelectorAll('.hero,.sec')),busy=false,ease=function(t){return t<.5?8*t*t*t*t:1-Math.pow(-2*t+2,4)/2};
 function cur(){var y=scrollY+innerHeight/2,k=0;S.forEach(function(s,i){if(s.offsetTop<=y)k=i});return k}
 function to(y,dur){var a=scrollY,d=y-a,t0=null;if(Math.abs(d)<2)return;busy=true;
  (function f(t){if(t0===null)t0=t;var p=Math.min((t-t0)/(dur||1300),1);scrollTo(0,a+d*ease(p));
   if(p<1)requestAnimationFrame(f);else setTimeout(function(){busy=false},120)})(performance.now())}
 function step(dir){var i=cur(),n=S[i+dir];if(n)to(n.offsetTop)}
 addEventListener('wheel',function(e){
  if(document.documentElement.classList.contains('modal-open'))return;
  if(e.ctrlKey||Math.abs(e.deltaY)<Math.abs(e.deltaX))return;
  var r=S[cur()].getBoundingClientRect();
  if(e.deltaY>0&&r.bottom>innerHeight+4)return;   // tall block: scroll natively
  if(e.deltaY<0&&r.top<-4)return;
  e.preventDefault();if(busy||Math.abs(e.deltaY)<4)return;step(e.deltaY>0?1:-1)},{passive:false});
 addEventListener('keydown',function(e){
  if(document.documentElement.classList.contains('modal-open'))return;
  if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)||e.target.closest&&e.target.closest('.lang'))return;
  var d={ArrowDown:1,PageDown:1,' ':e.shiftKey?-1:1,ArrowUp:-1,PageUp:-1}[e.key];
  if(d){e.preventDefault();if(!busy)step(d)}});
 document.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){
  var t=document.getElementById(a.getAttribute('href').slice(1));if(t){e.preventDefault();to(t.offsetTop,1500)}})});
}


// mobile: if a pair of blocks is taller than the screen, also snap to the pair's bottom so nothing is unreachable
var mq=matchMedia('(max-width:768px) and (pointer:coarse)');
function fitSnap(){
 var S=[].slice.call(document.querySelectorAll('.sec'));
 S.forEach(function(s,i){
  s.style.scrollSnapAlign='';s.style.scrollSnapStop='';
  if(!mq.matches||i%2===0)return;
  var p=S[i-1],h=s.offsetTop+s.offsetHeight-p.offsetTop;
  if(h>innerHeight-58+4){s.style.scrollSnapAlign='end';s.style.scrollSnapStop='always'}})}
addEventListener('resize',fitSnap);addEventListener('load',fitSnap);
// ---------- booking popup ----------
var ACT={trips:'trip',discover:'discover',snorkeling:'snorkel'};
function openModal(sec){
 lastFocus=document.activeElement;document.body.classList.remove('menu');
 form.hidden=false;bdone.hidden=true;
 var d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());form.elements.date.min=d.toISOString().slice(0,10);
 if(ACT[sec])form.elements.act.value=ACT[sec];
 modal.hidden=false;document.documentElement.classList.add('modal-open');
 requestAnimationFrame(function(){modal.classList.add('open');form.elements.cname.focus({preventScroll:true})})}
function closeModal(){
 modal.classList.remove('open');document.documentElement.classList.remove('modal-open');
 setTimeout(function(){if(!modal.classList.contains('open'))modal.hidden=true},300);
 if(lastFocus&&lastFocus.focus)lastFocus.focus()}
document.querySelectorAll('[data-book]').forEach(function(b){b.onclick=function(){var s=b.closest('section');openModal(s&&s.id)}});
mclose.onclick=closeModal;document.getElementById('bclose2').onclick=closeModal;
modal.addEventListener('mousedown',function(e){if(e.target===modal)closeModal()});
modal.addEventListener('keydown',function(e){
 if(e.key!=='Tab')return;
 var f=[].slice.call(modal.querySelectorAll('button,input,select,textarea,a[href]')).filter(function(x){return x.offsetParent&&!x.disabled&&x.tabIndex>=0});
 if(!f.length)return;var first=f[0],last=f[f.length-1];
 if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
 else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}});
function finish(msg,text,wa){
 document.getElementById('bmsg').textContent=msg;
 var w=document.getElementById('bwa');w.hidden=!wa;if(wa)w.href=waUrl(text);
 form.hidden=true;bdone.hidden=false;form.reset();modal.querySelector('.mbox').scrollTop=0;
 (wa?w:document.getElementById('bclose2')).focus()}
form.onsubmit=function(e){
 e.preventDefault();
 var E=form.elements,t=L[lang].f;
 if(E._gotcha.value){finish(t.done,'',false);return}
 var lines=[t.msg,'',t.name+': '+E.cname.value.trim(),t.phone+': '+E.cphone.value.trim()];
 if(E.act.value)lines.push(t.act+': '+t.acts[E.act.value]);
 if(E.date.value)lines.push(t.date+': '+E.date.value);
 lines.push(t.guests+': '+E.guests.value);
 if(E.note.value.trim())lines.push(t.note.replace(/\s*\(.*\)/,'')+': '+E.note.value.trim());
 var text=lines.join('\n'),sb=form.querySelector('[type=submit]');
 if(window.FORM_ENDPOINT){
  sb.disabled=true;
  fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},
   body:JSON.stringify({name:E.cname.value.trim(),phone:E.cphone.value.trim(),activity:E.act.value,date:E.date.value,guests:E.guests.value,comment:E.note.value.trim(),message:text,lang:lang})})
  .then(function(r){if(!r.ok)throw 0;sb.disabled=false;finish(t.done,text,false)})
  .catch(function(){sb.disabled=false;window.open(waUrl(text),'_blank','noopener');finish(t.doneWa,text,true)})
 }else{window.open(waUrl(text),'_blank','noopener');finish(t.doneWa,text,true)}};
render()})();
