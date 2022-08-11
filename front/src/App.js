import bridge from '@vkontakte/vk-bridge';
import Main from './Components/Pages/Main';
import Games from './Components/Pages/Games';
import Loading from './Components/Pages/Loading';
import SoloWheel from './Components/Pages/SoloWheel';
import TeamWheel from './Components/Pages/TeamWheel';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

bridge.send("VKWebAppInit");

const params = window.location.search.slice(1);

const socket = io("https://lucky-spin.space:2087", {
  transports: ['websocket'],
  query: {
    params: params
  }
})

export const messageSend = (msg, json) => {
  socket.emit(msg, json);
}

let teamWheelClear = false;
let abc = 0;

const App = () => {
  const [counter, setCounter] = useState(0);
  const [startGame, setStartGame] = useState(false);
  const [isShowCheck, setShowCheck] = useState(false);
  const [isShowResult, setShowResult] = useState(false);
  const [isStart, setStart] = useState(false);
  const [data, setData] = useState({
    avatar: '',
    name: '',
    userId: '',
    coins: 0,
    hash: '',
    md5: '',
    ballDeg: '',
    winnumber: '',
    savedBets: false,
    lastLaunch: false,
    lastGame: false,
    teamWheelHash: '',
    teamWheelMd5: '',
    teamWheelBallDeg: '',
    teamWheelWinNumber: '',
    teamWheelSavedBets: false,
    teamWheelBets: [],
    teamWHeelTime: '',
    teamWheelIsStart: false,
    teamWheelClear: false
  })
  const [isLoaded, setLoaded] = useState(false);

  const {
    avatar, name, coins,
    hash, md5, ballDeg,
    savedBets, lastGame, teamWheelHash,
    teamWheelMd5, teamWheelBallDeg, teamWheelWinNumber,
    teamWheelSavedBets, teamWheelBets, teamWHeelTime,
    userId, teamWheelIsStart
  } = data;

  const setStartt = () => setStart(false);

  socket.on('userInfo', (data) => {
    const { coins } = data;

    setData((prevState) => {
      return {
        ...prevState,
        coins: coins
      }
    })

    setLoaded(true);
  })

  socket.on('startTeamWheel', () => {
    abc = 0;
  })

  socket.on('teamWheelData', (data2) => {
    const { hash, bets, md5, winNumber, time, ballDeg, isStart } = data2;

    if (time === 0 || time > -1 || isStart) {
      setData((prevState) => {
        return {
          ...prevState,
          teamWHeelTime: time,
          teamWheelIsStart: isStart
        }
      })
    } 
    if (hash || bets || md5 || winNumber || ballDeg) {
      setData((prevState) => {
        return {
          ...prevState,
          teamWheelHash: hash ? hash : teamWheelHash,
          teamWheelBets: bets ? bets : teamWheelBets,
          teamWheelMd5: md5 ? md5 : '',
          teamWheelWinNumber: winNumber ? winNumber : teamWheelWinNumber,
          teamWheelBallDeg: ballDeg ? ballDeg : teamWheelBallDeg
        }
      })
    }
    if (hash && isStart) {
      setData((prevState) => {
        return {
          ...prevState,
          teamWheelBets: bets,
          teamWheelIsStart: isStart
        }
      })
    }
    // if (isStart === false) {
    //   setData((prevState) => {
    //     return {
    //       ...prevState,
    //       teamWheelBets: []
    //     }
    //   })
    //   console.log(data);
    // }
  })

  socket.on('message', (msg) => {
    if (msg === 'Подождите, пока завершится предыдущая игра') {
      setData((prevState) => {
        return {
          ...prevState,
          lastGame: true
        }
      })
    }
  })

  const checkLastGame = () => {
    let a = false;

    if (lastGame) {
      setShowCheck(false);
      setStartGame(false);
      
      a = true;
    }

    return a;
  }

  const startt = (bets) => {
    if (bets.length === 0) return;

    messageSend('soloWheelStart');
    setShowCheck(true);
    setStartGame(true);
  }

  socket.on('soloWheelData', (data) => {
    const { hash, md5, ballDeg, winnumber, bets } = data;

      setData((prevState) => {
        return {
          ...prevState,
          hash: hash,
          md5: md5 ? md5 : '',
          ballDeg: ballDeg ? ballDeg : '',
          winnumber: winnumber > 0 ? winnumber : data.winnumber,
          lastGame: false
        }
      })

    if (bets) {
      setData((prevState) => {
        return {
          ...prevState,
          savedBets: bets,
          lastGame: false
        }
      })
    }

    if (ballDeg) setStart(true);
  })

  socket.on('updateCoins', (data) => {
    const { coins } = data;

    setData((prevState) => {
      return {
        ...prevState,
        coins: coins
      }
    })
  })

  useEffect(() => {
    bridge.subscribe(event => {
      const data = event.detail.data;

      if (!data) return;
    
      const { type } = event.detail;
    
      if (type === 'VKWebAppGetUserInfoResult') {
        setData((prevState) => {
          return {
            ...prevState,
            avatar: data.photo_200,
            name: `${data.first_name} ${data.last_name}`,
            userId: data.id
          }
        })
      }
    })
  })

  socket.on('clearTeamWheel', () => {
    teamWheelClear = true;
  })

  if (isLoaded) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path='*' element={<Main avatar={avatar} name={name} coins={coins}/>}/>
          <Route path='/games' element={<Games/>}/>
          <Route path='/soloWheel' element={<SoloWheel coins={coins} params={params} checkLastGame={checkLastGame} hash={hash} md5={md5} ballDeg={ballDeg} isStart={isStart} setStartFalse={setStartt} winnumber={data.winnumber} savedBets={savedBets} isShowResult={isShowResult} isShowCheck={isShowCheck} startGame={startGame} setStartGame={(a) => {setStartGame(a)}} setShowResult={(a) => {setShowResult(a)}} setShowCheck={(a) => {setShowCheck(a)}} lastGame={lastGame} startt={startt}/>}/>
          <Route path='/teamWheel' element={<TeamWheel abc={abc} updateAbc={() => {abc++}} isClear={teamWheelClear} setClearFalse={() => teamWheelClear = false} coins={coins} hash={teamWheelHash} md5={teamWheelMd5} ballDeg={teamWheelBallDeg} winNumber={teamWheelWinNumber} bets={data.teamWheelBets} time={teamWHeelTime} userId={userId} avatar={avatar} name={name} isStart={teamWheelIsStart}/>}/>
        </Routes>
      </BrowserRouter>
    )
  } else {
    return (
      <Loading/>
    )
  }
}

bridge.send("VKWebAppGetUserInfo");

export default App;