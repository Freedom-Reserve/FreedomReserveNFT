/*config ...
@type: Configuration
@brief ..//-------------== To Deploy
set contractPair = 4
$ yarn run deploy
Then push
//-------------==
manual push: copy ethereum192x192.png into repo

erc20TokenAddress: '',

@date   2021-05-23
*/
export const config = {
  infuraProvider:
    "https://eth-mainnet.alchemyapi.io/v2/k2--UTxxx",
  ethNodeURL0: "",
  ethNodeURL1: "https://mainnet.infura.io/v3/75df212e084f4778811330dd3c14907b",
  ethNodeURL4: "https://rinkeby.infura.io/v3/75df212e084f4778811330dd3c14907b",
  ethNodeURL42: "https://kovan.infura.io/v3/75df212e084f4778811330dd3c14907b",
  gasDataSource:
    "https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=GH7KVC23UWE9BTDKDVRDSTTE5X8I25U2X5",
  password: "abc123",
  DBID: 0,
  serverNumer: 1,
  isProduction: 1,
  gasPrice: 155,
  gasLimit: 200000,
  server0: "http://localhost:3000",
  server1: "https://google.com",
  defaultUserChoice: 2,
  user1: "",
  user2: "",
  recordsPerPage: 3,
  contractPair: 1,
  NFT721Creature_rinkeby: "0xa8e5142885Ec751fA9CE34a32E6a978DEaC22C8e",
  NFT721Sales_rinkeby: "0x8Ace2c3Cc2e4657312b0B19F51a402Ffc74f9c1a",
  ERC20_FR_rinkeby: "",
  NFT721Creature_ethMainnet: "0xa58257fF0849d04b2B3896C75590Bce6e1e61ae8",
  NFT721Sales_ethMainnet: "0xd34443606A62c7c09dC88e86C4D52165799bd362",
  ERC20_FR_mainnet: "",
  NFT721Creature_xDAI_0: "0xEf169fbA14000463C9A9747C6Ab39750CaeBA440",
  NFT721Sales_xDAI_0: "0xc2153D539cE9778e7011BdC5bA7E56aE8F87d22e",
  ERC20_FR_xDAI_0: "",
  NFT721Creature_xDAI_1: "",
  NFT721Sales_xDAI_1: "",
  ERC20_FR_xDAI_1: "0x270DE58F54649608D316fAa795a9941b355A2Bd0",
};
export const items = [
  {
    title: '# 01',
    imageUrlFake: '',
    imageUrl: 'https://ipfs.fleek.co/ipfs/bafybeiahy2ednf4l2eak4voxoskuqrqh4pnqewxx4f2n6x7jsw6w2ic3gi',
    size: 'small',
    id: 1,
    linkUrl: 'shop/mens'
  },
  {
    title: '# 02',
    imageUrl: 'https://ipfs.fleek.co/ipfs/bafybeihxphm3msrktv23s5yuhsct7bvmvic75sifa2oa3mbct3optnggwu',
    size: 'small',
    id: 2,
    linkUrl: 'shop/mens'
  },
  {
    title: '# 03',
    imageUrl: 'https://ipfs.fleek.co/ipfs/bafybeib5a36m6dzk7ivztqgmhhzlgtjx2eulvtbxm6all7xe3hmppkuoae',
    size: 'small',
    id: 3,
    linkUrl: 'shop/mens'
  },
  {
    title: '# 04',
    imageUrl: 'https://ipfs.fleek.co/ipfs/bafybeibebbfxvxkkxuaei7emgb4vmngykkbq7gnxy2muwb6e7653uvdlfi',
    size: 'small',
    id: 4,
    linkUrl: 'shop/mens'
  },
  {
    title: '# 05',
    imageUrl: 'https://ipfs.fleek.co/ipfs/bafybeiekfwtnovtiz7zu5haq7t6vhyzno3lqurwehsprcvi3gho6fema2e',
    size: 'small',
    id: 5,
    linkUrl: 'shop/mens'
  },
  {
    title: '# 06',
    imageUrl: 'https://ipfs.fleek.co/ipfs/bafybeih3fttxvo74eik62otd2wy6d6zty5wwig7ocb6waqvl6tfrwb2sze',
    size: 'small',
    id: 6,
    linkUrl: 'shop/mens'
  },
  {
    title: '# 07',
    imageUrl: 'https://ipfs.fleek.co/ipfs/bafybeic6l4dehe3usvf25wmd5muzux2mfpe4pjapgir4cmyk43tmin6dei',
    size: 'small',
    id: 7,
    linkUrl: 'shop/mens'
  },
  {
    title: '# 08',
    imageUrl: 'https://ipfs.fleek.co/ipfs/bafybeifw7vgtgjdcuzfuhhorwp536z34tfsxv3ygetfa42ocbxnxycoxcu',
    size: 'small',
    id: 8,
    linkUrl: 'shop/mens'
  },
  {
    title: '# 09',
    imageUrl: 'https://ipfs.fleek.co/ipfs/bafybeifuhh42leyt63cfsvrygygrojnlqwvo5676n5x43lhyvstffc5slq',
    size: 'small',
    id: 9,
    linkUrl: 'shop/mens'
  },
  {
    title: '# 10',
    imageUrl: 'https://ipfs.fleek.co/ipfs/bafybeih3fibnfg7qiblfa7bkovljjp3755fpkdfhlxfcbciduu7nndjfze',
    size: 'small',
    id: 10,
    linkUrl: 'shop/mens'
  }
];

export const assetSelections = [
  {
    key: "0",
    text: "Pay with Ether",
    value: "Ethereum",
  },
  {
    key: "1",
    text: "Pay with FR Token",
    value: "ERC20FR",
  },
];

