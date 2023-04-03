# Install NVM
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
source ~/.bashrc
nvm install 18
nvm use 18
#check
node -v
npm -v
```
# Install npm
```
npm install -g npm@9.6.3
mkdir $HOME/command_celestia_bot && cd $HOME/command_celestia_bot
npm install telegraf nodemon axios start --save
```
# Add Telegram bot
- Using [@BotFather](https://t.me/BotFather) to create your BOT, pay attention to HTTP API

![image](https://user-images.githubusercontent.com/110772351/229352442-98e30347-943b-46f7-bb6b-30a162b4ea88.png)

- Download the repo, then open `create.js` to add API of your BOT
```
wget -O create.js https://raw.githubusercontent.com/tunguyen9234/celestia/task/botcheck/create.js
```
# Start BOT
```
which screen
#if result return is "/usr/bin/screen" , screen is installed
#if not have screen , run the current command to install
apt install screen
screen -S celestiabot
```
```
cd $HOME/command_celestia_bot
npm i && npm start
```
# check and use bot , go to t.me/command_celestia_bot
- Start the bot with the command /start , then select the node you want to support
