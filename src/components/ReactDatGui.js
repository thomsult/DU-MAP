import React, {useEffect, useState,useContext } from "react";
import * as dat from 'dat.gui';
import "./dat.css"
import {GetAllData} from '../Viewer/Data'

import { IDContext } from "../context"
import ReactDatGui from "./ReactDatComponent/component";
const lang = 1




function DatGUI(props){
const [hide,sethide] = useState({main:null})
const [data,setdata] = useState(null)
const [image,setimage] = useState(null)

const [ID,SetID] = useState(1)


function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}
const IDs = useContext(IDContext).id
useEffect(() => {
  GetAllData().then((HeliosSystem)=>{setdata(Object.values(HeliosSystem))});
  img().then((img)=>{setimage(img)})
  data&&SetID(getKeyByValue(data, data.find((el)=>el.id === IDContext._currentValue.id)))
  
}, [IDs,ID]);






function close(element){
  
  hide[element] !== "closed"?sethide({
    ...hide,
    [element]:"closed",
  }):sethide({
    ...hide,
    [element]:null,
  })
}




function OreToType(Ore){
  const T1 = [
    ["Bauxite", "Bauxite", "Bauxit"],
    ["Coal", "Charbon", "Kohle"],
    ["Quartz", "Quartz", "Quarz"],
    ["Hematite", "Hématite", "Hämatit"]
  ]
  const T2 = [
    ["Natron", "Natron", "Soda"],
    ["Chromite", "Chromite", "Chromit"],
    ["Limestone", "Calcaire", "Kalkstein"],
    ["Malachite", "Malachite", "Malachit"]
  ]
  const T3 = [
    ["Garnierite", "Garniérite", "Garnierit"],
    ["Acanthite", "Acanthite", "Akanthit"],
    ["Petalite", "Pétalite", "Petalit"],
    ["Pyrite", "Pyrite", "Pyrit"]
  ]
  
  const T4 = [
    ["Cryolite", "Cryolite", "Kryolith"],
    ["Cobaltite", "Cobaltite", "Cobaltit"],
    ["Kolbeckite", "Kolbeckite", "Kolbeckit"],
    ["Gold nuggets", "Pépites d'or", "Goldnuggets"]
  ]
  

  const T5 = [
    ["Columbite", "Columbite", "Columbit"],    
    ["Vanadinite", "Vanadinite", "Vanadinit"],
    ["Ilmenite", "Ilménite", "Ilmenit"],
    ["Rhodonite", "Rhodonite", "Rhodonit"]
  ]




return T1.find((el)=>el[0] === Ore[0])?"Tier 1":T2.find((el)=>el[0] === Ore[0])?"Tier 2":T3.find((el)=>el[0] === Ore[0])?"Tier 3":T4.find((el)=>el[0] === Ore[0])?"Tier 4":T5.find((el)=>el[0] === Ore[0])?"Tier 5":null
}



 function OreToTypeClassName(string){
  
  return "T"+string[string.length-1]

}
function compare( a, b ) {
  if ( a.props.children[0].props.children < b.props.children[0].props.children ){
    return -1;
  }
  if ( a.props.children[0].props.children > b.props.children[0].props.children ){
    return 1;
  }
  return 0;
}

//objs.sort( compare );



async function  img(){

const img = await fetch('./data/image.json').then(response => {
  return response.json();


}).catch((error)=>console.log(error))

return img

}



function GetImage(name){
return name.includes("Moon")?image&&image["generic moon"]:image&&image[name]}
//data!== null&&console.log(data)

 const [descriptionhide,setdescriptionhide]=useState(true)
 const [Orehide,setOrehide]=useState(true)


const [display,setdisplay] = useState({Safezone:false,pipe:false,orbit:false})


return data!== null&&(
  
  <div className="dg ac" onLoad={(e)=>{
    setInterval(()=>{
      SetID(getKeyByValue(data, data.find((el)=>el.id === IDContext._currentValue.id))) 
    },100)


  }}>
    <div className="dg main a" id="gui" style={{width:"245px",marginTop:"20px"}}>
      <div
        style={{
          width: "245px",
          marginLeft: "-3px",
          cursor: "ew-resize",
          position: "absolute",
          overflowX: "hidden",
          maxHeight: "90vh",
          paddingBottom:"28px" ,
        }}
      >
        {/* <input id="PlanetID" type="text" value={IDs}/> */}
    <ul className={hide.main} >
    <ReactDatGui.Folder title="Description" close onChange={(e)=>{setdescriptionhide(!descriptionhide)}}>
<li className="cr string"  style={{height:descriptionhide?0:"auto"}}  >
  <h3>{data[ID].name[lang]}</h3>
  <img style={{width:"100%",height:"auto"}} alt="Planet" src={"https://"+GetImage(data[ID].name[0])}/>
    <span style={{ display: "flex", height: "100%", width: "100%" }}>
    {data[ID].description?data[ID].description[lang]:""}
    </span>
</li>
</ReactDatGui.Folder>
<ReactDatGui.Folder title="Info" close>
              <ReactDatGui.String src={{Type:data[ID], lang:lang}}/>
              <ReactDatGui.String src={{Classification:data[ID], lang:lang}}/>

              <ReactDatGui.String src={{Biosphere:data[ID],lang:lang}}/>
               <ReactDatGui.String src={{Habitability:data[ID],lang:lang}}/>

              <ReactDatGui.Boolean src={{Atmosphere:data[ID]}}/>
              <ReactDatGui.Boolean src={{"In Safe Zone":data[ID]}}/>
      </ReactDatGui.Folder>


<ReactDatGui.Folder title="Ores" close onChange={(e)=>{setOrehide(!Orehide)}}>
              <li className="cr" style={{height:Orehide?0:"auto"}} >
                {data[ID].ores.map((el)=>(
                <div key={el[0]} className="cr" >
                  <span className={"property-name Ores "+OreToTypeClassName(OreToType(el))}>{OreToType(el)}</span>
                  <span className=" c">{el[lang]}</span>
                </div>)).sort(compare)}
              </li>
</ReactDatGui.Folder>
<ReactDatGui.Folder title="System" close>
<li className="cr boolean">
          <div>
            <span className="property-name">Toggle SafeZone</span>
            <div className="c">
              <input id="Safezone" type="checkbox"  checked={display.Safezone} onChange={()=>{setdisplay({...display,Safezone:!display.Safezone})}}/>
            </div>
          </div>
        </li>
        <li className="cr boolean">
          <div>
            <span className="property-name">Toggle Pipe</span>
            <div className="c">
              <input id="pipe" type="checkbox" checked={display.pipe} onChange={()=>{setdisplay({...display,pipe:!display.pipe})}}/>
            </div>
          </div>
</li>
<li className="cr boolean">
          <div>
            <span className="property-name">Toggle Orbit</span>
            <div className="c">
              <input id="Orbit" type="checkbox" checked={display.orbit} onChange={()=>{setdisplay({...display,orbit:!display.orbit})}}/>
            </div>
          </div>
</li>
  
</ReactDatGui.Folder>

      </ul>
      <div className="close-button close-bottom" style={{ width: "245px" }} onClick={()=>{close("main")}}>
        {hide.main === null?"Close":"Open"}
      </div>
      
      
      
      
      </div>
      
    </div>
  </div>
);
}



















export {DatGUI}
