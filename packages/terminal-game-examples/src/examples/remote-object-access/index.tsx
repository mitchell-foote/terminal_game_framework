import * as React from 'react';
import { Types, LoginWorkflow } from 'react-terminal-game-builder';
import { StartingSystems, Logs } from './data';
import RemoteObject from './remoteObject';
import EvilRemoteObject from './evilRemoteObject';


enum GameState {
    NotLoaded,
    Login,
    LoggedIn,
    BadSatLoggedIn
}

export interface MainStoryWrapperProps extends Types.GameComponentProps {

}

export interface MainStoryWrapperState {
    mainGameState: GameState
}

class MainStoryWrapper extends React.Component<MainStoryWrapperProps, MainStoryWrapperState> {
    state = { mainGameState: GameState.NotLoaded }

    componentDidMount() {
        let overallState = { ...this.props.overallState };
        overallState.systemList = { ...StartingSystems };
        overallState.logs = [...Logs];
        this.props.updateOverallState(overallState, () => {
            this.moveToLoginScreen();
        });
    }

    moveToLoginScreen = () => {
        this.setState({ mainGameState: GameState.NotLoaded }, () => {
            this.props.clearLines(() => {
                this.props.addLine(["satellite access terminal v2.4"], () => {
                    this.setState({ mainGameState: GameState.Login });

                })
            })
        })

    }

    moveToLoggedInScreen = () => {
        if (this.props.overallState.login.username === 'evl-crp-123') {
            this.setState({ mainGameState: GameState.BadSatLoggedIn })
        }
        else {
            this.setState({ mainGameState: GameState.LoggedIn });

        }
    }

    handleSuccessfulLogin = () => {
        this.moveToLoggedInScreen();
    }

    handleLogout = () => {
        this.moveToLoginScreen();
    }


    render() {
        return (<div>
            {this.state.mainGameState === GameState.Login && <LoginWorkflow disableWelcome={true} usernameLabel={'Sat-Name'} passwordLabel={'Sat-Access-Code'} allowedLogins={{ 'sat-1254': 'jbower-123', 'evl-crp-123': '8675309' }} {...this.props} onLoginComplete={this.moveToLoggedInScreen} />}
            {this.state.mainGameState === GameState.LoggedIn && <RemoteObject {...this.props} onLogout={this.handleLogout} />}
            {this.state.mainGameState === GameState.BadSatLoggedIn && <EvilRemoteObject {...this.props} onLogout={this.handleLogout} />}
        </div>);
    }
}

export default MainStoryWrapper;