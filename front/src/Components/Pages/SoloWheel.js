import Wrapper from '../PageElements/Wrapper';
import Content from '../PageElements/Content';
import Tabbar from '../PageElements/Tabbar';
import wheel from '../../Images/wheel.png';
import ball from '../../Images/ball.png';
import ReactDOM from 'react-dom/client';
import { messageSend } from '../../App';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon28ChevronBack } from '@vkontakte/icons';
import { keyframes } from 'styled-components';

const getNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const blackNumbers = [
    13, 24, 15, 22, 17, 20, 11, 26, 28,
    2, 35, 4, 33, 6, 31, 8, 29, 10
]

let bets = [];
let result = [];
let a;
let b;
let aaa = 0;
const num = getNumber(0, 37);

const SoloWheel = ({ coins, hash, md5, ballDeg, isStart, winnumber, setStartFalse, savedBets, checkLastGame, isShowCheck, isShowResult, setShowCheck, setShowResult, startGame, setStartGame, lastGame, startt }) => {
    useEffect(() => {
        messageSend('joinToSoloWheel');

        aaa = 0;
        setStartGame(false);
        setShowCheck(false);
        setShowResult(false);
    }, [])

    const [isShowBets, setShowBets] = useState(false);
    const [data, setData] = useState({
        betAmount: 0,
        modifedBets: [],
        number: num,
        ballAnimation: {}
    })

    const { betAmount, modifedBets, ballAnimation } = data;

    const intToString = (num) => {
        num = num.toString().replace(/[^0-9.]/g, '');

        if (num < 1000) {
            return num;
        }

        let si = [
          {v: 1E3, s: "K"},
          {v: 1E6, s: "M"},
          {v: 1E9, s: "B"},
          {v: 1E12, s: "T"},
          {v: 1E15, s: "P"},
          {v: 1E18, s: "E"}
        ]

        let index

        for (index = si.length - 1; index > 0; index--) {
            if (num >= si[index].v) {
                break;
            }
        }

        return (num / si[index].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[index].s;
    }

    if (savedBets) {
        if (aaa === 0) {
            savedBets.forEach((e) => {
                const { type, amount, date } = e;
    
                bets.push({ preview: type, amount: parseInt(amount), date: date, color: 'primary' });

                result = Object.values(bets.reduce((acc, item) => {    
                    if (!acc[item.preview]) {
                        acc[item.preview] = {...item};
                    } else {
                        acc[item.preview].amount = +acc[item.preview].amount + +item.amount;
                    }
        
                    return acc;
                }, {}))
        
                result.sort((a,b) => {
                    return a.date - b.date;
                })
                
                const normalBets = [];
        
                for (let i = 0; i < result.length; i++) {
                    const { preview, amount, color } = result[i];
                    const children = (
                        <div className='bets__item'>
                            <div className='bets__preview'>{preview}</div>
                            <div className={`bets__title bets__title_${color}`}>{intToString(amount)}</div>
                        </div>
                    )
        
                    normalBets.push(children);
                }
        
                setData((prevState) => {
                    return {
                        ...prevState,
                        modifedBets: normalBets
                    }
                })
            })

            aaa = 1;
            setShowBets(true);
        }
    }

    const clearAll = () => {
        bets = [];
        result = [];
        
        setStartFalse();
        clearTimeout(a);
        clearTimeout(b);
        messageSend('leaveFromSoloWheel');
    }

    const start = (balldeg) => {
        if (bets.length === 0) return;

        const wheel = document.getElementsByClassName('wheel')[0];
        const ball = document.getElementsByClassName('ball')[0];
        const numbers = {
            0: 180, 1: 9.473684, 2: 189.473684,
            3: 47.3684211, 4: 227.368416, 5: 85.263156,
            6: 265.263152, 7: 123.157892, 8: 303.157888,
            9: 161.052628, 10: 341.052624, 11: 132.631576,
            12: 312.631572, 13: 19.487368, 14: 198.947364,
            15: 56.842104, 16: 236.8421, 17: 94.73684,
            18: 274.736836, 19: 293.684204, 20: 113.684208,
            21: 255.789468, 22: 75.789472, 23: 217.894732,
            24: 37.894736, 25: 331.57894, 26: 151.578944,
            27: 350.526308, 28: 170.526312, 29: 322.105256,
            30: 142.10526, 31: 284.21052, 32: 104.210524,
            33: 246.315784, 34: 66.315788, 35: 208.421048,
            36: 28.421052, 37: 0
        }
        const deg = balldeg;

        wheel.style = 'transform: rotate(2520deg)';

        const ballSpin = keyframes`
            from { transform: rotate(0deg) translateY(-26px); }
            to { transform: rotate(${deg}deg) }
        `;

        setTimeout(() => {
            setData((prevState) => {
                return {
                    ...prevState,
                    ballAnimation: {
                        animation:  `${ballSpin} 13s cubic-bezier(0, 0, 0.2, 1)`
                    }
                }
            })
        }, 10);

        a = setTimeout(() => {
            ball.style=`transform: rotate(-${numbers[winnumber]}deg)`;

            let even = winnumber % 2 === 0 && winnumber > 0 ? true : winnumber === 0 ? 0 : false;
            let black = winnumber === 0 ? 0 : false;
            let interval1 = winnumber > 0 && winnumber <= 18 ? '1-18' : winnumber > 0 && winnumber <= 36 && winnumber > 18 ? '19-36' : 0;
            let interval2 = winnumber <= 12 && winnumber > 0 ? '1-12' : winnumber <= 24 && winnumber > 0 ? '13-24' : winnumber === 0 ? '0' : '25-36';
            
            blackNumbers.forEach((e) => {
                if (e !== winnumber) return;

                black = true;
            })

            if (winnumber === 37) {
                even = 0;
                black = 0;
                interval1 = 0;
                interval2 = '0';
              }

            const bets2 = [];
            
            result.forEach((e) => {
                const { amount, preview } = e;
                let color;
                let amount2 = 0;

                if (preview === winnumber) {
                    amount2 += amount * 36;
                    color = 'win';
                }
                if (interval1 !== 0) {
                    if (preview === interval1) {
                        amount2 += amount * 2;
                        color = 'win';
                    }
                }
                if (interval2 !== 0) {
                    if (preview === interval2) {
                        amount2 += amount * 3;
                        color = 'win';
                    }
                }
                if (black) {
                    if (preview === 'черн') {
                        amount2 += amount * 2;
                        color = 'win';
                    }
                } else if (black !== 0 && black === false) {
                    if (preview === 'красн') {
                        amount2 += amount * 2;
                        color = 'win';
                    }
                }
                if (even) {
                    if (preview === 'четн') {
                        amount2 += amount * 2;
                        color = 'win';
                    }
                } else if (even !== 0 && even === false) {
                    if (preview === 'нечет') {
                        amount2 += amount * 2;
                        color = 'win';
                    }
                }
                
                if (color !== 'win') color = 'lose';
                if (amount2 === 0) amount2 = amount;

                bets2.push({ preview: preview, amount: amount2, date: e.date, color: color });
            })

            const betsList = ReactDOM.createRoot(document.getElementsByClassName('bets__items')[0]);
            const bets3 = [];

            for (let i = 0; i < bets2.length; i++) {
                const { preview, amount, color } = bets2[i];
                const children = (
                    <div className='bets__item'>
                        <div className='bets__preview'>{preview}</div>
                        <div className={`bets__title bets__title_${color}`}>{intToString(amount)}</div>
                    </div>
                )
    
                bets3.push(children);
            }
            betsList.render(bets3);

            setShowResult(true);

        }, 13000);

        b = setTimeout(() => {
            setStartGame(false);
            setShowBets(false);
            setShowResult(false);
            
            wheel.style='';
            ball.style='';
            setData((prevState) => {
                return {
                    ...prevState,
                    ballAnimation: {}
                }
            })
            bets = [];
            result = [];

            setShowCheck(false);
            setStartFalse();
        }, 16050);
    }

    if (isStart) {
        start(ballDeg);
    }

    if (ballAnimation !== {}) setStartFalse();

    const handleChange = (event) => {
        const value = event.target.value;

        setData((prevState) => {
            return {
                ...prevState,
                betAmount: value
            }
        })
    }

    const addBet = (preview, amount) => {
        const aaaa = checkLastGame();

        if (amount <= 0 || coins < amount ) return;
        if (startGame && !aaaa) return;

        setShowBets(true);
        messageSend('addSoloBet', { amount: amount, type: preview });

        bets.push({ preview: preview, amount: parseInt(amount), date: Date.now(), color: 'primary' });

        result = Object.values(bets.reduce((acc, item) => {    
            if (!acc[item.preview]) {
                acc[item.preview] = {...item};
            } else {
                acc[item.preview].amount = +acc[item.preview].amount + +item.amount;
            }

            return acc;
        }, {}))

        result.sort((a,b) => {
            return a.date - b.date;
        })
        
        const normalBets = [];

        for (let i = 0; i < result.length; i++) {
            const { preview, amount, color } = result[i];
            const children = (
                <div className='bets__item'>
                    <div className='bets__preview'>{preview}</div>
                    <div className={`bets__title bets__title_${color}`}>{intToString(amount)}</div>
                </div>
            )

            normalBets.push(children);
        }

        setData((prevState) => {
            return {
                ...prevState,
                modifedBets: normalBets
            }
        })
    }

return(
    <Wrapper>
        <div className='header'>
            <div className='header__content'>
                <Link to='/games' className='header__icon' onClick={() => {clearAll()}}>
                    <Icon28ChevronBack width={32} height={32}/>
                </Link>
                <div className='header__title header__title_l'>Solo Wheel</div>
            </div>
        </div>
        <Content>
            <div className='balance'>{coins.toLocaleString()} LS</div>
            <div className='div'>
                <img className={`${startGame ? 'wheel wheel_start' : 'wheel'}`} src={wheel} alt=''></img>
                <img className={`${startGame ? 'ball ball_start' : 'ball'}`} style={ballAnimation} src={ball} alt=''></img>
                {isShowResult ?
                    <div className='div__result-wrap'>
                        <div className='div__result'>{winnumber}</div>
                    </div>
                : ''}
            </div>
            {isShowBets ?
                <div className='bets'>
                    <div className='bets__title bets_title_f'>Ваши ставки:</div>
                    <div className='bets__items'>{modifedBets}</div>
                </div>
            : ''}
            <input className='input-bet' placeholder='Введите ставку' onChange={handleChange}></input>
            <div className='bet-buttons'>
                <div className='bet-buttons__title'>Стол ставок</div>
                <div className='row'>
                    <div className='bet-buttons__button' onClick={() => {addBet('красн', betAmount)}}>Красное</div>
                    <div className='bet-buttons__button' onClick={() => {addBet('черн', betAmount)}}>Черное</div>
                </div>
                <div className='row'>
                    <div className='bet-buttons__button' onClick={() => {addBet('четн', betAmount)}}>Четное</div>
                    <div className='bet-buttons__button' onClick={() => {addBet('нечет', betAmount)}}>Нечетное</div>
                </div>
                <div className='row'>
                    <div className='bet-buttons__button' onClick={() => {addBet('1-18', betAmount)}}>1-18</div>
                    <div className='bet-buttons__button' onClick={() => {addBet(0, betAmount)}}>0</div>
                    <div className='bet-buttons__button' onClick={() => {addBet('19-36', betAmount)}}>19-36</div>
                </div>
                <div className='row'>
                    <div className='bet-buttons__button' onClick={() => {addBet('1-12', betAmount)}}>1-12</div>
                    <div className='bet-buttons__button' onClick={() => {addBet('13-24', betAmount)}}>13-24</div>
                    <div className='bet-buttons__button' onClick={() => {addBet('25-36', betAmount)}}>25-36</div>
                </div>
                <div className='row'>
                    <div className='bet-buttons__button bet-buttons__button_l'>Поставить на число</div>
                </div>
            </div>
            <div className='start-button' onClick={() => {startt(bets)}}>Запустить</div>
            {isShowCheck ?
                <>
                    <div className='hash'>{hash}</div>
                    <div className='check-string' style={{marginBottom: '70px'}}>{md5}</div>    
                </>
            : <div className='hash' style={{marginBottom: '70px'}}>{hash}</div>
            }
        </Content>
    </Wrapper>
    )
}

export default SoloWheel;