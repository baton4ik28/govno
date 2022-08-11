import Wrapper from '../PageElements/Wrapper';
import Content from '../PageElements/Content';
import Tabbar from '../PageElements/Tabbar';
import wheel from '../../Images/wheel.png';
import ball from '../../Images/ball.png';
import ReactDOM from 'react-dom/client';
import { messageSend } from '../../App';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon28ChevronBack, Icon28ClockOutline } from '@vkontakte/icons';
import { keyframes } from 'styled-components';

let betss = [];
let result = [];
const blackNumbers = [
    13, 24, 15, 22, 17, 20, 11, 26, 28,
    2, 35, 4, 33, 6, 31, 8, 29, 10
]
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
let a;
let b;
let betsToList2 = [];

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

const Start = ({ ballDeg, number, isShowResult, setShowResult, winNumber, isStart, bets, setModifedBets, setShowBets }) => {
    console.log('launched')
    const wheelSpin = keyframes`
        from { transform: rotate(0deg) }
        to { transform: rotate(2520deg) }
    `
    const ballSpin = keyframes`
        from { transform: rotate(0deg) translateY(-26px) }
        to { transform: rotate(${ballDeg}deg) }
    `;
    const ballAnimation = {
        animation: `${ballSpin} 13s cubic-bezier(0, 0, 0.2, 1)`
    }
    const wheelAnimation = {
        animation: `${wheelSpin} 12s cubic-bezier(0.39, 0.58, 0.57, 1)`
    }

    if (!isShowResult) {
    a = setTimeout(() => {
        const ball = document.getElementsByClassName('ball')[0];

        ball.style=`transform: rotate(-${numbers[number]}deg)`;

        let even = number % 2 === 0 && number > 0 ? true : number === 0 ? 0 : false;
            let black = number === 0 ? 0 : false;
            let interval1 = number > 0 && number <= 18 ? '1-18' : number > 0 && number <= 36 && number > 18 ? '19-36' : 0;
            let interval2 = number <= 12 && number > 0 ? '1-12' : number <= 24 && number > 0 ? '13-24' : number === 0 ? '0' : '25-36';
            
            blackNumbers.forEach((e) => {
                if (e !== number) return;

                black = true;
            })

            if (number === 37) {
                even = 0;
                black = 0;
                interval1 = 0;
                interval2 = '0';
            }

            const bets2 = [];
            
            result.forEach((e) => {
                const { amount, type, color } = e;
                let colorr;
                let amount2 = 0;

                if (type === number) {
                    amount2 += amount * 36;
                    colorr = 'win';
                }
                if (interval1 !== 0) {
                    if (type === interval1) {
                        amount2 += amount * 2;
                        colorr = 'win';
                    }
                }
                if (interval2 !== 0) {
                    if (type === interval2) {
                        amount2 += amount * 3;
                        colorr = 'win';
                    }
                }
                if (black) {
                    if (type === 'черн') {
                        amount2 += amount * 2;
                        colorr = 'win';
                    }
                } else if (black !== 0 && black === false) {
                    if (type === 'красн') {
                        amount2 += amount * 2;
                        colorr = 'win';
                    }
                }
                if (even) {
                    if (type === 'четн') {
                        amount2 += amount * 2;
                        colorr = 'win';
                    }
                } else if (even !== 0 && even === false) {
                    if (type === 'нечет') {
                        amount2 += amount * 2;
                        colorr = 'win';
                    }
                }
                
                if (colorr !== 'win') colorr = 'lose';
                if (amount2 === 0) amount2 = amount;

                bets2.push({ type: type, amount: amount2, date: e.date, color: colorr, color2: color });
            })

            setShowResult(true);
            const betsList = ReactDOM.createRoot(document.getElementsByClassName('bets__items')[0]);
            const bets3 = [];

            for (let i = 0; i < bets2.length; i++) {
                const { type, amount, color, color2 } = bets2[i];
                const children = (
                    <div className={`bets__item bets__item_${color2}`}>
                        <div className='bets__preview'>{type}</div>
                        <div className={`bets__title bets__title_${color}`}>{intToString(amount)}</div>
                    </div>
                )
    
                bets3.push(children);
            }
            betsList.render(bets3);

            bets.forEach((e, i) => {
                const { avatar, name } = e;
    
                const children = [];
                const betts = [];
                const copyArr = bets[i].bets;
    
                let result3 = Object.values(copyArr.reduce((acc, item) => {    
                    if (!acc[item.type]) {
                        acc[item.type] = {...item};
                    } else {
                        acc[item.type].amount = +acc[item.type].amount + +item.amount;
                    }
        
                    return acc;
                }, {}))
        
                result3.sort((a,b) => {
                    return a.date - b.date;
                })
    
                const bets5 = [];
                result3.forEach((e) => {
                    const { type, amount, color } = e;
    
                    let colorr;
                    let amount2 = 0;

                    if (type === winNumber) {
                        amount2 += amount * 36;
                        colorr = 'win';
                    }
                    if (interval1 !== 0) {
                        if (type === interval1) {
                            amount2 += amount * 2;
                            colorr = 'win';
                        }
                    }
                    if (interval2 !== 0) {
                        if (type === interval2) {
                            amount2 += amount * 3;
                            colorr = 'win';
                        }
                    }
                    if (black) {
                        if (type === 'черн') {
                            amount2 += amount * 2;
                            colorr = 'win';
                        }
                    } else if (black !== 0 && black === false) {
                        if (type === 'красн') {
                            amount2 += amount * 2;
                            colorr = 'win';
                        }
                    }
                    if (even) {
                        if (type === 'четн') {
                            amount2 += amount * 2;
                            colorr = 'win';
                        }
                    } else if (even !== 0 && even === false) {
                        if (type === 'нечет') {
                            amount2 += amount * 2;
                            colorr = 'win';
                        }
                    }
                    
                    if (colorr !== 'win') colorr = 'lose';
                    if (amount2 === 0) amount2 = amount;

                    bets5.push({ type: type, amount: amount2, date: e.date, color: colorr, color2: color });
                })
    
                bets5.forEach((e) => {
                    betts.push(
                        <div className={`bet__bets__bet bet bet__bets__bet_${e.color2}`}>
                            <div className='bet__type'>{e.type}</div>
                            <div className={`bet__title bet__title_${e.color}`}>{intToString(e.amount)}</div>
                        </div>
                    )
                })
    
                children.push(
                    <div className='bet'>
                        <img className='bet__avatar' src={avatar} alt=''></img>
                        <div className='bet__info'>
                            <div className='bet__name'>{name}</div>
                            <div className='bet__bets'>
                                {betts}
                            </div>
                        </div>
                    </div>
                )
                betsToList2.push(children);
            })
    }, 13000);
        // b = setTimeout(() => {
        //     console.log('b');
        //     result = [];
        //     betss = [];
        //     betsToList2 = [];
        //     setModifedBets();
        //     setShowBets(false);
        //     setShowResult(false);
        //     // let id = window.setTimeout(function() {}, 0);

        //     // while (id--) {
        //     //     window.clearTimeout(id);
        //     // }
        // }, 16000)
    }
    return (
        <>
            <img className='wheel wheel_start' style={wheelAnimation} src={wheel} alt=''></img>
            <img className='ball' style={ballAnimation} src={ball} alt=''></img>
            {isShowResult ?
                <div className='div__result-wrapper'>
                    <div className='div__result'>{winNumber}</div>
                </div>
            : ''}
        </>
    )
}

