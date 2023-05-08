#!/bin/bash

# File name for saving parameters
LOG_FILE="$HOME/.monitor/monitor.log"

# File name stores login session in today
LOG_SESSION="$HOME/.monitor/logsession.log"

# Your node RPC address, e.g. "http://127.0.0.1:26657"
NODE_RPC="http://127.0.0.1:26657"

# Your Celestia nodeid
CEL_NODEID="12D3KooWS47idXvbzQurhQezdnGpAvNniQFfcYEviXSEZeQq2e4m"
CEL_API="https://leaderboard.celestia.tools/api/v1/nodes/$CEL_NODEID"

# YOUR node name
NODE_NAME="Celestia-light"

source

# Your public IP
ip=$(wget -qO- eth0.me)

touch $LOG_FILE

# Collect status of node
STATUS=$(curl -s "$CEL_API")
uptime=$(echo $STATUS | jq .uptime | xargs)
network_height=$(echo $STATUS | jq .network_height | xargs )
head=$(echo $STATUS | jq .head | xargs )
das_network_head=$(echo $STATUS | jq .das_network_head | xargs )
das_sampled_chain_head=$(echo $STATUS | jq .das_sampled_chain_head | xargs )
DAS=$(echo $STATUS | jq .das_total_sampled_headers | xargs)
PFB=$(echo $STATUS | jq .pfb_count | xargs)

# Collect nodeid status
ID_STATUS=$uptime

source $LOG_FILE
echo 'LAST_BLOCK="'"$network_height"'"' > $LOG_FILE
echo 'LAST_HEAD="'"$das_network_head"'"' >> $LOG_FILE


source $HOME/.bash_profile
curl -s "$NODE_RPC/status"> /dev/null
if [[ $? -ne 0 ]]; then
    MSG="Node $NODE_NAME with $ip is stopped!.To check your node."
    SEND=$(curl -s -X POST -H "Content-Type:multipart/form-data" "https://api.telegram.org/bot$TG_API/sendMessage?chat_id=$TG_ID&text=$MSG"); exit 1
fi

if [[ $ID_STATUS = "<95" ]]; then
    MSG=" Node $NODE_NAME with $ip is uptime drop warning !!!.To check your node."
    SEND=$(curl -s -X POST -H "Content-Type:multipart/form-data" "https://api.telegram.org/bot$TG_API/sendMessage?chat_id=$TG_ID&text=$MSG");
fi

if [[ $LAST_HEAD -ne $das_sampled_chain_head ]]; then
    DIFF=$(($das_sampled_chain_head - $LAST_HEAD))
    if [[ $DIFF -gt 0 ]]; then
        DIFF="%2B$DIFF"
    fi
    MSG="Node $NODE_NAME with $ip has missed head : $DIFF%0A($LAST_HEAD -> $das_sampled_chain_head)"
    SEND=$(curl -s -X POST -H "Content-Type:multipart/form-data" "https://api.telegram.org/bot$TG_API/sendMessage?chat_id=$TG_ID&text=$MSG");
fi

if [[ $das_network_head = "$das_network_head" ]]; then
    MSG="Node $NODE_NAME with $ip das_network_head $das_network_head "
    SEND=$(curl -s -X POST -H "Content-Type:multipart/form-data" "https://api.telegram.org/bot$TG_API/sendMessage?chat_id=$TG_ID&text=$MSG");
fi

if [[ $DAS = "$DAS" ]]; then
    MSG=" Node $NODE_NAME with $ip is accomplished das_total_sampled_headers $DAS"
    SEND=$(curl -s -X POST -H "Content-Type:multipart/form-data" "https://api.telegram.org/bot$TG_API/sendMessage?chat_id=$TG_ID&text=$MSG");
fi

if [[ $PFB = "$PFB" ]]; then
    MSG="Node $NODE_NAME with $ip is submited PFB transactions $PFB"
    SEND=$(curl -s -X POST -H "Content-Type:multipart/form-data" "https://api.telegram.org/bot$TG_API/sendMessage?chat_id=$TG_ID&text=$MSG");

fi

touch $LOG_SESSION
echo "Subject: List of login session to your server" > $LOG_SESSION
last -s today >> $LOG_SESSION
MSG="Last login session in today: `last -s today | awk '{print $3}' |grep ^[0-9] | tr '\t' ' '`"
SEND=$(curl -s -X POST -H "Content-Type:multipart/form-data" "https://api.telegram.org/bot$TG_API/sendMessage?chat_id=$TG_ID&text=$MSG");
