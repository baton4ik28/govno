import { Icon28HomeOutline, Icon28CrownOutline, Icon28GameOutline, Icon28More } from '@vkontakte/icons';
import { Link } from 'react-router-dom';

const icons = {
    1: <Icon28HomeOutline width={40} height={40}/>,
    2: <Icon28GameOutline width={40} height={40}/>,
    3: <Icon28CrownOutline width={40} height={40}/>,
    4: <Icon28More width={40} height={40}/>
}

const TabbarIcon = ({ activeIcon, link, icon  }) => {
    return(
        <Link to={link} className={activeIcon === icon ? 'tabbar__icon tabbar__icon_active' : 'tabbar__icon'}>
            {icons[icon]}
        </Link>
    )
}

const Tabbar = ({ activeIcon }) => {
    return(
        <div className='tabbar'>
            <TabbarIcon activeIcon={activeIcon} link='/' icon={1}/>
            <TabbarIcon activeIcon={activeIcon} link='/games' icon={2}/>
            <TabbarIcon activeIcon={activeIcon} link='/rating' icon={3}/>
            <TabbarIcon activeIcon={activeIcon} link='/more' icon={4}/>
        </div>
    )
}

export default Tabbar;