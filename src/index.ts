import express from "express";
import bodyParser from "body-parser";

export const app = express();

app.use(bodyParser({}));

interface Balances {
  [key: string]: number;
}

interface User {
  id: string;
  balances: Balances;
}

interface Order {
  userId: string;
  price: number;
  quantity: number;
}

//ticker is an variable for traded comidity
export const TICKER = "GOOGLE";

const users: User[] = [
  {
    id: "1",
    balances: {
      GOOGLE: 10,
      USD: 50000,
    },
  },
  {
    id: "2",
    balances: {
      GOOGLE: 10,
      USD: 50000,
    },
  },
];

const bids: Order[] = [];
const asks: Order[] = [];

// Place a limit order
app.post("/order", (req: any, res: any) => {
  const side: string = req.body.side;
  const price: number = req.body.price;
  const quantity: number = req.body.quantity;
  const userId: string = req.body.userId;

  const remainingQty = fillOrders(side, price, quantity, userId);
  //whole order got fulfilled
  if (remainingQty === 0) {
    res.json({ filledQuantity: quantity });
    return;
  }
  //putting the orders in the order book to be fulfilled
  if (side === "bid") {
    bids.push({
      userId,
      price,
      quantity: remainingQty,
    });
    //sorting on base of prise its imp 
    bids.sort((a, b) => (a.price < b.price ? -1 : 1));
  } else {
    asks.push({
      userId,
      price,
      quantity: remainingQty,
    });
        //sorting on base of prise its imp 
    asks.sort((a, b) => (a.price < b.price ? 1 : -1));
  }

  res.json({
    filledQuantity: quantity - remainingQty,
  });
});

//creating depth
app.get("/depth", (req: any, res: any) => {
  const depth: {
    [price: string]: {
      type: "bid" | "ask";
      quantity: number;
    };
  } = {};
//here it it creating the cumilitave of how much quantity of a certien tiche is prtesent for a certin price we did same for ask


  for (let i = 0; i < bids.length; i++) {
    //initilized the price at (X) quantity if it didnt exist
    if (!depth[bids[i].price]) {
      depth[bids[i].price] = {
        quantity: bids[i].quantity,
        type: "bid",
      };
    } else {
      //if it akredy existed at (y) price for (X) quantity and not there is more quantity then new quantiy will be X+new quantity at (Y) Price
      depth[bids[i].price].quantity += bids[i].quantity;
    }
  }

  for (let i = 0; i < asks.length; i++) {
    if (!depth[asks[i].price]) {
      depth[asks[i].price] = {
        quantity: asks[i].quantity,
        type: "ask",
      };
    } else {
      depth[asks[i].price].quantity += asks[i].quantity;
    }
  }

  res.json({
    depth,
  });
});

app.get("/balance/:userId", (req: any, res: any) => {
  const userId = req.params.userId;
  const user = users.find((x) => x.id === userId);
  if (!user) {
    return res.json({
      USD: 0,
      [TICKER]: 0,
    });
  }
  res.json({ balances: user.balances });
});

app.post("/quote", (req: any, res: any) => {
  const side: string = req.body.side;
  const quantity: number = req.body.quantity;
  const userId: string = req.body.userId;
  let user = users.find((x) => x.id === userId);
  let quote:number=0;
  let avgAsk:number=0;
  let avgQut:number=0;  
  //checking if user is not undefined
  if (!user) {
    return;
  }
  if(side=="bid"){
     
    for(let i=asks.length-1;i >= 0;i++){
      avgAsk+= +asks[i].price
      avgQut+= +asks[i].quantity
    }
    quote=avgAsk/avgQut;

  }
  else{
    for(let i=bids.length-1;i >= 0;i++){
      avgAsk+= +bids[i].price
      avgQut+= +bids[i].quantity
    }
    quote=avgAsk/avgQut;

  }
  
  return quote*quantity;
});

//this if for transaction which means that deduction and addition of the balances as well as the
function flipBalance(
  userId1: string,
  userId2: string,
  quantity: number,
  price: number
) {
  let user1 = users.find((x) => x.id === userId1);
  let user2 = users.find((x) => x.id === userId2);
  //checking if user is not undefined
  if (!user1 || !user2) {
    return;
  }
  //updating quantities
  user1.balances[TICKER] -= quantity;
  user2.balances[TICKER] += quantity;
  //updating balances
  user1.balances["USD"] += quantity * price;
  user2.balances["USD"] -= quantity * price;
}

function fillOrders( 
  side: string,//bid or ask order
  price: number,
  quantity: number,
  userId: string): number {
  let remainingQuantity = quantity;
  //for some onw who is there to buy it will be matched with some one who wants to sell 
  if (side === "bid") {
    //we iterate from the end because the last value is the best price we can find
    for (let i = asks.length - 1; i >= 0; i--) {
      if (asks[i].price > price) {
        break;
      }
      //check if all the order can be fulfilled 
      if (asks[i].quantity > remainingQuantity) {
        asks[i].quantity -= remainingQuantity;
        //asset transfer 
        flipBalance(asks[i].userId, userId, remainingQuantity, asks[i].price);
        return 0;
      } else {
        //else fulfil the orders that can be fulfilled and wait for other to be fulfilled
        remainingQuantity -= asks[i].quantity;
        flipBalance(asks[i].userId, userId, asks[i].quantity, asks[i].price);
        //if ask is filled psrtily and still need to be fille the psrt that is filled will be remove from the order book
        asks.pop();
      }
    }
    //for someone who wants to sell 
  } else {
    for (let i = bids.length - 1; i >= 0; i--) {
      if (bids[i].price < price) {
        break;
      }
      if (bids[i].quantity > remainingQuantity) {
        bids[i].quantity -= remainingQuantity;
        flipBalance(userId, bids[i].userId, remainingQuantity, price);
        return 0;
      } else {
        remainingQuantity -= bids[i].quantity;
        flipBalance(userId, bids[i].userId, bids[i].quantity, price);
        bids.pop();
      }
    }
  }

  return remainingQuantity;
}
