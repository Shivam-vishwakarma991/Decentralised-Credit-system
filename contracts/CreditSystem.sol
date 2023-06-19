 // SPDX-License-Identifier: MIT

pragma solidity >=0.5.0 <0.9.0;

contract Credit{

    constructor(){
        Balance[msg.sender]= 1000;
        owner= msg.sender;
    }
    address public owner;
    mapping(address=> uint) private Balance;
    mapping(address => bool) public initialized;


    modifier OnlyOwner(){
        require(msg.sender== owner, "Only owner an call this function");
        _;
    }


    function initializeAccount() public {
    require(!initialized[msg.sender], "Account has already been initialized");
    Balance[msg.sender] = 1000;
    initialized[msg.sender] = true;
}

    function TransferCredit(address recepient, uint creditAmount) public {
        require(Balance[msg.sender] >= creditAmount, "Insufficient credits");
        Balance[msg.sender]-= creditAmount;
        Balance[recepient]+= creditAmount;

    }

    function GetcreditBalance(address creditor) view public returns(uint){
        return Balance[creditor];
    } 

    function mint(address receipient, uint creditamount) public OnlyOwner(){
    
     Balance[receipient]+= creditamount;
     Balance[msg.sender]-=creditamount;
    }





}
