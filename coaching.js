import {advance,check,reaches} from './rules.js';
const names={k:'킹',q:'퀸',r:'룩',b:'비숍',n:'나이트',p:'폰'};
const book=[
 ['e4 e5 Nf3 Nc6 Bb5','루이 로페스','비숍으로 c6 나이트에 압박을 겁니다.'],
 ['e4 e5 Nf3 Nc6 Bc4','이탈리안 게임','비숍을 c4에 전개해 f7 쪽을 바라봅니다.'],
 ['e4 c5','시실리안 디펜스','흑이 c폰으로 d4를 견제합니다.'],
 ['e4 e6 d4 d5','프렌치 디펜스','흑의 d폰이 백의 e4 폰을 압박합니다.'],
 ['d4 d5 c4','퀸스 갬빗','백이 c폰을 내밀어 흑의 중앙 d폰에 도전합니다.'],
 ['e4 c6','카로칸 디펜스','흑의 c폰이 d5 전진을 준비합니다.'],
 ['d4 Nf6 c4 g6 Nc3 Bg7','인디언 디펜스의 피앙케토 전개','흑 비숍을 g7의 긴 대각선에 놓았습니다.']
];
const glossary=[
 ['디스커버드 체크','앞 기물이 비키면서 뒤 기물이 상대 킹에 체크를 겁니다.'],
 ['디스커버드 어택','앞 기물이 비켜 다른 기물의 공격선이 열립니다.'],
 ['더블 체크','두 기물이 동시에 킹을 체크합니다.'],
 ['절대 핀','뒤에 킹이 있어 앞 기물이 공격선 밖으로 움직일 수 없습니다.'],
 ['핀','일렬로 선 기물 중 앞 기물이 움직이면 뒤의 기물이 공격받습니다.'],
 ['포크','한 기물이 둘 이상의 상대 기물을 동시에 공격합니다.'],
 ['피앙케토','나이트 폰을 전진시키고 그 자리에 비숍을 전개해 긴 대각선을 노립니다.'],
 ['캐슬링','킹과 룩을 한 수에 이동해 킹의 위치를 바꾸고 룩을 연결하기 쉽게 만듭니다.'],
 ['앙파상','상대 폰이 두 칸 전진한 직후, 인접한 폰이 지나온 칸으로 대각선 이동해 그 폰을 잡습니다.'],
 ['승격','마지막 줄에 도착한 폰을 퀸·룩·비숍·나이트 중 하나로 바꿉니다.'],
 ['체크메이트','체크에 걸린 쪽에 체크를 해소할 합법수가 없습니다.'],
 ['전개','시작 칸에 있던 기물을 활동할 칸으로 꺼내는 과정입니다.'],
 ['중앙 점유','d4·e4·d5·e5에 기물을 놓아 중앙에 영향력을 둡니다.']
];
export function definition(input){return [...glossary,...book.map(([,t,d])=>[t,d])].find(([t])=>input.includes(t))?.join(' · ');}
export function recognize(g,m,history){
  const next=advance(g,m),enemy=next.turn,targets=Object.keys(next.board).filter(s=>next.board[s][0]===enemy);
  const opening=book.find(([line])=>line===history.join(' '));
  const labels=[];
  function add(term,why){labels.push({term,why});}
  const moved=m.to,king=targets.find(s=>next.board[s][1]==='k');
  const xray=Object.keys(next.board).filter(s=>s!==moved && g.board[s]===next.board[s] && next.board[s][0]===m.color && 'rbq'.includes(next.board[s][1]));
  if(check(next)&&targets.length && Object.keys(next.board).filter(s=>next.board[s][0]===m.color&&reaches(next,s,king)).length>=2)add('더블 체크','두 기물이 동시에 '+king+' 킹을 공격했습니다.');
  for(const s of xray){
    const target=targets.find(t=>t===king&&reaches(next,s,t)&&!reaches(g,s,t)) || targets.find(t=>reaches(next,s,t)&&!reaches(g,s,t));
    if(target)add(target===king?'디스커버드 체크':'디스커버드 어택',m.from+'의 기물이 비키자 '+s+'의 '+names[next.board[s][1]]+'에서 '+target+'의 '+names[next.board[target][1]]+'까지 공격선이 열렸습니다.');
  }
  const attacked=targets.filter(s=>reaches(next,moved,s)&&next.board[s][1]!=='p');
  if(attacked.length>=2)add('포크',moved+'의 '+names[next.board[moved][1]]+'가 '+attacked.map(s=>s+' '+names[next.board[s][1]]).join('·')+'을 동시에 공격합니다.');
  if('brq'.includes(next.board[moved][1])&&!reaches(next,moved,king)){
    for(const t of attacked.concat(targets.filter(t=>next.board[t][1]==='p'&&reaches(next,moved,t)))){
      const stripped={...next,board:{...next.board}};delete stripped.board[t];
      if(reaches(stripped,moved,king))add('절대 핀',t+'의 '+names[next.board[t][1]]+' 뒤에 '+king+' 킹이 있어 공격선 밖으로 움직일 수 없습니다.');
    }
  }
  if(opening)add(opening[1],opening[2]);
  if(m.castle)add('캐슬링',glossary.find(([t])=>t==='캐슬링')[1]);
  if(m.epCapture)add('앙파상',m.to+'로 이동하면서 '+m.epCapture+'의 폰을 잡았습니다.');
  if(m.promotion)add('승격','폰을 '+names[m.promotion]+'으로 바꿨습니다.');
  if(m.p==='b' && ({c1:'b2',f1:'g2',c8:'b7',f8:'g7'})[m.from]===m.to)add('피앙케토',m.to+'에 비숍을 전개해 긴 대각선을 바라봅니다.');
  if(!labels.length && 'bn'.includes(m.p)&&m.from[1]===(m.color==='w'?'1':'8'))add('기물 전개',m.from+'의 '+names[m.p]+'를 '+m.to+'에 꺼냈습니다.');
  if(!labels.length && m.p==='p'&&['d4','e4','d5','e5'].includes(m.to))add('중앙 점유',m.to+'에 폰을 놓아 중앙에 자리를 잡았습니다.');
  return labels;
}
