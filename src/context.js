import React,{useState} from "react";
  export const IDContext = React.createContext({
    id: "Alioth",
    Safezone:false,
    pipe:false,
    orbit:true,
    changeInfo(state,value){
      IDContext._currentValue[state] = value
    },
    Waypoint :null,
    Path:[]


  });
export const dispatch = (state)=>{
//console.log(state.parent.name)
if(state.parent.name!== "Waypoint"){
  IDContext._currentValue.id = state.parent.name
  IDContext._currentValue.Waypoint = null
}
else{

  IDContext._currentValue.Waypoint = state.name
  IDContext._currentValue.id = state.parent.name
}
}

export const dispatchWaypoint = (value)=>{
  IDContext._currentValue.Path.push(value)

}