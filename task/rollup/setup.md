## 1. Download repo of Cosmos SDK Appchain L1

## 2. Convert repo of appchain to rollup
```
REPO_PATH="YOUR_DOWNLOAD_PATH"

cd $REPO_PATH

# Check existing Cosmos SDK version using by chain
SDK_VERSION=$(cat go.mod | grep "github.com/cosmos/cosmos-sdk " | awk '{print $2}' | awk -F"\." '{print $1"."$2}')
echo $SDK_VERSION

# Select latest Rollkit SDK version from the link `https://github.com/rollkit/cosmos-sdk/tags` which is consistent with your $SDK_VERSION
# If $SDK_VERSION=0.45 => select v0.45.10-rollkit-v0.7.3-no-fraud-proofs
# If $SDK_VERSION=0.46 => select v0.46.7-rollkit-v0.7.3-no-fraud-proofs

# Edit Cosmos-SDK appchain to be Cosmos SDK rollup (Suppose $SDK_VERSION=0.45)
go mod edit -replace github.com/cosmos/cosmos-sdk=github.com/rollkit/cosmos-sdk@v0.45.10-rollkit-v0.7.3-no-fraud-proofs
go mod edit -replace github.com/tendermint/tendermint=github.com/celestiaorg/tendermint@v0.34.22-0.20221202214355-3605c597500d
go mod tidy
go mod download
make install
```

## 3. Setting Cosmos SDK Rollup local devnet
```
# Setup some variables
inst_chain="CHAIN_BINARY_FILE" # Such as, Sei is seid, OKP4 is okp4d
MONIKER_NAME="YOUR_NAME"
CHAIN_ID="YOUR_CHAIN_ID"
KEY_NAME_1=key1
KEY_NAME_2=key2
DENOM="YOUR_DENOM"
CHAINFLAG="--chain-id ${CHAIN_ID}"
TOKEN_AMOUNT="10000000000000000000000000${DENOM}"
STAKING_AMOUNT="1000000000${DENOM}"
HOME_DIR="YOUR_INSTALLED_CHAIN_PATH" # Ex: Sei is /root/.seid, okp4 is /root/.okp4


# reset any existing genesis/chain data
$inst_chain tendermint unsafe-reset-all

# initialize the validator with the chain ID you set
$inst_chain init $MONIKER_NAME --chain-id $CHAIN_ID

# add keys for key 1 and key 2 to keyring-backend test
$inst_chain keys add $KEY_NAME_1 --keyring-backend test

$inst_chain keys add $KEY_NAME_2 --keyring-backend test

sed -i.bak -e "s|\"stake\"|\"$DENOM\"|g" ${HOME_DIR}/config/genesis.json

# add these as genesis accounts
$inst_chain add-genesis-account $KEY_NAME_1 $TOKEN_AMOUNT --keyring-backend test
$inst_chain add-genesis-account $KEY_NAME_2 $TOKEN_AMOUNT --keyring-backend test

# set the staking amounts in the genesis transaction
$inst_chain gentx $KEY_NAME_1 $STAKING_AMOUNT --chain-id $CHAIN_ID --keyring-backend test

# collect genesis transactions
$inst_chain collect-gentxs
```

## 4. Start rollup chain
### 4.1 Setup Celestia DA light/fullnode (OPTIONAL)
- [Lightnode setup guide](https://docs.celestia.org/nodes/full-storage-node/)
- [Fullnode setup guide](https://docs.celestia.org/nodes/light-node/)

### 4.2 Start chain
```
# Declare DA_URL
# If DA node and Rollup sequencer are on different server
DA_URL="http://YOUR_PUB_IP:26659"

# If DA node and Rollup sequencer are on same server
DA_URL="http://localhost:26659"

# Create a random Namespace ID for your rollup to post blocks to
NAMESPACE_ID=$(echo $RANDOM | md5sum | head -c 16; echo;)
echo $NAMESPACE_ID 

# Query the DA Layer start height, in this case we are querying blockheight from RPC of a consensus fullnode on Celestia-Blockspacerace
# You can check public of Celestia RPC at here: https://docs.celestia.org/nodes/blockspace-race/#rpc-endpoints
DA_BLOCK_HEIGHT=$(curl https://rpc-blockspacerace.pops.one/block | jq -r '.result.block.header.height')
echo $DA_BLOCK_HEIGHT

# start a sequencer of rollkit chain
$inst_chain start --rollkit.aggregator true --rollkit.block_time 2.35s --rollkit.da_block_time 2.35s --rollkit.da_layer celestia --rollkit.da_config='{"base_url":"$DA_URL","timeout":60000000000,"fee":100,"gas_limit":100000}' --rollkit.namespace_id $NAMESPACE_ID  --rollkit.da_start_height $DA_BLOCK_HEIGHT --p2p.laddr "0.0.0.0:26656" --p2p.seed_mode --log_level debug
```
