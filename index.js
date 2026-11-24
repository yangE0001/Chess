const page = new URL('./board.html', import.meta.url);
const key = 'tavernChessV1';
const context = () => SillyTavern.getContext();
const launch = document.createElement('button');
launch.id = 'tavernChessLaunch';
launch.type = 'button';
launch.textContent = '♞ 체스';
document.body.append(launch);
let frame;
function chatKey(ctx) {
    const chat = ctx.getCurrentChatId?.() ?? ctx.chatId;
    return chat ? JSON.stringify([ctx.groupId ?? null,ctx.characterId ?? null,chat]) : null;
}
function dismiss() {
    frame?.remove();
    frame = null;
    launch.focus();
}
function sync() {
    dismiss();
    launch.hidden = !chatKey(context());
}
launch.onclick = () => {
    const id = chatKey(context());
    if (!id || frame) return;
    const panel = document.createElement('iframe');
    panel.title = '태번 체스';
    panel.id = 'tavernChessFrame';
    panel.src = page.href;
    panel.chessSession = {
        character: context().name2 || '상대',
        player: context().name1 || '나',
        read: () => structuredClone(context().chatMetadata[key]),
        close: dismiss,
        async save(data) {
            const ctx = context();
            if (panel !== frame || chatKey(ctx) !== id) return;
            ctx.chatMetadata[key] = structuredClone(data);
            try { await ctx.saveMetadata(); }
            catch { if (panel === frame) panel.contentDocument.getElementById('notice').textContent = '대국 저장 실패 · 연결을 확인하세요.'; }
        }
    };
    frame = panel;
    document.body.append(panel);
};
context().eventSource.on(context().eventTypes.CHAT_CHANGED,sync);
sync();
