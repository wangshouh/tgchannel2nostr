import * as secp from '@noble/secp256k1';

const regex = /#(.*?) /gm;

function exactHashTag(content) {
    const array = [...content.matchAll(regex)];
    return array.map(m => ["t", m[1]])
}

function serializeEvent(content, publicKey) {
    return JSON.stringify(
        [
            0,
            publicKey,
            Math.floor(Date.now() / 1000),
            1,
            exactHashTag(content),
            content
        ]
    )
}

export async function generateNip01Event(content, publicKey, privateKey) {
    let nip01Event = {};
    const idImage = new TextEncoder().encode(serializeEvent(content, publicKey));
    const idHash = await crypto.subtle.digest(
        {
            name: 'SHA-256',
        },
        idImage
    );
    nip01Event.id = secp.utils.bytesToHex(new Uint8Array(idHash));
    nip01Event.pubkey = publicKey;
    nip01Event.created_at = Math.floor(Date.now() / 1000);
    nip01Event.kind = 1;
    nip01Event.tags = exactHashTag(content);
    nip01Event.content = content;
    nip01Event.sig = secp.utils.bytesToHex(await secp.schnorr.sign(nip01Event.id, privateKey));
    return JSON.stringify(nip01Event)
}

export async function sendEvent(nip01Event) {
    let resp = await fetch("https://nos.lol",
        {
            headers: {
                Upgrade: 'websocket',
            },
        });
    let ws = resp.webSocket;
    if (!ws) {
        throw new Error("server didn't accept WebSocket");
    }
    ws.accept();
    ws.send(nip01Event);
    ws.addEventListener('message', msg => { console.log(msg.data); });
}


