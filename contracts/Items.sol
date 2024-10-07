pragma solidity ^0.5.0;

contract Items {
    struct Item {
        uint256 itemId;
        uint256 id;
        string name;
        string info;
        uint256 price;
        uint256 count;
        uint256 status;
        address buyer;
    }

    mapping(uint256 => Item) public items;
    uint256 public itemCount = 0;
    event ItemPurchased(
        uint256 itemId,
        uint256 id,
        string name,
        string info,
        uint256 price,
        uint256 count,
        uint256 status,
        address buyer
    );
    event ChangeItemStatus(uint256 itemId, uint256 id, uint256 status);

    // Add a product
    function buyItem(
        uint256 _id,
        string memory _name,
        string memory _info,
        uint256 _price
    ) public {
        itemCount++;
        items[itemCount] = Item(
            itemCount,
            _id,
            _name,
            _info,
            _price,
            1,
            0,
            msg.sender
        );
        emit ItemPurchased(
            itemCount,
            _id,
            _name,
            _info,
            _price,
            1,
            0,
            msg.sender
        );
    }
}