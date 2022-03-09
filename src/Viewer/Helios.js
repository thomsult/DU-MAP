import React, {useState,useRef } from 'react';

import {TransformNode,useBeforeRender,Sphere,useScene} from 'react-babylonjs'

import {Planets} from './Component/planete';
import { GetAllData} from './Data';
import InfoUser from './infoUsers';
import { Vector3 } from "@babylonjs/core";
import { Color3 } from "@babylonjs/core/Maths/math.color";
const Scale = 0.00005;
const centerMap = new Vector3(0*Scale, 24000000*Scale, 0*Scale)
function SafeZone(){
  const safezonestate = useRef(null)
  //
  const [Hide,setHide] = useState(true)
  
    const centerSafeZone = new Vector3(13771471*Scale,7364470.4372*Scale,-128971*Scale)
    //position approximative
    /* const safezonegeometry = new THREE.SphereGeometry( 36000000*Scale, 17, 17 );//position approximative
    //geometry.position =new THREE.Vector3(centerMap.x,centerMap.y,centerMap.z)*/
    //
  //setHide(console.log())
    useBeforeRender(() => {
      //
      setHide(document.getElementById('Safezone').checked)
      
    });

  const Radius = 90 * 200000

  return <Sphere
  ref={safezonestate}
  name={"SafeZone Trigger"}
  segments={12}
  diameter={(Radius*2)*Scale}
  position={centerSafeZone}
  setEnabled={Hide}
  computeWorldMatrix={true}
  isPickable={false}
>
  <standardMaterial
    name={"SafeZone Trigger mat"}
    alpha="0.5"
    diffuseColor={new Color3(0, 0, 1)}
    specularColor={new Color3(0, 0, 0)}
  />
</Sphere>
}

function Sun(){
 
  const centerSafeZone = new Vector3(13771471*Scale,7364470.4372*Scale,-128971*Scale)
  //position approximative
  /* const safezonegeometry = new THREE.SphereGeometry( 36000000*Scale, 17, 17 );//position approximative
  //geometry.position =new THREE.Vector3(centerMap.x,centerMap.y,centerMap.z)*/


return <Sphere
name={"Sun"}
segments={12}
diameter={1000000*Scale}
position={centerMap}

>
<standardMaterial
  name={"Sun mat"}
  alpha="0.5"
  diffuseColor={new Color3(0, 0, 1)}
  specularColor={new Color3(0, 0, 0)}
/>
</Sphere>
}




export default function Helios(){
    const [data,setdata] = useState(null)
    const [loaded,setLoaded] = useState(false) 
    const beforeMount = useRef(false);
  const Scene = useScene();
  if (Scene&&beforeMount.current === false) {
    console.log("mount")
  beforeMount.current = true;
  const engine = Scene.getEngine();
  Scene.debugLayer.show();
  const options = {
    autoStart: false,
    clearBeforeRender: false,
    context: engine._gl, // ._gl is public **hidden**
    height: engine.getRenderHeight(),
    // roundPixels: true, available PIXI < 5.0
    view: engine.getRenderingCanvas(),
    width: engine.getRenderWidth()
  }
  
}
    InfoUser()
    
    
    
    useBeforeRender(() => {
        if(data === null && loaded=== false){
            GetAllData().then((HeliosSystem)=>{setdata(HeliosSystem);setLoaded(true)})
            
        }
        //console.log("loading")
      });
      
    return loaded&&(<TransformNode name="Helios" >
                                <Planets data={data} />
                                <SafeZone/>
            </TransformNode>)
}