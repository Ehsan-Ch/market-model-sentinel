export function validProbability(p){return Array.isArray(p)&&p.length===3&&p.every(x=>Number.isFinite(x)&&x>=0&&x<=1)&&Math.abs(p.reduce((a,b)=>a+b,0)-1)<1e-5;}
export function snapshot(rows,clock,{window=60,minLabels=30,lossThreshold=1.3,staleSeconds=40}={}){
 const now=Date.parse(clock);if(!Number.isFinite(now)||window<1||minLabels<1)throw Error('Invalid monitor configuration');
 const arrived=rows.filter(r=>Date.parse(r.received)<=now),seen=new Set(),clean=[];let duplicates=0,invalid=0;
 for(const r of arrived){if(seen.has(r.id)){duplicates++;continue;}seen.add(r.id);if(!validProbability(r.p)||!Number.isFinite(Date.parse(r.time))||!Number.isFinite(Date.parse(r.labelAvailable))||Date.parse(r.received)<Date.parse(r.time)||Date.parse(r.labelAvailable)<Date.parse(r.time)||![0,1,2].includes(r.actual)){invalid++;continue;}clean.push(r);}
 clean.sort((a,b)=>Date.parse(a.time)-Date.parse(b.time));
 const matured=clean.filter(r=>Date.parse(r.labelAvailable)<=now).slice(-window);
 const loss=matured.length?-matured.reduce((s,r)=>s+Math.log(Math.max(1e-12,r.p[r.actual])),0)/matured.length:null;
 const accuracy=matured.length?matured.filter(r=>r.p.indexOf(Math.max(...r.p))===r.actual).length/matured.length:null;
 const last=clean.at(-1),age=last?(now-Date.parse(last.time))/1000:null;
 return {clock,received:arrived.length,accepted:clean.length,duplicates,invalid,matured:matured.length,pending:clean.filter(r=>Date.parse(r.labelAvailable)>now).length,loss,accuracy,age,
 rules:{quality:duplicates+invalid>0?'BREACH':'CLEAR',freshness:age===null||age>staleSeconds?'BREACH':'CLEAR',performance:matured.length<minLabels?'WARMUP':loss>lossThreshold?'BREACH':'CLEAR'},
 recent:clean.slice(-8).reverse().map(r=>({id:r.id,time:r.time,p:r.p,actual:Date.parse(r.labelAvailable)<=now?r.actual:null}))};
}
export function replay(rows,clocks,options){
 const state=Object.fromEntries(['quality','freshness','performance'].map(k=>[k,{open:false,bad:0,good:0}])),events=[],history=[];
 for(const clock of clocks){const s=snapshot(rows,clock,options);for(const [rule,status]of Object.entries(s.rules)){const r=state[rule];if(status==='WARMUP'){r.bad=0;r.good=0;continue;}if(status==='BREACH'){r.bad++;r.good=0;if(!r.open&&r.bad>=2){r.open=true;events.push({clock,rule,event:'OPEN'});}}else{r.good++;r.bad=0;if(r.open&&r.good>=2){r.open=false;events.push({clock,rule,event:'RESOLVED'});}}}history.push({...s,open:Object.keys(state).filter(k=>state[k].open)});}
 return {history,events,open:Object.keys(state).filter(k=>state[k].open)};
}
export function scenario(source,kind){
 return source.map((r,i)=>({...r,id:String(i),received:kind==='delayed'&&i>=40&&i<65?new Date(Date.parse(r.time)+120000).toISOString():r.time,p:kind==='overconfident'&&i>=30&&i<85?r.p.map(x=>x**4/r.p.reduce((s,v)=>s+v**4,0)):[...r.p]})).flatMap((r,i)=>kind==='corrupt'&&i===45?[r,{...r}, {...r,id:'bad',p:[2,-1,0]}]:[r]);
}
