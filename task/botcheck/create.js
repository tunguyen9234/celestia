const { Telegraf } = require('telegraf');
const axios = require('axios').default;
const icon = require('node-emoji')

const bot = new Telegraf('6002368720:AAGtVC20_LR-Whup8Os1LV8URVxG7Y_0-uw');

var instance = "";
var denom = "";
var chainid = "";

// Define supported chains
const inlineKeyboardChainsCommands = {
    inline_keyboard: [
        [		
    { text: "VALIDATOR", callback_data: 'validator' },
    { text: "LIGHT", callback_data: 'light' },
    { text: "BRIDGE", callback_data: 'bridge' },		
        ]
    ]
};

async function myCLI(ctx) {
    var msg = `
     ${icon.get(':ok:')} <b> Discorver The Following Interesting Tips </b> ${icon.get(':rocket:')}

${icon.get(':eyes:')} <b>What do you want to search</b>
${icon.get(':writing_hand:')} Wallet Commands: /wallet
${icon.get(':writing_hand:')} Useful links: /links
${icon.get(':writing_hand:')} Status Node Commands: /status
${icon.get(':writing_hand:')} node id Commands: /nodeid
`;
    bot.telegram.sendMessage(ctx.chat.id, msg, {parse_mode: 'html'});
};




bot.command('start', ctx => {
	instance = "";
  	denom = "";
	chainid = "";
	myCLI(ctx);	
	let msg = 'Please choose one of the node type below';
	bot.telegram.sendMessage(ctx.chat.id, msg,  { reply_markup:  inlineKeyboardChainsCommands});
});

bot.action('light', ctx => {
    instance = "./cel-key";
    denom = "utia";
    chainid = "blockspacerace";
    Nodetype = "light";
    bot.telegram.sendMessage(ctx.chat.id, `${icon.get('white_check_mark')} Glad to support you !`);
});

bot.action('bridge', ctx => {
    instance = "./cel-key";
    denom = "utia";
    chainid = "blockspacerace";
    Nodetype = "bridge";
    bot.telegram.sendMessage(ctx.chat.id, `${icon.get('white_check_mark')} Glad to support you !`);
});


bot.command('wallet', ctx => {
if(instance) {
    bot.telegram.sendMessage(ctx.chat.id,`
${icon.get('lower_left_paintbrush')} <b>Create new wallet</b>
${instance} add <b>WALLET_NAME</b> --keyring-backend test  --node.type ${Nodetype} --p2p.network ${chainid}

${icon.get('lower_left_paintbrush')} <b>Restore wallet</b>
${instance} add <b>WALLET_NAME</b> --keyring-backend test  --node.type ${Nodetype} --p2p.network ${chainid} --recover

${icon.get('lower_left_paintbrush')} <b>Export private key</b>
${instance} export <b>WALLET_NAME</b> --unarmored-hex --unsafe --keyring-backend test  --node.type ${Nodetype} --p2p.network ${chainid}

${icon.get('lower_left_paintbrush')} <b>Show list of wallet</b>
${instance} list <b>WALLET_NAME</b> --keyring-backend test  --node.type ${Nodetype} --p2p.network ${chainid}

${icon.get('lower_left_paintbrush')} <b>Query wallet balance</b>

curl -X GET http://127.0.0.1:26659/balance  | jq

${icon.get('lower_left_paintbrush')} <b>Import private key</b>
${instance} import <b><WALLET_NAME></b> <b><KEY_FILE></b> --keyring-backend test  --node.type ${Nodetype} --p2p.network ${chainid}

${icon.get('lower_left_paintbrush')} <b>Delete wallet</b>
${instance} delete <b>WALLET_NAME</b> --keyring-backend test  --node.type ${Nodetype} --p2p.network ${chainid}
    `, {parse_mode: 'html'});
} else {
   bot.telegram.sendMessage(ctx.chat.id,`${icon.get('warning')} You did not select chain! Kindly select !`,{reply_markup: inlineKeyboardChainsCommands});
  }
});

bot.command('status', ctx => {
if(instance) {	
    bot.telegram.sendMessage(ctx.chat.id,`
${icon.get('lower_left_paintbrush')} <b>check service node status</b>
sudo systemctl status celestia-${Nodetype}.service

${icon.get('lower_left_paintbrush')} <b>check log of node</b>
sudo journalctl -u celestia-${Nodetype} -f -o cat
    `, {parse_mode: 'html'});
} else {
   bot.telegram.sendMessage(ctx.chat.id,`${icon.get('warning')} You did not select chain! Kindly select !`,{reply_markup: inlineKeyboardChainsCommands});
  }
});

bot.command('nodeid', ctx => {
if(instance) {	
    bot.telegram.sendMessage(ctx.chat.id,`
${icon.get('lower_left_paintbrush')} <b>Show node id</b>

NODE_TYPE=${Nodetype}
AUTH_TOKEN=$(celestia $NODE_TYPE auth admin --p2p.network blockspacerace)
curl -X POST -H "Authorization: Bearer $AUTH_TOKEN" -H 'Content-Type: application/json' -d '{"jsonrpc":"2.0","id":0,"method":"p2p.Info","params":[]}' http://localhost:26658
     
    `, {parse_mode: 'html'});
 } else {
    bot.telegram.sendMessage(ctx.chat.id,`${icon.get('warning')} You did not select chain! Kindly select !`,{reply_markup: inlineKeyboardChainsCommands});
  }	
});

bot.command('links', ctx => {
if(instance) {	
    bot.telegram.sendMessage(ctx.chat.id,`
${icon.get('lower_left_paintbrush')} <b>official document</b>

https://docs.celestia.org/

${icon.get('lower_left_paintbrush')} <b>explorer</b>

https://testnet.mintscan.io/celestia-incentivized-testnet


${icon.get('lower_left_paintbrush')} <b>check node id status</b>

https://tiascan.com/light-nodes

    `, {parse_mode: 'html'});
} else {
   bot.telegram.sendMessage(ctx.chat.id,`${icon.get('warning')} You did not select chain! Kindly select !`,{reply_markup: inlineKeyboardChainsCommands});
  }	
});

bot.launch();