const Timer = ({ time }) => {
    return (
        <div className='timer-wrap'>
            <div className='timer'>{time}</div>
        </div>
    )
}

const StandbyScreen = () => {
    return (
        <div className='standby-screen'>
            <Icon28ClockOutline width={56} height={56}/>
            <div className='standby-screen__title'>Ожидание ставок...</div>
        </div>
    )
}

const TeamWheel = ({ coins, hash, md5, ballDeg, winNumber, bets, time, userId, avatar, name, isStart, isClear, setClearFalse, abc, updateAbc }) => {
    const [data, setData] = useState({
        betAmount: 0,
        modifedBets: []
    })
    const [isShowBets, setShowBets] = useState(false);
    const [isShowResult, setShowResult] = useState(false);

    useEffect(() => {
        messageSend('joinToTeamWheel');
    }, [])
    const { betAmount, modifedBets } = data;

    let betsToList = [];

    const clearAll = () => {
        let id = window.setTimeout(function() {}, 0);

        while (id--) {
            window.clearTimeout(id);
        }

        betsToList2 = [];
    }

    const handleChange = (event) => {
        const value = event.target.value;

        setData((prevState) => {
            return {
                ...prevState,
                betAmount: value
            }
        })
    }

    const addBet = (type, amount, color) => {
        if (amount <= 0 || coins < amount) return;

        const bet = { type: type, amount: parseInt(amount), date: Date.now(), color: color };
        
        messageSend('addTeamBet', { bet: bet, avatar: avatar, name: name });
        setShowBets(true);
       
        betss.push({ type: type, amount: parseInt(amount), date: Date.now(), color: color });

        result = Object.values(betss.reduce((acc, item) => {    
            if (!acc[item.type]) {
                acc[item.type] = {...item};
            } else {
                acc[item.type].amount = +acc[item.type].amount + +item.amount;
            }

            return acc;
        }, {}))

        result.sort((a,b) => {
            return a.date - b.date;
        })
        
        const normalBets = [];

        for (let i = 0; i < result.length; i++) {
            const { type, amount, color } = result[i];
            const children = (
                <div className={`bets__item bets__item_${color}`}>
                    <div className='bets__preview'>{type}</div>
                    <div className='bets__title bets__title--primary'>{intToString(amount)}</div>
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


    if (isClear && abc === 0) {
        result = [];
        betss = [];
        betsToList2 = [];
        setShowBets(false);
        setShowResult(false);
        setData((prevState) => {
            return {
                ...prevState,
                modifedBets: []
            }
        })
        setClearFalse();
        abc ++;
    }

    if (bets.length > 0) {
        let even = winNumber % 2 === 0 && winNumber > 0 ? true : winNumber === 0 ? 0 : false;
        let black = winNumber === 0 ? 0 : false;
        let interval1 = winNumber > 0 && winNumber <= 18 ? '1-18' : winNumber > 0 && winNumber <= 36 && winNumber > 18 ? '19-36' : 0;
        let interval2 = winNumber <= 12 && winNumber > 0 ? '1-12' : winNumber <= 24 && winNumber > 0 ? '13-24' : winNumber === 0 ? '0' : '25-36';
        
        blackNumbers.forEach((e) => {
            if (e !== winNumber) return;

            black = true;
        })

        if (winNumber === 37) {
            even = 0;
            black = 0;
            interval1 = 0;
            interval2 = '0';
        }
        
        bets.forEach((e, i) => {
            const { avatar, name } = e;

            const children = [];
            const betts = [];
            const copyArr = bets[i].bets;

            let result2 = Object.values(copyArr.reduce((acc, item) => {    
                if (!acc[item.type]) {
                    acc[item.type] = {...item};
                } else {
                    acc[item.type].amount = +acc[item.type].amount + +item.amount;
                }
    
                return acc;
            }, {}))
    
            result2.sort((a,b) => {
                return a.date - b.date;
            })

            const bets5 = [];
            result2.forEach((e) => {
                const { type, amount, color } = e;

                if (time || time === 0) {
                    betts.push(
                        <div className={`bet__bets__bet bet bet__bets__bet_${color}`}>
                            <div className='bet__type'>{type}</div>
                            <div className='bet__title'>{intToString(amount)}</div>
                        </div>
                    )
                } else if (isStart && time < 0) {

                    let colorr;
                    let amount2 = 0;

                    if (type === winNumber) {
                        amount2 += amount * 36;
                        colorr = 'win';
                    }
                    if (interval1 !== 0) {
                        if (type === interval1) {
                            amount2 += amount * 2;
                            colorr = 'win';
                        }
                    }
                    if (interval2 !== 0) {
                        if (type === interval2) {
                            amount2 += amount * 3;
                            colorr = 'win';
                        }
                    }
                    if (black) {
                        if (type === 'черн') {
                            amount2 += amount * 2;
                            colorr = 'win';
                        }
                    } else if (black !== 0 && black === false) {
                        if (type === 'красн') {
                            amount2 += amount * 2;
                            colorr = 'win';
                        }
                    }
                    if (even) {
                        if (type === 'четн') {
                            amount2 += amount * 2;
                            colorr = 'win';
                        }
                    } else if (even !== 0 && even === false) {
                        if (type === 'нечет') {
                            amount2 += amount * 2;
                            colorr = 'win';
                        }
                    }
                    
                    if (colorr !== 'win') colorr = 'lose';
                    if (amount2 === 0) amount2 = amount;

                    bets5.push({ type: type, amount: amount2, date: e.date, color: colorr, color2: color });
                }
            })

            if (isStart) {
                bets5.forEach((e) => {
                    betts.push(
                        <div className={`bet__bets__bet bet bet__bets__bet_${e.color2}`}>
                            <div className='bet__type'>{e.type}</div>
                            <div className={`bet__title bet__title_${e.color}`}>{intToString(e.amount)}</div>
                        </div>
                    )
                })
            }

            children.push(
                <div className='bet'>
                    <img className='bet__avatar' src={avatar} alt=''></img>
                    <div className='bet__info'>
                        <div className='bet__name'>{name}</div>
                        <div className='bet__bets'>
                            {betts}
                        </div>
                    </div>
                </div>
            )
            betsToList.push(children);
        })
    }

    return(
        <Wrapper>
            <div className='header'>
                <div className='header__content'>
                    <Link to='/games' className='header__icon' onClick={() => {clearAll()}}>
                        <Icon28ChevronBack width={32} height={32}/>
                    </Link>
                    <div className='header__title header__title_l'>Team Wheel</div>
                </div>
            </div>
            <Content>
                <div className='balance'>{coins.toLocaleString()} LS</div>
                <div className='div'>
                    {time <= 0 && typeof(time) === 'number' && bets.length > 0 ? <Start setShowBets={(a) => {setShowBets(a)}} ballDeg={ballDeg} number={winNumber} isShowResult={isShowResult} winNumber={winNumber} isStart={isStart} setShowResult={(a) => {setShowResult(a)}} bets={bets} setModifedBets={() => {setData((prevState) => {return {...prevState, modifedBets: []}})}}/> : bets.length !== 0 ? <Timer time={time}/> : <StandbyScreen/>}
                </div>
                {isShowBets ?
                <div className='bets'>
                    <div className='bets__title bets_title_f'>Ваши ставки:</div>
                    <div className='bets__items'>{!isClear ? modifedBets : []}</div>
                </div>
                : ''}
                {time <= 0 && typeof(time) === 'number' ? ''
                :
                <>
                    <input className='input-bet' placeholder='Введите ставку' onChange={handleChange}></input>
                    <div className='bet-buttons'>
                        <div className='bet-buttons__title'>Стол ставок</div>
                        <div className='row'>
                            <div className='bet-buttons__button' onClick={() => {addBet('красн', betAmount, 'red')}}>Красное</div>
                            <div className='bet-buttons__button' onClick={() => {addBet('черн', betAmount, 'black')}}>Черное</div>
                        </div>
                        <div className='row'>
                            <div className='bet-buttons__button' onClick={() => {addBet('четн', betAmount, 'even')}}>Четное</div>
                            <div className='bet-buttons__button' onClick={() => {addBet('нечет', betAmount, 'odd')}}>Нечетное</div>
                        </div>
                        <div className='row'>
                            <div className='bet-buttons__button' onClick={() => {addBet('1-18', betAmount, 'primary')}}>1-18</div>
                            <div className='bet-buttons__button' onClick={() => {addBet(0, betAmount, 'green')}}>0</div>
                            <div className='bet-buttons__button' onClick={() => {addBet('19-36', betAmount, 'primary')}}>19-36</div>
                        </div>
                        <div className='row'>
                            <div className='bet-buttons__button' onClick={() => {addBet('1-12', betAmount, 'primary')}}>1-12</div>
                            <div className='bet-buttons__button' onClick={() => {addBet('13-24', betAmount, 'primary')}}>13-24</div>
                            <div className='bet-buttons__button' onClick={() => {addBet('25-36', betAmount, 'primary')}}>25-36</div>
                        </div>
                        <div className='row'>
                            <div className='bet-buttons__button bet-buttons__button_l'>Поставить на число</div>
                        </div>
                    </div>
                </>}
                <div className='bets-list'>
                    {betsToList2.length === 0 ? betsToList : betsToList2}
                </div>
                <div className='hash'>{hash}</div>
                {md5 ? <div className='check-string'>{md5}</div> : ''}
            </Content>
        </Wrapper>
    )
}

export default TeamWheel;