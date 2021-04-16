/*config ...
@type: Configuration
@brief ... 

//-------------== To Deploy
For Production:  serverNumber to 1

Else: Set serverNumber = 0

Then push
//-------------==
manual push: copy ethereum192x192.png into repo

erc20TokenAddress: '',

@author Raymond Lieu
@date   2020-12-23
*/
export const config = {
  infuraProvider:
    "https://eth-mainnet.alchemyapi.io/v2/k2--UTxxx",
  ethNodeNumber: 1,
  ethNodeURL0: "",
  ethNodeURL1: "https://mainnet.infura.io/v3/75df2",
  ethNodeURL42: "https://kovan.infura.io/v3/75d",
  gasDataSource:
    "https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=xyz",
  password: "abc123",
  DBID: 0,
  serverNumer: 1,
  isProduction: 1,
  server0: "http://localhost:3000",
  server1: "https://google.com",
  "defaultUserChoice": 2,
  "user1": "",
  "user2": "0xF694dCbec7f434dE9F892cfACF0449DB8661334D",
  "recordsPerPage": 3,
  "contractPair": 77,
  "NFT721Creature_xDAI_0": "0xEf169fbA14000463C9A9747C6Ab39750CaeBA440",
  "NFT721Sales_xDAI_0": "0xc2153D539cE9778e7011BdC5bA7E56aE8F87d22e",
  "ERC20_FR_xDAI_0": "",
  "NFT721Creature_xDAI_1": "",
  "NFT721Sales_xDAI_1": "",
  "ERC20_FR_xDAI_1": "0x270DE58F54649608D316fAa795a9941b355A2Bd0",
};
export const items = [
  {
    title: '# 01',
    imageUrlFake: '',
    imageUrl: 'https://media.giphy.com/media/7A4bR3e8qCO9nky7BJ/giphy.gif',
    size: 'small',
    id: 1,
    linkUrl: 'shop/mens'
  },
  {
    title: '# 02',
    imageUrl: 'https://media.giphy.com/media/c9Ft6wfXpxcNLEYrVu/giphy.gif',
    size: 'small',
    id: 2,
    linkUrl: 'shop/mens'
  },
  {
    title: '# 03',
    imageUrl: 'https://media.giphy.com/media/S2XgpFnBxplP3DbFXl/giphy.gif',
    size: 'small',
    id: 3,
    linkUrl: 'shop/mens'
  },
  {
    title: '# 04',
    imageUrl: 'https://media.giphy.com/media/VLqcUe4JIWgbGKatlC/giphy.gif',
    size: 'small',
    id: 4,
    linkUrl: 'shop/mens'
  },
  {
    title: '# 05',
    imageUrl: 'https://media.giphy.com/media/zpCLHEaj2YQpbjfOsB/giphy.gif',
    size: 'small',
    id: 5,
    linkUrl: 'shop/mens'
  },
  {
    title: '# 06',
    imageUrl: 'https://media.giphy.com/media/nEnUUOHZcE7YJklUpF/giphy.gif',
    size: 'small',
    id: 6,
    linkUrl: 'shop/mens'
  },
  {
    title: '# 07',
    imageUrl: 'https://media.giphy.com/media/AoAjXhr4vVFhsuKlHE/giphy.gif',
    size: 'small',
    id: 7,
    linkUrl: 'shop/mens'
  },
  {
    title: '# 08',
    imageUrl: 'https://media.giphy.com/media/n8E8ZHYmOiMTgAdQB4/giphy.gif',
    size: 'small',
    id: 8,
    linkUrl: 'shop/mens'
  },
  {
    title: '# 09',
    imageUrl: 'https://media.giphy.com/media/6uWIC9F67lnyn8nZzS/giphy.gif',
    size: 'small',
    id: 9,
    linkUrl: 'shop/mens'
  },
  {
    title: '# 10',
    imageUrl: 'https://media.giphy.com/media/gj3vM2nGsarfPoDDTj/giphy.gif',
    size: 'small',
    id: 10,
    linkUrl: 'shop/mens'
  }
];

export const dbSelections = [
  {
    key: "0",
    text: "Dev1 DB",
    value: "0",
  },
  {
    key: "1",
    text: "Prod1 DB",
    value: "1",
  },
];

