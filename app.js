//get rinkeby provider
let provider = ethers.getDefaultProvider('rinkeby');
console.log(provider);

//get latest block number
const getBlock = () => {
  provider.getBlockNumber().then((blockNumber) => {
    return provider.getBlock(blockNumber).then((block) => {
      console.log('latest block =', block);
    });
  });
}
getBlock();

/*
const getBlock = async () => {
  let block = await provider.getBlockNumber();
  console.log(`latest block =${block}`);
}
getBlock();
*/

//get the current blockNumber 
const blockNumber = () => {
  provider.getBlockNumber().then((blockNumber) => {
    console.log(`block number =${blockNumber}`);
  });
  return blockNumber;
}
blockNumber();

/*
const BlockNumber = async () => {
  let blockNumber = await provider.getBlockNumber();
  console.log(`block number =${blockNumber}`);
  return blockNumber;
}
BlockNumber();
*/

// get the gas price and convert it to decimal
const gasPrice = () => {
  provider.getGasPrice().then((gasPrice) => {
    let price = parseInt(gasPrice._hex, 16);
    console.log(`current gas price =${price}`);
  });
}
gasPrice();

//get Response then Receipt of this transaction Hash 
let hash = '0x425b74ff4090bad9dacd972f96646f1f' +
           '136b7dee39be06910463c245761ad493';

const transactionResponse = (txHash) => {
  provider.getTransaction(txHash).then((txResponse) => {
    console.log('transaction response = ', txResponse);
  });
}
transactionResponse(hash);

/*
const transactionResponse = async () => {
  let txResponse = await provider.getTransaction(hash);
  console.log('my transaction response =', txResponse);
}
transactionResponse();
*/

const transactionReceipt = (txHash) => {
  provider.getTransactionReceipt(txHash).then((txReceipt) => {
    console.log('my transaction receipt =', txReceipt);
  });
}
transactionReceipt(hash);

// of this address in ethers
let address = '0x42EB768f2244C8811C63729A21A3569731535f06';

const getBalance = (ethAddress) => {
  provider.getBalance(ethAddress).then((balance) => {
    let etherString = parseInt(ethers.utils.formatEther(balance));
    console.log('account balance =', etherString);
  });
}
getBalance(address);

//get Nonce of same address
/* 
const getNonce = (ethAddress) => {
  provider.getTransactionCount(ethAddress).then((nonce) => {
    console.log('nonce: ', nonce);
  });
}
*/

const getNonce = async () => {
  const nonce = await provider.getTransactionCount(address);
  console.log('nonce: ', nonce);
}
getNonce();

//create an account and use the account in the next functions
const createAccount = async () => {
  let wallet = await ethers.Wallet.createRandom();
  console.log('this is my wallet there are many like it but this one is mine: ', wallet);
  return wallet;
}
let myWallet = createAccount(); //returns a promise

//take the mnemonic of the account and generate a wallet object, from the object list the address and privatekey
const accountFromMnemonic = () => {
  myWallet.then((response) => {
    let wallet = ethers.Wallet.fromMnemonic(response.mnemonic);
    console.log(`this is the address of the mnemonic: ${wallet.address}`);
    console.log(`this is the private key of the mnemonic ${wallet.mnemonic}`);
  });
}
accountFromMnemonic();

function callback(progress) {
  let progressPercent = parseInt(progress * 100);
  if (progressPercent % 20 == 0) {
    console.log(`Encrypting: ${progressPercent} % complete`);
  }
}

let password = 'password123';
//encrypt the wallet with a password, bonus points if you have a progress
/*
const encrypt = (wallet) => {
  return wallet.then((response) => {
    response.encrypt(password, callback).then(json => {
      console.log(`json: ${json}`);
    });
  });
}
*/

const encrypt = async () => {
  let wallet = await myWallet;
  let data = await wallet.encrypt(password, callback);
  console.log(`data: ${data}`);
  return data;
}
let myEncryptedWallet = encrypt(); //returns a promise

//decrypt the encrypted wallet 
const decrypt = async () => {
  let data = await myEncryptedWallet;
  let wallet = await ethers.Wallet.fromEncryptedJson(data, password);
  console.log('decrypted wallet: ', wallet);
  return wallet;
}
decrypt(); //returns a promise

/// bonus signing and verifying messages, and send a transaction to a neighbor

// use this endpoint


//sign a message 
let hello_world = 'Hello, World!'; //I have no creativity :-(
const sign = async (walletPromise, message) => {
  let wallet = await walletPromise;
  let flatSig = await wallet.signMessage(message);
  console.log(`this is me signing my life away: ${flatSig}`);
  return flatSig;
}
let signature = sign(myWallet, hello_world); //returns a promise

//recover the signed message  ??
const recoverSignature = async (signedMessagePromise, walletPromise) => {
  let signed_message = await signedMessagePromise;
  let wallet = await walletPromise;
  console.log(`signing address: ${wallet.address} \nsigned_message : ${signed_message}`);
}
recoverSignature(signature, myWallet);