const boardModule = new URL('./board.js?v=0.3.0', import.meta.url);
const key = 'tavernChessV1';
const context = () => SillyTavern.getContext();
const launch = document.createElement('button');
launch.id = 'tavernChessLaunch';
launch.type = 'button';
launch.textContent = '♞ 체스';
document.body.append(launch);
const menuLaunch = document.createElement('button');
menuLaunch.id = 'tavernChessMenuLaunch';
menuLaunch.type = 'button';
menuLaunch.className = 'list-group-item flex-container flexGap5 interactable';
menuLaunch.innerHTML = '<span class="fa-solid fa-chess-knight extensionsMenuExtensionButton" aria-hidden="true"></span><span>태번 체스</span>';
menuLaunch.onclick = openBoard;

function mountMenu() {
    const menu = document.getElementById('extensionsMenu');
    if (menu && menuLaunch.parentElement !== menu) menu.append(menuLaunch);
}
let frame;
let cleanup;
let activeChat;
let deleting = false;
const settings = context().extensionSettings.tavernChess ??= { enabled: true, profile: 'current' };
const manager = document.createElement('details');
manager.id = 'tavernChessSettings';
manager.innerHTML = `<summary>♞ 태번 체스</summary>
<label><input type="checkbox" class="enable"> 체스 확장 켜기</label>
<label>대국 대화 연결 프로필 <select class="profile text_pole"></select></label>
<button type="button" class="erase menu_button">현재 채팅의 체스 데이터 삭제</button>
<div role="status" class="result"></div>`;
const enabled = manager.querySelector('.enable');
const profiles = manager.querySelector('.profile');
const erase = manager.querySelector('.erase');
const result = manager.querySelector('.result');
function listProfiles() {
    const ctx = context();
    const stored = ctx.extensionSettings.connectionManager?.profiles ?? [];
    let available = [];
    try {
        available = ctx.ConnectionManagerRequestService?.getSupportedProfiles?.() ?? stored;
    } catch { /* Connection Manager is disabled. */ }
    return Array.isArray(available) ? available.filter(p => p?.id && p.name) : [];
}
function refreshProfiles() {
    profiles.replaceChildren(new Option('현재 채팅 연결', 'current'),new Option('로컬 코칭 (API 사용 안 함)', ''));
    for (const p of listProfiles()) profiles.add(new Option(p.name, p.id));
    if (settings.profile && !Array.from(profiles.options).some(o => o.value === settings.profile)) {
        profiles.add(new Option('사용할 수 없는 프로필', settings.profile));
    }
    profiles.value = settings.profile || '';
}
function mountSettings() {
    mountMenu();
    const container = document.getElementById('extensions_settings');
    if (container && !manager.isConnected) container.append(manager);
    enabled.checked = settings.enabled !== false;
    refreshProfiles();
}
mountSettings();
manager.addEventListener('toggle', () => { if (manager.open) refreshProfiles(); });
profiles.onfocus = refreshProfiles;
profiles.onchange = () => {
    settings.profile = profiles.value;
    context().saveSettingsDebounced();
};
enabled.onchange = () => {
    settings.enabled = enabled.checked;
    context().saveSettingsDebounced();
    sync();
};
erase.onclick = async () => {
    const ctx = context();
    const id = chatKey(ctx);
    if (!id || deleting || !ctx.chatMetadata[key]) return;
    if (!window.confirm('현재 채팅의 체스 기보와 대국 대화를 삭제할까요?')) return;
    deleting = true;
    sync();
    const previous = ctx.chatMetadata[key];
    delete ctx.chatMetadata[key];
    try {
        await ctx.saveMetadata();
        if (id === chatKey(context())) result.textContent = '이 채팅의 체스 데이터를 삭제했어요.';
    } catch {
        if (id === chatKey(context())) {
            context().chatMetadata[key] = previous;
            result.textContent = '삭제를 저장하지 못했어요. 다시 시도해 주세요.';
        }
    } finally {
        deleting = false;
        updateControls();
    }
};
function chatKey(ctx) {
    const group = ctx.groups?.find(g => String(g.id) === String(ctx.groupId));
    const chat = ctx.getCurrentChatId?.() || ctx.chatId || group?.chat_id || ctx.characters?.[ctx.characterId]?.chat;
    return chat ? JSON.stringify([ctx.groupId ?? null,ctx.characterId ?? null,chat]) : null;
}
function dismiss() {
    cleanup?.();
    cleanup = null;
    frame?.remove();
    frame = null;

}
function sync() {
    if (settings.enabled === false || deleting || activeChat !== chatKey(context())) dismiss();
    result.textContent = '';
    updateControls();
}
function updateControls() {
    const ctx = context();
    launch.hidden = settings.enabled === false || !chatKey(ctx);
    launch.disabled = deleting;
    menuLaunch.hidden = settings.enabled === false;
    menuLaunch.disabled = deleting;
    erase.disabled = deleting || !chatKey(ctx) || !ctx.chatMetadata?.[key];
}
function report(text) {
    if (globalThis.toastr) globalThis.toastr.warning(text);
    else window.alert(text);
}
launch.onclick = openBoard;
async function openBoard() {
    const id = chatKey(context());
    if (!id) return report('체스를 연결할 채팅을 먼저 열어 주세요.');
    if (frame || deleting || settings.enabled === false) return;
    activeChat = id;
    const panel = document.createElement('dialog');
    panel.setAttribute('aria-label','태번 체스');
    panel.addEventListener('cancel',event => { event.preventDefault(); dismiss(); });
    panel.title = '태번 체스';
    panel.id = 'tavernChessFrame';
    const session = {
        character: context().name2 || '상대',
        player: context().name1 || '나',
        read: () => structuredClone(context().chatMetadata[key]),
        close: dismiss,
        get profile() { return settings.profile; },
        async reply(history, position, cue='') {
            const ctx = context();
            const profile = settings.profile;
            if (panel !== frame || chatKey(ctx) !== id || (profile!=='current' && !listProfiles().some(p => p.id === profile))) {
                throw new Error('profile unavailable');
            }
            const character = ctx.characters?.[ctx.characterId];
            const messages = [{role:'system',content:[
                '한국어로 짧게 답하는 체스 대국 상대입니다.',
                '캐릭터 카드와 최근 장면의 말투와 관계를 유지하세요. 기물 이동은 확장이 담당합니다. 제공된 사실만 설명하고 평가점수나 강제 수순을 만들지 마세요.',
                ctx.name2,character?.description,character?.personality,character?.scenario,character?.data?.mes_example?.slice(0,900),
                '최근 채팅 장면: '+JSON.stringify((ctx.chat||[]).filter(m=>!m.is_system).slice(-6).map(m=>[m.name,String(m.mes||'').slice(0,500)])),
                position.hints?'복기 또는 힌트 허용.':'힌트 OFF. 수다와 규칙 설명은 허용. 현재 판 조언이나 유불리 질문은 캐릭터답게 거절하세요.',
                '현재 기물 위치: ' + JSON.stringify(position),
            ].filter(Boolean).join('\n')}];
            for (const [speaker,content] of history.slice(-20)) {
                messages.push({role:speaker === '유니' ? 'user' : 'assistant',content});
            }
            if(cue)messages.push({role:'user',content:'다음 확인된 상황을 캐릭터의 짧은 대사로 표현하세요: '+cue});
            if(profile==='current'){
                const output=await ctx.generateQuietPrompt({quietPrompt:JSON.stringify(messages),quietToLoud:false});
                if(!output?.trim())throw new Error('empty reply');
                return output.trim();
            }
            const response = await ctx.ConnectionManagerRequestService.sendRequest(profile,messages,300);
            const text = typeof response === 'string' ? response : response?.content ?? response?.choices?.[0]?.message?.content ?? response?.choices?.[0]?.text;
            if (typeof text !== 'string' || !text.trim()) throw new Error('empty reply');
            return text.trim();
        },
        async save(data) {
            const ctx = context();
            if (panel !== frame || chatKey(ctx) !== id) return;
            ctx.chatMetadata[key] = structuredClone(data);
            updateControls();
            try { await ctx.saveMetadata(); }
            catch { if (panel === frame) report('대국 저장 실패 · 연결을 확인하세요.'); }
        }
    };
    frame = panel;
    document.body.append(panel);
    try {
        panel.textContent = '체스판을 여는 중…';
        panel.showModal();
        // A dialog cannot host a shadow root directly.
        const host = document.createElement('div');
        const { mountBoard } = await import(boardModule.href);
        if (frame !== panel) return;
        panel.replaceChildren(host);
        cleanup = mountBoard(host,session);
    } catch (error) {
        if (panel !== frame) return;
        dismiss();
        console.error('[태번 체스]',error);
        report('체스판을 열지 못했어요. ' + error.message);
    }
}
context().eventSource.on(context().eventTypes.APP_READY,mountSettings);
context().eventSource.on(context().eventTypes.CHAT_CHANGED,sync);
sync();
