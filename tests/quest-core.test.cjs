const Q=require('../quest-core.js'),assert=require('node:assert/strict');
const s=Q.fresh();assert.equal(Q.xp(s),0);assert.equal(Q.level(s)[1],1);
for(const [i,m] of Q.missions.entries()){assert.equal(Q.complete(s,m.id,new Date('2026-11-26T12:00:00Z')),m.xp);assert.equal(Q.complete(s,m.id),0);assert.equal(Object.keys(s.completed).length,i+1);}assert.equal(Q.xp(s),180);assert.equal(Q.level(s)[1],4);
const restored=Q.validate(JSON.parse(JSON.stringify(s)));assert.deepEqual(restored,s);assert.equal(Q.weekly(s,new Date('2026-11-26T13:00:00Z')),4);assert.equal(Q.weekly(s,new Date('2026-12-05T13:00:00Z')),0);
s.quiz=Array(Q.questions.length).fill(0);s.quiz=[];assert.equal(Q.xp(s),180,'Retaking must not erase learning');
for(let type=0;type<6;type++){const choices=Q.questions.map(q=>{let i=q[1].findIndex(a=>a[1][0]===type);return i<0?Math.max(0,q[1].findIndex(a=>a[1][1]===type)):i;});assert.equal(Q.ranking(choices).order[0],type,`Style ${type} reachable`);}
const score=Q.ranking(Array(Q.questions.length).fill(0));assert.equal(score.scores.reduce((a,b)=>a+b),24);
assert.deepEqual(Q.grade('pattern',{a:'generate',b:'predict',c:'rule'}),[true,true,true]);assert.deepEqual(Q.grade('evidence',{a:'capacity',b:'faithful'}),[true,true]);assert.deepEqual(Q.grade('review',{order:'0,1,2,3'}),[true]);assert.deepEqual(Q.grade('review',{order:'1,3,0,2'}),[false]);assert.deepEqual(Q.grade('capstone',{a:'specific',b:'source',c:'approve'}),[true,true,true]);assert(Q.grade('capstone',{}).every(x=>!x));
for(const change of [{version:1},{quiz:[99]},{quiz:['0']},{completed:{fake:'2026-11-26'}},{notes:'x'.repeat(4001)},{goal:9},{path:99},{drafts:{pattern:{a:'x'.repeat(101)}}}])assert.throws(()=>Q.validate({...Q.fresh(),...change}));
const locked=Q.validate({...Q.fresh(),accessory:'halo'});assert.equal(locked.accessory,'none');
console.log('Passed: six styles reachable; scoring; progression; duplicate XP protection; week boundaries; grades; backup round-trip; corrupt backup rejection; accessory thresholds; quiz/progress independence.');
const legacy={...Q.fresh(),quiz:Array(12).fill(0)};Q.complete(legacy,'pattern');const migrated=Q.validate(legacy);assert.equal(migrated.quiz.length,8);assert.equal(Q.xp(migrated),30);assert.equal(Q.questions.length,8);console.log('Eight-question migration preserves learning progress.');
