import { useEffect, useContext, useState} from 'react';
import '../styles/Login.css';
import { TokenContext } from '../Contexts/TokenContext';

export const Login = () => {
    const [clientId, setClientId] = useState(JSON.parse(sessionStorage.getItem('clientId')));
    const redirectUri = 'https://scotthahn1.github.io/Spotify-Clone/';
    const authEndpoint = 'https://accounts.spotify.com/authorize';
    const responseType = 'token';
    const scopes = [
        'user-modify-playback-state',
        'user-library-modify',
        'user-library-read',
        'user-read-currently-playing',
        'playlist-read-private',
        'playlist-modify-private',
        'user-follow-read',
        'user-read-playback-state',
        'user-top-read',
        'user-read-recently-played',
        'streaming',
        'app-remote-control',
        'user-read-private',
        'user-read-email'
    ]

    const address = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scopes}`;
    const {token, setToken} = useContext(TokenContext);

    useEffect(() => {
        clientId && sessionStorage.setItem('clientId', JSON.stringify(clientId));
        clientId && setClientId(JSON.parse(sessionStorage.getItem('clientId')));
    }, [clientId])

    useEffect(() => {
        const hash = window.location.hash;
        let token = localStorage.getItem('token');
        
        if(!token && hash.length > 5) {
            token = hash.substring(1).split('&').find(elem => elem.startsWith('access_token')).split('=')[1];

            window.location.hash = '';
            localStorage.setItem('token', token);
        }
        setToken(token);
    }, [])

    return (
        <div className='login-container'>
            <div className='login'>
                {!token &&
                    <div className='form'>
                        <div className='client-id'>
                            <div className='authorization-steps'>
                                <h2>Steps to authorize your spotify account in order to use the spotify api.</h2>
                                <ul>
                                    <li>Click the "Get Client ID" button to log into the spotify api dashboard.</li>
                                    <li>Click on the "Login" button at the top right of the page and log into your account.</li>
                                    <li>Click on your Spotify username at the top right of the page and select "Dashboard"</li>
                                    <li>Click the blue "Create app" button on the right of the page.</li>
                                    <li>Enter a name and description. In the "Redirect URI" textbox copy and paste "https://scotthahn1.github.io/Spotify-Clone/". Accept terms and click "Save".</li>
                                    <li>Click "Settings" on the right of the page. Copy the Client Id and go back to the Spotify Clone app tab and paste it in the textbox above the "Get Client ID" button.</li>
                                    <li>Click Login.</li>
                                </ul>
                                <p>(If you get an INVALID_CLIENT error page it means the redirect uri is incorrect or the client id is incorrect. Make sure both have been correctly copied and pasted.)</p>
                            </div>
                            <input type='text' 
                                value={clientId} 
                                onChange={ e => setClientId(e.target.value) } 
                                placeholder='Paste Client ID here...' 
                                style={ {fontWeight: 'bold'} }
                            > 
                            </input>
                            {
                                !clientId ?
                                <button className='login-btn'>
                                    <a href ='https://developer.spotify.com/dashboard/' target='_blank'>
                                        Get Client ID
                                    </a>
                                </button>
                                :
                                <button className='login-btn'>
                                    <a href={address}>
                                        Login
                                    </a>
                                </button>
                            }
                        </div>
                    </div> 
                }
            </div>
        </div>
    )
}