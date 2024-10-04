App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.renderProducts()
    // await App.deleteAllProducts()
    // await App.render()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account
    console.log('use this account', web3.eth.accounts)
    App.account = web3.eth.accounts[0]

    document.getElementById("account").innerText = `${App.account}`;
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const products = await $.getJSON('Products.json')
    App.contracts.Products = TruffleContract(products)
    App.contracts.Products.setProvider(App.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    App.products = await App.contracts.Products.deployed()
  },

  // Render the list of products
  renderProducts: async () => {
    // Clear the existing products in the #productsRow div
    document.getElementById("productsRow").innerHTML = "";
    try {
      // Get the total number of products
      const productCount = await App.products.productCount();
      const productCountNumber = productCount.toNumber(); 
      if (!App.products) {
        console.error("Failed to load contract instance.");
        return;
      }
    
      // Iterate through each product and render its details
      for (let i = 1; i <= productCountNumber; i++) {
        const product = await App.products.products(i); // Fetch product by ID

        // Map the product details from the struct
        const productId = product.id.toNumber();
        const productName = product.name;
        const productInfo = product.info;
        const productPrice = product.price.toNumber();
        const productCount = product.count.toNumber();
        const productOwner = product.owner;

        // Create HTML for each product (Bootstrap card style)
        const productCard = `
          <div class="col-md-4">
            <div class="card mb-4 shadow-sm">
              <div class="card-body">
                <h5 class="card-title">Product ID: ${productId}</h5>
                <h5 class="card-title">${productName}</h5>
                <p class="card-text"><strong>Info:</strong> ${productInfo}</p>
                <p class="card-text"><strong>Price:</strong> ${productPrice} ETH</p>
                <p class="card-text"><strong>Count:</strong> ${productCount}</p>
                <p class="card-text"><strong>Owner:</strong> ${productOwner}</p>
                <div class="d-flex justify-content-between">
                  <button class="btn btn-primary btn-buy" data-id="${productId}">Buy</button>
                  <button class="btn btn-danger btn-cancel" data-id="${productId}">Cancel</button>
                </div>
              </div>
            </div>
          </div>`;
      
        // Append the product card to the #productsRow div
        document.getElementById("productsRow").innerHTML += productCard;
      }
    } catch (error) {
      console.error("Error loading contract:", error);
    
    }

    App.bindProductButtons();
  },


  bindProductButtons: function() {
    // Attach click event to buy buttons
    $(document).on('click', '.btn btn-default btn-buy', App.buyProduct);
  },

  buyProduct: async (event) => {
    const productId = $(event.target).data('id');
    await App.products.buyProduct(productId, { from: App.account });
    window.location.href = "delivery.html";
  },

  bindEvents: function() {
    $(document).on('submit', '.productForm', App.addProduct);
  },

  bindEvents: function() {
    // Attach click event to buy buttons
    $(document).on('click', '.btn btn-default btn-buy', App.buyProduct);
  },

  addProduct: async () => {

    var name = $('#productName').val();
    var info = $('#productInfo').val();
    var price = parseInt($('#productPrice').val());
    var count = parseInt($('#productCount').val());
    console.log(name, info, price, count)
    await App.products.addProduct(name, info, price, count, { from: App.account });
    window.location.href = "status.html";
  },

  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  }
}

const clickMe = () => {
  alert("Thanks for clicking me. Hope you have a nice day!")
}

$(() => {
  $(window).load(() => {
    App.load()
  })
})