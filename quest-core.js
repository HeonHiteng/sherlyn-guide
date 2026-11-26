/* AI Quest content and deterministic progression. Shared by the UI and tests. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Quest = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const styles = [
    {name:'Creator',icon:'✦',color:'#b267bd',line:'You turn possibility into something people can feel.',strengths:['Finding fresh angles','Shaping a story or experience'],habit:'Set one constraint before you start creating.',example:'a caption for a fictional art workshop',next:1},
    {name:'Explorer',icon:'✧',color:'#7974c9',line:'Your next good idea starts with “what if?”',strengths:['Asking unexpected questions','Connecting unfamiliar ideas'],habit:'Explain one discovery in your own words.',example:'a beginner explanation of a fictional science exhibit',next:1},
    {name:'Researcher',icon:'⌕',color:'#478c90',line:'You look past a convincing answer to find the evidence.',strengths:['Comparing evidence','Noticing missing information'],habit:'Name what evidence could change your mind.',example:'a summary of a fictional museum event',next:2},
    {name:'Builder',icon:'⌘',color:'#a77353',line:'You make ideas tangible, one small test at a time.',strengths:['Breaking ideas into steps','Learning through prototypes'],habit:'Define a success check before adding features.',example:'a description for a fictional app-building workshop',next:4},
    {name:'Optimizer',icon:'ϟ',color:'#7d9363',line:'You make room for better work by simplifying the routine.',strengths:['Spotting repeated steps','Creating reusable processes'],habit:'Keep human review before important actions.',example:'a reusable reminder for a fictional weekly meetup',next:3},
    {name:'Strategist',icon:'◇',color:'#8d6ab6',line:'You connect today’s choices to tomorrow’s possibilities.',strengths:['Comparing trade-offs','Clarifying priorities'],habit:'Make one hidden assumption explicit.',example:'an invitation for a fictional planning session',next:4}
  ];
  // Each answer supports two preferences; no points measure knowledge or ability.
  const questions = [
    ['A friend has a promising idea but no starting point. You…', [['Sketch what it could look like',[0,3]],['Ask questions that open new possibilities',[1,2]],['Find the smallest useful next step',[4,3]],['Compare a few directions before choosing',[5,2]]]],
    ['An AI answer surprises you. What happens next?', [['Follow the surprising idea somewhere new',[1,0]],['Look for the evidence behind it',[2,5]],['Try it on a small example',[3,4]],['Ask how it changes the original plan',[5,1]]]],
    ['You’re helping with a community event. Pick your task.', [['Make the invitation feel memorable',[0,5]],['Find out what people actually need',[2,1]],['Set up a simple sign-up experience',[3,0]],['Reduce the organiser’s repetitive work',[4,5]]]],
    ['A project has too many possibilities. What helps you?', [['An unusual example to react to',[1,0]],['A clear definition of success',[5,3]],['A quick comparison with evidence',[2,4]],['A repeatable process for narrowing choices',[4,2]]]],
    ['You have 20 minutes to experiment. Choose one.', [['Remix an ordinary idea into three new versions',[0,1]],['Make a tiny thing that works',[3,4]],['Test a statement you’ve taken for granted',[2,1]],['Explore the trade-offs in a decision',[5,4]]]],
    ['The first draft is technically fine, but not useful. You…', [['Change the voice and perspective',[0,2]],['Ask what important question is missing',[1,5]],['Try it in the situation it was made for',[3,2]],['Remove steps and make it easier to reuse',[4,0]]]],
    ['Which folder would you most like to open?', [['Things I never knew existed',[1,3]],['Ideas worth turning into stories',[0,4]],['Questions with surprisingly complicated answers',[2,5]],['Plans that became something real',[5,3]]]],
    ['Your team is stuck. You would rather…', [['Build a rough example everyone can respond to',[3,0]],['Separate the known facts from guesses',[2,4]],['Connect ideas from a different field',[1,5]],['Find the bottleneck and simplify it',[4,3]]]],

  ];
  const chapters = [
    ['AI Foundations','Get your bearings. Learn where AI helps—and where your judgement matters.',['Recognise the pattern','Evidence over confidence','Keep a human in the loop','Your first AI workflow']],
    ['Prompt Playground','Shape a useful request, then improve it.',['Give useful context','Show an example','Refine a first draft','Prompt makeover']],
    ['Truth Detective','Follow the evidence behind an answer.',['Spot an unsupported claim','Find the original source','Compare conflicting answers','Fact-check a briefing']],
    ['Tool Connections','Understand how assistants reach beyond a chat.',['Choose the right tool','Understand APIs','Meet MCP','Map a tool connection']],
    ['Agent Workshop','Design useful workflows with clear boundaries.',['Instructions and goals','Tools and permissions','Approval checkpoints','Design an agent workflow']]
  ];
  const missions = [
    {id:'pattern',title:'Recognise the pattern',xp:30,time:'3–5 min',objective:'Tell generation, prediction, and a fixed rule apart.',body:'AI is a broad term for systems that perform tasks such as making predictions, recommendations, or generating content. Machine learning is one approach: a system learns patterns from examples. Generative AI produces content such as text or images. Not every automated task needs AI—a fixed instruction can be enough.',takeaway:'Choose a tool for the task. “Automated” and “AI” do not mean the same thing.',kind:'sort'},
    {id:'evidence',title:'Evidence over confidence',xp:40,time:'3–5 min',objective:'Separate supported facts from plausible additions.',body:'A fluent answer can still be wrong. Generative AI can add details that were never in its source, or present false information confidently. Asking it to sound certain does not make it accurate. Compare the answer with the original material, and verify important claims independently.',takeaway:'Check the claim against its source, not the confidence of its wording.',kind:'evidence'},
    {id:'review',title:'Keep a human in the loop',xp:50,time:'3–7 min',objective:'Put review before an action that affects other people.',body:'Generating a draft and sending it are different actions. An assistant with a connected tool may be able to act outside the chat. A useful workflow gives it only the information and permissions it needs, then adds a human check before publishing or sending. Use fictional data while practising.',takeaway:'Let AI help prepare the work. Keep approval before consequential actions.',kind:'order'},
    {id:'capstone',title:'Your first AI workflow',xp:60,time:'5–7 min',objective:'Combine a clear task, a source, and a human review step.',body:'Your project is a short event invitation. Choose a useful instruction, identify the source you would rely on, and decide what happens before sending. The exercise uses fixed examples, not a live AI model. You can download the finished workflow and reuse its structure.',takeaway:'A useful AI workflow has a clear request, evidence to check, and a deliberate approval step.',kind:'project'}
  ];
  const awards = [
    {name:'Pattern Spotter',criterion:'Correctly sort all three tasks.',id:'pattern'},
    {name:'Evidence Detective',criterion:'Find the unsupported claim and choose a faithful rewrite.',id:'evidence'},
    {name:'Thoughtful Operator',criterion:'Place every workflow step in the correct order.',id:'review'},
    {name:'Workflow Designer',criterion:'Pass all three final-project checks.',id:'capstone'}
  ];
  const accessories=[['none','Just me',0],['glasses','Thinking glasses',30],['scarf','Curiosity scarf',90],['halo','Orbit halo',180]];
  function fresh(){return {version:2,quiz:[],path:0,completed:{},drafts:{},goal:2,accessory:'none',notes:'',welcomeSeen:false};}
  function validate(v){
    if(!v||v.version!==2||!Array.isArray(v.quiz)||v.quiz.length>12||!v.quiz.every(x=>Number.isInteger(x)&&x>=0&&x<4))throw Error('Invalid quiz data');
    if(!Number.isInteger(v.path)||v.path<0||v.path>5||![1,2,3,4].includes(v.goal)||!accessories.some(a=>a[0]===v.accessory))throw Error('Invalid preferences');
    if(!v.completed||typeof v.completed!=='object'||Array.isArray(v.completed)||!v.drafts||typeof v.drafts!=='object'||Array.isArray(v.drafts))throw Error('Invalid progress');
    const s=fresh();s.quiz=v.quiz.slice(0,questions.length);s.path=v.path;s.goal=v.goal;s.accessory=v.accessory;s.welcomeSeen=v.welcomeSeen===true;
    if(typeof v.notes!=='string'||v.notes.length>4000)throw Error('Invalid notes');s.notes=v.notes;
    for(const [id,date] of Object.entries(v.completed)){if(!missions.some(m=>m.id===id)||typeof date!=='string'||!Number.isFinite(Date.parse(date))||Date.parse(date)<Date.UTC(2020,0)||Date.parse(date)>Date.now()+86400000)throw Error('Invalid completion');s.completed[id]=new Date(date).toISOString();}
    for(const [id,draft] of Object.entries(v.drafts)){if(!missions.some(m=>m.id===id)||!draft||typeof draft!=='object'||Array.isArray(draft))throw Error('Invalid mission');s.drafts[id]={};for(const [k,val] of Object.entries(draft)){if(!['a','b','c','order'].includes(k)||typeof val!=='string'||val.length>100)throw Error('Invalid answer');s.drafts[id][k]=val;}}
    if(accessories.find(a=>a[0]===s.accessory)[2]>xp(s))s.accessory='none';return s;
  }
  function ranking(answers){const scores=styles.map(()=>0);answers.forEach((a,i)=>{const weights=questions[i]?.[1][a]?.[1];if(weights){scores[weights[0]]+=2;scores[weights[1]]+=1;}});const order=styles.map((_,i)=>i).sort((a,b)=>scores[b]-scores[a]||a-b);const supported=scores[order[1]]>=Math.max(4,scores[order[0]]*.6);return {scores,order,secondary:supported?order[1]:null,blend:supported&&scores[order[0]]-scores[order[1]]<=2};}
  function xp(s){return missions.reduce((n,m)=>n+(s.completed[m.id]?m.xp:0),0);}
  function level(s){const n=xp(s);return n>=180?['Pathfinder',4,180]:n>=120?['Practitioner',3,180]:n>=60?['Investigator',2,120]:['Curious beginner',1,60];}
  function complete(s,id,now=new Date()){if(!missions.some(m=>m.id===id))throw Error('Unknown mission');if(s.completed[id])return 0;s.completed[id]=now.toISOString();return missions.find(m=>m.id===id).xp;}
  function weekly(s,now=new Date()){const start=new Date(now);start.setHours(0,0,0,0);start.setDate(start.getDate()-(start.getDay()+6)%7);return Object.values(s.completed).filter(d=>new Date(d)>=start&&new Date(d)<=now).length;}
  function grade(id,d){if(id==='pattern')return [d.a==='generate',d.b==='predict',d.c==='rule'];if(id==='evidence')return [d.a==='capacity',d.b==='faithful'];if(id==='review')return [d.order==='0,1,2,3'];if(id==='capstone')return [d.a==='specific',d.b==='source',d.c==='approve'];return [];}
  return {styles,questions,chapters,missions,awards,accessories,fresh,validate,ranking,xp,level,complete,weekly,grade};
});
