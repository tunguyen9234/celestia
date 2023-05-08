***instructions to set up a notification system that sends node information to mail . Take for example celestia-light***
# Install SSMTP for sending mail from Linux
```
sudo apt install ssmtp
sudo apt install sendmail
sudo apt install sendmail-cf
sed -i.bak -e "s/\(^127\.0\.0\.1 .*\)/\1 `hostname`/" /etc/hosts
```

# Install script of monitoring
```
mkdir $HOME/.monitor/ && cd $HOME/.monitor/
wget https://raw.githubusercontent.com/tunguyen9234/celestia/main/task/monitor/monitor.sh

```

# Edit monitor.sh file following your chain
```
vi $HOME/.monitor/monitor.sh
```
```
# If monitor script and your node are in different machine, you have to expose your RPC node to public internet. then replace YOUR_RPC="http://YOUR_NODE_IP:YOUR_RPC_PORT"
if alert and your node are in one machine YOUR_RPC="http://127.0.0.1:YOUR_RPC_PORT"

# set CEL_NODEID
example : CEL_NODEID="12D3KooWS47idXvbzQurhQezdnGpAvNniQFfcYEviXSEZeQq2e4m"

# name the alert string
example : YOUR_NODE_NAME="Celestia-light"

# set your_email 
example : YOUR_EMAIL="tu99248@gmail.com"

```

# Run crontab as command
```
crontab -e -u root
* * * * *  /bin/bash $HOME/.monitor/monitor.sh
```

- Stop your node, then check alerting on your email

![image](https://user-images.githubusercontent.com/110772351/236840356-fdd69399-ca81-4258-95c3-8b8cb8ad5ba0.png)

