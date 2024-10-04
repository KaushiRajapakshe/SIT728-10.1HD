const Products = artifacts.require("Products");

contract("Products", (accounts) => {
  let productsInstance;

  // Account addresses for testing
  const owner = accounts[0]; 
  const buyer = accounts[1]; 

  before(async () => {
    // Deploy a new instance of the Products contract before each test
    productsInstance = await Products.new();
  });

  it("should initialize with zero products", async () => {
    const productCount = await productsInstance.productCount();
    assert.equal(productCount.toNumber(), 0, "Product count should be zero initially.");
  });

  it("should add a new product correctly", async () => {
    // Add a new product
    await productsInstance.addProduct("Leeks", "./src/images/Leeks.jpegp", 10, 5, { from: owner });

    // Retrieve the product count
    const productCount = await productsInstance.productCount();
    const product = await productsInstance.products(productCount);

    // Validate product details
    assert.equal(product.id.toNumber(), 1, "Product ID should be 1.");
    assert.equal(product.name, "Leeks", "Product name should be 'Leeks'.");
    assert.equal(product.info, "./src/images/Leeks.jpegp", "Product info should match.");
    assert.equal(product.price.toNumber(), 10, "Product price should be 10.");
    assert.equal(product.count.toNumber(), 5, "Product count should be 5.");
    assert.equal(product.owner, owner, "Owner should be the account that added the product.");
  });

  it("should allow a user to buy a product and delete it", async () => {
    // Add another product
    await productsInstance.addProduct("Carrot", "./src/images/Carrot.jpegp", 5, 10, { from: owner });

    // Buy (delete) the product with ID 2
    await productsInstance.buyProduct(2, { from: buyer });

    // Try to fetch the deleted product and check if reset
    const deletedProduct = await productsInstance.products(2);
    assert.equal(deletedProduct.id.toNumber(), 0, "Product ID should be reset to 0 after deletion.");
    assert.equal(deletedProduct.name, "", "Product name should be reset after deletion.");
  });

  it("should delete all products successfully", async () => {
    // Add multiple products
    await productsInstance.addProduct("Apple", "./src/images/Fruits.webp", 8, 15, { from: owner });
    await productsInstance.addProduct("Carrot", "./src/images/Carrot.jpegp", 3, 20, { from: owner });

    // Check product count before deletion
    const countBefore = await productsInstance.productCount();
    assert.equal(countBefore.toNumber(), 3, "Product count should be 3 before deletion.");

    // Delete all products
    await productsInstance.deleteAllProducts({ from: owner });

    // Check product count after deletion
    const countAfter = await productsInstance.productCount();
    assert.equal(countAfter.toNumber(), 0, "Product count should be zero after all products are deleted.");

    // Verify that products are deleted
    for (let i = 1; i <= countBefore.toNumber(); i++) {
      const product = await productsInstance.products(i);
      assert.equal(product.id.toNumber(), 0, `Product ID ${i} should be reset.`);
      assert.equal(product.name, "", `Product name ${i} should be reset.`);
    }
  });
});
