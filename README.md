# Simulated Order Book for Trading Exchange

## Introduction
This project implements a simulated order book similar to those found in trading exchanges. It serves as a learning exercise for building low-latency systems and understanding financial concepts such as limit orders, market orders, liquidity, and market depth. The application is built using TypeScript (TSX) and runs on the server-side using Node.js.

## Technologies Used
- **TypeScript** btw this was my first application on type script
- **Node.js**
   
## Financial Concepts Explored
### Limit Orders
Limit orders are instructions given to a broker or exchange to buy or sell a security at a specified price or better. They allow traders to control the price at which they buy or sell an asset, providing more control over their trades.

### Market Orders
Market orders are instructions to buy or sell a security immediately at the best available current price. Unlike limit orders, market orders prioritize execution speed over price, resulting in immediate execution but potentially at a less favorable price.

### Liquidity
Liquidity refers to the ease with which an asset can be bought or sold in the market without significantly affecting its price. High liquidity assets have a large number of buyers and sellers, allowing transactions to be executed quickly with minimal price impact.

### Market Depth
Market depth represents the level of liquidity available in an order book at various price levels. It shows the quantity of buy and sell orders at different price points, providing insight into potential price movements and market sentiment.

## Application Overview
The simulated order book application replicates the core functionality of a trading exchange, including:
- Accepting and processing limit orders from traders.
- Executing market orders against available liquidity in the order book.
- Maintaining an order book with buy and sell orders organized by price and time priority.

## Getting Started
To run the application locally, follow these steps:
1. Clone the repository to your local machine.
2. Install dependencies using `npm install`.
3. Start the server using `npm start`.
4. Access the application through the provided endpoint (e.g., `http://localhost:3000`).

## Conclusion
The simulated order book project offers a practical way to explore low-latency systems, TypeScript development, and fundamental financial concepts relevant to trading exchanges. By understanding how order books function and implementing them in code, developers can gain valuable insights into financial markets and improve their skills in building efficient and scalable systems.
