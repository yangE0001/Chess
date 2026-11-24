const page = new URL('./board.html', import.meta.url);
const key = 'tavernChessV1';
const context = () => SillyTavern.getContext();
const launch = document.createElement('button');
launch.id = 'tavernChessLaunch';
launch.type = 'button';
launch.textContent = '♞ 체스';
document.body.append(launch);
let frame;
let deleting = false;
const settings = context().extensionSettings.tavernChess ??= { enabled: true, profile: '' };
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
    profiles.replaceChildren(new Option('예시 대사 (API 사용 안 함)', ''));
    for (const p of listProfiles()) profiles.add(new Option(p.name, p.id));
    if (settings.profile && !Array.from(profiles.options).some(o => o.value === settings.profile)) {
        profiles.add(new Option('사용할 수 없는 프로필', settings.profile));
    }
    profiles.value = settings.profile || '';
}
function mountSettings() {
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
    const chat = ctx.getCurrentChatId?.() ?? ctx.chatId;
    return chat ? JSON.stringify([ctx.groupId ?? null,ctx.characterId ?? null,chat]) : null;
}
function dismiss() {
    frame?.remove();
    frame = null;

}
function sync() {
    dismiss();
    result.textContent = '';
    updateControls();
}
function updateControls() {
    const ctx = context();
    launch.hidden = settings.enabled === false || !chatKey(ctx);
    launch.disabled = deleting;
    erase.disabled = deleting || !chatKey(ctx) || !ctx.chatMetadata?.[key];
}
launch.onclick = () => {
    const id = chatKey(context());
    if (!id || frame || deleting || settings.enabled === false) return;
    const panel = document.createElement('iframe');
    panel.title = '태번 체스';
    panel.id = 'tavernChessFrame';
    panel.src = page.href;
    panel.chessSession = {
        character: context().name2 || '상대',
        player: context().name1 || '나',
        read: () => structuredClone(context().chatMetadata[key]),
        close: dismiss,
        get profile() { return settings.profile; },
        async reply(history, position) {
            const ctx = context();
            const profile = settings.profile;
            if (panel !== frame || chatKey(ctx) !== id || !listProfiles().some(p => p.id === profile)) {
                throw new Error('profile unavailable');
            }
            const character = ctx.characters?.[ctx.characterId];
            const messages = [{role:'system',content:[
                '한국어로 짧게 답하는 체스 대국 상대입니다.',
                ctx.name2,character?.description,character?.personality,
                '현재 기물 위치: ' + JSON.stringify(position),
            ].filter(Boolean).join('\n')}];
            for (const [speaker,content] of history.slice(-20)) {
                messages.push({role:speaker === '유니' ? 'user' : 'assistant',content});
            }
            const response = await ctx.ConnectionManagerRequestService.sendRequest(profile,messages,300);
            const text = typeof response === 'string' ? response : response?.content ?? response?.choices?.[0]?.message?.content;
            if (typeof text !== 'string' || !text.trim()) throw new Error('empty reply');
            return text.trim();
        },
        async save(data) {
            const ctx = context();
            if (panel !== frame || chatKey(ctx) !== id) return;
            ctx.chatMetadata[key] = structuredClone(data);
            updateControls();
            try { await ctx.saveMetadata(); }
            catch { if (panel === frame) panel.contentDocument.getElementById('notice').textContent = '대국 저장 실패 · 연결을 확인하세요.'; }
        }
    };
    frame = panel;
    document.body.append(panel);
};
context().eventSource.on(context().eventTypes.APP_READY,mountSettings);
context().eventSource.on(context().eventTypes.CHAT_CHANGED,sync);
sync();
