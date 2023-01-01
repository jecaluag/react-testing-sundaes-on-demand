// Context with embedded state pattern based on https://kentcdodds.com/blog/application-state-management-with-react
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { PRICE_PER_ITEM } from "../constants";

const OrderDetails = createContext();

// create custom hook to check whether we're inside a provider
export function useOrderDetails() {
  const contextValue = useContext(OrderDetails);

  if (!contextValue) {
    throw new Error(
      "useOrderDetails must be called from within an OrderDetailsProvider"
    );
  }

  const [optionCount, setOptionCount] = contextValue;

  const updateOptionCount = useCallback(
    (itemName, newItemCount, optionType) => {
      const newOptionCount = { ...optionCount };

      newOptionCount[optionType][itemName] = newItemCount;

      setOptionCount(newOptionCount);
    },
    [optionCount, setOptionCount]
  );

  const resetOrder = useCallback(() => {
    setOptionCount({
      scoops: {},
      toppings: {},
    });
  }, [setOptionCount]);

  const calculateTotal = useCallback(
    (optionType) => {
      const countsArray = Object.values(optionCount[optionType]);

      const totalCount = countsArray.reduce((total, count) => total + count, 0);

      return PRICE_PER_ITEM[optionType] * totalCount;
    },
    [optionCount]
  );

  const totals = {
    scoops: calculateTotal("scoops"),
    toppings: calculateTotal("toppings"),
  };

  return {
    optionCount,
    totals,
    updateOptionCount,
    resetOrder,
  };
}

export function OrderDetailsProvider(props) {
  const [optionCount, setOptionCount] = useState({
    scoops: {},
    toppings: {},
  });

  const value = useMemo(() => [optionCount, setOptionCount], [optionCount]);

  return <OrderDetails.Provider value={value} {...props} />;
}

// import { createContext, useContext, useState, useCallback } from "react";
// import { PRICE_PER_ITEM } from "../constants";

// const OrderDetails = createContext();

// // create custom hook to check whether we're inside a provider
// export function useOrderDetails() {
//   const contextValue = useContext(OrderDetails);

//   if (!contextValue) {
//     throw new Error(
//       "useOrderDetails must be called from within an OrderDetailsProvider"
//     );
//   }

//   return contextValue;
// }

// export function OrderDetailsProvider(props) {
//   const [optionCount, setOptionCount] = useState({
//     scoops: {},
//     toppings: {},
//   });

//   const updateOptionCount = useCallback(
//     (itemName, newItemCount, optionType) => {
//       const newOptionCount = { ...optionCount };

//       newOptionCount[optionType][itemName] = newItemCount;

//       setOptionCount(newOptionCount);
//     },
//     [optionCount]
//   );

//   const resetOrder = useCallback(() => {
//     setOptionCount({
//       scoops: {},
//       toppings: {},
//     });
//   }, []);

//   const calculateTotal = useCallback(
//     (optionType) => {
//       const countsArray = Object.values(optionCount[optionType]);

//       const totalCount = countsArray.reduce((total, count) => total + count, 0);

//       return PRICE_PER_ITEM[optionType] * totalCount;
//     },
//     [optionCount]
//   );

//   const totals = {
//     scoops: calculateTotal("scoops"),
//     toppings: calculateTotal("toppings"),
//   };

//   const value = { optionCount, totals, updateOptionCount, resetOrder };

//   return <OrderDetails.Provider value={value} {...props} />;
// }
