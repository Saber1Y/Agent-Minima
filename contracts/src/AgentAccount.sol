// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

struct Proof {
    bytes proofData;
    bytes32[] publicInputs;
}

interface IVerifier {
    function verify(bytes calldata _proof, bytes32[] calldata _publicInputs) external view returns (bool);
}

interface IEntryPoint {
    function getNonce(address sender, uint192 key) external view returns (uint256);
    function depositTo(address account) external payable;
}

contract AgentAccount {
    address public owner;
    address public entryPoint;
    IVerifier public verifier;

    mapping(address => bool) public sessionKeys;
    mapping(address => address[]) public sessionKeyTargets;
    uint256 public nonce;

    event OwnerUpdated(address indexed oldOwner, address indexed newOwner);
    event SessionKeyAdded(address indexed key);
    event SessionKeyRemoved(address indexed key);
    event ActionExecuted(
        address indexed target,
        bytes data,
        bytes32 proofHash,
        address indexed sessionKey
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    modifier onlySessionKey() {
        require(sessionKeys[msg.sender], "not session key");
        _;
    }

    constructor(address _entryPoint, address _verifier) {
        owner = msg.sender;
        entryPoint = _entryPoint;
        verifier = IVerifier(_verifier);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "zero address");
        emit OwnerUpdated(owner, newOwner);
        owner = newOwner;
    }

    function addSessionKey(address key, address[] calldata targets) external onlyOwner {
        require(key != address(0), "zero address");
        sessionKeys[key] = true;
        sessionKeyTargets[key] = targets;
        emit SessionKeyAdded(key);
    }

    function removeSessionKey(address key) external onlyOwner {
        sessionKeys[key] = false;
        delete sessionKeyTargets[key];
        emit SessionKeyRemoved(key);
    }

    function executeWithProof(
        Proof calldata _proof,
        address target,
        bytes calldata data
    ) external onlySessionKey returns (bytes memory) {
        require(verifier.verify(_proof.proofData, _proof.publicInputs), "proof verification failed");
        require(_validateTarget(target), "target not allowed");

        nonce++;
        (bool success, bytes memory result) = target.call(data);
        require(success, "call failed");

        emit ActionExecuted(target, data, keccak256(_proof.proofData), msg.sender);
        return result;
    }

    function _validateTarget(address target) internal view returns (bool) {
        address[] memory targets = sessionKeyTargets[msg.sender];
        if (targets.length == 0) return true;
        for (uint256 i = 0; i < targets.length; i++) {
            if (targets[i] == target) return true;
        }
        return false;
    }

    function validateUserOp(
        bytes32,
        bytes32,
        uint256 missingAccountFunds
    ) external returns (uint256 validationData) {
        require(msg.sender == entryPoint, "only entrypoint");
        if (missingAccountFunds > 0) {
            payable(msg.sender).transfer(missingAccountFunds);
        }
        return 0;
    }

    receive() external payable {}

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getSessionKeyTargets(address key) external view returns (address[] memory) {
        return sessionKeyTargets[key];
    }
}
