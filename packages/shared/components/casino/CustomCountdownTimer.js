import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { setGlobalVar } from '../../utils/Constants';
import '../../css/custom-countdown.css';

function CustomCountdownTimer({ data }) {
    const [timeLeft, setTimeLeft] = useState(0);
    const [digits, setDigits] = useState(['0', '0']); // [tens of seconds, seconds]
    const [prevDigits, setPrevDigits] = useState(['0', '0']); // Previous digits for flip animation

    useEffect(() => {
        const t1lt = data?.t1?.lt || 0;
        const lt = data?.lt || 0;
        const maxLt = Math.max(t1lt, lt);
        
        if (maxLt > 0) {
            setTimeLeft(maxLt);
            setGlobalVar(maxLt);
        } else {
            setTimeLeft(0);
        }
    }, [data?.lt, data?.t1?.lt]);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    useEffect(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        const tensOfSeconds = Math.floor(seconds / 10);
        const onesOfSeconds = seconds % 10;
        
        const newDigits = [
            tensOfSeconds.toString(),
            onesOfSeconds.toString()
        ];
        
        // Only update if digits actually changed
        if (JSON.stringify(newDigits) !== JSON.stringify(digits)) {
            setPrevDigits(digits);
            setDigits(newDigits);
        }
    }, [timeLeft]);

    const renderDigit = (currentDigit, prevDigit, index) => {
        return (
            <ul key={`${index}-${currentDigit}`} className="flip play">
                <li className="flip-clock-before">
                    <a href="#">
                        <div className="up">
                            <div className="shadow"></div>
                            <div className="inn">{prevDigit}</div>
                        </div>
                        <div className="down">
                            <div className="shadow"></div>
                            <div className="inn">{prevDigit}</div>
                        </div>
                    </a>
                </li>
                <li className="flip-clock-active">
                    <a href="#">
                        <div className="up">
                            <div className="shadow"></div>
                            <div className="inn">{currentDigit}</div>
                        </div>
                        <div className="down">
                            <div className="shadow"></div>
                            <div className="inn">{currentDigit}</div>
                        </div>
                    </a>
                </li>
            </ul>
        );
    };

    return (
        <div 
            className="clock flip-clock-wrapper float-right"
            
        >
            {digits.map((digit, index) => {
                return renderDigit(digit, prevDigits[index], index);
            })}
        </div>
    );
}

export default CustomCountdownTimer;
