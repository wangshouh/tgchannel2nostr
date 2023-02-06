# tgchannel2nostr

This is a Telegram bot for forwarding Telegram channel information to Nostr. The bot uses Cloudflare Worker and Telegram bot webhook.

# Use

Prerequisites:

1. [Wrangler](https://developers.cloudflare.com/workers/wrangler/)
1. Telegram bot token
1. Schnorr private key and public key

Change the wrangler.toml file:

```toml
[vars]

publicKey=YOUR_PUBLICK_KEY
privateKey=YOUR_PRIVATE_KEY
```

Type the following command inside the terminal:

```bash
npm install
wrangler publish
```

Request the following link to setup webhook:
```
https://api.telegram.org/bot[Telegram bot Token]/setWebhook?url=[Cloudflare worker link]
```
