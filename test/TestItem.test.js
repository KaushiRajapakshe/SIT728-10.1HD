const Items = artifacts.require("Items");

contract("Items", (accounts) => {
  let itemsInstance;
  const owner = accounts[0]; // Use the first account as the owner
  const buyer = accounts[1];

  before(async () => {
    // Deploy a new instance of the Items contract before each test
    itemsInstance = await Items.new({ from: owner });
  });

  it("should initialize with zero items", async () => {
    const itemCount = await itemsInstance.itemCount();
    assert.equal(itemCount.toNumber(), 0, "Item count should be zero initially.");
  });
  
  // Commenting out this test case due to revert issue in testBuyProduct
  it("should buy a item successfully", async () => {
    // Attempt to buy the item with ID 1 using the buyer account and sufficient funds
    await itemsInstance.buyItem(1, "Leeks", "/images/Leeks.jpeg", 7);
    const item = await itemsInstance.items(1);
    assert.equal(item.count.toNumber(), 1, "Product count should be reduced by 1 after purchase.");
  });
  
});
