(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.Quest=api;})(globalThis,function(){
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
    ['Your friend has a new idea. How do you help?', [['Draw it out',[0,3]],['Ask more questions',[1,2]],['Find an easy first step',[4,3]],['Compare a few options',[5,2]]]],
    ['AI gives you a surprising answer. You…', [['Explore it more',[1,0]],['Check if it is true',[2,5]],['Test it out',[3,4]],['Rethink your plan',[5,1]]]],
    ['You are planning a party. Pick a job.', [['Design the invite',[0,5]],['Ask what guests want',[2,1]],['Build a sign-up page',[3,0]],['Make the jobs easier',[4,5]]]],
    ['Too many ideas! What helps you choose?', [['See something different',[1,0]],['Decide on a goal',[5,3]],['Compare the facts',[2,4]],['Use a simple checklist',[4,2]]]],
    ['You have 20 free minutes. What sounds fun?', [['Create something new',[0,1]],['Build a small tool',[3,4]],['Check a surprising fact',[2,1]],['Plan your next move',[5,4]]]],
    ['AI gives you a boring first draft. You…', [['Give it more personality',[0,2]],['Ask a new question',[1,5]],['Try it in real life',[3,2]],['Make it simpler',[4,0]]]],
    ['Which folder would you open first?', [['Cool discoveries',[1,3]],['Creative ideas',[0,4]],['Mysteries explained',[2,5]],['Plans that worked',[5,3]]]],
    ['Your team is stuck. What do you do?', [['Make a quick example',[3,0]],['Check what we know',[2,4]],['Try a fresh idea',[1,5]],['Find an easier way',[4,3]]]],

  ];
  function ranking(answers){const scores=styles.map(()=>0);answers.forEach((a,i)=>{const weights=questions[i]?.[1][a]?.[1];if(weights){scores[weights[0]]+=2;scores[weights[1]]+=1;}});const order=styles.map((_,i)=>i).sort((a,b)=>scores[b]-scores[a]||a-b);const supported=scores[order[1]]>=Math.max(4,scores[order[0]]*.6);return {scores,order,secondary:supported?order[1]:null,blend:supported&&scores[order[0]]-scores[order[1]]<=2};}
function validateQuiz(value){if(!Array.isArray(value)||value.length>12||!value.every(n=>Number.isInteger(n)&&n>=0&&n<4))throw Error('Invalid quiz');return value.slice(0,questions.length);}
return {styles,questions,ranking,validateQuiz};
});