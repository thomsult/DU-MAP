import React, { Component, useState } from "react";

//{propriétés:"value"}

export default class ReactDatGui extends Component {
  static String(props) {
    const lang = props.src.lang
    const obj = Object.values(props.src)[0]
    const property = Object.keys(props.src)[0]
    const value = obj[property.toLowerCase()]
    //console.log(props,value[lang])

   
    return (
      <li className={""}>
        <span className="property-name">{property}</span>
        <span className="c">{obj.hasOwnProperty(property.toLowerCase())?value[lang]:null}</span>
      </li>
    );
  }



  static Boolean(props) {
    
    const lang = props.src.lang
    const obj = Object.values(props.src)[0]
    const property = Object.keys(props.src)[0]
    const value = obj[Object.keys(obj).find((el)=>el.match(property.replace(/ /g, "")))]
    //console.log(props)
    return (
      <li className={"cr boolean"}>
        <div>
          <span className="property-name">{property}</span>
          <div className="c">
            <span className="c">
              <input
                type="checkbox"
                checked={value ? true : false}
                onChange={()=>{return false}}
              />
            </span>
          </div>
        </div>
      </li>
    );
  }

  static Folder(props) {
    const [hide, sethide] = useState(props.close);
    
    return (
      <li className="folder ">
        <div
          className=" title"
          onClick={(e) => {
            e.target.innerText === props.title && sethide(!hide);props.onChange !== undefined&&props.onChange(hide);
          }}
        >
          <ul className={hide ? "closed" : null}>
            <li className="title">{props.title}</li>
            {props.children}
          </ul>
        </div>
      </li>
    );
  }




















  
}
