/*config ...
@type: Configuration
@brief ... 

//-------------== To Deploy
For Production:  serverNumber to 1
https://mgmt.aries.financial/reward

Else: Set serverNumber = 0

Then push
//-------------==
manual push: copy ethereum192x192.png into repo

@author Raymond Lieu
@date   2020-12-23

contractPair = 56 for BSC Mainnet, 97 for BSC Testnet
*/
const config = {
  infuraProvider:
    "https://eth-mainnet.alchemyapi.io/v2/k2--UT_xVVXMOvAyoxJYqtKhlmyBbqnX",
  ethNodeNumber: 1,
  ethNodeURL1: "https://mainnet.infura.io/v3/34d79804349241d8a6bbfb1351e33a62",
  ethNodeURL0: "https://rinkeby.infura.io/v3/34d79804349241d8a6bbfb1351e33a62",
  gasDataSource:
    "https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=SQDE7E4HMPT3J4DECSY4IZ3HP1PC4MANB7",
  DBID: 0,
  serverNumer: 1,
  server0: "http://localhost:3000",
  server1: "https://af-api.aries.financial",
  defaultUserChoice: 2,
  user1: "0xAc52301711C49394b17cA585df714307f0C588C0",
  user2: "0x2D4aF9b1d5037F39F6480f4AfE7A91771738f195",
  gasPriceDefault: 10, //GWei
  gasLimitDefault: 400000,
  period1: 1800,
  period2: 3600,
  recordsPerPage: 10,
  contractPair: 97,
  TokenERC20_BSC_1: "0x82D6F82a82d08e08b7619E6C8F139391C23DC539",
  priceBetting_BSC_1: "0xD89C7e770e30921c42386c538580A96368092d08",
  RoundIdCtrt_BSC_1: "0x330d0a1F960d90311cf6c1BdBc7ecDE35a4144D4",
  ChainlinkPF_BTCUSD_BSC_1: "0x264990fbd0A4796A3E3d8E37C4d5F87a3aCa5Ebf",
  ChainlinkPF_ETHUSD_BSC_1: "0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e",

  TokenERC20_BSC_0: "0x9121e7445B4cCD88EF4B509Df17dB029128EbbA0",
  priceBetting_BSC_0: "0x5d8B7F644Ed661c4F785A3579a487EeE3EC10adB",
  RoundIdCtrt_BSC_0: "0x62DebdCD848839E2ab2248511D7AE6cd5c035126",
  ChainlinkPF_BTCUSD_BSC_0: "0x5741306c21795FdCBb9b265Ea0255F499DFe515C",
  ChainlinkPF_ETHUSD_BSC_0: "0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7",

  TokenERC20_xDAI_0: "0x4B6bC66E2f4fe91E5938a0f18fdd00Be27Eda3F3",
  priceBettingT1S2_xDAI_1: "",
  RoundIdCtrt_xDAI_1: "",
  TokenERC20_xDAI_1: "0xc81c785653D97766b995D867CF91F56367742eAC",
  priceBettingT1S2_xDAI_0: "0x52E25845eE3A1A19AB474ca4c56e0EB1E0330467",
  RoundIdCtrt_xDAI_0: "",
};
/*
BSC Main
  "gasPriceDefault": 10,//GWei
  "gasLimitDefault": 4000000,

BSC Testnet
  "gasPriceDefault": 20,//GWei
  "gasLimitDefault": 2000000,

xDAI
  "gasPriceDefault": 1,//GWei
  "gasLimitDefault": 1000000,

 */
const assetNames = [
  {
    key: "001",
    text: "Bitcoin",
    value: "bitcoin",
  },
  {
    key: "002",
    text: "Ethereum",
    value: "ethereum",
  },
];

const outcomes = [
  {
    key: "0",
    text: "Down",
    value: "0",
  },
  {
    key: "1",
    text: "Up",
    value: "1",
  },
];
export { config, assetNames, outcomes };
