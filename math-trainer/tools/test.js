const fs=require('fs'),vm=require('vm');
const code=['core.js','gen1.js','gen2.js','gen0.js','lt1.js','lt2.js','lt0.js'].map(f=>fs.readFileSync(__dirname+'/../js/'+f,'utf8')).join('\n')+'\n;globalThis.__x={TYPES,checkStep,numeric,parseNum,S,val,TOPICS};';
vm.runInThisContext(code);
const {TYPES,checkStep,numeric,parseNum,S,val}=globalThis.__x;
const N=+process.argv[2]||400; let fails=0;
const fn=(x,ctx)=>typeof x==='function'?x(ctx):x;
// parser checks
const pc=[['3/4',.75],['-2,5',-2.5],['3sqrt(2)',3*Math.SQRT2],['7pi/6',7*Math.PI/6],['sqrt(3)/2',Math.sqrt(3)/2],['-inf',-Infinity],['∞',Infinity],['2^3',8],['sqrt(5/3)',Math.sqrt(5/3)],['−1/2',-.5],['pi',Math.PI],['-sqrt3',-Math.sqrt(3)],['1 1',11*0+NaN],['abc',NaN],['',NaN],['(1+2)*3',9],['2(3)',6],['+∞',Infinity]];
for(const [s,e] of pc){const v=parseNum(s); if(!(Object.is(v,e)||Math.abs(v-e)<1e-12||(isNaN(v)&&isNaN(e)))){console.log('PARSER',JSON.stringify(s),v,e);fails++}}
const LANGS=[['en',t=>t.gen],['lt',t=>t.L&&t.L.gen]];
for(const [lg,getGen] of LANGS) for(const t of TYPES){
  const gen=getGen(t); if(!gen){console.log('MISSING',lg,t.id);fails++;continue}
  let stepsTotal=0;
  for(let n=0;n<N;n++){
    let p; try{p=gen()}catch(e){console.log('GEN ERR',t.id,e.stack.split('\n').slice(0,3).join(' | '));fails++;break}
    const ctx={}; if(typeof p.q!=='string'||/undefined|NaN|\[object/.test(p.q)){console.log('BAD Q',t.id,p.q.slice(0,200));fails++;break}
    let bad=false;
    for(const [k,s] of p.steps.entries()){
      stepsTotal++;
      try{
        const q=fn(s.q,ctx);
        const raw=s.ans; 
        // round-trip through the text the UI would fill in on "show answer"
        const typed=s.fields.map((f,i)=>f.k==='num'?parseNum(S(raw[i])):f.k==='mat'?raw[i].map(r=>r.map(x=>parseNum(S(x)))):raw[i]);
        const r=checkStep(s,typed,ctx);
        if(!r.ok){console.log('ANS REJECTED',t.id,'step',k,JSON.stringify(typed),r.msg||'');fails++;bad=true;break}
        if(s.save) s.save(ctx);
        if(s.ansFn){const a=s.ansFn(ctx); const r2=checkStep(s,a.map((x,i)=>numeric(s.fields[i],x)),ctx); if(!r2.ok){console.log('ANSFN REJECTED',t.id,k);fails++;bad=true;break}}
        // wrong answers must be rejected
        const wrong=s.fields.map((f,i)=>f.k==='num'?(isFinite(typed[i])?typed[i]+1:0):f.k==='mat'?typed[i].map((r,a)=>r.map((x,b)=>x+0.37*(a+1)-0.21*(b+1))):f.k==='choice'?(typed[i]+1)%f.options.length:typed[i].map((x,j)=>j===0?!x:x));
        const hasMod=s.fields.some(f=>f.mod);
        const c2=JSON.parse(JSON.stringify(ctx));
        const rw=checkStep(s,wrong,c2);
        if(rw.ok && !hasMod){console.log('WRONG ACCEPTED',t.id,'step',k,JSON.stringify(wrong));fails++;bad=true;break}
        const texts=[q,fn(s.hint,ctx),fn(s.sol,ctx),...s.fields.map(f=>f.label||''),...s.fields.flatMap(f=>f.options||[])].join(' ');
        if(/undefined|NaN|\[object|Infinity/.test(texts)){console.log('BAD TEXT',t.id,'step',k,texts.match(/.{0,60}(undefined|NaN|\[object|Infinity).{0,40}/)[0]);fails++;bad=true;break}
      }catch(e){console.log('STEP ERR',t.id,k,e.stack.split('\n').slice(0,3).join(' | '));fails++;bad=true;break}
    }
    if(bad)break;
  }
  console.log('ok',lg,t.id.padEnd(10),'topic',t.topic,'steps/problem',(stepsTotal/N).toFixed(1));
}
console.log(fails?('FAILS: '+fails):'ALL PASS', TYPES.length,'types');
