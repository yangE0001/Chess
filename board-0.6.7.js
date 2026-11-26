import {analyze,levels} from './engine.js';
import {recognize,definition,studyPhase} from './coaching.js';
import {initialGame,legal,advance,notation,identity,outcome,describe,check,learnings} from './rules.js';
const layout = "<style>\n:host{color-scheme:light;--bg:#f5f2eb;--panel:#fffdf8;--ink:#252520;--muted:#67645a;--line:#dfdacf;--tone:#ede7d9;--accent:#f1c85b;--deep:#594013;--light:#eee2ca;--dark:#ad997c;--mark:#ffdd73;--white:#fff9e9;--black:#34312b}\n:host[data-theme=\"honey\"]{--bg:#f8efdb;--panel:#fffbf0;--ink:#31261b;--muted:#725d45;--line:#e7d7b6;--tone:#f3e2b8;--accent:#f0be46;--deep:#533606;--light:#fae7b1;--dark:#c18e4f;--mark:#fff18e}\n:host[data-theme=\"night\"]{color-scheme:dark;--bg:#211f1b;--panel:#2b2924;--ink:#f9f3e4;--muted:#c0b8a5;--line:#4a4439;--tone:#3a352c;--accent:#ebc467;--deep:#30220d;--light:#d0c0a3;--dark:#73634e;--mark:#efd081}\n*{box-sizing:border-box}\n:host{margin:0;background:var(--bg);color:var(--ink);font:14px/1.5 system-ui,-apple-system,\"Malgun Gothic\",sans-serif}\nbutton,input,select{font:inherit;color:inherit}\nbutton{cursor:pointer}\nbutton:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid #bd801d;outline-offset:2px}\nbutton:disabled{opacity:.45;cursor:default}\n[hidden]{display:none!important}\n.shell{max-width:1060px;margin:0 auto;padding:0 28px 28px}\nheader{height:76px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;gap:12px}\n.brand,.actions,.tabs,.person,.buttons,.stepper,.compose,.section-head,.choice-row{display:flex;align-items:center;gap:8px}\n.brand{gap:11px}.brand b{font-size:17px;letter-spacing:-.035em}.brand-icon{display:grid;place-items:center;width:35px;height:35px;border-radius:10px;background:var(--accent);color:#30220d;font:26px Georgia,serif}\n.button,.tab,.pick,.stepper button{border:1px solid var(--line);background:var(--panel);border-radius:9px;padding:8px 12px;font-weight:650;min-height:38px}\n.button:hover,.tab:hover,.pick:hover,.stepper button:hover{filter:brightness(.95)}\n.quiet{background:transparent}.primary{background:var(--accent);border-color:transparent;color:#30220d}\nmain{padding-top:25px}\n.tabs{margin-bottom:20px;display:inline-flex;background:var(--tone);padding:4px;border-radius:11px;gap:3px}\n.tab{border-color:transparent;background:transparent;color:var(--muted);min-width:94px;min-height:35px;padding:5px 13px}\n.tab[aria-pressed=\"true\"]{background:var(--panel);color:var(--ink);box-shadow:0 1px 3px #23170015}\n.layout{display:grid;grid-template-columns:minmax(0,540px) minmax(0,1fr);gap:29px;align-items:start}\n.match,.sidebar{min-width:0}.match{display:grid;gap:10px}\n.player{display:grid;gap:9px;min-width:0}\n.person{gap:10px;min-height:42px}\n.identity{display:grid;line-height:1.2;gap:4px}.identity small,.muted,.meta{color:var(--muted);font-size:12px}\n.avatar{flex:none;display:grid;place-items:center;width:38px;height:38px;border-radius:50%;font-weight:700}\n.avatar.op{background:#343128;color:#f8da8a;border:1px solid #574a32;font:italic 22px Georgia,serif}\n.avatar.me{background:var(--tone);font-size:13px}\n.clock{margin-left:auto;font:700 16px ui-monospace,monospace;padding:6px 9px;border-radius:7px;background:var(--tone);white-space:nowrap}\n.clock.active{background:var(--accent);color:#30220d}\n.turn{margin-left:auto;font-size:12px;color:var(--muted);white-space:nowrap}\n.chat-expand{margin-left:auto;white-space:nowrap;font-size:12px}\n.clock+.chat-expand{margin-left:0}\n.clock[hidden]+.chat-expand{margin-left:auto}\n.compact-chat{border:1px solid var(--line);background:var(--panel);border-radius:11px;overflow:hidden}\n.compact-chat .log{height:92px;padding:8px 10px;gap:5px;font-size:13px;line-height:1.4}\n.compact-chat .log li{display:flex;align-items:baseline;gap:6px;padding:5px 8px}\n.compact-chat .log small{flex:none;margin:0}\n.board-wrap{position:relative;isolation:isolate;overflow:hidden;border-radius:9px;box-shadow:0 1px 0 #30220d38}\n.board{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));grid-template-rows:repeat(8,minmax(0,1fr));aspect-ratio:1;background:var(--light)}\n.square{position:relative;display:grid;place-items:center;min-width:0;min-height:0;padding:0;border:0;border-radius:0;background:var(--light);color:#594933;line-height:1;touch-action:manipulation}\n.square.dark{background:var(--dark);color:#29231b}\n.square.last{box-shadow:inset 0 0 0 100px color-mix(in srgb,var(--mark) 57%,transparent)}\n.square.selected{box-shadow:inset 0 0 0 3px #7b4516;background:var(--mark)}\n.square:focus-visible{outline-offset:-3px;z-index:2}\n.square canvas{width:96%;height:96%;pointer-events:none}\n.coord{font-size:clamp(9px,1.1vw,12px);font-weight:750;position:absolute;pointer-events:none}.coord.rank{left:4px;top:4px}.coord.file{bottom:3px;right:4px}\n.dot::after{content:\"\";display:block;position:absolute;width:24%;aspect-ratio:1;border-radius:50%;background:#68491880}\n#arrows{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:3}\n.tools{display:flex;gap:7px;flex-wrap:wrap}\n.sidebar{display:grid;gap:12px}\n.card{background:var(--panel);border:1px solid var(--line);border-radius:13px;overflow:hidden}\n.section-head{padding:13px 14px;justify-content:space-between;border-bottom:1px solid var(--line)}\nh2,h3,p{margin:0}h2{font-size:14px}h3{font-size:14px}\n.status{font-size:12px;padding:4px 7px;border-radius:6px;background:var(--tone);color:var(--muted);white-space:nowrap}\n.log{list-style:none;margin:0;padding:13px 14px;display:grid;align-content:start;gap:10px;height:225px;overflow:auto;overscroll-behavior:contain}\n.log li{width:fit-content;max-width:92%;background:var(--tone);padding:8px 11px;border-radius:9px;overflow-wrap:anywhere}\n.log li.me-msg{justify-self:end;background:var(--accent);color:#30220d}\n.log small{display:block;color:inherit;opacity:.8;margin-bottom:3px;font-size:11px;font-weight:700}\n.compose{border:1px solid var(--line);background:var(--panel);border-radius:11px;padding:7px;gap:6px}\n.compose input{min-width:0;flex:1;border:0;background:transparent;padding:7px 5px;font-size:16px}\n.compose .button{flex:none}\n.moves{display:grid;gap:4px;padding:7px 12px 9px}\n.move-row{display:grid;grid-template-columns:33px 1fr 1fr;align-items:center;gap:6px}\n.move-row span{padding-left:5px;color:var(--muted);font:12px ui-monospace,monospace}\n.move-row button{border:0;text-align:left;border-radius:5px;background:none;padding:5px 8px;font:650 13px ui-monospace,monospace;cursor:default}\n.move-row button[aria-current=\"step\"]{background:var(--tone)}\n.move-row button:not(:disabled){cursor:pointer}\n.move-row button:disabled{opacity:1}\n.stepper{padding:0 11px 10px;justify-content:stretch;gap:5px}\n.stepper button{flex:1;min-width:0;padding:4px}\n.notice{font-size:12px;min-height:18px;color:var(--muted);margin:0 2px}\ndialog{background:var(--panel);color:var(--ink);border:1px solid var(--line);padding:0;width:min(450px,calc(100% - 26px));border-radius:16px;box-shadow:0 18px 64px #211a163d}\ndialog::backdrop{background:#211a1660}\n.chat-drawer{position:fixed;inset:12px 12px 12px auto;margin:0;width:min(420px,calc(100% - 24px));max-width:none;max-height:none}\n.chat-drawer[open]{display:grid;grid-template-rows:auto minmax(0,1fr) auto}\n.chat-drawer::backdrop{background:#211a162f}\n.chat-drawer .dialog-head .status{margin-left:auto;margin-right:8px}\n.chat-drawer .log{height:auto;padding:14px;align-content:start}\n.dialog-head{display:flex;justify-content:space-between;align-items:center;padding:14px 17px;border-bottom:1px solid var(--line)}\n.dialog-head h2{font-size:16px}\n.settings-form{display:grid;gap:17px;padding:16px 17px 18px}\nfieldset{border:0;padding:0;margin:0;min-width:0}\nlegend{font-weight:750;margin-bottom:7px;padding:0}\n.choice-row{gap:6px;align-items:stretch}\n.pick{min-width:0;flex:1;padding:7px 5px;text-align:center}\n.pick[aria-pressed=\"true\"]{border-color:#b18336;background:var(--tone)}\n.pick canvas{width:31px;height:31px;display:block;margin:auto}\n.swatch{width:28px;height:19px;display:inline-block;border-radius:4px;margin:auto auto 3px;background:linear-gradient(90deg,var(--a) 50%,var(--b) 50%)}\n.pick span.label{display:block}\n.switch{display:flex;align-items:center;justify-content:space-between;gap:10px;border-top:1px solid var(--line);padding-top:13px}\n.switch input{width:19px;height:19px;accent-color:#9a641b}\n.select{width:100%;padding:8px;border:1px solid var(--line);background:var(--panel);border-radius:8px}\n.launch{position:fixed;right:20px;bottom:20px;z-index:4}\n.lobby{max-width:460px;margin:14vh auto;padding:22px;text-align:center}.lobby p{margin:12px 0}\n@media(max-width:700px){\n.shell{max-width:520px;padding:0 12px 20px}\nheader{height:56px}.brand-icon{width:29px;height:29px;font-size:22px}.brand b{font-size:15px}.actions{gap:5px}.actions .button{padding:5px 8px;font-size:12px;min-height:35px}\nmain{padding-top:11px}.tabs{margin-bottom:10px}.tab{min-height:31px;font-size:13px}.layout{grid-template-columns:1fr;gap:8px}.match{gap:7px}.player{gap:5px}.person{min-height:34px}.avatar{width:31px;height:31px}.compact-chat .log{height:76px;padding:6px 8px}.chat-expand{padding:4px 7px;min-height:32px}.identity{gap:2px}.clock{padding:4px 7px;font-size:14px}\n.tools{gap:5px}.tools .button{min-height:32px;padding:4px 9px;font-size:12px}\n.sidebar{gap:9px}.chat-drawer{inset:auto 0 0;width:100%;height:75vh;height:75dvh;border-radius:16px 16px 0 0}\n.section-head{padding:8px 10px}.compose{padding:5px}.move-card .section-head{border-bottom:0}\n.move-card:not(.open) .moves,.move-card:not(.open) .stepper{display:none}\n}\n#reviewInfo .stepper{display:flex;padding:8px 0}#reviewInfo details{margin-top:8px}#reviewInfo summary{cursor:pointer}#reviewInfo h3{margin:8px 0 3px}:host([data-review=\"true\"]) #moveCard:not(.open) .moves{display:none}:host([data-review=\"true\"]) #moveCard .section-head button{display:block!important}.reviewhead,.reviewtabs{display:flex;align-items:center;gap:6px}.reviewhead{justify-content:space-between}.reviewtabs button{flex:1;padding:7px 4px;border:0;border-radius:6px;color:var(--muted);background:var(--tone);cursor:pointer}.reviewtabs button[aria-pressed=true]{background:var(--accent);color:var(--deep)}#reviewInfo dl{margin:10px 0}#reviewInfo dl div{display:grid;grid-template-columns:minmax(72px,32%) 1fr;gap:8px;padding:4px 0;border-bottom:1px solid var(--line)}#reviewInfo dd{margin:0;overflow-wrap:anywhere}#reviewInfo dt,.reviewhead small,.brand small{color:var(--muted);font-size:12px}#reviewInfo h3{margin:8px 0}#annotation{margin:10px 0}#rewindBar[hidden],#liveTools[hidden]{display:none!important}.square.checked-king{box-shadow:inset 0 0 0 3px #b43829}.person .identity{min-width:0}.identity strong{overflow-wrap:anywhere}.chat-expand{flex-shrink:0}#reviewInfo .reviewtabs button{min-height:40px}.avatar.op{overflow:hidden;flex-shrink:0}.avatar.op img{display:block;width:100%;height:100%;object-fit:cover;border-radius:inherit}.chat-drawer .compose{margin:6px 10px max(8px,env(safe-area-inset-bottom))}.chat-drawer .log{min-height:0;overflow:auto}#lesson p{line-height:1.55;margin:.35em 0}#lesson{padding:.6em .8em;background:var(--tone);border-radius:8px}</style>\n<div class=\"shell\" id=\"app\">\n<header>\n<div class=\"brand\"><span class=\"brand-icon\" aria-hidden=\"true\">♞</span><b>태번 체스 <small>v0.6.7</small></b></div>\n<div class=\"actions\">\n<button class=\"button quiet\" id=\"minimize\" type=\"button\">접기</button>\n<button class=\"button quiet\" id=\"settingsButton\" type=\"button\">설정</button>\n<button class=\"button primary\" id=\"newButton\" type=\"button\">새 대국</button>\n</div>\n</header>\n<main>\n<nav class=\"tabs\" aria-label=\"대국 모드\">\n<button class=\"tab\" data-mode=\"free\" type=\"button\" aria-pressed=\"false\">자유대국</button>\n<button class=\"tab\" data-mode=\"coach\" type=\"button\" aria-pressed=\"true\">코칭</button>\n</nav>\n<div class=\"layout\">\n<section class=\"match\" aria-label=\"체스판\">\n<div class=\"player\">\n<div class=\"person\"><span class=\"avatar op\" aria-hidden=\"true\">R</span><div class=\"identity\"><strong>루퍼트</strong><small id=\"opSide\">흑 · 코치</small></div><span class=\"clock\" id=\"opClock\" hidden></span><button class=\"button quiet chat-expand\" id=\"chatToggle\" type=\"button\" aria-haspopup=\"dialog\" aria-controls=\"chatDialog\">큰 창으로 보기</button></div>\n<div class=\"compact-chat\"><ol class=\"log\" id=\"recentLog\" role=\"log\" aria-label=\"대국 대화\" tabindex=\"0\"></ol></div>\n</div>\n<div class=\"board-wrap\">\n<div class=\"board\" id=\"board\" role=\"group\" aria-label=\"체스판\"></div>\n<canvas id=\"arrows\" width=\"800\" height=\"800\" aria-hidden=\"true\"></canvas>\n</div>\n<section class=\"card\" id=\"reviewInfo\" hidden style=\"padding:10px 12px\"><div class=\"reviewhead\"><select id=\"record\" aria-label=\"복기할 판\"></select><small id=\"reviewCount\"></small></div>\n<h3 id=\"reviewTitle\"></h3><nav class=\"reviewtabs\" aria-label=\"복기 정보\"><button data-review-pane=\"move\">현재 수</button><button data-review-pane=\"engine\">엔진 분석</button><button data-review-pane=\"total\">판 요약</button></nav>\n<p id=\"annotation\"></p><dl id=\"engineText\" hidden></dl><section id=\"lesson\" hidden><strong>이 수의 해설</strong><p id=\"lessonText\"></p></section><dl id=\"summary\" hidden></dl><div class=\"stepper\">\n<button type=\"button\" data-step=\"first\" aria-label=\"첫 위치\">|‹</button>\n<button type=\"button\" data-step=\"prev\" aria-label=\"이전 수\">‹</button>\n<button type=\"button\" data-step=\"next\" aria-label=\"다음 수\">›</button>\n<button type=\"button\" data-step=\"last\" aria-label=\"마지막 수\">›|</button>\n</div><button class=\"button\" id=\"playback\">▶ 자동 재생</button></section>\n\n<div class=\"person\"><span class=\"avatar me\" aria-hidden=\"true\">나</span><div class=\"identity\"><strong>유니</strong><small id=\"mySide\">백</small></div><span class=\"turn\" id=\"turn\">내 차례</span><span class=\"clock\" id=\"myClock\" hidden></span></div>\n<span hidden id=\"composeAnchor\"></span><form class=\"compose\" id=\"compose\">\n<input id=\"message\" aria-label=\"루퍼트에게 할 말\" placeholder=\"루퍼트에게 말 걸기…\" autocomplete=\"off\" maxlength=\"240\">\n<button class=\"button primary\" type=\"submit\">보내기</button>\n</form>\n<div id=\"rewindBar\" class=\"tools\" hidden><button class=\"button\" id=\"backOne\">한 수 더 이전</button><button class=\"button primary\" id=\"keepUndo\">여기서 계속</button><button class=\"button\" id=\"cancelUndo\">취소</button></div>\n<div class=\"tools\" id=\"liveTools\">\n<button class=\"button\" id=\"hint\" type=\"button\">힌트</button>\n<button class=\"button\" id=\"variation\">수 시험하기</button>\n<button class=\"button\" id=\"undo\" type=\"button\">↶ 되돌리기</button>\n<button class=\"button quiet\" id=\"resign\">기권</button><button class=\"button\" id=\"review\" type=\"button\" aria-pressed=\"false\">복기</button>\n</div>\n<p class=\"notice\" id=\"notice\" role=\"status\"></p>\n</section>\n<aside class=\"sidebar\">\n<section class=\"card move-card\" id=\"moveCard\" aria-label=\"기보\">\n<div class=\"section-head\"><h2>기보</h2><button class=\"button quiet\" id=\"movesToggle\" type=\"button\" aria-expanded=\"false\">기보 보기</button></div>\n<div class=\"moves\" id=\"moves\"></div>\n\n</section>\n</aside>\n</div>\n</main>\n</div>\n<div class=\"shell\" id=\"lobby\" hidden><div class=\"card lobby\"><h2>실리태번 채팅</h2><p class=\"muted\">대국창을 접었어요.</p></div><button class=\"button primary launch\" id=\"reopen\" type=\"button\">♞ 대국 열기</button></div>\n<dialog class=\"chat-drawer\" id=\"chatDialog\" aria-labelledby=\"chatTitle\">\n<div class=\"dialog-head\"><h2 id=\"chatTitle\">대국 대화</h2><span class=\"status\" id=\"chatStatus\">힌트 켜짐</span><form method=\"dialog\"><button class=\"button quiet\" type=\"submit\">닫기</button></form></div>\n<ol class=\"log\" id=\"log\" aria-label=\"전체 대화 내역\" tabindex=\"0\"></ol>\n</dialog>\n<dialog id=\"settingsDialog\" aria-labelledby=\"settingsTitle\">\n<div class=\"dialog-head\"><h2 id=\"settingsTitle\">화면 설정</h2><form method=\"dialog\"><button class=\"button quiet\" type=\"submit\">닫기</button></form></div>\n<div class=\"settings-form\">\n<fieldset><legend>테마</legend><div class=\"choice-row\">\n<button class=\"pick\" type=\"button\" data-theme-choice=\"ivory\"><i class=\"swatch\" style=\"--a:#eee2ca;--b:#ad997c\"></i><span class=\"label\">아이보리</span></button>\n<button class=\"pick\" type=\"button\" data-theme-choice=\"honey\"><i class=\"swatch\" style=\"--a:#fae7b1;--b:#c18e4f\"></i><span class=\"label\">허니</span></button>\n<button class=\"pick\" type=\"button\" data-theme-choice=\"night\"><i class=\"swatch\" style=\"--a:#d0c0a3;--b:#73634e\"></i><span class=\"label\">차콜</span></button>\n</div></fieldset>\n<fieldset><legend>기물 디자인</legend><div class=\"choice-row\">\n<button class=\"pick\" type=\"button\" data-piece-choice=\"classic\"><canvas width=\"96\" height=\"96\" aria-hidden=\"true\"></canvas><span class=\"label\">클래식</span></button>\n<button class=\"pick\" type=\"button\" data-piece-choice=\"simple\"><canvas width=\"96\" height=\"96\" aria-hidden=\"true\"></canvas><span class=\"label\">미니멀</span></button>\n<button class=\"pick\" type=\"button\" data-piece-choice=\"letter\"><canvas width=\"96\" height=\"96\" aria-hidden=\"true\"></canvas><span class=\"label\">영문 표기</span></button>\n</div></fieldset>\n<label class=\"switch\"><strong>무제한 자유대국에서도 착수 후 해설 듣기</strong><input type=\"checkbox\" id=\"pacedFree\"></label>\n<label class=\"switch\"><strong>기물 놓는 소리</strong><input type=\"checkbox\" id=\"soundToggle\" checked></label>\n<label class=\"switch\"><strong>대국 중 힌트</strong><input type=\"checkbox\" id=\"hintToggle\" checked></label>\n</div>\n</dialog>\n<dialog id=\"newDialog\" aria-labelledby=\"newTitle\">\n<div class=\"dialog-head\"><h2 id=\"newTitle\">새 대국</h2><form method=\"dialog\"><button class=\"button quiet\" type=\"submit\">닫기</button></form></div>\n<form id=\"start\" class=\"settings-form\">\n<label><strong>모드</strong><select class=\"select\" id=\"gameMode\"><option value=\"free\">자유대국</option><option value=\"coach\">코칭</option></select></label>\n<label id=\"memberField\" hidden><strong>대국 상대</strong><select class=\"select\" id=\"memberChoice\"><option value=\"\">랜덤</option></select></label><label><strong>상대 난이도</strong><select class=\"select\" id=\"gameLevel\"></select></label>\n<label><strong>내 기물 색</strong><select class=\"select\" id=\"gameSide\"><option value=\"w\">백</option><option value=\"b\">흑</option><option value=\"random\">랜덤</option></select></label>\n<label id=\"timerField\"><strong>타이머</strong><select class=\"select\" id=\"gameTime\"><option value=\"0\">없음</option><option value=\"5\">5분</option><option value=\"10\">10분</option><option value=\"15\">15분</option></select></label>\n<button class=\"button primary\" type=\"submit\">대국 시작</button>\n</form>\n</dialog>\n";
export function mountBoard(host,session) {
const view = host.attachShadow({mode:'open'});
view.innerHTML = layout;

const byId = (id) => view.getElementById(id);
const root = host;
const board = byId('board');
const files = 'abcdefgh';
const names = {k:'킹',q:'퀸',r:'룩',b:'비숍',n:'나이트',p:'폰'};
const figures = {"k": "M22.41 18.02Q22.43 17.95 22.48 17.89Q21.68 16.91 20.52 16.27Q18.84 15.34 17.07 15.34Q15.30 15.34 13.62 16.26Q11.95 17.18 11.00 18.88Q10.05 20.57 10.05 22.39Q10.05 24.23 10.98 25.89Q11.91 27.55 13.59 28.45Q14.09 28.77 14.61 28.95H22.41ZM25.61 28.95H33.39Q33.93 28.77 34.43 28.45Q36.11 27.55 37.03 25.89Q37.95 24.23 37.95 22.39Q37.95 20.57 37.01 18.88Q36.07 17.18 34.40 16.26Q32.73 15.34 30.93 15.34Q29.18 15.34 27.50 16.27Q26.32 16.91 25.55 17.89Q25.59 17.95 25.61 18.02ZM15.41 31.30V38.18H32.61V31.30ZM13.55 40.00V31.30Q12.59 31.00 11.73 30.50Q10.16 29.27 8.93 27.05Q7.70 24.82 7.70 22.39Q7.70 19.93 8.95 17.69Q10.20 15.45 12.45 14.25Q14.70 13.05 17.07 13.05Q18.89 13.05 20.61 13.75V13.70Q20.61 12.89 21.02 12.17Q21.43 11.45 22.16 11.05Q22.45 10.89 22.82 10.80V9.57H20.36V7.98H22.82V6.00H25.20V7.98H27.66V9.57H25.20V10.80Q25.57 10.89 25.86 11.05Q26.57 11.45 26.99 12.17Q27.41 12.89 27.41 13.70V13.75Q29.14 13.05 30.93 13.05Q33.30 13.05 35.55 14.25Q37.80 15.45 39.05 17.69Q40.30 19.93 40.30 22.39Q40.30 24.82 39.07 27.05Q37.84 29.27 36.30 30.50Q35.41 31.00 34.48 31.30V40.00ZM21.89 13.89Q21.89 14.45 22.17 14.94Q22.45 15.43 22.97 15.72Q23.48 16.00 24.00 16.00Q24.55 16.00 25.06 15.72Q25.57 15.43 25.84 14.94Q26.11 14.45 26.11 13.89Q26.11 13.34 25.84 12.83Q25.57 12.32 25.06 12.06Q24.55 11.80 24.00 11.80Q23.48 11.80 22.97 12.06Q22.45 12.32 22.17 12.83Q21.89 13.34 21.89 13.89ZM31.43 32.48V37.02H16.59V32.48ZM21.27 27.80H14.91Q14.50 27.64 14.11 27.36Q12.73 26.61 11.98 25.24Q11.23 23.86 11.23 22.34Q11.23 20.84 12.00 19.44Q12.77 18.05 14.12 17.28Q15.48 16.52 16.93 16.52Q18.34 16.52 19.73 17.27Q20.66 17.80 21.32 18.61Q21.27 18.68 21.27 18.73ZM26.75 18.73Q26.75 18.68 26.70 18.61Q27.36 17.80 28.30 17.27Q29.68 16.52 31.07 16.52Q32.55 16.52 33.90 17.28Q35.25 18.05 36.02 19.44Q36.80 20.84 36.80 22.34Q36.80 23.86 36.05 25.24Q35.30 26.61 33.91 27.36Q33.50 27.64 33.09 27.80H26.75Z", "q": "M10.70 16.84Q8.55 16.80 8.27 14.64Q8.27 14.00 8.60 13.42Q8.93 12.84 9.55 12.52Q10.16 12.20 10.82 12.20Q11.45 12.20 12.07 12.52Q12.68 12.84 13.00 13.42Q13.32 14.00 13.32 14.64Q13.23 16.09 11.93 16.59L17.36 28.09L16.18 12.14Q14.30 12.14 13.89 10.02Q13.89 9.39 14.22 8.82Q14.55 8.25 15.15 7.93Q15.75 7.61 16.45 7.61Q17.09 7.61 17.69 7.93Q18.30 8.25 18.62 8.82Q18.95 9.39 18.95 10.02Q18.91 11.05 17.86 11.82L22.16 28.82L23.14 10.18Q21.61 9.50 21.57 8.41Q21.57 7.77 21.91 7.18Q22.25 6.59 22.85 6.30Q23.45 6.00 24.07 6.00Q24.73 6.00 25.33 6.30Q25.93 6.59 26.27 7.18Q26.61 7.77 26.61 8.41Q26.55 9.64 25.02 10.18L25.89 28.86L30.09 12.05Q29.05 10.98 29.05 10.02Q29.05 9.41 29.38 8.83Q29.70 8.25 30.32 7.93Q30.93 7.61 31.55 7.61Q32.23 7.61 32.84 7.93Q33.45 8.25 33.78 8.83Q34.11 9.41 34.11 10.02Q33.86 11.95 31.91 12.32L29.82 28.09L35.66 16.39Q34.68 15.61 34.68 14.64Q34.68 14.00 35.01 13.42Q35.34 12.84 35.94 12.53Q36.55 12.23 37.18 12.23Q37.86 12.23 38.47 12.53Q39.07 12.84 39.40 13.42Q39.73 14.00 39.73 14.64Q39.43 16.77 37.18 16.77L33.55 27.30V40.00H13.98V27.30ZM32.25 31.91V30.14H15.73V31.91ZM32.25 38.68V36.89H15.73V38.68Z", "r": "M31.28 13.68V11.55H16.74V13.68ZM32.97 35.89V33.36H15.06V35.89ZM20.78 6.00H27.08V9.52H30.97V6.00H37.10V9.68H34.49V12.95L32.40 16.36V29.66L34.49 33.05V36.30H37.10V40.00H10.90V36.30H13.51V33.05L15.63 29.59H15.65V16.39H15.63L13.51 12.95V9.68H10.90V6.00H16.92V9.52H20.78ZM35.85 38.73V37.48H12.17V38.73Z", "b": "M18.68 28.32Q18.68 26.95 19.41 25.75Q19.59 25.36 19.84 25.05Q18.48 24.18 17.66 22.75Q16.73 21.11 16.70 19.30V19.20Q16.73 17.39 17.66 15.73Q18.64 14.02 20.41 13.07Q21.05 12.75 21.73 12.52Q21.14 12.11 20.75 11.45Q20.25 10.57 20.25 9.64Q20.25 8.66 20.76 7.81Q21.27 6.95 22.16 6.48Q23.05 6.00 24.00 6.00Q24.93 6.00 25.82 6.48Q26.70 6.95 27.22 7.81Q27.73 8.66 27.73 9.64Q27.73 10.57 27.25 11.45Q26.89 12.11 26.30 12.55Q26.93 12.75 27.59 13.07Q29.34 14.02 30.34 15.73Q31.30 17.39 31.32 19.20V19.30Q31.30 21.11 30.34 22.75Q29.50 24.16 28.18 25.02Q28.43 25.36 28.61 25.75Q29.32 26.95 29.32 28.32Q29.32 29.64 28.59 30.86L34.91 40.00H13.09L19.25 30.82Q18.68 29.61 18.68 28.32ZM25.34 23.23V20.41H29.25V17.95H25.34V15.14H22.66V17.95H18.75V20.41H22.66V23.23Z", "n": "M21.09 11.50Q21.93 10.98 21.93 10.09Q21.93 9.52 21.59 8.88Q21.25 8.23 21.25 7.73Q21.25 6.68 22.57 6.00Q24.50 7.84 24.67 8.85Q24.84 9.86 24.84 10.16Q24.84 11.23 24.07 11.50H24.16Q24.16 11.52 24.11 11.52Q36.30 19.25 37.32 40.00H15.27Q14.98 38.73 14.98 37.41Q14.98 33.77 19.58 30.56Q24.18 27.34 24.18 24.77Q24.18 24.59 24.16 24.43Q22.66 28.23 20.00 28.23Q20.00 28.23 19.77 28.23Q17.73 31.55 15.39 31.55Q15.30 31.55 15.23 31.55L16.32 29.18L13.89 31.00Q11.30 30.36 10.68 28.48Q12.68 23.27 12.68 18.95Q12.68 18.34 12.64 17.75Q13.73 15.27 15.98 12.91Q16.05 12.68 16.05 12.48Q16.05 11.84 15.53 11.55Q15.02 11.25 15.02 10.45Q15.02 9.61 15.48 8.11Q17.84 8.73 19.11 11.50ZM15.25 17.30V17.66Q15.34 18.34 15.52 18.34H16.00Q17.57 18.34 17.57 17.23Q17.57 16.45 18.55 15.36H18.41Q16.23 15.36 15.39 16.82ZM12.77 27.52V28.07Q12.77 28.73 13.41 28.73H13.64Q15.27 28.39 15.27 27.18L15.11 26.41Q13.70 26.41 12.77 27.52ZM24.09 13.32 25.27 15.34Q33.80 21.45 33.93 38.82H35.68Q34.66 19.50 24.09 13.32Z", "p": "M10.31 40.00Q10.06 38.70 10.06 37.39Q10.06 33.75 11.93 30.42Q13.81 27.09 17.12 25.32Q17.99 24.84 18.90 24.50Q18.22 23.84 17.74 22.98Q16.78 21.27 16.78 19.41Q16.78 17.52 17.75 15.81Q18.72 14.09 20.47 13.14Q21.08 12.82 21.74 12.59Q21.15 12.16 20.81 11.50Q20.28 10.61 20.28 9.66Q20.28 8.70 20.78 7.83Q21.28 6.95 22.17 6.48Q23.06 6.00 23.99 6.00Q24.90 6.00 25.78 6.48Q26.67 6.95 27.18 7.83Q27.69 8.70 27.69 9.66Q27.69 10.61 27.22 11.50Q26.83 12.16 26.26 12.61Q26.88 12.82 27.56 13.14Q29.26 14.09 30.24 15.81Q31.22 17.52 31.22 19.41Q31.22 21.27 30.28 22.98Q29.78 23.84 29.10 24.50Q29.97 24.86 30.83 25.32Q34.17 27.09 36.06 30.42Q37.94 33.75 37.94 37.39Q37.94 38.70 37.67 40.00Z"};
const minimal = {"n": "M7 39 Q7 36 11 35 Q19 32 23 22 L16 26 Q13 28 10 25 L8 22 Q12 16 18 12 L20 6 L24 10 L28 7 Q39 14 37 34 Q41 35 40 40 L8 40Z", "p": "M10 39 Q10 36 16 34 Q21 28 21 23 A8 8 0 1 1 27 23 Q27 29 32 34 Q38 36 38 39Z", "r": "M9 39 L11 35 L17 33 L18 20 L12 18 L11 8 L17 8 L17 13 L21 13 L21 8 L27 8 L27 13 L31 13 L31 8 L37 8 L36 18 L30 20 L31 33 L37 35 L39 39Z", "b": "M9 39 Q9 36 15 34 L21 30 Q10 25 18 16 L23 10 Q20 6 24 5 Q28 5 26 10 L29 13 L22 23 L24 25 L32 16 Q39 28 27 30 L33 34 Q39 36 39 39Z", "q": "M8 39 L11 35 L16 32 L10 15 Q5 14 8 10 Q12 8 13 13 L19 22 L22 11 Q18 7 23 5 Q29 4 27 10 L28 22 L35 13 Q33 8 38 9 Q43 12 38 16 L32 32 L37 35 L40 39Z", "k": "M8 39 L11 35 L17 33 Q10 26 11 21 Q12 14 21 17 L22 13 L18 13 L18 9 L22 9 L22 5 L26 5 L26 9 L30 9 L30 13 L26 13 L27 17 Q36 14 37 21 Q38 26 31 33 L37 35 L40 39Z"};
const colorName = (side) => side === 'w' ? '백' : '흑';
function paintPiece(canvas, piece, style = root.dataset.pieces) {
  const ctx = canvas.getContext('2d');
  const white = piece[0] === 'w';
  const type = piece[1];
  const outline = white ? '#43372b' : '#211e19';
  const fill = white ? '#fff8e6' : '#36312a';
  ctx.setTransform(2,0,0,2,0,0);
  ctx.clearRect(0,0,48,48);
  ctx.fillStyle = fill;
  ctx.strokeStyle = outline;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = style === 'classic' ? 1.5 : 1.25;
  if (style === 'letter') {
    ctx.beginPath();
    ctx.arc(24,24,16,0,Math.PI*2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = white ? '#36312a' : '#fff8e6';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 18px system-ui';
    ctx.fillText(type.toUpperCase(),24,24);
    return;
  }
  const silhouette = new Path2D(style === "simple" ? minimal[type] : figures[type]);
  ctx.lineWidth = style === 'classic' ? 0.95 : 1.7;
  ctx.stroke(silhouette);
  ctx.fill(silhouette);
}

const preferences = {theme:'ivory',pieces:'simple',hints:true,sound:true,pacedFree:false};
try {
  const saved = JSON.parse(localStorage.getItem('tavern-chess-ui'));
  if (['ivory','honey','night'].includes(saved?.theme)) preferences.theme = saved.theme;
  if (['classic','simple','letter'].includes(saved?.pieces)) preferences.pieces = saved.pieces;
  preferences.pacedFree=saved?.pacedFree===true;
  if(typeof saved?.sound==='boolean')preferences.sound=saved.sound;
  if (typeof saved?.hints === 'boolean') preferences.hints = saved.hints;
} catch {}

const transcript = [];
let ready = false;
for(const [id,level] of Object.entries(levels))byId('gameLevel').add(new Option(level.label,id));
let rewind=null, speechPending=0;
const state = {hold:false,plyClocks:[],level:'intermediate',mode:'coach',side:'w',timer:0,history:[],review:false,at:0,selected:null,arrow:null,hintLevel:0,times:null,turnStart:0,result:'',clockHistory:[],previous:null,archived:false};
let variation=null;
let timeline = [initialGame()], previousTimeline=[], playback, closed=false, autoTicket=0;

function inspectingOld(){return state.review && state.archived && state.previous;}
function line(){return inspectingOld()?state.previous.history:state.history;}
function frames(){return inspectingOld()?previousTimeline:timeline;}
function positions(ply){return frames()[ply].board;}
function rebuild(history){
  const sequence=[initialGame()];
  for(const [from,to,,promotion] of history){
    const game=sequence.at(-1);
    const move=legal(game).find(m=>m.from===from&&m.to===to&&(m.promotion||null)===(promotion||null));
    if(!move)throw new Error('저장된 기보에서 읽을 수 없는 수: '+from+to);
    sequence.push(advance(game,move));
  }
  return sequence;
}
function baseline(){return state.side==='b'?1:0;}
function destinations(from){return legal(timeline.at(-1)).filter(m=>m.from===from).map(m=>m.to);}
const engineCache=new WeakMap();
function engineAt(game,sequence=timeline){
  if(!engineCache.has(game)){
    const index=sequence.indexOf(game);
    engineCache.set(game,analyze(game,{previous:index<0?[]:sequence.slice(0,index)}));
  }
  return engineCache.get(game);
}
function analysisText(game){
  const a=engineAt(game,frames());
  return '엔진 · 백 기준 '+a.evaluation+' · 깊이 '+a.depth+(a.san.length?' · 예상 수순 '+a.san.join(' '):'');
}
function reviewAnalysis(ply){
  if(!ply)return analysisText(frames()[0]);
  const prior=engineAt(frames()[ply-1],frames());
  return '착수 전 후보 '+(prior.san[0]||'—')+' · 실제 '+line()[ply-1][2]+' / '+analysisText(frames()[ply]);
}
function labelsAt(ply){
  if(!ply)return [];
  const entry=line()[ply-1];
  if(entry[5])return entry[5];
  const g=frames()[ply-1];
  const m=legal(g).find(m=>m.from===entry[0]&&m.to===entry[1]&&(m.promotion||null)===(entry[3]||null));
  return m?recognize(g,m,line().slice(0,ply).map(row=>row[2])):[];
}
function labelText(labels){return labels.slice(0,2).map(x=>x.term+' · '+x.why).join(' ');}
function addMove(m){
  const g=timeline.at(-1), all=legal(g);
  const san=notation(g,m,all);
  const labels=recognize(g,m,[...state.history.map(row=>row[2]),san]);
  state.history.push([m.from,m.to,san,m.promotion||null,describe(g,m),labels]);
  state.plyClocks.push(state.times?{...state.times}:null);
  const next=advance(g,m);timeline.push(next);
  if(preferences.sound)session.tap?.();
  const key=identity(next);
  state.result=outcome(next,legal(next),timeline.filter(item=>identity(item)===key).length);
}
function reference(ply){
  const entry=line()[ply-1];
  if(!entry)return '기물 32개가 놓인 시작 위치입니다.';
  if(entry[4])return entry[4];
  const g=frames()[ply-1],m=legal(g).find(m=>m.from===entry[0]&&m.to===entry[1]);
  return describe(g,m);
}
function summary(){
  const history=line(),result=inspectingOld()?state.previous.result:state.result;
  const captures=history.filter(m=>m[2].includes('x')).length, checks=history.filter(m=>/[+#]/.test(m[2])).length;
  const last=history.findLastIndex(m=>/[+#x]/.test(m[2]));
  return (result||'진행 중인 판')+' · '+history.length+'회 착수, 포획 '+captures+'회, 체크 '+checks+'회.'+(last<0?'':' 돌아볼 장면: '+Math.floor(last/2+1)+'수 '+history[last][2]+'. '+reference(last+1));
}
function stopPlayback(){clearInterval(playback);playback=null;byId('playback').textContent='▶ 자동 재생';}
byId('record').onchange=()=>{stopPlayback();state.archived=byId('record').value==='old';goToPly(0);};
byId('playback').onclick=()=>{
  if(playback){stopPlayback();return;}
  if(state.at>=line().length)goToPly(0);
  byId('playback').textContent='Ⅱ 일시정지';
  playback=setInterval(()=>{if(state.at>=line().length){stopPlayback();return;}goToPly(state.at+1);},3000);
};
function axes() {
  return (inspectingOld()?state.previous.side:state.side) === 'w' ? [files,'87654321'] : ['hgfedcba','12345678'];
}
function renderBoard() {
  const ply = rewind ?? (state.review ? state.at : state.history.length);
  const displayedGame = variation || frames()[ply];
  const position = displayedGame.board;
  const checkedKing = check(displayedGame) ? displayedGame.turn + 'k' : null;
  const [columns,ranks] = axes();
  const last = line()[ply-1]?.slice(0,2) ?? [];
  const focusedSquare = view.activeElement?.dataset.square;
  const targets = state.selected ? (variation?legal(variation).filter(m=>m.from===state.selected).map(m=>m.to):destinations(state.selected)) : [];
  const cells = document.createDocumentFragment();
  [...ranks].forEach((rank, row) => [...columns].forEach((file, col) => {
    const square = file + rank;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.square = square;
    btn.className = 'square' + ((row+col)%2 ? ' dark' : '') + (last.includes(square) ? ' last' : '') + (state.selected === square ? ' selected' : '');
    if (targets.includes(square)) btn.classList.add('dot');
    const piece = position[square];
    btn.setAttribute('aria-label', piece ? square + ' ' + colorName(piece[0]) + ' ' + names[piece[1]] : square);
    if(piece && piece===checkedKing){
      btn.classList.add('checked-king');
      btn.setAttribute('aria-label',btn.getAttribute('aria-label')+' · 체크');
    }
    if (piece) {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 96;
      canvas.setAttribute('aria-hidden','true');
      paintPiece(canvas,piece);
      btn.append(canvas);
    }
    if (col === 0) {
      const label = document.createElement('span');
      label.className = 'coord rank';
      label.textContent = rank;
      label.setAttribute('aria-hidden','true');
      btn.append(label);
    }
    if (row === 7) {
      const label = document.createElement('span');
      label.className = 'coord file';
      label.textContent = file;
      label.setAttribute('aria-hidden','true');
      btn.append(label);
    }
    cells.append(btn);
  }));
  board.replaceChildren(cells);
  if (focusedSquare) board.querySelector('[data-square="' + focusedSquare + '"]')?.focus({preventScroll:true});
  drawArrow();
}
function drawArrow() {
  const ctx = byId('arrows').getContext('2d');
  ctx.clearRect(0,0,800,800);
  if (!state.arrow) return;
  const [columns,ranks] = axes();
  const point = ([file,rank]) => [(columns.indexOf(file)+.5)*100,(ranks.indexOf(rank)+.5)*100];
  const [from,to] = state.arrow.map(point);
  const angle = Math.atan2(to[1]-from[1],to[0]-from[0]);
  ctx.strokeStyle = '#8b480e';
  ctx.fillStyle = '#8b480e';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(...from);
  ctx.lineTo(to[0]-15*Math.cos(angle),to[1]-15*Math.sin(angle));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(...to);
  ctx.lineTo(to[0]-32*Math.cos(angle-.48),to[1]-32*Math.sin(angle-.48));
  ctx.lineTo(to[0]-32*Math.cos(angle+.48),to[1]-32*Math.sin(angle+.48));
  ctx.closePath();
  ctx.fill();
}
function note(text) {byId('notice').textContent = text;}
function talk(speaker, text) {
  const li = document.createElement('li');
  const name = document.createElement('small');
  transcript.push([speaker,text]);
  name.textContent = speaker === '유니' ? session.player : session.character;
  li.append(name, document.createTextNode(text));
  if (speaker === '유니') li.className = 'me-msg';
  const log=byId('log');
  const follow=log.scrollHeight-log.scrollTop-log.clientHeight<48 || speaker==='유니';
  log.append(li);
  if(follow)log.scrollTop=log.scrollHeight;
  const recentLog = byId('recentLog');
  recentLog.append(li.cloneNode(true));
  recentLog.scrollTop = recentLog.scrollHeight;
}
byId('variation').onclick=()=>{
  stopPlayback();autoTicket++;
  variation=variation?null:frames()[state.at];
  state.selected=state.arrow=null;
  note(variation?'시험할 수를 판에서 두세요. 원래 기보는 보존됩니다.':'원래 판으로 돌아왔습니다.');
  refresh();
};
function refresh() {
  byId('variation').hidden=!state.review && (state.mode!=='coach'||!preferences.hints||Boolean(state.result));
  byId('variation').textContent=variation?'원래 판으로':'수 시험하기';
  state.at = state.review ? state.at : state.history.length;
  const shownSide=inspectingOld()?state.previous.side:state.side;
  byId('opSide').textContent = colorName(shownSide === 'w' ? 'b' : 'w') + (state.mode === 'coach' ? ' · 코치' : ' · 상대')+' · '+(levels[inspectingOld()?state.previous.level:state.level]||levels.intermediate).label;
  byId('mySide').textContent = colorName(shownSide);
  byId('turn').textContent = state.review ? '복기 중' : state.result || (theirTurn()?session.character+' 생각 중…':'내 차례');
  byId('chatStatus').textContent = state.review ? '복기 중' : preferences.hints ? '힌트 켜짐' : '힌트 꺼짐';
  const waiting=theirTurn()&&!state.result&&!state.review;
  host.dataset.review=String(state.review);
  byId('movesToggle').hidden=!state.review&&!mobile.matches;
  const preview=rewind!==null;
  byId('rewindBar').hidden=!preview;
  byId('liveTools').hidden=preview;
  byId('compose').hidden=preview;
  byId('backOne').disabled=rewind===0;
  byId('resign').hidden=state.review||preview||!!state.result;
  byId('review').disabled=waiting||preview;
  if(preview)byId('turn').textContent='되돌릴 위치 · '+rewind+' / '+state.history.length;
  byId('variation').disabled=waiting||preview;
  byId('hint').disabled=waiting||preview;
  byId('hint').hidden = !preferences.hints && !state.review;
  byId('hint').textContent = state.hintLevel % 2 ? '판에서 보기' : '힌트';
  byId('undo').disabled = state.review || preview || !state.history.length;
  byId('review').textContent = state.review ? '대국 화면' : '복기';
  byId('review').setAttribute('aria-pressed',state.review);
  view.querySelectorAll('[data-mode]').forEach((btn) => btn.setAttribute('aria-pressed',btn.dataset.mode === state.mode));
  byId('reviewInfo').hidden=!state.review;
  if(state.review){
    byId('record').replaceChildren(new Option('현재 판','live'));
    if(state.previous)byId('record').add(new Option('직전 판','old'));
    byId('record').value=inspectingOld()?'old':'live';
    renderReviewPane();
  }
  renderBoard();
  renderMoves();
  renderClocks();
}
let reviewPane='move';
function writeRows(id,items){
  const panel=byId(id);panel.replaceChildren();
  for(const [label,text] of items){
    const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');
    dt.textContent=label;dd.textContent=text;row.append(dt,dd);panel.append(row);
  }
}
function reviewLesson(ply,after){
  const before=frames()[ply-1], history=line(), entry=history[ply-1];
  const best=engineAt(before,frames());
  const actual=legal(before).find(m=>m.from===entry[0]&&m.to===entry[1]&&(m.promotion||null)===(entry[3]||null));
  function explain(move,san,labels){
    const effect=labels[0];
    if(effect)return san+' — '+effect.term+'. '+effect.why;
    if(move.capture)return san+'에서는 '+move.to+'에서 상대 '+names[move.capture]+' 기물을 잡습니다.';
    if(check(advance(before,move)))return san+'은 체크를 걸어 상대가 먼저 킹의 위협을 해소하게 합니다.';
    return san+'은 '+names[move.p]+'의 위치를 '+move.from+'에서 '+move.to+'로 바꿉니다.';
  }
  const study=studyPhase(frames()[ply],history.slice(0,ply));
  const lines=[explain(actual,entry[2],labelsAt(ply))];
  if(best.move && best.san[0]!==entry[2]){
    const labels=recognize(before,best.move,[...history.slice(0,ply-1).map(m=>m[2]),best.san[0]]);
    lines.push('엔진 후보 '+explain(best.move,best.san[0],labels));
  }else if(after.move?.capture && after.move.to===actual.to){
    lines.push('예상 응수 '+after.san[0]+'에서는 상대가 방금 움직인 기물을 되잡습니다. 교환 뒤 양쪽에 무엇이 남는지 살펴보세요.');
  }else if(best.move)lines.push('이 위치에서는 엔진도 같은 수를 첫 후보로 골랐습니다.');
  lines.push((study.opening?study.opening+'에서 출발한 판입니다. '+study.meaning+' ':'')+study.phase+' · '+study.plan);
  return lines.join(' ');
}
function renderReviewPane(){
  const ply=state.at,history=line(),entry=history[ply-1];
  byId('reviewCount').textContent=ply+' / '+history.length;
  byId('reviewTitle').textContent=entry?Math.ceil(ply/2)+'수 · '+(ply%2?'백':'흑')+' '+entry[2]:'시작 위치';
  for(const [id,tab] of [['annotation','move'],['engineText','engine'],['summary','total']])byId(id).hidden=reviewPane!==tab;
  view.querySelectorAll('[data-review-pane]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.reviewPane===reviewPane));
  byId('lesson').hidden=reviewPane!=='engine'||!ply;
  if(reviewPane==='move'){
    const label=labelsAt(ply)[0];
    byId('annotation').textContent=label?label.term+' · '+label.why:reference(ply).split(/(?<=\.)\s+/)[0];
  }else if(reviewPane==='engine'){
    const result=engineAt(frames()[ply],frames());
    const items=[];
    if(ply)items.push(['실제 수',entry[2]],['착수 전 후보',engineAt(frames()[ply-1],frames()).san[0]||'—']);
    items.push(['백 기준 평가',result.evaluation],['탐색 깊이',result.depth],['예상 수순',result.san.join(' → ')||'—']);
    writeRows('engineText',items);
    if(ply)byId('lessonText').textContent=reviewLesson(ply,result);
  }else{
    const items=[['결과',(inspectingOld()?state.previous.result:state.result)||'진행 중'],['착수',history.length+'회'],['포획',history.filter(m=>m[2].includes('x')).length+'회'],['체크',history.filter(m=>/[+#]/.test(m[2])).length+'회']];
    const moment=history.findLastIndex(m=>/[+#x]/.test(m[2]));
    if(moment>=0)items.push(['돌아볼 수',Math.floor(moment/2+1)+'수 · '+(moment%2?'흑 ':'백 ')+history[moment][2]]);
    for(const item of learnings(history,inspectingOld()?state.previous.side:state.side).split(' / ').filter(Boolean)){
      const split=item.indexOf(' · ');if(split>=0)items.push([item.slice(0,split),item.slice(split+3)]);
    }
    writeRows('summary',items);
  }
}
view.querySelectorAll('[data-review-pane]').forEach(b=>b.onclick=()=>{reviewPane=b.dataset.reviewPane;stopPlayback();renderReviewPane();});
function renderMoves() {
  const list = byId('moves');
  list.replaceChildren();
  for (let i=0;i<line().length;i+=2) {
    const row = document.createElement('div');
    row.className = 'move-row';
    const no = document.createElement('span');
    no.textContent = (i/2+1) + '.';
    row.append(no);
    line().slice(i,i+2).forEach((move, offset) => {
      const btn = document.createElement('button');
      const ply = i+offset+1;
      btn.textContent = move[2];
      btn.disabled = !state.review;
      if (state.at === ply) btn.setAttribute('aria-current','step');
      btn.onclick = () => goToPly(ply);
      row.append(btn);
    });
    list.append(row);
  }
  view.querySelectorAll('[data-step]').forEach((btn) => {
    const first = ['first','prev'].includes(btn.dataset.step);
    btn.disabled = !state.review || (first ? state.at === 0 : state.at === line().length);
  });
}
let opponentTimer, worker, cancelPending, turnToken=0;
function stopOpponent(){
  turnToken++;
  clearTimeout(opponentTimer);
  worker?.terminate();worker=null;
  cancelPending?.();cancelPending=null;
}
function opponentMove(game){
  const level=levels[state.level]||levels.intermediate;
  const options={...level,previous:timeline.slice(0,-1)};
  if(state.times)options.budget=Math.min(options.budget,Math.max(20,currentTime('op')-100));
  const fallback=()=>analyze(game,{...options,budget:Math.min(options.budget,250)}).move;
  if(typeof Worker==='undefined')return Promise.resolve(fallback());
  return new Promise(resolve=>{
    try{worker=new Worker(new URL('./search-worker.js',import.meta.url),{type:'module'});}
    catch{resolve(fallback());return;}
    const finish=move=>{worker?.terminate();worker=null;cancelPending=null;resolve(move);};
    cancelPending=()=>finish(null);
    worker.onmessage=e=>finish(e.data);
    worker.onerror=()=>finish(fallback());
    worker.postMessage({game,options});
  });
}
const theirTurn = () => timeline.at(-1).turn !== state.side;
const activeClock = () => theirTurn() ? 'op' : 'me';
function currentTime(clock='me') {
  if (!state.times) return 0;
  if (state.result || rewind!==null || clock!==activeClock()) return state.times[clock];
  return Math.max(0,state.times[clock]-(performance.now()-state.turnStart));
}
function timeoutIfNeeded(){
  const clock=activeClock();
  if(!state.times || state.result || currentTime(clock)>0)return false;
  state.times[clock]=0;
  state.result=colorName(clock==='op'?state.side:(state.side==='w'?'b':'w'))+' 승 · 시간 종료';
  stopOpponent();persist();refresh();return true;
}
function renderClocks() {
  if(ready && rewind===null && timeoutIfNeeded())return;
  const hidden = !state.times || state.review;
  byId('myClock').hidden = byId('opClock').hidden = hidden;
  if (hidden) return;
  const fmt = (ms) => {
    const seconds = Math.ceil(ms/1000);
    return Math.floor(seconds/60) + ':' + String(seconds%60).padStart(2,'0');
  };
  byId('myClock').textContent = fmt(currentTime());
  byId('opClock').textContent = fmt(currentTime('op'));
  byId('myClock').classList.toggle('active',!state.result&&!theirTurn());
  byId('opClock').classList.toggle('active',!state.result&&theirTurn());

}
function goToPly(ply) {
  variation=null;
  autoTicket++;
  state.at = Math.max(0,Math.min(line().length,ply));
  state.arrow = null;
  state.hintLevel = 0;
  refresh();
}
let gameGeneration = 0;
function startGame(mode,side,timer,level='intermediate') {
  stopOpponent();variation=null;stopPlayback();
  if(ready && (state.history.length || state.result)){
    state.previous={level:state.level,history:state.history,side:state.side,result:state.result||'중단한 판'};
    previousTimeline=timeline;
  }
  rewind=null;speechPending=0;state.hold=false;state.plyClocks=[];state.archived=false;state.result='';state.clockHistory=[];
  gameGeneration++;
  autoTicket++;
  transcript.length = 0;
  state.level=Object.hasOwn(levels,level)?level:'intermediate';
  state.mode = mode;
  state.side = side === 'random' ? (Math.random() < .5 ? 'w' : 'b') : side;
  state.timer = mode === 'free' ? timer : 0;
  state.history=[];timeline=[initialGame()];

  state.review = false;
  state.selected = state.arrow = state.priorTimes = null;
  state.hintLevel = 0;
  state.times = state.timer ? {me:state.timer*60000,op:state.timer*60000} : null;
  state.turnStart = performance.now();
  byId('log').replaceChildren();
  byId('recentLog').replaceChildren();
  state.at=state.history.length;
  characterLine(state.side === 'w' ? '먼저 두시죠.' : '그럼 제가 먼저 두겠습니다.');
  note(state.side==='w'?'첫 수를 둘 폰이나 나이트를 선택하세요.':'');
  refresh();
  if(ready)scheduleOpponent();
}
board.addEventListener('click', (event) => {
  const square = event.target.closest('[data-square]')?.dataset.square;
  if(!square||rewind!==null)return;
  if(variation){
    const options=legal(variation), selected=options.filter(m=>m.from===state.selected&&m.to===square);
    if(selected.length){
      let m=selected[0];
      if(selected.length>1){
        const input=window.prompt('승격할 기물: Q, R, B, N','Q');
        m=selected.find(m=>m.promotion===input?.trim().toLowerCase());if(!m)return;
      }
      const feedback=describe(variation,m);variation=advance(variation,m);
      state.selected=null;note('시험 수 · '+feedback);
    }else state.selected=options.some(m=>m.from===square)?square:null;
    refresh();return;
  }
  if(state.review)return;
  if (state.result || state.times && !currentTime()) return;
  const game=timeline.at(-1), moves=legal(game);
  if(game.turn!==state.side)return;
  const options=moves.filter(m=>m.from===state.selected&&m.to===square);
  if(options.length){
    let mine=options[0];
    if(options.length>1){
      const input=window.prompt('승격할 기물: Q 퀸, R 룩, B 비숍, N 나이트','Q');
      mine=options.find(m=>m.promotion===input?.trim().toLowerCase());
      if(!mine)return;
    }
    state.selected=state.arrow=null;state.hintLevel=0;
    if(state.times){state.clockHistory.push({...state.times});state.times.me=currentTime();}
    if(!sending){autoTicket++;speechPending=0;}
    addMove(mine);
    state.turnStart=performance.now();
    state.at=state.history.length;
    const userLabel=labelText(state.history.at(-1)[5]);
    note(state.result||(preferences.hints&&userLabel?'방금 둔 수 · '+userLabel:''));
    if(state.result)characterLine(state.result);
    else if(state.mode==='coach'||(preferences.pacedFree&&!state.times)){
      const cue=preferences.hints?lessonCue:'제 차례군요.';
      scheduleOpponent(cue);
    }else scheduleOpponent();
  }else{
    state.selected=state.selected===square?null:moves.some(m=>m.from===square)?square:null;
    note(state.selected?'표시된 칸을 선택하세요.':check(game)?'체크를 해소할 수를 두세요.':'내 기물을 선택하세요.');
  }
  refresh();
});
function lessonCue(){
  const ply=state.history.length, entry=state.history[ply-1];
  const current=studyPhase(timeline[ply],state.history);
  const earlier=Math.max(0,ply-2);
  const prior=studyPhase(timeline[earlier],state.history.slice(0,earlier));
  const best=engineAt(timeline[ply-1]), after=engineAt(timeline[ply]);
  const loss=(best.whiteScore-after.whiteScore)*(state.side==='w'?1:-1);
  if(best.san[0]!==entry[2] && best.depth>=2 && after.depth>=2 && loss>=180 && after.move?.capture)
    return '이번 수 뒤에는 기물을 잃을 위험이 생겼군요. 교환이 끝났을 때 양쪽에 남을 기물을 한번 헤아려 보시죠.';
  if(current.opening && current.opening!==prior.opening)return current.opening+'의 수순입니다. '+current.meaning;
  if(current.phase!==prior.phase || ply<=2)return current.phase+' 단계군요. '+current.plan;
  const term=entry[5]?.[0];
  return term?term.term+'입니다. '+term.why:entry[4];
}
// A separate task gives the board a full, observable player turn before search starts.
function scheduleOpponent(cue){
  const turn=++turnToken;
  clearTimeout(opponentTimer);
  if(closed||state.result||rewind!==null||!theirTurn())return;
  opponentTimer=setTimeout(async()=>{
    if(closed||state.result||!theirTurn()||timeoutIfNeeded())return;
    const game=timeline.at(-1), previous=state.history.at(-1);
    const term=previous?.[5]?.[0];
    const message=typeof cue==='function'?cue():cue;
    const fallback=preferences.hints && !state.times && term ? '방금 두신 수는 '+term.term+'입니다. '+term.why : '';
    const lineCue=message || fallback;
    const [reply,line]=await Promise.all([opponentMove(game),lineCue?pacedLine(lineCue,turn):null]);
    if(turn!==turnToken || rewind!==null)return;
    if(closed||state.result||timeline.at(-1)!==game)return;
    if(timeoutIfNeeded()||!reply)return;
    if(state.times)state.times.op=currentTime('op');
    addMove(reply);
    if(line && line.ticket===autoTicket)talk('루퍼트',line.text);
    state.at=state.history.length;
    state.turnStart=performance.now();
    refresh();
    const move=state.history.at(-1);
    note(state.result||session.character+' · '+reply.from+' → '+reply.to+'   '+move[2]);
    persist();
    if(sending)return;
    if(state.result)characterLine(state.result);

  },cue?150:1200);
}
function hintLine(showArrow){
  const game=variation||frames()[state.review?state.at:state.history.length], moves=legal(game);
  if(!moves.length)return '종료된 국면입니다. '+reference(state.at);
  const m=engineAt(game,frames()).move;
  if(!m)return reference(state.at);
  if(showArrow)state.arrow=[m.from,m.to];
  return showArrow?'엔진 후보수 '+notation(game,m,moves)+'. '+describe(game,m):check(game)?'체크입니다. 킹을 피하거나 공격을 막거나 공격 기물을 잡을 수 있는지 보세요.':names[m.p]+'이 있는 '+m.from+' 칸을 보세요. '+(m.capture?'잡을 수 있는 상대 기물이 있습니다.':'어느 칸으로 이동할 수 있을까요?');
}
function matchFacts(){
  const userSide = inspectingOld() ? state.previous.side : state.side;
  const owner = side => (side === userSide ? '사용자 ' + session.player : '캐릭터 ' + session.character)
    + (side === 'w' ? '(백)' : '(흑)');
  const sequence = frames();
  const ply = state.review ? state.at : state.history.length;
  const captures = [];
  let lastMove = null;
  for (const [i, entry] of line().slice(0,ply).entries()) {
    const [from,to,san] = entry;
    const before = sequence[i];
    const piece = before.board[from];
    const target = before.board[to] || (piece[1] === 'p' && from[0] !== to[0] ? before.board[to[0]+from[1]] : null);
    lastMove = {수번호:Math.floor(i/2)+1, 기보:san, 둔사람:owner(piece[0]), 기물:names[piece[1]], 출발:from, 도착:to};
    if (target) {
      lastMove.잡힌기물 = owner(target[0]) + '의 ' + names[target[1]];
      captures.push(lastMove);
    }
  }
  const game = variation || sequence[ply];
  return {사용자:owner(userSide), 캐릭터:owner(userSide==='w'?'b':'w'), 차례:owner(game.turn),
    체크받는쪽:check(game)?owner(game.turn):null, 실제기보의마지막수:lastMove, 실제포획기록:captures};
}
function info(direct=false){
  const facts = matchFacts();
  if(!state.review&&!preferences.hints)return {hints:false,...facts,variation:Boolean(variation)};
  if(!state.review&&!direct)return {hints:true,indirect:true,...facts};
  if(variation)return {hints:true,...facts,variation:true,board:variation.board,turn:variation.turn,legal:legal(variation).map(m=>m.from+m.to)};
  return {hints:true,...facts,board:positions(state.at),moves:line().slice(0,state.at).map(m=>m[2]),last:reference(state.at),terms:labelsAt(state.at),engine:analysisText(frames()[state.at]),legal:legal(frames()[state.at]).map(m=>m.from+m.to+(m.promotion||'')),summary:state.review?summary():undefined};
}
async function pacedLine(cue,turn){
  if(sending)return;
  const ticket=++autoTicket;
  let timeout;
  let text=cue;
  if(session.profile){
    try{
      text=await Promise.race([
        session.reply(transcript,info(),cue),
        new Promise(resolve=>{timeout=setTimeout(()=>resolve(cue),6000);})
      ]) || cue;
    }catch{ text=cue; }
    finally{clearTimeout(timeout);}
  }
  if(closed||turn!==turnToken||ticket!==autoTicket||state.result)return;
  return {text,ticket};
}
function characterLine(text,direct=false){
  if(sending)return;
  if(!session.profile){talk('루퍼트',text);return;}
  const ticket=++autoTicket,generation=gameGeneration;
  const pos=info(direct);
  speechPending=ticket;
  session.reply(transcript,pos,text).then(reply=>{
    if(!closed && generation===gameGeneration && ticket===autoTicket){talk('루퍼트',reply);persist();}
  }).catch(()=>{if(!closed && ticket===autoTicket && generation===gameGeneration){talk('루퍼트',text);persist();}}).finally(()=>{if(!closed&&speechPending===ticket){speechPending=0;refresh();}});
}
byId('hint').onclick = () => {
  const showArrow = Boolean(state.hintLevel % 2);
  characterLine('힌트를 청하셨군요. '+hintLine(showArrow),true);
  state.hintLevel++;
  refresh();
};
byId('undo').onclick=()=>{
  if(!state.history.length||rewind!==null)return;
  stopPlayback();
  if(state.times)state.times={me:currentTime('me'),op:currentTime('op')};
  stopOpponent();variation=null;autoTicket++;speechPending=0;
  rewind=state.history.length-1;state.selected=state.arrow=null;
  note('취소하면 되돌리기 전 위치로 돌아갑니다.');refresh();characterLine('되돌리고 싶은 장면이 있으신가요?');
};
byId('backOne').onclick=()=>{if(rewind>0){rewind--;refresh();}};
byId('cancelUndo').onclick=()=>{
  rewind=null;state.turnStart=performance.now();note('원래 위치로 돌아왔어요.');
  refresh();characterLine('원래 위치에서 계속 두시죠.');scheduleOpponent();persist();
};
byId('keepUndo').onclick=()=>{
  if(rewind===null)return;
  const ply=rewind;rewind=null;gameGeneration++;
  state.clockHistory.length=Math.min(state.clockHistory.length,state.history.slice(0,ply).filter((_,i)=>i%2===(state.side==='w'?0:1)).length);
  state.history.length=ply;timeline=timeline.slice(0,ply+1);
  if(state.times&&state.plyClocks[ply])state.times={...state.plyClocks[ply]};
  state.plyClocks.length=ply;state.result='';state.turnStart=performance.now();
  state.hold=false;
  note('이 위치에서 이어둡니다.');refresh();characterLine('그 수를 물리셨군요. 여기서 다시 두시죠.');persist();scheduleOpponent();
};
byId('resign').onclick=()=>{
  if(state.result||!window.confirm('이 판을 기권할까요?'))return;
  stopOpponent();autoTicket++;speechPending=0;gameGeneration++;
  if(state.times)state.times={me:currentTime('me'),op:currentTime('op')};
  state.result=colorName(state.side==='w'?'b':'w')+' 승 · '+session.player+' 기권';
  state.hold=false;variation=null;state.arrow=state.selected=null;
  note(state.result);refresh();characterLine('기권을 받겠습니다. 한 판 함께해 주셔서 감사합니다.');persist();
};
byId('review').onclick = () => {
  variation=null;autoTicket++;stopPlayback();state.archived=false;
  reviewPane='move';state.review = !state.review;
  state.at = state.history.length;
  state.selected = state.arrow = null;
  state.hintLevel = 0;
  byId('moveCard').classList.toggle('open',false);
  byId('movesToggle').setAttribute('aria-expanded',false);
  byId('movesToggle').textContent = '기보 보기';
  note(state.review ? '기보에서 수를 눌러 판을 살펴보세요.' : '대국 화면으로 돌아왔어요.');
  refresh();characterLine(state.review?'어느 장면부터 되짚어 볼까요?':'체스판으로 돌아왔군요.');
};
view.querySelectorAll('[data-step]').forEach((btn) => {
  btn.onclick = () => goToPly({first:0,prev:state.at-1,next:state.at+1,last:line().length}[btn.dataset.step]);
});
let sending = false;
byId('compose').onsubmit = async (event) => {
  event.preventDefault();
  const message = byId('message');
  const input = message.value.trim();
  if (!input || sending || rewind!==null) return;
  const explicitHint = !/(힌트|추천).{0,10}(필요 없|필요없|말아|말고|싫|주지|없이|끄|꺼)/i.test(input) &&
    /^(힌트|hint)[!?.~ㅋㅎ\s]*$|(?:힌트|도움|단서)\s*(?:를|을)?\s*(?:좀|하나|조금)?\s*(?:줘|주|줄|부탁|달라|달라고|주세요)|(?:어느|어떤|무슨)\s*(?:기물|말)(?:로|을 써|이 좋)|(?:어느|어떤|무슨)\s*수(?:를|가 좋|가 나)|(?:어디로|어디에|어떻게|뭘)\s*(?:두|둬|둘|움직|옮|되잡|잡아)|(?:다음|좋은|최선의?)\s*수.{0,8}(?:알려|추천|뭐|보여)|(?:수|착수)\s*추천|(?:give me|can i have) (?:a )?hint/i.test(input);
  talk('유니',input);
  message.value = '';
  if (session.profile) {
    const generation = gameGeneration;
    const expectedPosition = variation || frames()[state.at];
    const button = byId('compose').querySelector('button');
    sending = button.disabled = true;
    button.textContent = '응답 중';
    try {
      const ticket=++autoTicket;
      const reply = await session.reply(transcript,info(explicitHint));
      if (!closed && expectedPosition===(variation || frames()[state.at]) && ticket===autoTicket && generation === gameGeneration) talk('루퍼트',reply);
    } catch {
      if (generation === gameGeneration) note('응답 실패 · 확장 설정의 연결 프로필을 확인해 주세요.');
    } finally {
      sending = button.disabled = false;
      if(!closed)refresh();
      button.textContent = '보내기';
      persist();
    }
    return;
  }
  const termDefinition=definition(input);
  let answer = /어려|어렵|너무 세/.test(input)?'천천히 생각하셔도 좋습니다. 기다릴게요.':/고마|감사/.test(input)?'천만에요.':/ㅋㅋ|ㅎㅎ/.test(input)?'그 표정은 무슨 뜻인지 궁금하군요.':/긴장|떨려/.test(input)?'천천히 두세요. 여기서 기다릴게요.':/안녕|반가/.test(input)?'반갑습니다. 한 판 같이 두죠.':'듣고 있어요. 조금 더 얘기해 주시겠어요?';
  if (explicitHint) {
    answer = state.review || preferences.hints ? hintLine(true) : '대국 중에 힌트는 드리지 않기로 했습니다. 문장을 바꾸셔도요.';
  } else if(termDefinition){
    answer=termDefinition;
  } else if(/무슨|용어|뭐라고|뭐야|방금|방식|전술|오프닝/.test(input)){
    if(!state.review&&!preferences.hints)answer='지금 판에 대한 해설은 복기 때 말씀드리겠습니다.';
    else{
      let ply=state.at;
      if(!state.review && ply && frames()[ply-1].turn!==state.side)ply--;
      answer=labelText(labelsAt(ply))||reference(ply);
    }
  }
  talk('루퍼트',answer);
  message.value = '';
  drawArrow();
};
function applyPreferences() {
  root.dataset.theme = preferences.theme;
  root.dataset.pieces = preferences.pieces;
  byId('pacedFree').checked=preferences.pacedFree;
  byId('soundToggle').checked=preferences.sound;
  byId('hintToggle').checked = preferences.hints;
  view.querySelectorAll('[data-theme-choice]').forEach((btn) => btn.setAttribute('aria-pressed',btn.dataset.themeChoice === preferences.theme));
  view.querySelectorAll('[data-piece-choice]').forEach((btn) => {
    btn.setAttribute('aria-pressed',btn.dataset.pieceChoice === preferences.pieces);
    paintPiece(btn.querySelector('canvas'),'wn',btn.dataset.pieceChoice);
  });
  try {localStorage.setItem('tavern-chess-ui',JSON.stringify(preferences));} catch {}
  refresh();
}
view.querySelectorAll('[data-theme-choice]').forEach((btn) => btn.onclick = () => {
  preferences.theme = btn.dataset.themeChoice;
  applyPreferences();
});
view.querySelectorAll('[data-piece-choice]').forEach((btn) => btn.onclick = () => {
  preferences.pieces = btn.dataset.pieceChoice;
  applyPreferences();
});
view.addEventListener('pointerdown',()=>{if(preferences.sound)session.unlockSound?.();});
byId('pacedFree').onchange=event=>{
  preferences.pacedFree=event.target.checked;applyPreferences();
};
byId('soundToggle').onchange=event=>{
  preferences.sound=event.target.checked;
  if(preferences.sound)session.unlockSound?.();
  applyPreferences();
};
byId('hintToggle').onchange = (event) => {
  variation=null;autoTicket++;preferences.hints = event.target.checked;
  if(!preferences.hints)note('힌트 꺼짐');
  state.arrow = null;
  state.hintLevel = 0;
  if (!preferences.hints && !state.review) talk('루퍼트','좋습니다. 이제부터 대국 중 힌트는 드리지 않겠습니다.');
  applyPreferences();
};
byId('settingsButton').onclick = () => byId('settingsDialog').showModal();
function toggleCard(card,toggle,openText,closedText) {
  const open = byId(card).classList.toggle('open');
  byId(toggle).setAttribute('aria-expanded',open);
  byId(toggle).textContent = open ? openText : closedText;
}
byId('chatToggle').onclick = () => {
  byId('chatDialog').append(byId('compose'));
  byId('chatDialog').showModal();
  const log = byId('log');
  log.scrollTop = log.scrollHeight;
};
byId('movesToggle').onclick = () => toggleCard('moveCard','movesToggle','기보 접기','기보 보기');
byId('chatDialog').addEventListener('close',()=>byId('composeAnchor').after(byId('compose')));
const mobile = matchMedia('(max-width: 700px)');
function syncPanels() {
  byId('movesToggle').hidden = !mobile.matches && !state.review;
}
mobile.addEventListener('change',syncPanels);
syncPanels();
function configureGame(mode) {
  byId('gameMode').value = mode;
  byId('gameSide').value = state.side;
  byId('gameLevel').value=state.level;
  byId('gameTime').value = String(state.timer);
  byId('gameMode').onchange();
  byId('newDialog').showModal();
}
byId('newButton').onclick = () => configureGame(state.mode);
byId('gameMode').onchange = () => byId('timerField').hidden = byId('gameMode').value !== 'free';
view.querySelectorAll('[data-mode]').forEach((btn) => btn.onclick = () => configureGame(btn.dataset.mode));
byId('start').onsubmit = (event) => {
  event.preventDefault();
  session.selectOpponent?.(byId('memberChoice').value);
  renderOpponent();
  startGame(byId('gameMode').value,byId('gameSide').value,Number(byId('gameTime').value),byId('gameLevel').value);
  byId('newDialog').close();
};
byId('minimize').onclick = () => {byId('app').hidden = true;byId('lobby').hidden = false;byId('reopen').focus();};
byId('reopen').onclick = () => {byId('lobby').hidden = true;byId('app').hidden = false;byId('minimize').focus();};
const saved = session.read();
const avatar=view.querySelector('.avatar.op');
function renderOpponent(){
const initial=Array.from(session.character)[0] || '♞';
avatar.textContent=initial;
if(session.avatarUrl){
  const photo=document.createElement('img');
  photo.alt='';
  photo.onload=()=>{if(!closed && session.avatarUrl===portrait)avatar.replaceChildren(photo);};
  const portrait=session.avatarUrl;
  photo.src=portrait;
}
const labels = view.querySelectorAll('.identity strong');
labels[0].textContent = session.character;
labels[1].textContent = session.player;
byId('message').placeholder = session.character + '에게 말 걸기…';
byId('message').setAttribute('aria-label',byId('message').placeholder);
}
renderOpponent();
if(session.members?.length){
  byId("memberField").hidden=false;
  for(const c of session.members)byId("memberChoice").add(new Option(c.name,c.avatar));
}
byId('minimize').onclick = () => {persist();session.close();};
if (saved?.version === 1) {
  Object.assign(state,saved.state);
  state.hold=false;
  timeline=rebuild(state.history);
  while(state.plyClocks.length<state.history.length)state.plyClocks.push(null);
  if(state.previous)previousTimeline=rebuild(state.previous.history);
  state.at=Math.min(state.at,line().length);state.selected=null;
  state.turnStart = performance.now() - (theirTurn()?0:Math.max(0,Date.now()-saved.stamp));
  for (const [speaker,text] of saved.transcript) talk(speaker,text);
} else {
  startGame('coach','w',0);
}
applyPreferences();
ready = true;
scheduleOpponent();
function persist() {
  if (!ready || closed) return;
  const snapshot = structuredClone(state);
  if (state.times) snapshot.times = {me:currentTime('me'),op:currentTime('op')};
  session.save({version:1,state:snapshot,stamp:Date.now(),transcript:structuredClone(transcript)});
}
view.addEventListener('click',persist);
view.addEventListener('submit',persist);
view.addEventListener('change',persist);
persist();
const timer = setInterval(renderClocks,250);
return () => { closed=true;stopOpponent();autoTicket++;stopPlayback();clearInterval(timer); mobile.removeEventListener('change',syncPanels); };

}
