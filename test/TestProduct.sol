pragma solidity ^0.5.0;

import "truffle/Assert.sol"; 
import "truffle/DeployedAddresses.sol"; 
import "../contracts/Products.sol"; 

contract TestProducts {
    Products products;

    // Initial setup for each test, deploy a new Products contract
    function beforeEach() public {
        products = new Products();
        products.addProduct("Leeks", "/images/Leeks.jpeg", 10, 5);
    }

    // Test to check the initial product count
    function testInitialProductCount() public {
        uint expected = 1; // Should have 1 product after initialization in beforeEach
        Assert.equal(products.productCount(), expected, "Product count should be one initially.");
    }

    // Test adding a new product by owner
    function testAddProduct() public {
        // The following line should be executed with the owner account
        // Make sure to specify the correct account in JS tests.
        products.addProduct("Carrot", "/images/Carrot.jpeg", 5, 10);
        uint expected = 2; // Product count should be 2 after adding a product
        Assert.equal(products.productCount(), expected, "Product count should be 2 after adding a product.");
    }

    // Test deleting all products
    function testDeleteAllProducts() public {
        // Make sure to execute this test case with the owner account
        products.addProduct("Apple", "/images/Apple.jpeg", 100, 20);
        products.addProduct("Orange", "/images/Orange.jpeg", 50, 15);
        
        products.deleteAllProducts(); // Call deleteAllProducts as the owner
        
        uint expected = 0;
        Assert.equal(products.productCount(), expected, "Product count should be zero after deleting all products.");
    }
}
