// whenever we try to deploy the project we need update two things which are : 1. The ABI address  2. contract & sender address (here only contract address) 


// Your Ganache local blockchain setup
const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");

// ABI and contract address from Remix
const contractABI = [{
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "landId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "location",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "area",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "LandRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "landId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "oldOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "lands",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "location",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "area",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "registered",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_location",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_area",
        "type": "uint256"
      }
    ],
    "name": "registerLand",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "getLand",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "isLandRegistered",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }];
const contractAddress = "0x4EFB030dE0E9C8232646D9eaAeE62b5B465A7100"; // Replace with your contract address from Ganache

// Create contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Get current accounts from MetaMask
async function getAccounts() {
    const accounts = await web3.eth.getAccounts();
    return accounts;
}

// Register a land
async function registerLand() {
    const accounts = await getAccounts();
    const landId = document.getElementById('landId').value;
    const location = document.getElementById('location').value;
    const area = document.getElementById('area').value;

    if (!landId || !location || !area) {
        alert('Please fill all fields!');
        return;
    }

    try {
        console.log("Registering land with the following details: ", landId, location, area);
                // Add a higher gas limit, e.g., 3000000 (3 million)
                await contract.methods.registerLand(landId, location, area).send({ 
                    from: accounts[0],
                    gas: 3000000  // Set a higher gas limit
                 });
        alert('Land registered successfully!');
    } catch (error) {
        console.error("Error in registering land: ", error);
        if (error.message.includes("user rejected transaction")) {
            alert("You rejected the transaction. Please approve it in MetaMask.");
        } else {
            alert('Error registering land: ' + error.message);
        }
    }
}


// Transfer ownership
async function transferOwnership() {
    const accounts = await getAccounts();
    const landId = document.getElementById('landId').value;
    const newOwner = document.getElementById('newOwner').value;

    if (!landId || !newOwner) {
        alert('Please fill all fields!');
        return;
    }

    // Validate if the new owner's address is a valid Ethereum address
    if (!web3.utils.isAddress(newOwner)) {
        alert('Invalid Ethereum address for new owner.');
        return;
    }

    try {
        console.log("Transferring ownership of land ID: ", landId, " to new owner: ", newOwner);
        await contract.methods.transferOwnership(landId, newOwner).send({ from: accounts[0] });
        alert('Ownership transferred successfully!');
    } catch (error) {
        console.error("Error in transferring ownership: ", error);
        alert('Error transferring ownership: ' + error.message);
    }
}


// Get land details
async function getLandDetails() {
    const landId = document.getElementById('searchId').value;

    if (!landId) {
        alert('Please enter a land ID!');
        return;
    }

    try {
        const land = await contract.methods.getLand(landId).call();
        document.getElementById('landDetails').style.display = 'block';
        document.getElementById('details').innerHTML = `
            <strong>Land ID:</strong> ${land[0]} <br>
            <strong>Location:</strong> ${land[1]} <br>
            <strong>Area:</strong> ${land[2]} sqm <br>
            <strong>Owner:</strong> ${land[3]} <br>
            <strong>Registered:</strong> ${land[4] ? 'Yes' : 'No'}
        `;
    } catch (error) {
        console.error(error);
        alert('Error fetching land details!');
    }
}
