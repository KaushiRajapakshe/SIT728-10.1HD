const Products = artifacts.require("Products");

contract("Products", (accounts) => {
  let productsInstance;
  const owner = accounts[0]; // Use the first account as the owner
  const buyer = accounts[1];

  before(async () => {
    // Deploy a new instance of the Products contract before each test
    productsInstance = await Products.new({ from: owner });
  });

  it("should initialize with zero products", async () => {
    const productCount = await productsInstance.productCount();
    assert.equal(productCount.toNumber(), 0, "Product count should be zero initially.");
  });

  it("should add a new product correctly", async () => {
    await productsInstance.addProduct("Leeks", "/images/Leeks.jpeg", 10, 5, { from: owner }); // Ensure the owner is adding the product
    const productCount = await productsInstance.productCount();
    const product = await productsInstance.products(productCount);

    assert.equal(product.id.toNumber(), 1, "Product ID should be 1.");
    assert.equal(product.name, "Leeks", "Product name should be 'Leeks'.");
    assert.equal(product.price.toNumber(), 10, "Product price should be 10.");
    assert.equal(product.count.toNumber(), 5, "Product count should be 5.");
    assert.equal(product.owner, owner, "Owner should be the account that added the product.");
  });
  

  it("should delete all products successfully using owner account", async () => {
    // Use owner account to delete all products
    await productsInstance.addProduct("Apple", "/images/Apple.jpeg", 100, 20, { from: owner });
    await productsInstance.addProduct("Orange", "/images/Orrange.jpeg", 50, 15, { from: owner });

    const countBefore = await productsInstance.productCount();
    assert.equal(countBefore.toNumber(), 3, "Product count should be 3 before deletion.");

    await productsInstance.deleteAllProducts({ from: owner });

    const countAfter = await productsInstance.productCount();
    assert.equal(countAfter.toNumber(), 0, "Product count should be zero after all products are deleted.");
  });
});
