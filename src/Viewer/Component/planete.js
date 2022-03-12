import React,{useRef,useCallback, useState,useMemo, useContext} from "react";
import {Orbit,Pipe} from './orbit';
import {
  
  Camera,
  Sphere,
  TransformNode,
  useBeforeRender,
  useScene,
  useClick,
  Html,
  
} from "react-babylonjs";
import { Vector3,ActionManager,ExecuteCodeAction } from "@babylonjs/core";
import { Color3,Color4 } from "@babylonjs/core/Maths/math.color";
import {AdvancedDynamicTexture} from '@babylonjs/gui/2D'
import {Control} from '@babylonjs/gui';

import { IDContext,dispatch } from '../../context'




const Scale = 0.00005;



















function SetTarget(mesh,scene) {
  //console.log('sphere clicked',ev.meshUnderPointer.parent.name,ev.meshUnderPointer.id);
  //console.log("old : ",scene.cameras[0].target.name)
  //ChangeID(ev.meshUnderPointer.id)
  //state.ID = ev.meshUnderPointer.id
  dispatch(mesh)

  
  //document.getElementById('PlanetID').value  = ev.meshUnderPointer.id

  scene.cameras[0].target.name!== undefined&&scene.meshes.forEach(element => {
    if(element.name === scene.cameras[0].target.name){
        //old Target
        element.isPickable = true
    }
})
scene.cameras[0].target = mesh
scene.cameras[0].target.name = mesh.name
//console.log("Triger",scene.cameras[0].target,ev.meshUnderPointer)
mesh.isPickable = false;

}













function Planet(props) {
  const params = props.params;


  const Satellites = () => {
    if (
      params &&
      params.satellites !== undefined &&
      params.satellites.length > 0
    ) {
      return params.satellites.map((moon) => (
        <Moon
          key={moon}
          system={props.system}
          bodyid={moon}
          parent={params}
          positionParent={new Vector3().fromArray(
            params.center.map((el) => el * Scale)
          )}
        />
      ));
    } else {
      return false;
    }
  };
  return (
    <Sphere
      name={params.name[0]}
      segments={12}
      diameter={params.radius * 2 * Scale}
      position={new Vector3().fromArray(params.center.map((el) => el * Scale))}
      bodytype={params.type[0]}
      infoData={params}
      systemId={params.systemId}
      bodyid={params.id}
      satellites={params.satellites}
      isPickable={false}
    >
      <standardMaterial
        name={params.name[0]+"mat"}
        diffuseColor={new Color3(0, 1, 0)}
        specularColor={new Color3(0, 0, 0)}
      />
      <Satellites />
      <PlanetTrigger parent={params}  />
      
    </Sphere>
  );
}

function Moon(props) {

  const params = props.system.find((moon) => moon.id === props.bodyid);
  const positionParent = props.positionParent;
  const center = new Vector3().fromArray(params.center.map((el) => el * Scale));
  const position = new Vector3(0, 0, 0).add(center.subtract(positionParent));

  return (
    <><Sphere
    
      name={params.name[0]}
      segments={12}
      diameter={params.radius * 2 * Scale}
      position={position}
      bodytype={params.type[0]}
      infoData={params}
      systemId={params.systemId}
      bodyid={params.id}
    >
      <standardMaterial
        name={params.name[0]+"mat"}
        diffuseColor={new Color3(1, 0, 0)}
        specularColor={new Color3(0, 0, 0)}
      />
      <PlanetTrigger parent={params} moon />
    </Sphere>
    
    <Orbit
    params={position}
    system={props.system}
    /></>
  );
}



function PlanetTrigger(props) {
  //console.log(scene) 
  
    
  const Context = useContext(IDContext)
  const [Hide,sethide] = useState(Context.Safezone)

  useBeforeRender(()=>{

    sethide(Context.Safezone)
  })

  const scene = useScene();


  
  const params = props.parent;
  
  const [PlanetRef] = useClick(e => {
    SetTarget(e.meshUnderPointer,scene)
    });



  
  return (
    <Sphere
    ref={PlanetRef}
      name={!props.moon?params.name[0] + ":Trigger":params.name[0] + ":Trigger"}
      segments={12}
      diameter={((params.radius+(!props.moon?500000:50000)) * 2) * Scale}//approximation
      position={new Vector3(0, 0, 0)}
      infoData={params}
      systemId={params.systemId}
      bodyid={params.id}
      father={params.name[0]}
    >
      <standardMaterial
        name={!props.moon?params.name[0] + ":Trigger mat":params.name[0] + ":Trigger mat"}
        alpha={Hide?"0.5":"0.05"}
        diffuseColor={new Color3(0, 0, 1)}
        specularColor={new Color3(0, 0, 0)}
      />
      

    </Sphere>
  );
}



function Planets(props) {
  return Object.values(props.data).map((Planet_info) => {
    if (Planet_info.type[0] === "Planet") {
      return (
        <TransformNode name={Planet_info.name[0]+" node"} key={Planet_info.id}><Planet
          params={Planet_info}
         
          system={Object.values(props.data)}
        />
        <Orbit
      type={"planet"}
        params={new Vector3().fromArray(Planet_info.center.map((el) => el * Scale))}
        system={Planet_info}
        />
        {!Planet_info.isInSafeZone?<Pipe info={Planet_info} system={Object.values(props.data)} position={new Vector3().fromArray(Planet_info.center.map((el) => el * Scale))}/>:null}
        
        </TransformNode>
      );
    } else {
      return null;
    }
  });
}

export {Planets};
