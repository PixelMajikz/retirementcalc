const IMG={
  scene1:'assets/images/scene1.jpg',
  logo:'assets/images/logo.jpg',
  couple4:'assets/images/couple4.jpg',
  boy6:'assets/images/boy6.jpg',
  home_own:'assets/images/home_own.jpg',
  home_fam:'assets/images/home_fam.jpg',
  act_travel:'assets/images/act_travel.jpg',
  act_garden:'assets/images/act_garden.jpg',
  act_relig:'assets/images/act_relig.jpg',
  act_care:'assets/images/act_care.jpg',
  tr_bus:'assets/images/tr_bus.jpg',
  tr_tuk:'assets/images/tr_tuk.jpg',
  tr_fam:'assets/images/tr_fam.jpg',
  tr_car:'assets/images/tr_car.jpg',
  heart:'assets/images/heart.jpg',
  coins:'assets/images/coins.jpg',
  p25:'assets/images/p25.jpg',
  p30:'assets/images/p30.jpg',
  p35:'assets/images/p35.jpg',
  p40:'assets/images/p40.jpg',
  p45:'assets/images/p45.jpg',
  p50:'assets/images/p50.jpg',
  p55:'assets/images/p55.jpg',
  piggy:'assets/images/piggy.jpg',
  calcheck:'assets/images/calcheck.jpg',
  chart:'assets/images/chart.jpg',
  calcoin:'assets/images/calcoin.jpg',
  sprout:'assets/images/sprout.jpg',
  book:'assets/images/book.jpg'
};
/* ---------- Assumptions (from the "Assumptions" sheet) ---------- */
const A={infl:.05,pre:.08,post:.08,ret:60,plan:75,health:15000,minAge:15,maxAge:55,starts:[25,30,35,40,45,50,55]};
const HOME=[{l:'Own / separate home',s:'Own home',v:60000,i:'home_own'},{l:'With children / family',s:'With family',v:10000,i:'home_fam'}];
const ACT=[{l:'Social & Travel',s:'Social & Travel',v:10000,i:'act_travel'},{l:'Cozy + Farming / Gardening',s:'Cozy & Gardening',v:5000,i:'act_garden'},{l:'Religious / Social Activities',s:'Religious / Social',v:8000,i:'act_relig'},{l:'Supporting / Caring for Family',s:'Caring for Family',v:1000,i:'act_care'}];
const TR=[{l:'Public Transport',s:'Public transport',v:5000,i:'tr_bus'},{l:'Tuk-tuk / Taxi',s:'Tuk-tuk / Taxi',v:8000,i:'tr_tuk'},{l:'With Family',s:'With family',v:2000,i:'tr_fam'},{l:'Own Vehicle',s:'Own vehicle',v:15000,i:'tr_car'}];
const G={h:HOME,a:ACT,t:TR};
const PASSWORD='finlit2026'; // change this to set the login password
const S={step:0,age:'',ret:60,h:null,a:null,t:null};
const RET=[50,55,60,65];
const rs=n=>'Rs. '+Math.round(n).toLocaleString('en-US');
const mil=n=>n>=1e6?'Rs. '+(n/1e6).toFixed(1)+' Million':rs(n);
const im=(k,c='')=>`<img class="${c}" src="${IMG[k]}" alt="">`;
/* ---------- Calculator (mirrors the "Calculator" sheet) ---------- */
function monthlySaving(fund,start){const n=start<A.ret?A.ret-start:0;if(!n)return 0;
 const i=Math.pow(1+A.pre,1/12)-1;return fund*i/(Math.pow(1+i,n*12)-1)}
function calc(){
 A.ret=S.ret;const age=+S.age,yrs=A.ret-age;
 const today=HOME[S.h].v+ACT[S.a].v+TR[S.t].v+A.health;
 const c60=today*Math.pow(1+A.infl,yrs);
 const period=A.plan-A.ret,rm=Math.pow(1+A.post,1/12),gm=Math.pow(1+A.infl,1/12);
 const fund=c60*(1-Math.pow(gm/rm,period*12))/(rm-gm)*rm;
 const next=A.starts.find(s=>s>=age&&s<A.ret)||age;
 return{age,today,c60,fund,next,nm:monthlySaving(fund,next),cur:monthlySaving(fund,age),rows:A.starts.map(s=>({s,m:monthlySaving(fund,s)}))}}
