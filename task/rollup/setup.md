***guide for building rollup for Cosmos SDK Appchain L1 to Celestia .The script for this tutorial is built for Celestia's Blockspacerace testnet***

# Cosmos-SDK are written in the Golang programming language , You will need install golang
```
ver="1.20.3"
cd $HOME
wget "https://golang.org/dl/go$ver.linux-amd64.tar.gz"
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf "go$ver.linux-amd64.tar.gz"
rm "go$ver.linux-amd64.tar.gz"
echo "export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin" >> ~/.bash_profile
source ~/.bash_profile
go version
```
# install celestia light node (OPTIONAL)

**go to [link](https://docs.celestia.org/nodes/light-node/)

# Download repo Cosmos SDK L1

 ***ex : nibiru , sei , okp4 ...***
 here for example nibiru
 ```
git clone https://github.com/NibiruChain/nibiru.git
cd nibiru
git checkout v0.19.2
make install
```
 
# Convert repo of Cosmos SDK L1 to rollup
**go to "YOUR_DOWNLOAD_PATH"**

**ex : cd nibiru**

- Check Cosmos SDK version using by chain
```
cat go.mod | grep "github.com/cosmos/cosmos-sdk" | awk '{print $2}' | awk -F: '{print $1"."$2}'
```
- To swap out Tendermint for Rollkit (Suppose SDK version 0.45)

#Select latest Rollkit SDK version from the [link](https://github.com/rollkit/cosmos-sdk/tags) which is consistent with your SDK version

#If SDK version = 0.45 => select v0.45.10-rollkit-v0.7.3-no-fraud-proofs

#If SDK version = 0.46 => select v0.46.7-rollkit-v0.7.3-no-fraud-proofs

```
go mod edit -replace github.com/cosmos/cosmos-sdk=github.com/rollkit/cosmos-sdk@v0.45.10-rollkit-v0.7.3-no-fraud-proofs
go mod edit -replace github.com/tendermint/tendermint=github.com/celestiaorg/tendermint@v0.34.22-0.20221202214355-3605c597500d
go mod tidy
go mod download
make install
```

# Setting Cosmos SDK Rollup
- Setup some variables
```
inst_chain="CHAIN_BINARY_FILE" # Such as, Nibiru is nibid ,Sei is seid, OKP4 is okp4d
MONIKER_NAME="YOUR_NAME"
CHAIN_ID="YOUR_CHAIN_ID"  # now , Nibiru is nibiru-itn-1 , Sei is atlantic-2 , OKP4 is okp4-nemeton-1
KEY_NAME_1=key1
KEY_NAME_2=key2
DENOM="YOUR_DENOM"  # Such as , Nibiru is unibi , Sei is usei , OKP4 is uknow
CHAINFLAG="--chain-id ${CHAIN_ID}"
TOKEN_AMOUNT="10000000000000000000000000${DENOM}"
STAKING_AMOUNT="1000000000${DENOM}"
HOME_DIR="YOUR_INSTALLED_CHAIN_PATH" # Ex:Nibiru is /root/.nibid ,  Sei is /root/.sei, okp4 is /root/.okp4
```
- reset any existing genesis/chain data
```
$inst_chain tendermint unsafe-reset-all
```
- initialize the validator with the chain ID you set
```
$inst_chain init $MONIKER_NAME --chain-id $CHAIN_ID
```
-  add keys for key 1 and key 2 to keyring-backend test
```
$inst_chain keys add $KEY_NAME_1 --keyring-backend test
$inst_chain keys add $KEY_NAME_2 --keyring-backend test
```
- add these as genesis accounts
```
$inst_chain add-genesis-account $KEY_NAME_1 $TOKEN_AMOUNT --keyring-backend test
$inst_chain add-genesis-account $KEY_NAME_2 $TOKEN_AMOUNT --keyring-backend test
```
- add DENOM go to genesis file
```
sed -i.bak -e "s|\"stake\"|\"$DENOM\"|g" ${HOME_DIR}/config/genesis.json
```
- set the staking amounts in the genesis transaction
```
$inst_chain gentx $KEY_NAME_1 $STAKING_AMOUNT --chain-id $CHAIN_ID --keyring-backend test
```
- collect genesis transactions
```
$inst_chain collect-gentxs
```
# Start rollup chain
-  Declare DA_URL
  #If DA node and Rollup sequencer are on different server
DA_URL="http://YOUR_PUB_IP:26659"
  #If DA node and Rollup sequencer are on same server
DA_URL="http://localhost:26659"

- Create a random Namespace ID for your rollup to post blocks to
```
NAMESPACE_ID=$(echo $RANDOM | md5sum | head -c 16; echo;)
echo $NAMESPACE_ID 
```
- query the DA Layer start height
( You can check public of Celestia RPC at [here](https://docs.celestia.org/nodes/blockspace-race/) #rpc-endpoints) 
```
DA_BLOCK_HEIGHT=$(curl https://rpc-blockspacerace.pops.one/block | jq -r '.result.block.header.height')
echo $DA_BLOCK_HEIGHT
```
- start a sequencer of rollkit chain
```
$inst_chain start --rollkit.aggregator true --rollkit.block_time 2.35s --rollkit.da_block_time 2.35s --rollkit.da_layer celestia --rollkit.da_config='{"base_url":"$DA_URL","timeout":60000000000,"fee":100,"gas_limit":100000}' --rollkit.namespace_id $NAMESPACE_ID  --rollkit.da_start_height $DA_BLOCK_HEIGHT --p2p.laddr "0.0.0.0:26656" --p2p.seed_mode --log_level debug
```
**and here is the result for Nibiru, sent PFB transaction to Celestia**

![image](https://user-images.githubusercontent.com/110772351/236657219-4e4e3cf9-8655-4a57-9d13-ba97e0d706c6.png)

![image](https://user-images.githubusercontent.com/110772351/236657255-f50f5a9f-1990-4999-9980-e8fd77381f9a.png)
