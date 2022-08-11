import Content from '../PageElements/Content';
import Tabbar from '../PageElements/Tabbar';
import Wrapper from '../PageElements/Wrapper';
import { Icon28GameOutline } from '@vkontakte/icons';
import { Link } from 'react-router-dom';

const Games = () => {
    return(
        <Wrapper>
            <div className='header'>
                <div className='header__content'>
                    <Icon28GameOutline className='header__icon' width={32} height={32}/>
                    <div className='header__title header__title_l'>Игры</div>
                </div>
            </div>
            <Content>
                <div className='games'>
                    <div className='row'>
                        <Link to='/soloWheel' className='game'>
                            <div className='game__title'>Solo Wheel</div>
                        </Link>
                        <Link to='/teamWheel' className='game'>
                            <div className='game__title'>Team Wheel</div>
                        </Link>
                    </div>
                </div>
            </Content>
            <Tabbar activeIcon={2}/>
        </Wrapper>
    )
}

export default Games;