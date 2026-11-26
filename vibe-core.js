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
    ['A friend has a promising idea but no starting point. You…', [['Sketch what it could look like',[0,3]],['Ask questions that open new possibilities',[1,2]],['Find the smallest useful next step',[4,3]],['Compare a few directions before choosing',[5,2]]]],
    ['An AI answer surprises you. What happens next?', [['Follow the surprising idea somewhere new',[1,0]],['Look for the evidence behind it',[2,5]],['Try it on a small example',[3,4]],['Ask how it changes the original plan',[5,1]]]],
    ['You’re helping with a community event. Pick your task.', [['Make the invitation feel memorable',[0,5]],['Find out what people actually need',[2,1]],['Set up a simple sign-up experience',[3,0]],['Reduce the organiser’s repetitive work',[4,5]]]],
    ['A project has too many possibilities. What helps you?', [['An unusual example to react to',[1,0]],['A clear definition of success',[5,3]],['A quick comparison with evidence',[2,4]],['A repeatable process for narrowing choices',[4,2]]]],
    ['You have 20 minutes to experiment. Choose one.', [['Remix an ordinary idea into three new versions',[0,1]],['Make a tiny thing that works',[3,4]],['Test a statement you’ve taken for granted',[2,1]],['Explore the trade-offs in a decision',[5,4]]]],
    ['The first draft is technically fine, but not useful. You…', [['Change the voice and perspective',[0,2]],['Ask what important question is missing',[1,5]],['Try it in the situation it was made for',[3,2]],['Remove steps and make it easier to reuse',[4,0]]]],
    ['Which folder would you most like to open?', [['Things I never knew existed',[1,3]],['Ideas worth turning into stories',[0,4]],['Questions with surprisingly complicated answers',[2,5]],['Plans that became something real',[5,3]]]],
    ['Your team is stuck. You would rather…', [['Build a rough example everyone can respond to',[3,0]],['Separate the known facts from guesses',[2,4]],['Connect ideas from a different field',[1,5]],['Find the bottleneck and simplify it',[4,3]]]],

  ];
  function ranking(answers){const scores=styles.map(()=>0);answers.forEach((a,i)=>{const weights=questions[i]?.[1][a]?.[1];if(weights){scores[weights[0]]+=2;scores[weights[1]]+=1;}});const order=styles.map((_,i)=>i).sort((a,b)=>scores[b]-scores[a]||a-b);const supported=scores[order[1]]>=Math.max(4,scores[order[0]]*.6);return {scores,order,secondary:supported?order[1]:null,blend:supported&&scores[order[0]]-scores[order[1]]<=2};}
function validateQuiz(value){if(!Array.isArray(value)||value.length>12||!value.every(n=>Number.isInteger(n)&&n>=0&&n<4))throw Error('Invalid quiz');return value.slice(0,questions.length);}
return {styles,questions,ranking,validateQuiz};
});