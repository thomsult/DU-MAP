import React, { Component } from 'react';
import { Engine } from 'react-babylonjs'
import Viewer from './Viewer/'; 
import {DatGUI} from './components/ReactDatGui'
import { IDContext } from './context'





export default class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = { width: 0, height: 0};
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }



  render() {
    return (
      <div className="App">
       
      <Engine antialias={true} width={this.state.width} height={this.state.height} adaptToDeviceRatio={true} canvasId="sample-canvas" debug={true}>
        
        <Viewer />
      
      </Engine>
      <DatGUI/>
      </div>
      
    );
  }
  
}
App.contextType = IDContext;

