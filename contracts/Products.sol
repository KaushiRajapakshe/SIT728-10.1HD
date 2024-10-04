pragma solidity ^0.5.0;

contract Products {
  struct Product {
    uint id;
    string name;
    string info;
    uint price;
    uint count;
    address owner;
  }

    mapping(uint => Product) public products;

    uint public productCount = 0;

    event ProductAdded(uint id, string name, string info, uint price, uint count, address owner);
    event AllProductsDeleted();

    // Add a product
    function addProduct(string memory _name, string memory _info, uint _price, uint _count) public {
        productCount++;
        products[productCount] = Product(productCount, _name, _info, _price, _count, msg.sender);
        emit ProductAdded(productCount, _name, _info, _price, _count, msg.sender);
    }

    // Retrieve all product
    // function getProducts() public {
    //     Product[] memory allProducts = new Product[](productCount);
    //     for (uint i = 1; i <= productCount; i++) {
    //         allProducts[i - 1] = products[i];
    //     }
    // }

    // Buy Product
    function buyProduct(uint _id) public {
      delete products[_id]; 
    }

    // Retrieve a product by ID
    // function getProduct(uint _id) public view returns (Product memory) {
    //     return products[_id];
    // }

    function deleteAllProducts() public {
        
        for (uint i = 1; i <= productCount; i++) {
            delete products[i];
        }
        productCount = 0; 
        emit AllProductsDeleted(); 
    }

}