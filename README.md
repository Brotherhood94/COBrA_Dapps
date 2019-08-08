# COBrA - Fair COntent Trade on the BlockchAin

The goal of this project is to implement a decentralized content publishing service, based on the blockchain technology,  which enables the authors of new contents to submit their creation (song, video, photo,...) and to be rewarded accordingly to customers' fruition.

## To run

### Start a Ethereum's testnet node
geth --testnet --syncmode "light" --datadir "./ethereumTestnet"  --rpc --rpcapi db,eth,net,web3,personal --cache=4096  --rpcport 8545 --rpcaddr 127.0.0.1 --rpccorsdomain "*"

Import your address in **/ethereumTestnet/keystore** directory


### Launch Dapps in your Browser

open **index.html** in **CoBrA_Dapps** directory


