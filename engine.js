// Iterative deepening with alpha-beta pruning. Scores inside search are from the side to move.
import {advance,check,identity,legal,notation,outcome} from './rules.js';
const material={p:100,n:320,b:335,r:500,q:920,k:0};
const mate=30000;
export const levels={
  starter:{label:'입문자',budget:65,depthLimit:1,tactics:0,noise:250},
  beginner:{label:'초심자',budget:130,depthLimit:2,tactics:0,noise:95},
  intermediate:{label:'중수',budget:340,depthLimit:4,tactics:1,noise:12},
  advanced:{label:'고수',budget:1050,depthLimit:6,tactics:2,noise:0},
  grandmaster:{label:'그랜드마스터급',budget:3400,depthLimit:9,tactics:4,noise:0}
};
function evaluate(game){
  let total=0;
  const pawns={w:Array(8).fill(0),b:Array(8).fill(0)};
  const men=Object.entries(game.board);
  const endgame=men.reduce((n,[,p])=>n+('qrbn'.includes(p[1])?material[p[1]]:0),0)<2300;
  for(const [sq,p] of men)if(p[1]==='p')pawns[p[0]][sq.charCodeAt(0)-97]++;
  const bishops={w:0,b:0};
  for(const [square,code] of men){
    const [color,piece]=code, file=square.charCodeAt(0)-97, rank=Number(square[1])-1;
    const center=7-Math.abs(file-3.5)-Math.abs(rank-3.5);
    const forward=color==='w'?rank:7-rank;
    let points=material[piece];
    if(piece==='p'){
      points+=forward*(endgame?9:5)+center*3;
      const lane=pawns[color];
      if(lane[file]>1)points-=13;
      if(!lane[file-1]&&!lane[file+1])points-=11;
      const passed=!men.some(([sq,enemy])=>enemy[1]==='p'&&enemy[0]!==color&&Math.abs(sq.charCodeAt(0)-square.charCodeAt(0))<=1&&(color==='w'?sq[1]>square[1]:sq[1]<square[1]));
      if(passed)points+=forward*forward*(endgame?3:1);
    }
    if(piece==='r'&&!pawns[color][file])points+=12;
    if(piece==='k'&&endgame)points+=center*7;
    if(piece==='n'||piece==='b')points+=center*7+(forward>0?14:0);
    if(piece==='b')bishops[color]++;
    if(piece==='k'&&!endgame&&forward===0&&(file===6||file===2))points+=25;
    total+=(color==='w'?1:-1)*points;
  }
  total+=(bishops.w>=2?20:0)-(bishops.b>=2?20:0);
  return game.turn==='w'?total:-total;
}
const priority=m=>(m.promotion?material[m.promotion]:0)+(m.capture?10*material[m.capture]-material[m.p]:0)+(m.castle?30:0);
const order=moves=>moves.sort((a,b)=>priority(b)-priority(a));
export function analyze(game,{budget=220,depthLimit=4,previous=[],tactics=2,noise=0,random=Math.random}={}){
  const deadline=performance.now()+budget,timeout=Symbol(),counts=new Map();
  for(const g of previous){const key=identity(g);counts.set(key,(counts.get(key)||0)+1);}
  let nodes=0;
  const preferred=new Map(),bias=new Map();
  const moveKey=m=>m.from+m.to+(m.promotion||'');
  for(const m of legal(game))bias.set(moveKey(m),noise?random()*noise:0);

  function search(g,depth,alpha,beta,ply){
    if((++nodes&15)===0 && performance.now()>deadline && iteration>1)throw timeout;
    const key=identity(g), repeats=(counts.get(key)||0)+1;
    const moves=legal(g),result=outcome(g,moves,repeats);
    if(result)return {score:!moves.length&&check(g)?-mate+ply:0,line:[]};
    const inCheck=check(g);
    let candidates=moves,stand=-Infinity;
    if(depth<=0){
      const staticScore=evaluate(g);
      if(iteration===1||depth<=-tactics)return {score:staticScore,line:[]};
      if(!inCheck){
        stand=staticScore;
        if(stand>=beta)return {score:stand,line:[]};
        alpha=Math.max(alpha,stand);
        candidates=moves.filter(m=>m.capture||m.promotion);
      }
    }
    counts.set(key,repeats);
    let best={score:stand,line:[]};
    try{
      const first=preferred.get(key);
      order(candidates);
      if(first)candidates.sort((a,b)=>Number(moveKey(b)===first)-Number(moveKey(a)===first));
      for(const m of candidates){
        const bonus=ply===0?bias.get(moveKey(m)):0;
        const reply=search(advance(g,m),depth-1,bonus-beta,bonus-alpha,ply+1),score=-reply.score+bonus;
        if(score>best.score)best={score,line:[m,...reply.line]};
        alpha=Math.max(alpha,score);
        if(alpha>=beta)break;
      }
    }finally{if(repeats===1)counts.delete(key);else counts.set(key,repeats-1);}
    if(depth>0&&best.line.length)preferred.set(key,moveKey(best.line[0]));
    return best;
  }
  let iteration=0,completed=0,best={score:0,line:[]};
  for(iteration=1;iteration<=depthLimit;iteration++){
    try{best=search(game,iteration,-Infinity,Infinity,0);completed=iteration;}
    catch(error){if(error!==timeout)throw error;break;}
    if(!best.line.length||Math.abs(best.score)>mate-100||performance.now()>deadline)break;
  }
  let g=game;
  const san=best.line.map(m=>{const label=notation(g,m);g=advance(g,m);return label;});
  const whiteScore=game.turn==='w'?best.score:-best.score;
  const evaluation=Math.abs(whiteScore)>mate-100?(whiteScore>0?'백':'흑')+' 메이트 수순':(whiteScore>=0?'+':'')+(whiteScore/100).toFixed(2);
  return {move:best.line[0],san,depth:completed,evaluation};
}
