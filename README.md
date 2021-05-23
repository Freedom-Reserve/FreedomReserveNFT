# FreedomReserveNFT

## To Deploy
set config file: contractPair = 4
$ yarn run deploy
Then push

contractPair inside the config file is needed to specify which smart contract to use: 0 for dev or 1 for production smart contract

all the functions you specified are inside store.js, and other related functions are inside ethFunc.js, and App.js

The common way you mentioned can be found inside ethFunc.js, where getWeb3() will detect if MetaMask exists, then get web3 to make contract instances and get accounts, network, then I put all these four elements inside "compo" for easy access

so different functions can find what they need inside compo

## Debug
