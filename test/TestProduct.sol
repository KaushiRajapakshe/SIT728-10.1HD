pragma solidity ^0.5.0;

import "truffle/Assert.sol"; 
import "truffle/DeployedAddresses.sol"; 
import "../contracts/Products.sol"; 

contract TestProducts {
    // Get the deployed Products contract instance
    Products products = Products(DeployedAddresses.Products());

    // Test to check the initial product count
    function testInitialProductCount() public {
        uint expected = 0;
        Assert.equal(products.productCount(), expected, "Product count should be zero initially.");
    }

    // Test adding a new product
    function testAddProduct() public {
        products.addProduct("Leeks", "./src/images/Leeks.jpegp", 10, 5);

        uint expected = 1; // Product count should be 1 after adding a product
        Assert.equal(products.productCount(), expected, "Product count should be 1 after adding a product.");

        // Check the product details
        (uint id, string memory name, string memory info, uint price, uint count, address owner) = products.products(expected);
        Assert.equal(id, expected, "Product ID should be 1");
        Assert.equal(name, "Leeks", "Product name should be 'Leeks'");
        Assert.equal(info, "./src/images/Leeks.jpegp", "Product info should be './src/images/Leeks.jpegp'");
        Assert.equal(price, 10, "Product price should be 10");
        Assert.equal(count, 5, "Product count should be 5");
        Assert.equal(owner, address(this), "Owner should be the current contract.");
    }

    // Test deleting a product (buying)
    function testBuyProduct() public {
        products.buyProduct(1); // Delete the product with ID 1

        (uint id, string memory name, , , , ) = products.products(1);
        Assert.equal(id, 0, "Product ID should be reset to 0 after deletion.");
        Assert.equal(name, "", "Product name should be empty after deletion.");
    }

    // Test deleting all products
    function testDeleteAllProducts() public {
        products.addProduct("Tablet", "./src/images/Fruits.webp", 8, 15); // Add another product
        products.addProduct("Phone", "./src/images/Carrot.jpegp", 5, 10); // Add another product

        products.deleteAllProducts(); // Delete all products

        uint expected = 0;
        Assert.equal(products.productCount(), expected, "Product count should be zero after deleting all products.");
    }
}
