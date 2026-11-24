// Iterative deepening with alpha-beta pruning. Scores inside search are from the side to move.
import {advance,check,identity,legal,notation,outcome} from './rules.js';
const material={p:100,n:320,b:335,r:500,q:920,k:0};
const mate=30000;
function evaluate(game){
  let total=0;
  const bishops={w:0,b:0};
  for(const [square,code] of Object.entries(game.board)){
    const [color,piece]=code, file=square.charCodeAt(0)-97, rank=Number(square[1])-1;
    const center=7-Math.abs(file-3.5)-Math.abs(rank-3.5);
    const forward=color==='w'?rank:7-rank;
    let points=material[piece];
    if(piece==='p')points+=forward*5+center*3;
    if(piece==='n'||piece==='b')points+=center*7+(forward>0?14:0);
    if(piece==='b')bishops[color]++;
    if(piece==='k'&&forward===0&&(file===6||file===2))points+=25;
    total+=(color==='w'?1:-1)*points;
  }
  total+=(bishops.w>=2?20:0)-(bishops.b>=2?20:0);
  return game.turn==='w'?total:-total;
}
const priority=m=>(m.promotion?material[m.promotion]:0)+(m.capture?10*material[m.capture]-material[m.p]:0)+(m.castle?30:0);
const order=moves=>moves.sort((a,b)=>priority(b)-priority(a));
export function analyze(game,{budget=220,depthLimit=4,previous=[]}={}){
  const deadline=performance.now()+budget,timeout=Symbol(),counts=new Map();
  for(const g of previous){const key=identity(g);counts.set(key,(counts.get(key)||0)+1);}
  let nodes=0;
  function search(g,depth,alpha,beta,ply){
    if((++nodes&15)===0 && performance.now()>deadline && iteration>1)throw timeout;
    const key=identity(g), repeats=(counts.get(key)||0)+1;
    const moves=legal(g),result=outcome(g,moves,repeats);
    if(result)return {score:!moves.length&&check(g)?-mate+ply:0,line:[]};
    if(!depth)return {score:evaluate(g),line:[]};
    counts.set(key,repeats);
    let best={score:-Infinity,line:[]};
    try{
      for(const m of order(moves)){
        const reply=search(advance(g,m),depth-1,-beta,-alpha,ply+1),score=-reply.score;
        if(score>best.score)best={score,line:[m,...reply.line]};
        alpha=Math.max(alpha,score);
        if(alpha>=beta)break;
      }
    }finally{if(repeats===1)counts.delete(key);else counts.set(key,repeats-1);}
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
