import React,{useRef, useState} from "react";
import {Orbit,Pipe} from './orbit';
import {
  
  Camera,
  Sphere,
  TransformNode,
  useBeforeRender,
  useScene,
  
} from "react-babylonjs";
import { Vector3,ActionManager,ExecuteCodeAction } from "@babylonjs/core";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import {AdvancedDynamicTexture} from '@babylonjs/gui/2D'
import {Rectangle,TextBlock,Line,Ellipse,Button} from '@babylonjs/gui/2D/controls'

import { IDContext,reducer } from '../../context'




const Scale = 0.00005;






function Gui3D(props,scene,params,context){
  let enable = false
  const name = params.name[0]
  const type = params.type[0]
  const center = new Vector3().fromArray(params.center.map((x)=>x*Scale))
  //console.log(center)
  if(!enable){
    var advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI(`GUI ${name}`)
   
   
   
    //props&&console.log(scene.getMeshByName(name))
  advancedTexture.useInvalidateRectOptimization = false
  
  
  var distance = ((scene.activeCamera.position.clone()).subtract(center.clone())).length().toFixed(2)
  var rect1 = new Rectangle();
    rect1.width = 0.5;
    rect1.height = "40px";
    rect1.color = "white";
    rect1.thickness = 0
    advancedTexture.addControl(rect1);
    rect1.distance = distance

    /* rect1.onPointerClickObservable.add(()=>{

      console.log(name)
    }) */
    var button = Button.CreateSimpleButton("button");
    button.textBlock.text = name+" "+rect1.distance
    button.top = "0px";
    button.left = "0px";
    button.width = 0.5;
    button.height = "40px";
    button.thickness = 0;
    button.cornerRadius = 2
    button.children[0].color = "#DFF9FB";
    button.children[0].fontSize = 18;
    button.color = "#FF7979";
    button.hoverCursor = "pointer";
    
    
    
    
    
    
    
    
    
    rect1.addControl(button)


    rect1.linkWithMesh(props);   
    rect1.linkOffsetY = -50;
    rect1.onBeforeDrawObservable.add(()=>{
      rect1.distance = ((scene.activeCamera.position.clone()).subtract(center.clone())).length().toFixed(2);//(Vector3.Distance(center,scene.cameras[0].position)).toFixed(2)

      if(type !== "Moon"){
        button.textBlock.text = name
      }else if(type === "Moon" && rect1.distance>400){
        button.textBlock.text = ""
        rect1.linkOffsetY = 0
      }
      else if(type === "Moon" && rect1.distance<400){
        button.textBlock.text = name 
        rect1.linkOffsetY = 50
      }
    })
    button.onPointerClickObservable.add(function (e) {
      if(button.textBlock.text !== ""){
        SetTarget(props,scene,context)
        console.log(button.textBlock.text,rect1.distance)
      }
  });
  
  enable = true


  }

return null

}




function SetTarget(mesh,scene,context) {
  const Change = context.change
  //console.log('sphere clicked',ev.meshUnderPointer.parent.name,ev.meshUnderPointer.id);
  //console.log("old : ",scene.cameras[0].target.name)
  //ChangeID(ev.meshUnderPointer.id)
  //state.ID = ev.meshUnderPointer.id
  //dispatch(state)
  Change(mesh.id)

  
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
          id={moon}
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
      id={params.id}
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

  const params = props.system.find((moon) => moon.id === props.id);
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
      id={params.id}
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
  //const [state, dispatch] = React.useReducer(reducer, initialState);
  
  
  const PlanetRef = useRef()
  const params = props.parent;
  const context = React.useContext(IDContext)

  const onSphereCreated = (sphere) => {
    sphere.actionManager = new ActionManager(sphere.getScene());
    const scene = sphere.getScene()
    //Vector3.Distance(scene.cameras[0].position, props.position)
    Gui3D(sphere,scene,params,context)
    sphere.actionManager.registerAction(
      new ExecuteCodeAction(
        ActionManager.OnPickTrigger, (ev)=>{SetTarget(ev.meshUnderPointer,scene,context)})
    );
  }
  useBeforeRender((scene)=>{
    })
  return (
    <Sphere
    ref={PlanetRef}
      name={!props.moon?params.name[0] + ":Trigger":params.name[0] + ":Trigger"}
      segments={12}
      diameter={((params.radius+(!props.moon?500000:10000)) * 2) * Scale}
      position={new Vector3(0, 0, 0)}
      infoData={params}
      systemId={params.systemId}
      id={params.id}
      onCreated={onSphereCreated}
      father={params.name[0]}
    >
      <standardMaterial
        name={!props.moon?params.name[0] + ":Trigger mat":params.name[0] + ":Trigger mat"}
        alpha="0.2"
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
