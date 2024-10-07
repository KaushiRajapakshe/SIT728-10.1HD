pragma solidity ^0.5.0;

// Ownable contract to manage ownership and restrict access
contract Ownable {
    address public owner;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    // Constructor to set the initial owner to the contract deployer
    constructor() public {
        owner = msg.sender;
    }

    // Modifier to restrict access to only the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Ownable: caller is not the owner");
        _;
    }

    // Function to transfer ownership to a new address
    function transferOwnership(address newOwner) public onlyOwner {
        require(
            newOwner != address(0),
            "Ownable: new owner is the zero address"
        );
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

// Products contract that uses Ownable for ownership management
contract Products is Ownable {
    struct Product {
        uint256 id;
        string name;
        string info;
        uint256 price;
        uint256 count;
        address owner;
    }

    mapping(uint256 => Product) public products;

    uint256 public productCount = 0;

    event ProductAdded(
        uint256 id,
        string name,
        string info,
        uint256 price,
        uint256 count,
        address owner
    );
    event AllProductsDeleted();

    // Modifier to check that the caller is the product owner
    modifier onlyProductOwner(uint _id) {
        require(
            products[_id].owner == msg.sender,
            "Caller is not the product owner"
        );
        _;
    }

    // Add a product
    function addProduct(
        string memory _name,
        string memory _info,
        uint256 _price,
        uint256 _count
    ) public onlyOwner {
        productCount++;
        products[productCount] = Product(
            productCount,
            _name,
            _info,
            _price,
            _count,
            msg.sender
        );
        emit ProductAdded(
            productCount,
            _name,
            _info,
            _price,
            _count,
            msg.sender
        );
    }

    function deleteAllProducts() public onlyOwner {
        for (uint256 i = 1; i <= productCount; i++) {
            delete products[i];
        }
        productCount = 0;
        emit AllProductsDeleted();
    }
}
