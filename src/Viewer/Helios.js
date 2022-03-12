import React, {useState,useRef,useCallback, useMemo, useEffect,useContext,useReducer } from 'react';

import {TransformNode,useBeforeRender,Sphere,useScene, Control, Control3D} from 'react-babylonjs'

import {Planets} from './Component/planete';
import { GetAllData} from './Data';
import InfoUser from './infoUsers';
import { Vector3 } from "@babylonjs/core";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { IDContext,dispatch } from '../context'

//import { Rectangle,TextBlock,Button } from '@babylonjs/gui';

const Scale = 0.00005;
const centerSafeZone = new Vector3(13771471*Scale,7364470.4372*Scale,-128971*Scale)
const centerMap = new Vector3(0*Scale, 24000000*Scale, 0*Scale)

function SafeZone(){
  const safezonestate = useRef(null)
  //
  const Context = useContext(IDContext)
  const [hide,sethide] = useState(Context.Safezone)

  useBeforeRender(()=>{

    sethide(Context.Safezone)
  })


  const Radius = 90 * 200000

  return (<Sphere
  ref={safezonestate}
  name={"SafeZone Trigger"}
  segments={12}
  diameter={(Radius*2)*Scale}
  position={centerSafeZone}
  setEnabled={hide}
  
  isPickable={false}
>
  <standardMaterial
    name={"SafeZone Trigger mat"}
    alpha="0.5"
    diffuseColor={new Color3(0, 0, 1)}
    specularColor={new Color3(0, 0, 0)}
  />
</Sphere>)
}

function Sun(){
 
  
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


function SetTarget(mesh,scene) {

  //console.log('sphere clicked',ev.meshUnderPointer.parent.name,ev.meshUnderPointer.id);
  //console.log("old : ",scene.cameras[0].target.name)
  //ChangeID(ev.meshUnderPointer.id)
  //state.ID = ev.meshUnderPointer.id
  //dispatch(state)
  dispatch(mesh)
  console.log(mesh)
  //Change(mesh._id)

  
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





const RectGui = React.forwardRef((props, ref)=>{
  const [name,target,Type] = props.data
  const refel= useRef()
return name !== undefined&&(
  <rectangle
    ref={ref}
    name={name}
    background="transparent"
    cornerRadius={0}
    thickness={0}
    linkOffsetX={Type!== 'point'?100:0}
    widthInPixels={name.length * 10} heightInPixels={14}
    verticalAlignment={Control.VERTICAL_ALIGNMENT_TOP}
    top="0"
  >
    <babylon-button ref={refel}
    name={name+"-button"} 
    widthInPixels={name.length * 10} heightInPixels={14}
    thickness={0} 
    onPointerDownObservable={()=>{
      SetTarget(Type==="Moon"?refel.current.parent._linkedMesh:refel.current.parent._linkedMesh,target.scene)}} >
    <textBlock  
    name={name+"-text"} 
    text={name} 
    color="White" 
    fontSizeInPixels={Type!== 'point'?16:12} 
    onBeforeDrawObservable={(ref)=>{
      let distance = ref.parent.parent._linkedMesh?((target.scene.activeCamera.position.clone()).subtract(ref.parent.parent._linkedMesh._absolutePosition.clone())).length().toFixed(2):console.log(ref.parent.parent.name)
      if(distance <= 400){
        ref.parent.parent.widthInPixels = name.length * 10
        ref.linkOffsetX = Type!== 'point'?100:0
        ref.text = name;
    
      }else if (distance > 400 && Type === "Moon"){
        ref.linkOffsetX = 0
        ref.parent.parent.widthInPixels = 0
        ref.text = ''
      }
      else{
        ref.parent.parent.widthInPixels = name.length * 10
        ref.linkOffsetX = 0
        ref.text = name ;
      }
    
    
    
    
      }}
    />
    </babylon-button>
    
  </rectangle>
);
})
/*  */









export default function Helios(){
  const context = useContext(IDContext)
  const [Waypoint,setWaypoint] = useState(null)
  const [data,setdata]=useState(null)
  const scene = useScene()
  const refList = []
  const refWaypointList = []


   useEffect(() => {
    scene.debugLayer.show();
    const p = GetAllData().then((HeliosSystem)=>{setdata({
      react:(<><Planets data={HeliosSystem}/><SafeZone/></>),
      raw:HeliosSystem
    })})
    
  },[]);
  

  const onFullScreenRef = useCallback(ref => {
    //
          try {
            refList.length > 0&&console.log(refList)
            refList.length > 0&&refList.forEach((el)=>{el!==null&&el.name!==undefined&&el.linkWithMesh(scene.getMeshByName(el.name+":Trigger"))})
            
          } catch (e) {
            console.error(e)
          }})

const onFullScreenWaypointRef = useCallback(ref => {
  let timers = 1000
  const temps = setInterval(()=>{
    if(context.Path.length>0){
      setWaypoint(context.Path)
      console.log(context.Path.length)
      try {
        refWaypointList.length > 0&&console.log(refWaypointList)
        refWaypointList.length > 0&&refWaypointList.forEach((el)=>{el!==null&&el.name!==undefined&&el.linkWithMesh(scene.getMeshByName(el.name))})
        
      } catch (e) {
        console.error(e)
      }
      
      
      
      clearInterval(temps)
    }

  
  },timers)
  
})



  if(data){
    return<>
    <transformNode name="Helios" >
              {data&&(data.react)}
              
    </transformNode>
    <InfoUser/>
    <adtFullscreenUi ref={onFullScreenRef} name="heliosGUI" idealHeight = {window.innerHeight} idealWidth = {window.innerWidth}>
    {  Object.values(data.raw).map((el)=>
      <RectGui key={el.id} ref={(ref)=>{refList.push(ref)}} data={[el.name[0],{scene:scene,context:context},el.type[0]]}/>)
      }
      
    </adtFullscreenUi>
    <adtFullscreenUi ref={onFullScreenWaypointRef} name="WaypointManager" idealHeight = {window.innerHeight} idealWidth = {window.innerWidth}>
    {Waypoint&&Waypoint.length> 0&&Waypoint.map((value,key)=>value !== null &&(<RectGui key={key} ref={(ref)=>{refWaypointList.push(ref)}} data={[value.name,{scene:scene,context:context},"point"]}/>)) }
    </adtFullscreenUi>
    </>



  }
  else {return null}

    
  }
//   <RectGui key={key} ref={(ref)=>{refWaypointList.push(ref)}} data={[value.name,{scene:scene,context:context},null]}/> 
//