import "./App.css";
import React, { useRef,useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
//old modal
import * as facemesh from "@tensorflow-models/facemesh";
//https://www.tensorflow.org/js/models
// NEW MODEL
//import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import { drawFaceMesh } from "../src/utilities";
function App() {
  //setup webcam and canvas
  const setWebCamRef = useRef(null);
  const setCanvasRef = useRef(null);
  //load facemesh
  const loadFaceMesh = async () => {
    //load neural network modal
    const neuralNetwork = await facemesh.load({
      inputResolution: { width: 640, height: 640, scale: 0.8 },
    });
    setInterval(() => {
      detect(neuralNetwork);
    }, 100);
  };
  // detect face funciton
  const detect = async (neuralNetwork) => {
    
    //if statemnt check if our camera is up, running and in recievivng state
    if (
      typeof setWebCamRef.current !== "undefined" &&
      setWebCamRef.current !== null &&
      setWebCamRef.current.video.readyState === 4
    ) {
      //Get video properties
      const video = setWebCamRef.current.video;
      const videoWidth = setWebCamRef.current.video.videoWidth;
      const videoHeight = setWebCamRef.current.video.videoHeight;
      //set video properties
      setWebCamRef.current.video.width = videoWidth;
      setWebCamRef.current.video.height = videoHeight;
      //set canvas width
      setCanvasRef.current.height = videoHeight;
      setCanvasRef.current.width = videoWidth;
      //make detections
      const face = await neuralNetwork.estimateFaces(video);
      console.log(face);
      //get canvas context for drawing

      const ctx = setCanvasRef.current.getContext("2d");
      requestAnimationFrame(() => {
        drawFaceMesh(face, ctx);
       
        
      });
    }
  };
  useEffect(() => {
    loadFaceMesh();
  
  }, []);
  
  

  return (
    <div className="App">
      <body className="App-header">
        <Webcam ref={setWebCamRef}
        className="cameraBox"
        // style={{
        //   position: "absolute",
        //   marginLeft: "auto",
        //   marginRight: "auto",
        //   left: 0,
        //   right: 0,
        //   textAlign: "center",
        //   zindex: 9,
        //   width: 640,
        //   height: 480,
        // }}
        />
        <canvas ref={setCanvasRef} className="cameraBox" 
        // style={{
        //     position: "absolute",
        //     marginLeft: "auto",
        //     marginRight: "auto", 
        //     left: 0,
        //     right: 0,
        //     textAlign: "center",
        //     zindex: 9,
        //     width: 640,
        //     height: 480,
        //   }}
          />

        <div className="msgBox">
          <h1>Face Detection!</h1>
          <p>
            Facial Recognition
             allows to detect
              different points 
              on your face 
              including mouth,eyes,nose ,ears etc.
              The modal used in this video detects 4863D facial landmaks to infer the geometry of human face.
            Are you curious,
             how facial recognition
              and emotion analysis applications are made? Heres the first step. checkout interesting code on github
          </p>
          </div>
      
      </body>
    </div>
  );
}

export default App;
