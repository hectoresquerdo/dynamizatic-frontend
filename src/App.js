import "./App.css";
import React, { useEffect, useState } from "react";
import TablePage from "./components/table";
import Header from "./components/header";
import axios from "axios";

function App() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get("https://dynamizatic-backend.herokuapp.com/orders")
      .then((response) => {
        setOrders(response.data);
      });
  }, []);

  return (
    <div className="App">
      <Header
        onCreate={(newOrder) => {
          setOrders([newOrder, ...orders]);
        }}
        onFilter={(filteredOrders) => {
          setOrders(filteredOrders);
        }}
      />
      <TablePage
        rows={orders}
        onUpdate={(updatedOrder) => {
          setOrders(
            orders.map((order) => {
              if (updatedOrder.order_id === order.order_id) {
                return updatedOrder;
              } else {
                return order;
              }
            })
          );
        }}
        onDeleteRow={(orderId) => {
          setOrders(orders.filter((order) => order.order_id !== orderId));
        }}
      />
    </div>
  );
}

export default App;
