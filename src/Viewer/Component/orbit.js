import React,{useRef,useState,useContext} from "react";

import { Vector3 } from "@babylonjs/core";
import { Color3} from "@babylonjs/core/Maths/math.color";
import { Ray,RayHelper,MeshBuilder,Mesh, StandardMaterial, } from "babylonjs";
import { Scene, Tube, useBeforeRender, useScene } from "react-babylonjs";
import { IDContext,reducer } from '../../context'
const Scale = 0.00005;


 function Orbit(props){


    const Context = useContext(IDContext)
    const [Hide,sethide] = useState(Context.orbit)
  
    useBeforeRender(()=>{
  
      sethide(Context.orbit)
    })


    const Planet_info = props.params
    const parent = new Vector3(0,0,0)
    const Type = props.type
        const Moon = Type === undefined? new Vector3().copyFrom(parent):new Vector3().copyFrom(Planet_info)
        const Planet = Type === undefined? new Vector3().copyFrom(Planet_info):new Vector3().copyFrom(parent)
        
        const distance =  Vector3.Distance(Planet,Moon)
        const detail = 65;
        const pieDiv = 2/detail;
        const divArray = [];
        const radius = distance
            for(let i = 0; i < detail; i++){
                divArray.push(Math.PI*(pieDiv*i));
            }
            const newPath= [];
            for(let y = 0; y < divArray.length; y++){
                newPath.push(new Vector3((radius * Math.cos(divArray[y])), (0), (radius * Math.sin(divArray[y]))));
                }
                newPath.push(newPath[0]);
          return (
            <lines
            alpha={0.2}
            setEnabled={Hide}
            isPickable={false}
            name={"orbit"}
            points={newPath}
            color={Type === undefined?new Color3(0,1,0):new Color3(1,1,1)}
            onCreated={(lines)=>{lines.lookAt(Type === undefined?Planet:Moon)}}
          />
          )







}
function Pipe(props){
    const Aliot = new Vector3().fromArray(props.system[1].center.map((el) => el * Scale))//TargetDestination
    const centerSafeZone = new Vector3(13771471*Scale,7364470.4372*Scale,-128971*Scale)
    const po = Aliot.subtract(props.position) //destination
    const pos = new Vector3(0,0,0) //origin
    const scene = useScene()
    
    const Context = useContext(IDContext)
    const [Hide,sethide] = useState(Context.pipe)
  
    useBeforeRender(()=>{
  
      sethide(Context.pipe)
    })


const transform = useRef(null)
const  Tube =()=>{
    return new Promise(resolve => {
    if(transform.current !== null && scene){
        const triggerPl = transform.current.parent._children[0]._children.find((el)=>el.name.includes("Trigger"))
       

    let Path = []
    var localMeshDirection = po;
    var localMeshOrigin = new Vector3().copyFrom(props.position);
    var length = 1000000000000;
    var ray = new Ray(localMeshOrigin,localMeshDirection,length);
    function predicate(mesh) {
        if (mesh.name === "SafeZone Trigger") {
            mesh.computeWorldMatrix()
            return true;
        }
        return false;
    }
    
    
    
    var hit = scene.pickWithRay(ray,predicate);
    Path = [localMeshOrigin,
        hit.pickedPoint
    ]
    
    
    //console.log("read",Path,transform,scene)
    const radius = (5 * 200000)*Scale
if (Path.length > 0 && transform.current !== null){
        const mesh = new MeshBuilder.CreateTube(props.info.name[0]+" pipe",{path:Path,radius:radius,sideOrientation: Mesh.DOUBLESIDE},scene)
    const mat = new StandardMaterial(props.info.name[0]+"pipe mat",scene)
    mat.diffuseColor = new Color3(1, 1, 0)
    mat.specularColor = new Color3(0, 0, 0)
    mat.alpha = 0.14
    mesh.material = mat
    mesh.parent = transform.current
    
    resolve({state:true,val:"ok"})

    } 
}})}
const [loaded,setLoaded] = useState(false);
function Display(props){
    
    !loaded&&Tube().then((state)=>{setLoaded(state.state)})
    return null
}


//setLoaded(true)
//useBeforeRender(()=>drawray(scene))
//name={props.info.name[0]+" pipe"} path={Path} radius={radius} sideOrientation={Mesh.DOUBLESIDE}
//{path.length > 1&&<tube path={path} onCreated={(tube)=>{console.log(tube)}} radius={radius} name={props.info.name[0]+" pipe"} position={props.position} >
//console.log(props.info)

return <transformNode setEnabled={Hide} ref={transform} name={props.info.name[0]+" pipe"}><Display debug={true}/></transformNode>
}

export {Orbit,Pipe}