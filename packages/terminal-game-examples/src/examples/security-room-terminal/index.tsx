import * as React from 'react';
import { Types, LoginWorkflow } from 'react-terminal-game-builder';
import { AdminDefaultState, DockingControlDefaultState, DockingLogs, DoorControlDefaultState, DoorControlLogs, TractorBeamLogs, TractorBeamTargets } from './defaultState';
import AdminSecuritySystem, { AdminSecurityState } from './screens/admin';
import DockingControl, { DockingControlState } from './screens/docking-control';
import DoorControl, { DoorControlState } from './screens/door-control';
import TractorBeamControl, { TractorBeamControlState } from './screens/tractor-beam';


enum GameState {
    NotLoaded,
    Login,
    LoggedInTractorBeam,
    LoggedInDockingControl,
    LoggedInDoorControl,
    LoggedInAdmin,
    LockedDown
}

export interface FullSecurityState extends Types.LoginOverallState, DockingControlState, AdminSecurityState, DoorControlState, TractorBeamControlState {

}

export interface SecurityRoomTerminalOverallState extends Types.GameComponentProps<FullSecurityState> {

}

interface MainStoryWrapperState {
    mainGameState: GameState
}




class MainStorySecurityTerminal extends React.Component<SecurityRoomTerminalOverallState, MainStoryWrapperState> {
    state: MainStoryWrapperState = { mainGameState: GameState.NotLoaded }


    componentDidMount() {
        let overallState = { ...this.props.overallState };
        overallState = {
            ...overallState, ...AdminDefaultState,
            tractorBeamLogs: [...TractorBeamLogs],
            tractorTargets: { ...TractorBeamTargets },
            dockingLogs: [...DockingLogs],
            targets: { ...DockingControlDefaultState },
            doorControlLogs: [...DoorControlLogs],
            doors: { ...DoorControlDefaultState }
        };
        this.props.updateOverallState(overallState, () => {
            this.setState({ mainGameState: GameState.Login })
        })
    }

    moveToLoginScreen = () => {
        this.setState({ mainGameState: GameState.NotLoaded }, () => {
            this.props.clearLines(() => {
                this.props.addLine(["Security Station Remote Access v1.0.0"], () => {
                    this.setState({ mainGameState: GameState.Login })
                })
            })
        })
    }

    moveToLoggedInScreen = () => {
        switch (this.props.overallState.login.username) {
            case "tractor-control": {
                this.setState({ mainGameState: GameState.LoggedInTractorBeam });
                break;
            }
            case "docking-control": {
                this.setState({ mainGameState: GameState.LoggedInDockingControl });
                break;
            }
            case "door-control": {
                this.setState({ mainGameState: GameState.LoggedInDoorControl });
                break;
            }
            case "admin": {
                this.setState({ mainGameState: GameState.LoggedInAdmin });
                break;
            }
            default: {
                this.props.addLine(["Unknown login detected, please try again"])
            }
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
            {this.state.mainGameState === GameState.Login && <LoginWorkflow onLoginComplete={this.handleSuccessfulLogin} {...this.props} disableWelcome={true} usernameLabel='Username' passwordLabel='Access code' allowedLogins={{
                'tractor-control': 'grabb3r',
                'docking-control': '@nchor',
                'door-control': 'lock3r',
                'admin': 'overse3r'
            }} />}
            {this.state.mainGameState === GameState.LoggedInAdmin && <AdminSecuritySystem {...this.props} onLogout={this.handleLogout} />}
            {this.state.mainGameState === GameState.LoggedInDockingControl && <DockingControl {...this.props} onLogout={this.handleLogout} />}
            {this.state.mainGameState === GameState.LoggedInDoorControl && <DoorControl {...this.props} onLogout={this.handleLogout} />}
            {this.state.mainGameState === GameState.LoggedInTractorBeam && <TractorBeamControl {...this.props} onLogout={this.handleLogout} />}
        </div>);
    }
}

export default MainStorySecurityTerminal;