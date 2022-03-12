import React ,{useRef,useState,useCallback}from 'react';

import Helios from './Helios';
import { Scene,Skybox} from 'react-babylonjs'
import { Vector3,Color3, Texture  } from '@babylonjs/core';



export default function Viewer(){
  var cubeTextureNode = null;
  var cubeTextureClone = null;
  var route = '../../assets/textures/' 
  const [texturesLoaded, setTexturesLoaded] = useState(false);
  const cubeTextureRef = useCallback(node => {
    if (node && texturesLoaded === false) {
      setTexturesLoaded(true); // trigger render and props assignment
      cubeTextureNode = node;

      cubeTextureClone = cubeTextureNode.clone();
      cubeTextureClone.name = 'cloned texture'
      cubeTextureClone.coordinatesMode = Texture.SKYBOX_MODE;
    }
  }, []);
  //          <cubeTexture ref={cubeTextureRef} name="cubeTexture" rootUrl={SkyboxTexture} createPolynomials={true} format={undefined} prefiltered={true}/>

   return (
           <Scene name="Helios" ambientColor={new  Color3(1, 1, 1)} clearColor={new Color3.Black()}>
                <arcRotateCamera
          name="camera1"
          target={Vector3.Zero()}
          alpha={Math.PI / 3}
          beta={Math.PI / 4}
          radius={8}
          minZ={1} maxZ={100000} lowerRadiusLimit={10} wheelPrecision={0.5}
        />
            
            <hemisphericLight name="light1" intensity={0.7} direction={Vector3.Up()} />
            
            <Skybox size={100000} rootUrl={route}></Skybox>

      <Helios/>
          </Scene>
        )
    }