/* ---------- Rendering ---------- */
function head(n){if(!n)return'';return`<header><div class="logo">${im('logo')}</div><div class="prog"><b class="pill">Step ${n} of 6</b><div class="dots">${[1,2,3,4,5,6].map(i=>`<i class="${i<n?'d':i==n?'c':''}">${i<n?'✓':i}</i>`).join('')}</div></div><div class="badge"><b>Meet Future Me</b><span>Your Choices. A Brighter Tomorrow.</span></div></header>`}
function nav(back,next,label,dis,backLabel='Back'){return`<div class="nav"><button class="btn alt" onclick="${back}">${L} ${backLabel}</button><button class="btn go" id="nx" onclick="${next}" ${dis?'disabled':''}>${label} ${R}</button></div>`}
const ar=p=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"><path d="${p}"/></svg>`;
const L=ar('M20 12H4M11 5l-7 7 7 7'),R=ar('M4 12h16M13 5l7 7-7 7');
const go=n=>{S.step=n;render();scrollTo(0,0)};
const okStep2=()=>validAge()&&S.ret&&S.ret>+S.age;
const validAge=()=>Number.isInteger(+S.age)&&S.age!==''&&+S.age>=A.minAge&&+S.age<=A.maxAge;
function pickRet(v){S.ret=v;A.ret=v;updRets()}
function updRets(){document.querySelectorAll('.rb').forEach(b=>{const v=+b.dataset.v;
 b.disabled=validAge()&&v<=+S.age;if(b.disabled&&S.ret===v)S.ret=null;b.classList.toggle('on',S.ret===v)});
 document.getElementById('nx').disabled=!okStep2()}
function setAge(v){S.age=v===''?'':Math.round(+v);const ok=validAge();
 updRets();
 document.getElementById('err').textContent=(v===''||ok)?'':`Please enter an age between ${A.minAge} and ${A.maxAge}.`}
function bump(d){const v=Math.min(A.maxAge,Math.max(A.minAge,(+S.age||35)+d));S.age=v;document.getElementById('age').value=v;setAge(v)}
function pick(g,i){S[g]=i;
 [...document.querySelector(`.opts[data-g="${g}"]`).children].forEach((b,j)=>b.classList.toggle('on',j===i));
 document.getElementById('nx').disabled=S.h===null||S.a===null||S.t===null}
