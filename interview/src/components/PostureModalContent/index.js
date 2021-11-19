import React, { useEffect, useRef, useState } from 'react';
import './PostureModal.scss';
import { Button } from '@material-ui/core';
import CircularProgress from "@material-ui/core/CircularProgress";
import AnimationLoader from '../../components/AnimationLoader';
import scriptLoader from 'react-async-script-loader'
import * as tf from '@tensorflow/tfjs';
import * as tmPose from '@teachablemachine/pose';
let model, webcam, ctx, labelContainer, maxPredictions;

async function loop(timestamp) {
  // console.log('loop called');
  webcam.update(); // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  // console.log('predict called');

  // Prediction #1: run input through posenet
  // estimatePose can take in an image, video or canvas html element
  // console.log(webcam.canvas);
  const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
  // Prediction 2: run input through teachable machine classification model
  const prediction = await model.predict(posenetOutput);

  // for (let i = 0; i < maxPredictions; i++) {
  //   const classPrediction = prediction[i].className + ': ' + prediction[i].probability.toFixed(2);
  //   labelContainer.childNodes[i].innerHTML = classPrediction;
  // }

  if(prediction[0].probability>prediction[1].probability)
  
  labelContainer.innerHTML = "Good job, you seem in control of yourself";
  else 
  
  labelContainer.innerHTML = "You Seem a Bit Nervous, try opening up and relax a bit";



  // finally draw the poses
  drawPose(pose);
}

function drawPose(pose) {
  // console.log('draw called');

  if (webcam.canvas) {
    ctx.drawImage(webcam.canvas, 0, 0);

    // draw the keypoints and skeleton
    // if (pose) {
    //   const minPartConfidence = 0.5;
    //   window.tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
    //   window.tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
    // }
  }
}

function PostureModal({ setter,isScriptLoaded, isScriptLoadSucceed }) {
  const canvasRef = useRef();
  const labelRef = useRef();
  const modalRef = useRef();
  const statusRef = useRef();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    // <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js"></script>
    // <script src="https://cdn.jsdelivr.net/npm/@teachablemachine/pose@0.8/dist/teachablemachine-pose.min.js"></script>
    // if (canvasRef.current && labelRef.current && modalRef && isScriptLoaded && isScriptLoadSucceed ) {
    if (canvasRef.current && labelRef.current && modalRef ) {

      const URL = '/my-pose-model/';
      const modelURL = URL + 'model.json';
      const metadataURL = URL + 'metadata.json';
      console.log("model loading")
      // statusRef.current.innerHTML = "model loading"
      tmPose.load(modelURL, metadataURL).then(model1 => {
      setLoading(false);
      // console.log("status ref", statusRef);

        model = model1;
        maxPredictions = model.getTotalClasses();
        const size = 300
       // const size = 80 * window.innerWidth / 100;
        // const hSize = 100 * window.innerHeight / 100;

        const flip = true; // whether to flip the webcam
        webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
        webcam.setup().then(() => {
          webcam.play().then(() => {
            window.requestAnimationFrame(loop);
            const canvas = canvasRef.current;
            // const canvas = document.getElementById('canvas');
            // console.log(canvasRef);
            canvas.width = size;
            canvas.height = size;
            ctx = canvas.getContext('2d');
            labelContainer = labelRef.current;
            for (let i = 0; i < maxPredictions; i++) {
              // and class labels
              labelContainer.appendChild(document.createElement('div'));
            }
          });
        });
      });
    }
  }, [canvasRef, labelRef, modalRef,isScriptLoaded, isScriptLoadSucceed]);

  const handleClose = () => {
    setter(false);
  };

  return (
    <div className='modal-body' ref={modalRef}>
      <div>Posture Assesment</div>
      {loading && <div className="loading" ref={statusRef}>
      <AnimationLoader />
      <br/><br/>
      MODEL LOADING
      </div>}
      <div>
        <canvas id='canvas' ref={canvasRef}></canvas>
        <div ref={labelRef} className="result" id='label-container'></div>
      </div>

      <Button className='close-btn' onClick={() => handleClose()}>
        &#10005;
      </Button>
    </div>
  );
}

// export default scriptLoader(
//     "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js",
//     "https://cdn.jsdelivr.net/npm/@teachablemachine/pose@0.8/dist/teachablemachine-pose.min.js"
// )(PostureModal);

export default PostureModal;
