pragma solidity ^0.5.0;

import "truffle/Assert.sol"; 
import "truffle/DeployedAddresses.sol"; 
import "../contracts/Items.sol"; 

contract TestItems {
    Items items;

    // Initial setup for each test, deploy a new Items contract
    function beforeEach() public {
        items = new Items();
        items.buyItem(1, "Leeks", "/images/Leeks.jpeg", 5);
    }

    // Test to check the initial items count
    function testInitialItemCount() public {
        uint expected = 1; // Should have 1 items after initialization in beforeEach
        Assert.equal(items.itemCount(), expected, "Item count should be one initially.");
    }

    // Test buying a new items by buyer
    function testBuyItem() public {
        // The following line should be executed with the owner account
        // Make sure to specify the correct account in JS tests.
        items.buyItem(2, "Carrots", "/images/Carrots.jpeg", 10);
        uint expected = 2; // Items count should be 2 after adding a items
        Assert.equal(items.itemCount(), expected, "Items count should be 2 after adding a items.");
    }
}
