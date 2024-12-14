//----------------------------------------------------------------------------------------------------------------------
//MetaMask_Init.js
//----------------------------------------------------------------------------------------------------------------------
// v1.1 (07.11.2024)
/*:
 * @plugindesc This plugin allows to connect your RPG to a MetaMask wallet.
 * It also allows to send gold to the player in exchange for tokens.
 * @author FrankCoin
 * @target MV
 * 
 * @help This plugin allows to connect your browser-deployed RPG to a MetaMask wallet.
 * 
 * In an event use the following script call to initiate the MetaMask connection:
 * this.pluginCommand_iniweb3();
 * 
 * In Plugin Parameters you can change the variable which is storing the 
 * connected MetaMask wallet address. By default its variable 1.
 * 
 * You can also change the network/blockchain the player needs to connect to. By
 * default the Neo X blockchain is selected.
 * 
 * ----- 2nd plugin part (sending ERC20-tokens and player receiving gold) -----
 *
 * In an event, use the following script call to send the tokens:
 * this.pluginCommand_sendtokens();
 * 
 * In Plugin Parameters you can change:
 * The Token Contract Address (You can decide which token the player should send)
 * It must be a token with 18 decimals. USDT for example is using 6 decimals and
 * would not work. Also it must be a ERC20-token!
 * By default its the contract of WGAS10 for the Neo X blockchain.
 * 
 * The Recipient Wallet Address (Your wallet which should receive the tokens)
 * By default its my wallet address :).
 * 
 * The Gold Amount the player will receive for their tokens after a transaction.
 * By default its 1000 gold.
 * 
 * The Token Amount the player needs to send to receive the gold amount.
 * By default its 0.1 token.
 * 
 * [Terms of Use] 
 * MIT License: Free for commercial and non-commercial use
 * No need to give credit
 * Feel free to modify or distribute this plugin
 *
 * @param MetaMask Wallet Address
 * @desc The variable where the MetaMask wallet address will be stored.
 * @default 1
 * @type variable
 * 
 * @param Is ERC-20 Token
 * @desc Set to true if sending a ERC-20 token. Set to false for native chain token (e.g. ETH, Neo X GAS).
 * @type boolean
 * @default false
 *
 * @param Token Contract Address
 * @desc The contract address of the token the player should send.
 * Must be a token using 18 decimals.
 * @type string
 * @default 0xdE41591ED1f8ED1484aC2CD8ca0876428de60EfF
 * 
 * @param Recipient Wallet Address
 * @desc The address to send the players tokens to.
 * "Your wallet address" if you want to earn with your game.
 * @type string
 * @default 0x4c1f0D4b26019eC365a50f98D21efE682f70ab36
 * 
 * @param Gold Amount
 * @desc The gold amount a player will receive for their tokens 
 * after a successful transaction.
 * @type number
 * @default 1000
 * 
 * @param Token Amount
 * @desc The token amount a player needs to send to receive the gold amount.
 * @type text
 * @default 0.1
 * 
 * @param Chain ID
 * @desc Chain ID of the blockchain network in decimal (e.g. 47763 for Neo X).
 * @type number
 * @default 47763
 *
 * @param Chain Name
 * @desc Name of the blockchain network (e.g. "NeoX Mainnet").
 * @type text
 * @default NeoX Mainnet
 *
 * @param Currency Name
 * @desc Name of the native currency (e.g. "GAS").
 * @type text
 * @default GAS
 *
 * @param Currency Symbol
 * @desc Symbol of the native currency (e.g. "GAS").
 * @type text
 * @default GAS
 *
 * @param Currency Decimals
 * @desc Decimals for the currency (typically 18 for Ethereum-based networks).
 * @type number
 * @default 18
 *
 * @param RPC URL
 * @desc RPC URL endpoint for the network.
 * @type text
 * @default https://mainnet-1.rpc.banelabs.org
 *
 * @param Block Explorer URL
 * @desc Block explorer URL for the network.
 * @type text
 * @default https://xexplorer.neo.org
 *  
 */

(() => {
  async function initializeWeb3() {
      const parameters = PluginManager.parameters("MetaMask_Init");
      const WalletAddressVariable = Number(parameters["MetaMask Wallet Address"] || 1);
      const chainIdDecimal = Number(parameters["Chain ID"] || 47763);
      const chainName = parameters["Chain Name"] || "NeoX Mainnet";
      const currencyName = parameters["Currency Name"] || "GAS";
      const currencySymbol = parameters["Currency Symbol"] || "GAS";
      const currencyDecimals = Number(parameters["Currency Decimals"] || 18);
      const rpcUrl = parameters["RPC URL"] || "https://mainnet-1.rpc.banelabs.org";
      const blockExplorerUrl = parameters["Block Explorer URL"] || "https://xexplorer.neo.org";

      const chainIdHex = "0x" + chainIdDecimal.toString(16); // Convert Chain ID to Hexadecimal for MetaMask

      const networkConfig = {
          chainId: chainIdHex,
          chainName: chainName,
          nativeCurrency: {
              name: currencyName,
              symbol: currencySymbol,
              decimals: currencyDecimals,
          },
          rpcUrls: [rpcUrl],
          blockExplorerUrls: [blockExplorerUrl],
      };

      // Check if MetaMask is installed
      if (typeof window.ethereum !== "undefined") {
          window.web3 = new Web3(window.ethereum);

          try {
              const currentNetwork = await ethereum.request({ method: 'net_version' });
              if (currentNetwork !== chainIdDecimal.toString()) {
                  await ethereum.request({
                      method: 'wallet_addEthereumChain',
                      params: [networkConfig],
                  });
              }
              const accounts = await ethereum.request({ method: "eth_requestAccounts" });
              console.log("Connected account:", accounts[0]);
              $gameVariables.setValue(WalletAddressVariable, accounts[0]);
              const metamasktrue = "Connected with\n" + $gameVariables.value(WalletAddressVariable);
              $gameMessage.add(metamasktrue);

          } catch (error) {
              console.error("MetaMask network switch or connection failed:", error);
              $gameMessage.add("Failed to switch network or connect to MetaMask.");
          }
      } else {
          console.warn("MetaMask is not installed. Please install MetaMask to use Web3 features.");
          $gameMessage.add("MetaMask is not installed.\nPlease install MetaMask to use Web3 features.");
      }
  }

  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/web3@4.13.0/dist/web3.min.js";
  script.onload = () => {
      console.log("Web3.js loaded successfully");
  };
  document.head.appendChild(script);

  Game_Interpreter.prototype.pluginCommand_iniweb3 = function() {
      initializeWeb3();
  };
})();

