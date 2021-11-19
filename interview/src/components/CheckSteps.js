import React from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import "./CheckSteps.css";

function CheckSteps() {
    const { stepNo } = useParams();
    return (

        <div className="checksteps">

            <div className={stepNo == 1 ? 'active' : ''}>
                <Link to="/step/1" className="step__link">Step 1</Link>
            </div>
            <div className={stepNo == 2 ? 'active' : ''}>
                <Link to="/step/2" className="step__link">Step 2</Link>
            </div>
            <div className={stepNo == 3 ? 'active' : ''}>
                <Link to="/step/3" className="step__link">Step 3</Link>
            </div>
        </div >

    )
}

export default CheckSteps;
