import React, { Component, useContext } from 'react';
import { Engine } from 'react-babylonjs'
import Viewer from './Viewer/'; 
import {DatGUI} from './components/ReactDatGui'
import { IDContext } from './context'
import "./app.css"




export default class App extends Component {
  render() {
    return (
      <div className="App">
       
      <Engine antialias={true} adaptToDeviceRatio={true} canvasId="sample-canvas" debug={true}>
        
        <Viewer />
      
      </Engine>
      <DatGUI/>
      </div>
      
    );
  }
  
}
App.contextType = IDContext;