/*
 * @param Is ERC-20 Token
 * @desc Set to true if sending a ERC-20 token. Set to false for native chain token (e.g. ETH, Neo X GAS).
 * @type boolean
 * @default false
 */

// Second plugin part
const contractABI = [
    {
        "constant": false,
        "inputs": [
            { "name": "_to", "type": "address" },
            { "name": "_value", "type": "uint256" }
        ],
        "name": "transfer",
        "outputs": [{ "name": "", "type": "bool" }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
(() => {
    var parameters = PluginManager.parameters("MetaMask_Init");
    var isERC20Token = parameters["Is ERC-20 Token"] && parameters["Is ERC-20 Token"].toLowerCase() !== "false";
    var recipient = parameters["Recipient Wallet Address"] || "0x4c1f0D4b26019eC365a50f98D21efE682f70ab36";
    var goldAmount = Number(parameters["Gold Amount"] || 1000);
    var tokenAmount = parseFloat(parameters["Token Amount"] || 0.1);
    var tokenAddress = parameters["Token Contract Address"] || "0xdE41591ED1f8ED1484aC2CD8ca0876428de60EfF";
    var chainIdDecimal = Number(parameters["Chain ID"] || 47763);

    async function send() {
        try {
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            const sender = accounts[0];
            let weiAmount = web3.utils.toWei(tokenAmount.toString(), "ether"); // Convert tokenAmount to Wei (needed for ERC-20 and native tokens)

            // sending ERC-20 token
            if (isERC20Token) {
                const tokenContract = new web3.eth.Contract(contractABI, tokenAddress);
                const gasPrice = await web3.eth.getGasPrice();
                const gasEstimate = await tokenContract.methods.transfer(recipient, weiAmount).estimateGas({ from: sender });

                tokenContract.methods.transfer(recipient, weiAmount)
                .send({
                    from: sender,
                    gas: gasEstimate,
                    gasPrice: gasPrice
                })
                .on("transactionHash", function(hash) {
                    console.log("Transaction hash:", hash);
                    $gameMessage.add("Transaction sent! Tx hash:\n" + hash);
                })
                .on("receipt", function(receipt) {
                    console.log("Transaction receipt:", receipt);
                    $gameParty.gainGold(goldAmount);
                    $gameMessage.add("Successful! You have received " + goldAmount + " Gold!\n" + "Please save your game now!");
                });

            } else {
                // else native token (ETH or Neo X GAS)
                if (chainIdDecimal === 47763) {
                    // Neo X GAS needs special handling
                    const gasPrice = await web3.eth.getGasPrice();

                    web3.eth.sendTransaction({
                        from: sender,
                        to: recipient,
                        value: weiAmount,
                        gasPrice: gasPrice
                    })
                    .on("transactionHash", function(hash) {
                        console.log("Transaction hash:", hash);
                        $gameMessage.add("Transaction sent! Tx hash:\n" + hash);
                    })
                    .on("receipt", function(receipt) {
                        console.log("Transaction receipt:", receipt);
                        $gameParty.gainGold(goldAmount);
                        $gameMessage.add("Successful! You have received " + goldAmount + " Gold!\n" + "Please save your game now!");
                    })
                    .on("error", function(error) {
                        console.error("Transaction failed:", error);
                        if (error?.data?.message && error.data.message.includes("execution reverted")) {
                            $gameMessage.add("The transfer amount exceeds your balance.");
                        } else if (error?.message && error.message.includes("underpriced")) {
                            $gameMessage.add("Transaction failed: Gas price too low.");
                        } else {
                            $gameMessage.add("Transaction failed!");
                        }
                    });

                } else {
                    // General handling for other native tokens (ETH)
                    web3.eth.sendTransaction({
                        from: sender,
                        to: recipient,
                        value: weiAmount
                    })
                    .on("transactionHash", function(hash) {
                        console.log("Transaction hash:", hash);
                        $gameMessage.add("Transaction sent! Tx hash:\n" + hash);
                    })
                    .on("receipt", function(receipt) {
                        console.log("Transaction receipt:", receipt);
                        $gameParty.gainGold(goldAmount);
                        $gameMessage.add("Successful! You have received " + goldAmount + " Gold!\n" + "Please save your game now!");
                    })
                    .on("error", function(error) {
                        console.error("Transaction failed:", error);
                        $gameMessage.add("Transaction failed!");
                    });
                }
            }
        } catch (error) {
            console.error("Unexpected error during MetaMask interaction:", error);
            $gameMessage.add("Unexpected error!\n" + "Maybe transfer amount exceeds your balance.");
        }
    }
    Game_Interpreter.prototype.pluginCommand_sendtokens = function() {
        send();
    };
})();