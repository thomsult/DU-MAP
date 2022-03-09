import React ,{useRef}from 'react';

import Helios from './Helios';
import { ArcRotateCamera, Scene,useScene} from 'react-babylonjs'
import { Vector3,Color3,  } from '@babylonjs/core';
import "@babylonjs/core/Debug/debugLayer"; // Augments the scene with the debug methods
import "@babylonjs/inspector"; // Injects a local ES6 version of the inspector to prevent automatically relying on the none compatible version


export default function Viewer(){ 
  
   return (
           <Scene name="Helios" ambientColor={new  Color3(1, 1, 1)} clearColor={new Color3.Black()}>
                <ArcRotateCamera
          name="camera1"
          target={Vector3.Zero()}
          alpha={Math.PI / 3}
          beta={Math.PI / 4}
          radius={8}
          minZ={1} maxZ={100000} lowerRadiusLimit={10} wheelPrecision={0.5}
        />
            
            <hemisphericLight name="light1" intensity={0.7} direction={Vector3.Up()} />
              <Helios/>
            
          </Scene>
        )
    }