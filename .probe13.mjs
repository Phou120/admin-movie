import { chromium } from 'playwright';
const B='http://localhost:5173';
const b=await chromium.launch({channel:'chrome',headless:true});
const ctx=await b.newContext();const p=await ctx.newPage();
const c=await ctx.newCDPSession(p);await c.send('Network.setCacheDisabled',{cacheDisabled:true});
let seen=[];
p.on('response',async r=>{ if(/payment\.vue/.test(r.url())){ let body='';try{body=await r.text()}catch{} seen.push({url:r.url(),status:r.status(),hasDebug:body.includes('DEBUG payment setup'),len:body.length}); }});
try{
  await p.goto(`${B}/login`,{waitUntil:'networkidle'});
  await p.fill('#login_email','super_admin@gmail.com');await p.fill('#login_password','super@2025-M');
  await Promise.all([p.waitForURL(u=>!u.pathname.includes('/login'),{timeout:20000}),p.click('button[type="submit"]')]);
  await p.goto(`${B}/payment`,{waitUntil:'networkidle'});
  await p.waitForTimeout(1500);
  console.log('payment.vue responses browser received:');
  seen.forEach(s=>console.log('  ',s.status,'hasMyDebug:',s.hasDebug,'len:',s.len,s.url.slice(-60)));
  if(!seen.length)console.log('  (browser never requested payment.vue!)');
}catch(e){console.log('ERR',e.message)}finally{await b.close()}
