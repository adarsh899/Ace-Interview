import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import AnimationLoader from '../../components/AnimationLoader';

import * as faceapi from '@vladmandic/face-api/dist/face-api.node.nobundle.js';
// import * as faceapi from 'face-api.js';

export default function ExpressionModalContent({ setter }) {
  const [loading, setLoading] = useState(true);
  const videoRef = useRef();
  const canvasRef = useRef();
  const labelRef = useRef();
  const videoHeight = 300;
  const videoWidth = 300;
  let faceApiInterval;
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]).then(startVideo);
    };
    loadModels();
  }, []);
  function startVideo () {
    navigator.getUserMedia({
      video: true,
  },
      stream => videoRef.current.srcObject = stream,
      err => console.error(err)
  );
  }
  const handleClose = () => {
    clearInterval(faceApiInterval);
    setter(false);
  };

  const handleVideoOnPlay = () => {
    const labelContainer = labelRef.current;
    faceApiInterval = setInterval(async ()=>{
      console.log("running")
      if(loading)
      setLoading(false);
      if (!videoRef.current) return;
      try{const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions).withFaceLandmarks().withFaceExpressions();
      console.log(detections);
      if(detections[0].expressions.happy<0.5)
      // console.log("nervous");
      labelContainer.innerHTML = "Cheer Up a bit";
      else 
      // console.log("confident");
      labelContainer.innerHTML = "You seem cheerful today, good going";
    }
      catch(err){
        console.log("handling")
      }
    },100)
  }
  return (
    <div className='modal-body'>
      <div>Expression Assesment</div>
      {loading && (
        <div className='loading'>
          <AnimationLoader />
          <br></br>
          MODEL LOADING
        </div>
      )}
      <video ref={videoRef} autoPlay muted height={videoHeight} width ={videoWidth} onPlay={handleVideoOnPlay}/>
      <canvas ref={canvasRef}/>
      <div ref={labelRef} className='result' id='label-container'></div>
      <Button className='close-btn' onClick={() => handleClose()}>
        &#10005;
      </Button>
    </div>
  );
}
