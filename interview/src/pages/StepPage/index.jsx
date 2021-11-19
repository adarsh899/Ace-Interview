import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import posture from '../../assets/images/posture.png';
import speech from '../../assets/images/speech2.png';
import expression from '../../assets/images/expression.jpg';
import Button from '@material-ui/core/Button';
import PostureModalContent from '../../components/PostureModalContent';
import SpeechModalContent from '../../components/SpeechModalContent';
import ExpressionModalContent from '../../components/ExpressionModalContent';
import Modal from '@material-ui/core/Modal';
import CheckSteps from '../../components/CheckSteps';
import IconButton from '@material-ui/core/IconButton';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { Link } from "react-router-dom";
import './StepPage.scss';
const stepData = {
  1: {
    heading: 'Correct Posture',
    desc:
      "A confident sitting posture is very important as it tells a lot about your preparation level. Interviewers also evaluate whether you'll be able to handle the work pressure or not based on this factor.",
    buttonText: 'Assess Your Posture',
  },
  2: {
    heading: 'Fluent Speech',
    desc:
      "You may look good on paper or in your interview suit, but if you're looking to nail your big interview, looks aren't everything. How you sound is often more important.",
    buttonText: 'Assess Your Fluency',
  },
  3: {
    heading: 'Right Facial Expressions',
    desc:
      "One of interviewers' top complaints about interviewees is that they fail to show sufficient enthusiasm; a smile is the best way to show how much you want the job. A warm smile is especially important when you first meet your interviewer.",
    buttonText: 'Assess Your Expressions',
  },
};

export default function StepPage() {
  const { stepNo } = useParams();
  const [open, setOpen] = useState(false);
  // const [openPosture, setOpenPosture] = useState(false);
  // const [openSpeech, setOpenSpeech] = useState(false);
  // const [openExpression, setOpenExpression] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className='step-page'>
      <CheckSteps />
      <div className="steppage__backIcon">
        <Link to="/">
          <IconButton size="small">
            <HomeOutlinedIcon className="steppage__homeicon" fontSize="large" />
          </IconButton>
        </Link>

        <div className='step-title'>Step {stepNo}</div>
      </div>
      <div className='step-heading'>{stepData[stepNo].heading}</div>

      {
        {
          1: <img src={posture} className="posture__image" alt='' />,
          2: <img src={speech} className="speech__image" alt='' />,
          3: <img src={expression} className="expression__image" alt='' />,
        }[stepNo]
      }

      <div className='step-desc'>{stepData[stepNo].desc}</div>
      {/* <Button
        variant='contained'
        color='secondary'
        onClick={handleOpen}
      // onClick={() => {
      // switch (stepNo) {
      //   case '1':
      //     setOpenPosture(true);
      //     break;
      //   case '2':
      //     setOpenSpeech(true);
      //     break;

      //   case '3':
      //     setOpenExpression(true);
      //     break;
      // }

      // }}
      >
        {stepData[stepNo].buttonText}
      </Button> */}
      {/* onClick={handleOpen} */}
      <div className="animated-button2" >
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        {stepData[stepNo].buttonText}
      </div>

      {/* {
        {
          1: <PostureModalContent openPosture={openPosture} setter={setOpenPosture} />,
          //   2: <img src={speech} alt='' srcset='' />,
          //   3: <img src={expression} alt='' srcset='' />,
        }[stepNo]
      } */}
      <Modal
        open={open}
        className="overlay"
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {
          {
            1: <PostureModalContent setter={setOpen} />,
            2: <SpeechModalContent setter={setOpen} />,
            3: <ExpressionModalContent setter={setOpen} />,
          }[stepNo]
        }
      </Modal>

    </div>
  );
}
