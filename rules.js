const files = 'abcdefgh';
const back = 'rnbqkbnr';
const orth = [[1,0],[-1,0],[0,1],[0,-1]];
const diag = [[1,1],[1,-1],[-1,1],[-1,-1]];
const knight = [[1,2],[2,1],[-1,2],[2,-1],[1,-2],[-2,1],[-1,-2],[-2,-1]];
const directions = [...orth,...diag];
const value = {p:1,n:3,b:3,r:5,q:9,k:20};
const name = {p:'폰',n:'나이트',b:'비숍',r:'룩',q:'퀸',k:'킹'};
const other = c => c==='w'?'b':'w';
function offset(s,x,y) {
  const file=files.indexOf(s[0])+x,rank=Number(s[1])+y;
  return files[file] && rank>=1 && rank<=8 ? files[file]+rank : '';
}
export function initialGame() {
  const board={};
  for (let i=0;i<8;i++) for (const [rank,piece] of [[1,'w'+back[i]],[2,'wp'],[7,'bp'],[8,'b'+back[i]]]) board[files[i]+rank]=piece;
  return {board,turn:'w',rights:'KQkq',ep:'',half:0};
}
function reaches(g,from,to) {
  if(from===to)return false;
  const [color,p]=g.board[from],dx=files.indexOf(to[0])-files.indexOf(from[0]),dy=to[1]-from[1];
  const x=Math.abs(dx),y=Math.abs(dy);
  if(p==='p')return x===1 && dy===(color==='w'?1:-1);
  if(p==='n')return x*y===2;
  if(p==='k')return Math.max(x,y)===1;
  const straight=!x||!y, diagonal=x===y;
  if(!(straight && 'rq'.includes(p) || diagonal && 'bq'.includes(p)))return false;
  let square=offset(from,Math.sign(dx),Math.sign(dy));
  while(square!==to){if(g.board[square])return false;square=offset(square,Math.sign(dx),Math.sign(dy));}
  return true;
}
function attacked(g,to,side){return Object.keys(g.board).some(s=>g.board[s][0]===side && reaches(g,s,to));}
export function check(g,side=g.turn){return attacked(g,Object.keys(g.board).find(s=>g.board[s]===side+'k'),other(side));}
function pseudo(g) {
  const moves=[],side=g.turn,enemy=other(side);
  for(const [from,code] of Object.entries(g.board)){
    if(code[0]!==side)continue;
    const p=code[1];
    function add(to,extra={}){
      if(!to||g.board[to]?.[0]===side||g.board[to]?.[1]==='k')return;
      const m={from,to,p,color:side,capture:g.board[to]?.[1],...extra};
      if(p==='p' && '18'.includes(to[1]))for(const promotion of 'qrbn')moves.push({...m,promotion});
      else moves.push(m);
    }
    if(p==='p'){
      const dir=side==='w'?1:-1,one=offset(from,0,dir),two=offset(from,0,dir*2);
      if(one&&!g.board[one]){add(one);if(from[1]===(side==='w'?'2':'7')&&!g.board[two])add(two,{epTarget:one});}
      for(const x of [-1,1]){const to=offset(from,x,dir);if(to&&g.board[to]?.[0]===enemy)add(to);else if(to&&to===g.ep)add(to,{epCapture:to[0]+from[1],capture:'p'});}
      continue;
    }
    const sliding='rbq'.includes(p);
    const steps=p==='n'?knight:p==='b'?diag:p==='r'?orth:directions;
    for(const [x,y] of steps){
      for(let to=offset(from,x,y);to;to=offset(to,x,y)){
        add(to);if(!sliding||g.board[to])break;
      }
    }
    if(p==='k'){
      const rank=side==='w'?'1':'8';
      if(from!=='e'+rank||check(g))continue;
      for(const wing of ['K','Q']){
        const short=wing==='K',right=side==='w'?wing:wing.toLowerCase(),via=(short?'f':'d')+rank,to=(short?'g':'c')+rank,rook=(short?'h':'a')+rank;
        if(g.rights.includes(right)&&g.board[rook]===side+'r'&&!g.board[via]&&!g.board[to]&&(short||!g.board['b'+rank])&&!attacked(g,via,enemy))add(to,{castle:wing,rook,via});
      }
    }
  }
  return moves;
}
export function advance(g,m){
  const board={...g.board},side=g.turn;
  delete board[m.from];board[m.to]=side+(m.promotion||m.p);
  if(m.epCapture)delete board[m.epCapture];
  if(m.castle){delete board[m.rook];board[m.via]=side+'r';}
  let rights=g.rights;
  if(m.p==='k')rights=rights.replace(side==='w'?/[KQ]/g:/[kq]/g,'');
  for(const sq of [m.from,m.to]){const flag={a1:'Q',h1:'K',a8:'q',h8:'k'}[sq];if(flag)rights=rights.replace(flag,'');}
  return {board,turn:other(side),rights,ep:m.epTarget||'',half:m.p==='p'||m.capture?0:g.half+1};
}
export const legal = g => pseudo(g).filter(m=>!check(advance(g,m),g.turn));
export function notation(g,m,all=legal(g)){
  const next=advance(g,m),suffix=check(next)?(legal(next).length?'+':'#'):'';
  if(m.castle)return (m.castle==='K'?'O-O':'O-O-O')+suffix;
  const rivals=all.filter(k=>k.p===m.p&&k.from!==m.from&&k.to===m.to);
  const dis=!rivals.length?'':rivals.every(k=>k.from[0]!==m.from[0])?m.from[0]:rivals.every(k=>k.from[1]!==m.from[1])?m.from[1]:m.from;
  return (m.p==='p'?(m.capture?m.from[0]:''):m.p.toUpperCase()+dis)+(m.capture?'x':'')+m.to+(m.promotion?'='+m.promotion.toUpperCase():'')+suffix;
}
export function identity(g){
  return Object.keys(g.board).sort().map(s=>s+g.board[s]).join('')+g.turn+g.rights+(g.ep&&legal(g).some(m=>m.epCapture)?g.ep:'');
}
export function outcome(g,all,repeated){
  if(!all.length)return check(g)?(g.turn==='w'?'흑':'백')+' 승 · 체크메이트':'무승부 · 스테일메이트';
  if(g.half>=100)return '무승부 · 50수 규칙';
  if(repeated>=3)return '무승부 · 동일 국면 3회';
  const pieces=Object.entries(g.board).filter(([,v])=>v[1]!=='k');
  if(!pieces.length||pieces.length===1&&'bn'.includes(pieces[0][1][1])||pieces.every(([,v])=>v[1]==='b')&&new Set(pieces.map(([s])=>(files.indexOf(s[0])+Number(s[1]))%2)).size===1)return '무승부 · 기물 부족';
  return '';
}
export function choose(g,moves,noise=Math.random){
  let best,score=-Infinity;
  for(const m of moves){
    const next=advance(g,m),danger=attacked(next,m.to,next.turn),checks=check(next);
    const n=(m.capture?value[m.capture]:0)+(m.promotion?value[m.promotion]-1:0)-(danger?value[m.promotion||m.p]*.8:0)+(checks?0.55:0)+(checks&&!legal(next).length?100:0)+(m.castle?1:0)+('d4 e4 d5 e5'.split(' ').includes(m.to)?.35:0)+('bn'.includes(m.p)&&'18'.includes(m.from[1])?.45:0)+noise()*.8;
    if(n>score){score=n;best=m;}
  }
  return best;
}
export function describe(g,m){
  const next=advance(g,m),piece=name[m.p],facts=[];
  if(m.castle)facts.push('캐슬링으로 킹과 룩을 함께 이동했습니다.');
  else if(m.capture)facts.push(m.to+'에서 '+piece+'로 상대 '+name[m.capture]+' 포획.'+(m.epCapture?' 앙파상입니다.':''));
  else facts.push(piece+' 이동 · '+m.from+' → '+m.to+'.');
  if(m.promotion)facts.push(name[m.promotion]+' 승격입니다.');
  if(check(next))facts.push(legal(next).length?'상대는 체크를 해소해야 합니다.':'체크메이트입니다.');
  const targets=Object.keys(next.board).filter(s=>next.board[s][0]===next.turn && next.board[s][1]!=='p' && reaches(next,m.to,s));
  if(targets.length>=2)facts.push(targets.join('·')+' 기물을 동시에 공격하는 포크입니다.');
  else if(targets.length && next.board[targets[0]][1]!=='k')facts.push(targets[0]+'의 '+name[next.board[targets[0]][1]]+'에 공격을 걸었습니다.');
  else if(!m.capture&&!m.castle&&!check(next)&&'bn'.includes(m.p)&&'18'.includes(m.from[1]))facts.push('뒷줄의 기물을 전개했습니다.');
  return facts.join(' ');
}

export function learnings(history,side) {
  const own=history.filter((_,i)=>i%2===(side==='w'?0:1));
  const examples=[];
  for (const [label,test] of [
    ['킹 안전',m=>m[2].startsWith('O-O')],
    ['전술',m=>m[4]?.includes('포크')],
    ['승격',m=>Boolean(m[3])],
    ['상대에게 체크',m=>/[+#]/.test(m[2])]
  ]) {
    const m=own.find(test);
    if(m)examples.push(label+' · '+m[2]);
  }
  for(let i=1;i<history.length;i++){
    const prev=history[i-1],reply=history[i];
    if((i-1)%2===(side==='w'?0:1) && prev[1]===reply[1] && reply[2].includes('x')){
      examples.push('복습 질문 · '+prev[2]+' 직후 상대가 '+reply[2]+'로 잡았습니다. 그 칸을 누가 지키고 있었을까요?');
      break;
    }
  }
  return examples.join(' / ');
}
