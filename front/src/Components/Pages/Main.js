import Wrapper from '../PageElements/Wrapper';
import Content from '../PageElements/Content';
import Subhead from '../PageElements/Subhead';
import Tabbar from '../PageElements/Tabbar';

const Main = ({ avatar, name, coins }) => {
    return(
        <Wrapper>
            <div className='header'>
                <div className='header__content'>
                    <img className='header__img' src={avatar} alt=''></img>
                    <div className='header__info'>
                        <div className='header__title'>Профиль</div>
                        <div className='header__text'>{name}</div>
                    </div>
                </div>
            </div>
            <Content>
                <div className='wallet'>
                    <Subhead>Кошелек</Subhead>
                    <div className='wallet__wrapper'>
                        <div className='wallet__title'>{coins.toLocaleString()}</div>
                        <div className='wallet__text'>LS коинов</div>
                    </div>
                    <div className='wallet__buttons'>
                        <div className='wallet__button'>Донат</div>
                        <div className='wallet__button'>Перевод</div>
                    </div>
                </div>
            </Content>
            <Tabbar activeIcon={1}/>
        </Wrapper>
    )
}

export default Main;