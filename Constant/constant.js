const contractAddress = "0x7b5fdCb7a5d983cfB70f2EF55aB8DFe7607A2C";

const contractAbi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "id",
				"type": "string"
			}
		],
		"name": "UserAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "id",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "idUser",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "idCandidate",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "idVoting",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "time",
				"type": "string"
			}
		],
		"name": "VoteAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "id",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "idUser",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "idCandidateNew",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "idCandidateOld",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "idVoting",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "time",
				"type": "string"
			}
		],
		"name": "VoteUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_userID",
				"type": "string"
			}
		],
		"name": "addUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_id",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_idUser",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_idCandidate",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_idVoting",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_time",
				"type": "string"
			}
		],
		"name": "addVote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllvotes",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "id",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "idUser",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "idCandidate",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "idVoting",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "time",
						"type": "string"
					}
				],
				"internalType": "struct VoteManager.Vote[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_idCandidate",
				"type": "string"
			}
		],
		"name": "getvotesByIdCandidate",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "id",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "idUser",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "idCandidate",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "idVoting",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "time",
						"type": "string"
					}
				],
				"internalType": "struct VoteManager.Vote[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_idUser",
				"type": "string"
			}
		],
		"name": "getvotesByIdUser",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "id",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "idUser",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "idCandidate",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "idVoting",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "time",
						"type": "string"
					}
				],
				"internalType": "struct VoteManager.Vote[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_idVoting",
				"type": "string"
			}
		],
		"name": "getvotesByIdVoting",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "id",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "idUser",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "idCandidate",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "idVoting",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "time",
						"type": "string"
					}
				],
				"internalType": "struct VoteManager.Vote[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_id",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_idUser",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_idCandidateNew",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_idCandidateOld",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_idVoting",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_time",
				"type": "string"
			}
		],
		"name": "updateVote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "voteUpdates",
		"outputs": [
			{
				"internalType": "string",
				"name": "id",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "idUser",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "idCandidateNew",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "idCandidateOld",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "idVoting",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "time",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "votes",
		"outputs": [
			{
				"internalType": "string",
				"name": "id",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "idUser",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "idCandidate",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "idVoting",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "time",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

export {contractAbi, contractAddress};