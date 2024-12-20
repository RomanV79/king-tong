import { memo, useState, useEffect } from "react";
import classNames from "classnames";
import axios from "axios";

import GameCard from './GameCard';

import AppConfig from "../../config/AppConfig";

const GameMain = ({information, playerData}) => {
  const [scrolling, setScrolling] = useState(false);
  const [visibleItems, setVisibleItems] = useState([]);

  useEffect(() => {
    const initialItems = Array.from({ length: 7 }, (_, i) => information[i % information.length]);
    setVisibleItems(initialItems);
  }, [information]);

  const startScrolling = async () => {

    const jwtToken = localStorage.getItem('jwt-token');
    if (jwtToken !== null && jwtToken !== "") {
      let spinDtoRequest = {
        betcoin: 0,
        betspin: 1
      };

      try {
        const response = await axios
          .post(AppConfig.BASE_URL + "/spin", spinDtoRequest,{
            headers: {
              'Content-Type': 'application/json',
              'Authorization': "Bearer " + jwtToken 
            }
          })
        console.log(response)
      } catch (error) {
        console.log(error)
      }
    }

    if (scrolling) return; 
    setScrolling(true);

    const interval = setInterval(() => {
      setVisibleItems((prev) => {
        const newItems = [...prev.slice(1), information[Math.floor(Math.random() * information.length)]];
        return newItems;
      });
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const randomStopIndex = Math.floor(Math.random() * information.length);
      const newItems = [...Array.from({ length: 7 }, (_, i) => information[(randomStopIndex + i) % information.length])];
      setVisibleItems(newItems);
      setScrolling(false);
    }, 1000);
  };


  let date = new Date(playerData && playerData.freeSpin.timeToIncrease);
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCMinutes()).padStart(2, '0');

  return(
    <div className="game__center">
      <div className="game__jackpot">
        <div className="game__jackpot-img">
          <img src={require('../../../assets/images/crown.png')} alt="" className="img"/>
        </div>
        <p className="game__jackpot-text">{playerData === null ? '0' : playerData && playerData.jackpot}</p>
      </div>
      <div className="game__luck">
        <div className="game__win">
          <p className="game_win-text">{playerData === null ? '' : playerData && playerData.win && 'WIN'}</p>
          <p className="game_win-text">{playerData === null ? '0' : playerData && playerData.win}</p>
        </div>
        <div className="game__wheel">
          <div className="game__wheel-cards">
          {visibleItems.map((item, index) => {
            const {imageBg, imageIcon, classIcon, classZero, number} = item;
            return (
              <GameCard key={index} className={classNames(`gameCard_slot ${scrolling ? 'gameCard_scrolling' : ''}`)}>
                <div className="gameCard__bg">
                  <img src={imageBg} alt="" className="img"/>
                </div>
                <div className="gameCard__info">
                  <div className={classNames(classIcon)}>
                    <img src={imageIcon} alt="" className="img"/>
                  </div>
                  <div className="gameCard__winning">
                    <p className={classNames("gameCard__text", classZero)}>{number}</p>
                  </div>
                </div>
              </GameCard>
            )
          })}
          </div>
          <div className="game__indicator">
            <img src={require('../../../assets/images/indicator.png')} alt="" className="img"/>
          </div>
        </div>
        <div className="game__info">
          <div className="game__info-blue">
            <img src={require('../../../assets/images/blue-game-background.png')} alt="" className="img"/>
          </div>
          <div className="game__info-top">
            <div className="game__info-light">
              <img src={require('../../../assets/images/light-game-background.png')} alt="" className="img"/>
              <div className="game__data">
                <div className="game__lightning">
                  <img src={require('../../../assets/images/purple-lightning.png')} alt="" className="img"/>
                </div>
                <div className="game__data-text">
                  <p className="game__data-title">{playerData === null ? 'X0' : playerData && playerData.freeSpin.slot}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="game__middle">
            <div className="game__progress">
              <div className="game__middle-grey">
                <img src={require('../../../assets/images/gray-game-background.png')} alt="" className="img"/>
              </div>
              <div 
                className="game__middle-color" 
                style={{left: `calc(-141px + ${playerData === null ? '0' : playerData && playerData.freeSpin.value}*(141px/${playerData === null ? '0' : playerData && playerData.freeSpin.maxValue}))`}}>
                <img src={require('../../../assets/images/violet-game-background.png')} alt="" className="img"/>
              </div>
            </div>
            <div className="game__middle-data">
              <p className="game__middle-text">{playerData === null ? '0' : playerData && playerData.freeSpin.value}</p>
              <p className="game__middle-text">/</p>
              <p className="game__middle-text">{playerData === null ? '0' : playerData && playerData.freeSpin.maxValue}</p>
            </div>
          </div>
          <div className="game__bottom">
            <p className="game__bottom-text">5</p>
            <p className="game__bottom-text">spin  in</p>
            <p className="game__bottom-text">{playerData === null ? '0' : `${hours} : ${minutes} : ${seconds}`}</p>
          </div>
        </div>
      </div>
      <button className="game__spin-button" onClick={startScrolling} disabled={scrolling}>
        <div className="game__spin-button-img">
          <img src={require('../../../assets/images/button.png')} alt="" className="img"/>
        </div>
        <div className="game__spin-button-block">
          <p className="game__spin-button-text">spin</p>
        </div>
      </button>
    </div>
  )
}

export default memo(GameMain);
