App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContractProduct()
    await App.loadContractItem()
    await App.renderProducts()
    await App.renderItems()
    await App.renderStatus()
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
      web3.eth.sendTransaction({/* ... */ })
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

  loadContractProduct: async () => {
    // Create a JavaScript version of the smart contract
    const products = await $.getJSON('Products.json')
    App.contracts.Products = TruffleContract(products)
    App.contracts.Products.setProvider(App.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    App.products = await App.contracts.Products.deployed()
    const networkId = await web3.eth.net.getId(); // Get current network ID
      const deployedNetwork = Products.networks[networkId]; // Get the deployed network info

      if (deployedNetwork) {
        const contractInstance = new web3.eth.Contract(
        Products.abi,
        deployedNetwork.address // Use the correct address from the JSON artifact
        );
        console.log("ppppppp", deployedNetwork.address, contractInstance)
      } else {
        console.error(`Contract not deployed on network with ID: ${networkId}`);
      }
  },

  loadContractItem: async () => {
    // Create a JavaScript version of the smart contract
    const items = await $.getJSON('Items.json')
    App.contracts.Items = TruffleContract(items)
    App.contracts.Items.setProvider(App.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    App.items = await App.contracts.Items.deployed()
  },

  // Render the list of products
  renderProducts: async () => {
    if (window.location.pathname.includes('index.html')) {
      try {
        // Get the total number of products
        const productCount = await App.products.productCount();
        const productCountNumber = productCount.toNumber();
        if (!App.products) {
          console.error("Failed to load contract instance.");
          return;
        }
        console.log("tests", productCountNumber)
        // Iterate through each product and render its details
        for (let i = 1; i <= productCountNumber; i++) {
          const product = await App.products.products(i); // Fetch product by ID
          // Map the product details from the struct
          const productId = product[0];
          const productName = product[1];
          const productInfo = product[2];
          const productPrice = product[3];
          const productCount = product[4];
          console.log("tests", productId)

          var productRow = $('#productsRow');
          var foodTemplate = $('#foodTemplate');
          foodTemplate.find('.food-id').text(productId);
          foodTemplate.find('.food-titile').text(productName);
          foodTemplate.find('img').attr('src', productInfo);
          foodTemplate.find('.food-price').text(productPrice);
          foodTemplate.find('.food-count').text(productCount);
          foodTemplate.find('.btn-buy').attr('data-id', productId);
          foodTemplate.find('.btn-view').attr('data-id', productId);
          productRow.append(foodTemplate.html());

        }
      } catch (error) {
        console.error("Error loading contract:", error);

      }

      App.bindProductButtons();
      App.bindViewButtons();
    }
  },

  // Render the list of items
  renderItems: async () => {
    if (window.location.pathname.includes('home.html')) {
      try {
        // Get the total number of items
        const itemCount = await App.items.itemCount();
        const itemCountNumber = itemCount.toNumber();
        if (!itemCountNumber) {
          console.error("Failed to load contract instance.");
          return;
        }
        for (let i = 1; i <= itemCountNumber; i++) {
          // Iterate through each item and render its details
          const item = await App.items.items(i); // Fetch item by ID
          // Map the product details from the struct
          const itemId = item[0];
          const productId = item[1];
          const productName = item[2];
          const productInfo = item[3];
          const productPrice = item[4];
          const productCount = item[5];

          var productRow = $('#productsRow');
          var foodTemplate = $('#foodTemplate');
          foodTemplate.find('.item-id').text(itemId);
          foodTemplate.find('.food-id').text(productId);
          foodTemplate.find('.food-titile').text(productName);
          foodTemplate.find('img').attr('src', productInfo);
          foodTemplate.find('.food-price').text(productPrice);
          foodTemplate.find('.food-count').text(productCount);
          foodTemplate.find('.btn-view').attr('data-id', itemId);
          productRow.append(foodTemplate.html());
        }

      } catch (error) {
        console.error("Error loading contract:", error);

      }

      App.bindProductButtons();
      App.bindViewButtons();
    }
  },

  // Render the item status
  renderStatus: async () => {


    if ((window.location.pathname.includes('delivery.html')) ||
      (window.location.pathname.includes('status.html'))) {
      try {
        var itemID = document.getElementById('product-id').textContent;
        // Get the total number of items
        const item = await App.items.items(itemID); // Fetch item by ID
        if (!item) {
          console.error("Failed to load contract instance.");
          return;
        }
        // Map the product details from the struct
        const itemStatus = parseInt(item[6]);

        console.log("vbhnj", itemStatus)

        var status = '';
        switch (itemStatus) {
          case 0:
            status = 'Current Status: Wrapping up your product';
            break;
          case 1:
            status = 'Current Status: Ready to pickup your order';
            break;
          case 2:
            status = 'Current Status: Heading your way';
            break;
          case 3:
            status = 'Current Status: Delivered';
            break;
          default:
            status = 'Current Status: Buy Product';
        }
        document.getElementById("status").innerText = `${status}`;

        console.log("vbhnj", status)


      } catch (error) {
        console.error("Error loading contract:", error);

      }

      App.bindProductButtons();
      App.bindViewButtons();
    }
  },

  bindProductButtons: function () {
    // Attach click event to buy buttons
    $(document).on('click', '.btn btn-default btn-buy', App.buyProduct);
  },

  bindEvents: function () {
    $(document).on('submit', '.productForm', App.addProduct);
  },

  bindViewButtons: function () {
    // Attach click event to buy buttons
    $(document).on('click', '.btn btn-default btn-view', App.changeStatus);
  },

  bindEvents: function () {
    // Attach click event to buy buttons
    $(document).on('click', '.btn btn-default btn-buy', App.buyProduct);
  },

  bindEvents: function () {
    // Attach click event to buy buttons
    $(document).on('click', '.btn btn-default btn-view', App.changeStatus);
  },


  buyProduct: async (productId) => {
    const item = await App.products.products(productId); // Fetch item by ID
    const id = parseInt(item[0]);
    const productName = item[1];
    const productInfo = item[2];
    const productPrice = parseInt(item[3]);
    await App.items.buyItem(id, productName, productInfo, productPrice, { from: App.account });
    // window.location.href = "delivery.html";
  },

  addProduct: async () => {

    var name = $('#productName').val();
    var info = $('#productInfo').val();
    var price = parseInt($('#productPrice').val());
    var count = parseInt($('#productCount').val());
    console.log(name, info, price, count)
    await App.products.addProduct(name, info, price, count, { from: App.account });
  },

  changeStatus: async (productId) => {
    console.log("Product ID:", productId);
    window.location.href = `delivery.html?productId=${productId}`;
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