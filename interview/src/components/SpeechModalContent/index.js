import React, { useEffect, useRef, useState } from 'react';
import scriptLoader from 'react-async-script-loader';
import CircularProgress from '@material-ui/core/CircularProgress';
import AnimationLoader from '../../components/AnimationLoader';
import 'splitting/dist/splitting.css';
import 'splitting/dist/splitting-cells.css';
import Splitting from 'splitting';
import { Button } from '@material-ui/core';
import './SpeechModalContent.scss';
import * as speechCommands from '@tensorflow-models/speech-commands';
const URL = 'https://teachablemachine.withgoogle.com/models/Nejb6_rXL/';
let recognizer;


function SpeechModalContent({ setter, isScriptLoaded, isScriptLoadSucceed }) {
  const [loading, setLoading] = useState(true);
  const labelRef = useRef();
  const textRef = useRef();

  useEffect(() => {
    async function integrationFunction() {
      if (isScriptLoaded && isScriptLoadSucceed && labelRef) {
        async function createModel() {
          const checkpointURL = URL + 'model.json'; // model topology
          const metadataURL = URL + 'metadata.json'; // model metadata

          // const recognizer = window.speechCommands.create(
          const recognizer = speechCommands.create(

            'BROWSER_FFT', // fourier transform type, not useful to change
            undefined, // speech commands vocabulary feature, not useful for your models
            checkpointURL,
            metadataURL
          );

          // check that model and metadata are loaded via HTTPS requests.
          await recognizer.ensureModelLoaded();

          return recognizer;
        }

        recognizer = await createModel();
        setLoading(false);
        const classLabels = recognizer.wordLabels(); // get class labels
        const labelContainer = labelRef.current;
        for (let i = 0; i < classLabels.length; i++) {
          labelContainer.appendChild(document.createElement('div'));
        }

        // listen() takes two arguments:
        // 1. A callback function that is invoked anytime a word is recognized.
        // 2. A configuration object with adjustable fields
        recognizer.listen(
          result => {
            const scores = result.scores; // probability of prediction for each class
            // render the probability scores per class
            // for (let i = 0; i < classLabels.length; i++) {
            //   const classPrediction = classLabels[i] + ': ' + result.scores[i].toFixed(2);
            //   labelContainer.childNodes[i].innerHTML = classPrediction;
            // }
            // if (result.scores[0] > 0.5) textRef.current.innerHTML = noiseHTML;
            // else if (result.scores[1] > 0.5) textRef.current.innerHTML = fluentHTML;
            // else if (result.scores[2] > 0.5) textRef.current.innerHTML = stutteringHTML;
            // animateStuff();
            // Splitting();

            if (result.scores[0] > 0.5) labelRef.current.innerHTML = "There is noise in your surrounding";
            else if (result.scores[1] > 0.5) labelRef.current.innerHTML = "Keep Going, You are FLUENT AF!";
            else if (result.scores[2] > 0.5) labelRef.current.innerHTML = "Calm down a bit, You are STUTTERING";
          },
          {
            includeSpectrogram: true, // in case listen should return result.spectrogram
            probabilityThreshold: 0.75,
            invokeCallbackOnNoiseAndUnknown: true,
            overlapFactor: 0.5, // probably want between 0.5 and 0.75. More info in README
          }
        );
      }
    }
    integrationFunction();
    // animation code below
    Splitting();
    const OBJ = 'h2 > div span';
    let flag = 1; // flag to not multiply events
    window.addEventListener('click', function () {
      if (!flag) return; // if event is on, exit
      flag = !flag;
      var audioContext = window.AudioContext || window.webkitAudioContext;
      // variables
      var analyserNode,
        frequencyData = new Uint8Array(128);
      const allRepeatedEls = document.querySelectorAll(OBJ),
        totalEls = allRepeatedEls.length;

      // create audio class
      if (audioContext) {
        var audioAPI = new audioContext(); // Web Audio API is available.
      } else {
        /* ERROR HANDLING */
      }

      // main animation func
      function animateStuff() {
        requestAnimationFrame(animateStuff);
        analyserNode.getByteFrequencyData(frequencyData);
        // loop and refreq all with nice matrix style
        for (let i = 0; i < totalEls; i++) {
          // range is 0 - 255 * 1.2 / 100 =~ 0-3
          var rang = Math.floor((i / totalEls) * frequencyData.length); // find equal distance in haystack
          var FREQ = frequencyData[rang] / 255;
          // set minimal opacity to 20%
          allRepeatedEls[i].style.opacity = FREQ + 0.2;
          // matrix set Y only [ matrix(X, 0, 0, Y, 0, 0) ]
          allRepeatedEls[i].style.transform = 'matrix(1, 0, 0, ' + (FREQ * 2 + 1) + ', 0, 0)';
          // set color to:
          // allRepeatedEls[i].style.color = colorArr[ Math.floor( Math.random()*colorArr.length ) ] ;
        }
      }

      // create an audio API analyser node and connect to source
      function createAnalyserNode(audioSource) {
        analyserNode = audioAPI.createAnalyser();
        analyserNode.fftSize = 2048;
        audioSource.connect(analyserNode);
      }

      // getUserMedia success callback -> pipe audio stream into audio API
      var gotStream = function (stream) {
        // Create an audio input from the stream.
        var audioSource = audioAPI.createMediaStreamSource(stream);
        createAnalyserNode(audioSource);
        animateStuff();
      };

      setTimeout(function () {
        console.log(frequencyData);
      }, 5000);

      // pipe in analysing to getUserMedia
      navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(gotStream);
    });

    return () => {
      //   recognizer.stopListening();
    };
  }, [isScriptLoaded, isScriptLoadSucceed, labelRef]);

  const handleClose = () => {
    recognizer.stopListening();
    setter(false);
  };

  return (
    <div className='modal-body'>
      <div>Speech Assesment</div>
      {loading && (
        <div className='loading'>
          <AnimationLoader />
          <br></br>
          MODEL LOADING
        </div>
      )}
      <h2>
        <div className='animation-text' id={loading ? 'hide' : ''} ref={textRef} data-splitting=''>
          ||||||||||||||||
        </div>
      </h2>
      <div ref={labelRef} className='result' id='label-container'></div>
      <Button className='close-btn' onClick={handleClose}>
        &#10005;
      </Button>
    </div>
  );
}

export default scriptLoader(
  // 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js',
  'https://cdn.jsdelivr.net/npm/@tensorflow-models/speech-commands@0.4.0/dist/speech-commands.min.js'
)(SpeechModalContent);
