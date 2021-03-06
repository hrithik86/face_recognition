import React, { Component } from 'react';
import Navigation from "./components/Navigation/Navigation.js";
import Logo from "./components/Logo/Logo.js";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm.js";
import './App.css';
import Rank from "./components/Rank/Rank.js";
import Particles from 'react-particles-js';
import Clarifai from "clarifai";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition.js";
// import keys from "./config/keys";

const app = new Clarifai.App({
  apiKey: "cc9278a220044c2686b165d5954aac55"
 });

const particlesOptions={
  particles: {
      number:{
        value:100,
        density:{
        enable:true,
        value_area:800
        }
      }
  }
}

class App extends Component {
  
  constructor(){
    super();
    this.state={
      input:"",
      imageUrl:"",
      box:{}
    }
  }
  
  calculateFaceLocation =(data)=>{
  const clarifaiFace=data.outputs[0].data.regions[0].region_info.bounding_box;
  const image =document.getElementById("inputimage");
  const width=Number(image.width);
  const height=Number(image.height);
  console.log(width, height);
  return{
    leftCol:clarifaiFace.left_col * width,
    topRow:clarifaiFace.top_row*height,
    rightCol:width- (clarifaiFace.right_col*width),
    bottomRow:height-(clarifaiFace.bottom_row*height),
  }
}

displayFaceBox=(box)=>{
  console.log(box);
  this.setState({box:box});
}

onInputChange =(event)=>{
    this.setState({input:event.target.value});
  }

  onButtonSubmit=()=>{
    this.setState({imageUrl:this.state.input})
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
        .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
        .catch(err => console.log(err));  
  }

  render() {
    return (
      <div className="App">
       <Particles className="particles"
          params={particlesOptions} 
        />
       <Navigation />
       <Logo />
       <Rank />
       <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
       <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
      </div>
    );
  }
}

export default App;
