import React from "react";
import { useOrderDetails } from "../../context/OrderDetails";
import { formatCurrency } from "../../utilities";

import Options from "./Options";

export default function OrderEntry() {
  const { totals } = useOrderDetails();
  return (
    <div>
      <h1>Design your Sundae!</h1>
      <Options optionType="scoops" />
      <Options optionType="toppings" />
      <h2>Grand Total: {formatCurrency(totals.scoops + totals.toppings)}</h2>
    </div>
  );
}
