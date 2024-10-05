pragma solidity ^0.5.0;

// Ownable contract to manage ownership
contract Ownable {
    address public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // Constructor to set the initial owner to the contract deployer
    constructor () public {
        owner = msg.sender;
    }

    // Modifier to restrict access to only the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Ownable: caller is not the owner");
        _;
    }

    // Function to transfer ownership to a new address
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

contract Products is Ownable {
    struct Product {
        uint id;
        string name;
        string info;
        uint price;
        uint count;
        address owner;
    }

    // Mapping of product ID to Product structure
    mapping(uint => Product) public products;

    uint public productCount = 0; // Counter to track the number of products

    // Events
    event ProductAdded(uint id, string name, string info, uint price, uint count, address owner);
    event ProductBought(uint id, address buyer, uint price);
    event AllProductsDeleted();

    // Modifier to check if a product exists
    modifier productExists(uint _id) {
        require(_id > 0 && _id <= productCount, "Product does not exist");
        _;
    }

    // Function to add a new product (only the owner can add)
    function addProduct(string memory _name, string memory _info, uint _price, uint _count) public onlyOwner {
        productCount++;
        products[productCount] = Product(productCount, _name, _info, _price, _count, msg.sender);
        emit ProductAdded(productCount, _name, _info, _price, _count, msg.sender);
    }

    // Function to buy a product (any user can buy)
    function buyProduct(uint _id) public payable productExists(_id) {
        Product memory product = products[_id];

        // Ensure the product has available count and buyer has sent enough ETH
        require(product.count > 0, "Product is out of stock");
        require(msg.value >= product.price, "Insufficient funds to buy this product");

        // Transfer ETH to the product owner
        address payable productOwner = address(uint160(product.owner));
        productOwner.transfer(msg.value);

        // Decrease product count by 1 and update the mapping
        products[_id].count--;

        // Emit an event indicating that the product has been bought
        emit ProductBought(_id, msg.sender, product.price);
    }

    // Function to delete all products (only the owner can delete)
    function deleteAllProducts() public onlyOwner {
        for (uint i = 1; i <= productCount; i++) {
            delete products[i];
        }
        productCount = 0;
        emit AllProductsDeleted();
    }

    // Function to retrieve a product by its ID (view only)
    function getProduct(uint _id) public view productExists(_id) returns (uint, string memory, string memory, uint, uint, address) {
        Product memory product = products[_id];
        return (product.id, product.name, product.info, product.price, product.count, product.owner);
    }

    // Function to retrieve the details of all products
    function getAllProducts() public view returns (uint[] memory, string[] memory, string[] memory, uint[] memory, uint[] memory, address[] memory) {
        uint[] memory ids = new uint[](productCount);
        string[] memory names = new string[](productCount);
        string[] memory infos = new string[](productCount);
        uint[] memory prices = new uint[](productCount);
        uint[] memory counts = new uint[](productCount);
        address[] memory owners = new address[](productCount);

        for (uint i = 1; i <= productCount; i++) {
            Product memory product = products[i];
            ids[i - 1] = product.id;
            names[i - 1] = product.name;
            infos[i - 1] = product.info;
            prices[i - 1] = product.price;
            counts[i - 1] = product.count;
            owners[i - 1] = product.owner;
        }

        return (ids, names, infos, prices, counts, owners);
    }
}
