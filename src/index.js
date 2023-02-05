/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { generateNip01Event, sendEvent } from './nostr';

export default {
	async fetch(request, env, ctx) {

		if (request.method != "POST") {
			return new Response("Error")
		} else {
			const socket = new WebSocket('wss://nos.lol');
			const data = await request.json();
			const channelPost = data["channel_post"]["text"];
			const nip01Event = await generateNip01Event(channelPost, env.publicKey, env.privateKey);
			console.log(`["EVENT,${nip01Event}]`);
			const test = await sendEvent(`["EVENT", ${nip01Event}]`);
			return new Response(test)
		}
	}
}