function opts(g,cls){return`<div class="opts ${cls}" data-g="${g}">${G[g].map((o,i)=>`<button class="opt ${S[g]===i?'on':''}" onclick="pick('${g}',${i})">${im(o.i)}<span>${o.l}</span></button>`).join('')}</div>`}
function login(){const i=document.getElementById('pw'),er=document.getElementById('err');
 try{
  if(i.value.trim().toLowerCase()===PASSWORD.toLowerCase()){go(1)}
  else{er.textContent='Incorrect password. Please try again.';i.value='';i.focus();
   const c=i.closest('.card');c.classList.remove('shake');void c.offsetWidth;c.classList.add('shake')}
 }catch(x){er.textContent='Something went wrong: '+x.message;console.error(x)}
}
const views={
0:()=>`<main><div class="card lg">${im('logo')}<h2>Welcome</h2><p class="sub" style="margin-bottom:10px">Please enter the password to continue.</p><div><input id="pw" type="password" onkeydown="if(event.key==='Enter')login()" placeholder="Password" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Password"><p class="err" id="err"></p><button class="btn" type="button" onclick="login()">Enter ${R}</button></div></div></main>`,
1:()=>`<main><div class="s1">${im('scene1')}<button class="btn s1b" onclick="go(2)">Let’s Begin ${R}</button></div></main>`,
2:()=>`<main><h2>Let’s get to know you</h2><p class="sub">A few quick details to build your future.</p>
<div class="card narrow"><h3><span class="ic">👤</span>How old are you now?</h3><div class="step"><button onclick="bump(-1)" aria-label="Decrease">−</button><input id="age" type="number" min="${A.minAge}" max="${A.maxAge}" value="${S.age}" oninput="setAge(this.value)" onkeydown="if(event.key==='Enter'&&okStep2())go(3)"><button onclick="bump(1)" aria-label="Increase">+</button></div><p class="hint">(Age ${A.minAge} – ${A.maxAge} years)</p><p class="err" id="err"></p></div>
<div class="card narrow"><h3><span class="ic">📅</span>At what age would you like to retire?</h3><div class="rets">${RET.map(v=>`<button class="rb ${S.ret===v?'on':''}" data-v="${v}" ${validAge()&&v<=+S.age?'disabled':''} onclick="pickRet(${v})">${v}</button>`).join('')}</div></div>
<div class="narrow" style="margin:0 auto;width:100%">${nav('go(1)','go(3)','Next',!okStep2())}</div></main>`,
3:()=>`<main><h2>Build Your Future Life</h2><p class="sub">Choose the lifestyle you’d like to have at retirement. <span class="hand">Design a life you’ll love at ${A.ret}!</span></p>
<div class="card"><h3><span class="ic">🏠</span>Where will you live?</h3>${opts('h','o2')}</div>
<div class="card"><h3><span class="ic">⭐</span>How would you like to spend your retirement?</h3>${opts('a','o4')}</div>
<div class="card"><h3><span class="ic">🚗</span>How will you get around?</h3>${opts('t','o4')}</div>
${nav('go(2)','go(4)','See My Future',S.h===null||S.a===null||S.t===null)}</main>`,
4:()=>{const c=calc(),ch=[[HOME[S.h],'home'],[ACT[S.a]],[TR[S.t]]];
 return`<main><div class="side">${im('couple4','scene')}<div><h2 style="text-align:left">Welcome to Age ${A.ret}!</h2><p class="sub" style="text-align:left">This is the life you chose. <span class="hand">Still exploring. Still enjoying. Still you!</span></p>
<div class="card"><h3 style="justify-content:center">Your chosen lifestyle</h3><div class="grid4">${ch.map(([o])=>`<div class="tile">${im(o.i)}${o.s}</div>`).join('')}<div class="tile">${im('heart')}Healthcare included</div></div>
<div class="two"><div class="amt blue">Your lifestyle today<b>${rs(c.today)}</b>per month</div><div class="amt pink">The same lifestyle at age ${A.ret}<b>${rs(c.c60)}</b>per month</div></div>
<div class="amt gold fund">${im('coins')}<span>Fund you may need at retirement</span><b>${mil(c.fund)}</b></div></div></div></div>
${nav('go(3)','go(5)','See the Difference')}</main>`},
5:()=>{const c=calc(),e=A.starts.filter(s=>s<c.next).length,mid=A.starts.includes(c.next)?1:0,w=7-e-mid;
 return`<main><h2>What if you started at…?</h2><p class="sub">See how much you would need to save each month to reach your goal. <span class="hand">The earlier you start, the easier it is!</span></p>
<div class="card"><div class="bands">${e?`<div style="grid-column:span ${e};background:#cdeede">If you had started earlier</div>`:''}${mid?'<div style="background:#fff0a8">Your next starting point</div>':''}${w?`<div style="grid-column:span ${w};background:#fbd8dc">If you wait</div>`:''}</div>
<div class="cols">${c.rows.map(r=>`<div class="col ${r.s===c.next?'nx':''} ${r.s>=A.ret?'off':''}"><div class="n">${r.s}</div>${im('p'+r.s)}<small>Age ${r.s}</small><div class="m">${r.s>=A.ret?'—':rs(r.m)}</div><small>${r.s>=A.ret?'past retirement':'per month'}</small></div>`).join('')}</div></div>
<div class="tip"><i>💡</i><span>Starting earlier gives your money more time to grow.<br>Even a small amount can make a big difference!</span></div>
<div class="est"><span>Estimated Monthly Savings from your current age</span><b>${rs(c.cur)}</b></div>
<div style="margin-top:16px">${nav('go(4)','go(6)','Next')}</div></main>`},
6:()=>{const c=calc();
 return`<main><div class="side">${im('boy6','scene')}<div><p class="hand" style="font-size:1.8rem;margin:0 0 8px">A brighter tomorrow is in your hands!</p>
<div class="card"><h2 style="margin-bottom:4px">Your Future Starts Today</h2><p class="sub" style="font-size:1.1rem">You’ve taken an important step towards a more secure and fulfilling future.</p>
<div class="amt big gold"><div>Your retirement goal<b>${rs(c.fund)}</b></div>${im('sprout')}</div>
<div class="amt big blue"><div>If you start from your next available age (${c.next})<b>${rs(c.nm)}</b>per month</div>${im('calcoin')}</div>
<div class="row3"><div>${im('piggy')}Start Early</div><div>${im('calcheck')}Save Regularly</div><div>${im('chart')}Review Your Plan</div></div>
<div class="guide">${im('book')}<span>Want to know how we calculated this?<br><b>Take the Pension Planning Guide</b></span></div></div></div></div>
<div class="nav"><button class="btn alt" onclick="S.age='';S.h=S.a=S.t=null;go(1)">${L} Start Over</button><button class="btn go" onclick="plan()">Plan My Brighter Tomorrow ${R}</button></div>
<p class="note">Illustration only – based on assumed inflation of ${A.infl*100}% and returns of ${A.pre*100}% p.a.; actual results will vary.</p></main>`}};
function plan(){const c=calc(),m=document.createElement('div');m.className='modal';
 m.onclick=e=>{if(e.target===m)m.remove()};
 m.innerHTML=`<div class="card"><h2>Your Plan</h2><ul><li>Age now: ${c.age} · Retire at ${A.ret}</li><li>Living: ${HOME[S.h].s} · Retirement: ${ACT[S.a].s} · Transport: ${TR[S.t].s}</li><li>Monthly cost today: ${rs(c.today)}</li><li>Monthly cost at ${A.ret}: ${rs(c.c60)}</li><li>Fund needed at ${A.ret}: ${rs(c.fund)}</li><li>Save from age ${c.next}: ${rs(c.nm)} per month</li></ul><div class="nav" style="justify-content:center"><button class="btn" onclick="this.closest('.modal').remove()">Close</button></div></div>`;
 document.body.appendChild(m)}
function render(){document.getElementById('app').innerHTML=head(S.step)+views[S.step]();
 if(S.step===0)document.getElementById('pw').focus();
 if(S.step===2){const a=document.getElementById('age');if(a&&!S.age)a.focus()}}
render();
