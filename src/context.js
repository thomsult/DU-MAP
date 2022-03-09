import React from "react";
 
  export const IDContext = React.createContext({
    id: 2,
    change: (state,value) => {
      IDContext._currentValue.id = state
      //console.log(state,IDContext)
    
    },
  });
