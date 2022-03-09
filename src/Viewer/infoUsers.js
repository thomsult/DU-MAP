
import { FindBody } from './Data';
import React,{useState,useRef} from "react";

import { Vector3 } from "@babylonjs/core";
import { Color3} from "@babylonjs/core/Maths/math.color";
import { Ray,RayHelper,MeshBuilder,Mesh, StandardMaterial } from "babylonjs";
import { Line, useBeforeRender } from "react-babylonjs";
const Scale = 0.00005

function ScaleValue(vec3,Scale){

    return new Vector3(vec3.x*Scale,vec3.y*Scale,vec3.z*Scale)
}
async function getPoints(coordonner,Scale){

    return  await parseCoordonner(coordonner).then((result)=>{
        return ScaleValue(result.coordonne, Scale);
    });

}
function formatCoordonne(unformattedCoord) {
    let fields = unformattedCoord.replace("::pos{","").replace("}","").split(',');
    if (fields.length < 5){
        return {error: true};
    }else{
        return {
            error: false,
            systemID: parseInt(fields[0]),
            planetID: parseInt(fields[1]),
            lat: parseFloat(fields[2]),
            long: parseFloat(fields[3]),
            height: parseFloat(fields[4]),
        };
    }
}

async function parseCoordonner(coordonner) {
    
    const deg2rad    = Math.PI/180
    //const rad2deg    = 180/Math.PI
    if(typeof coordonner === "string" && coordonner.includes("::pos")){
        let formatted = formatCoordonne(coordonner)
            if(!formatted.error && formatted.planetID !== 0){
                return FindBody(formatted.planetID).then((planete)=>{
                    //console.log(planete)
                    let radius = planete.radius;
                    let Center = planete.center

                    let height = formatted.height
                    let lat = formatted.lat*deg2rad
                    let long = formatted.long*deg2rad
                    let totalDistance =  height + radius;

                    let globalX = (Center[0] + totalDistance * Math.cos(lat)*Math.cos(long))
                    let globalY = (Center[1] + totalDistance * Math.cos(lat)*Math.sin(long))
                    let globalZ = (Center[2] + totalDistance * Math.sin(lat))
                    return {
                        error: "false",
                        message:'Les coordonner ce trouve sur '+planete.name[0],
                        coordonne: new Vector3(globalX,globalY,globalZ)
                    } })}
            else if(!formatted.error && formatted.planetID === 0){
                const promise = new Promise((resolve, reject) => {
                    resolve({
                        error: "false",
                        message:"les coordonner sont dans l'espace",
                        coordonne: new Vector3(formatted.long,formatted.lat,formatted.height)
                    })
                });
                return promise


            }
            
            else{
                const promise = new Promise((resolve, reject) => {
                    resolve({
                        error: "true",
                        message:'les coordonner ne sont pas bien formater',
                    })
                });
                return promise
            }
        
        
        
        }
    if (typeof coordonner === "object" && coordonner.length > 0){
        
        const promise = new Promise((resolve, reject) => {
            resolve({
                error: "false",
                message:'Les coordonner peuvent ne pas correspondre',
                coordonne: new Vector3(coordonner[0],coordonner[1],coordonner[2])
            })
          });
        return promise
    }
    
    else{
        const promise = new Promise((resolve, reject) => {
            resolve({
                error: "true",
                message:'les coordonner ne sont pas correcte',
                coordonne: new Vector3(0,0,0)
            })
          });
        return promise
    }


}






export  default function InfoUser()
{

/*    const worldVec = new BABYLON.Vector3(corArriver2.X,corArriver2.Y,corArriver2.Z)
const coords    = worldVec.subtract(Aliot)
const distance  = coords.length()
const altitude  = distance - AliotRadius */
const [count,setcount] = useState(0)
const Coordonner = [
    "::pos{0,2,30.8601,53.3687,-0.0000}",
    [238425.1186,311031.5552,-125195.9156],
    "::pos{0,0,1412187.3672,360396.1875,666238.9646}",
    "::pos{0,3,-2.5162,-123.9570,13569.2939}"
]

useBeforeRender(async (scene)  => {
    if(count === 0){
        setcount(count+1)
        const points = await Promise.all(Coordonner.map((el)=>getPoints(el,Scale))).then((Points)=>{return Points})
        new MeshBuilder.CreateLines("path",{points:points},scene)
        console.log("count") 
        
    }
    
}) 


 return null
}








