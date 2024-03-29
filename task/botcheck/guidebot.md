**Guide for setting up telegram bots that support CLI commands for the Celestia network**

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
# create folder 
```
mkdir $HOME/command_celestia_bot && cd $HOME/command_celestia_bot
npm install telegraf nodemon axios start --save
```
# Add Telegram bot
- Using [@BotFather](https://t.me/BotFather) to create new BOT, save HTTP API

![image](https://user-images.githubusercontent.com/110772351/229352442-98e30347-943b-46f7-bb6b-30a162b4ea88.png)

- Download the repo, then open `create.js` to add API of your BOT
```
wget -O create.js https://raw.githubusercontent.com/tunguyen9234/celestia/main/task/botcheck/create.js
```
# Start BOT
```
apt install tmux
tmux new -t celestiabot
cd $HOME/command_celestia_bot
npm i && npm start
#to exit a tmux session use CTRL+b then press d
#to back tmux session
tmux attach -t celestiabot
#to delete tmux session use exit
```
# use bot
go to https://t.me/command_celestia_bot
- Start the bot with the command /start , then select the node type you want to support

![image](https://user-images.githubusercontent.com/110772351/229537515-e57a39d8-992a-4c03-86ba-562082390368.png)

- you will see interesting things

![image](https://user-images.githubusercontent.com/110772351/229546372-1d782bd0-d63a-495f-972f-d1e230089536.png)
![image](https://user-images.githubusercontent.com/110772351/229541152-30467b9b-ea4d-490a-8c25-76ee3840da8b.png)
![image](https://user-images.githubusercontent.com/110772351/229541425-806d513c-1855-42ed-90c9-967f34fa185a.png)

OKOKOK
