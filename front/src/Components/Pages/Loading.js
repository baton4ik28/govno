import Wrapper from '../PageElements/Wrapper';
import Content from '../PageElements/Content';
import { Icon32Spinner } from '@vkontakte/icons';

const Loading = () => {
    return(
        <Wrapper>
            <Content>
                <div className='loading'>
                    <div className='rotate'>
                        <Icon32Spinner className='spinner'/>
                    </div>
                </div>
            </Content>
        </Wrapper>
    )
}

export default Loading;