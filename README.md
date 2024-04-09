<!-- ABOUT THE PROJECT -->
## Fake Product Identification for Clothing Product by Serial Number using Smart Contracts
Exploring several blockchain framework and introduces an approach for combating product counterfeiting by leveraging serial 
numbers and blockchain technology and smart contracts, with focus on clothing products.

### Built With/Tools
* [React.js](https://react.dev/)
* [Truffle](https://trufflesuite.com/docs/)
* [Web3.js](https://web3js.readthedocs.io/en/v1.10.0/)

* Time and Library is referenced by [BokkyPooBah](https://github.com/bokkypoobah/BokkyPooBahsDateTimeLibrary)

### Prerequisites

1. Install Ganache [here](https://archive.trufflesuite.com/ganache/)
2. Install Metamask extension [here](https://metamask.io/download/)

### Installation


1. Clone the repo
   ```sh
   git clone https://github.com/kietana/fake-product-identification-blockchain.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Start Ganache
3. Migrate smart contract to Ganache
   ```sh
   truffle migrate
   ```
   or if already migrated before, use
   ```sh
   truffle migrate --reset
   ```
   so that the latest migration of the contract is used in the blockchain
4. Run the app
   ```sh
   npm start
   ```

<!-- USAGE EXAMPLES -->
## Usage

1. Change Metamask network to Ganache
2. Import account from Ganache into Metamask
3. Smart contract interaction done by interacting with front-end (Changes is blockchain can be seen through Ganache)

_For more details, please refer to the [Documentation](https://drive.google.com/file/d/198OhbWe14Y8wH0SkyYLEtlhdujq5jt2u/view?usp=sharing)_



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
