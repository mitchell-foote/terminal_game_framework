import * as React from 'react';
import { LoadingHelper, TerminalInputHelper, Types } from 'react-terminal-game-builder';
import { SystemStatus } from '../types';
import Camera1 from '../media/stock-movie.mov'
import ReactPlayer from 'react-player';


export interface AdminSecurityState extends Types.OverallStateMediaPlayer {
    camera1: SystemStatus
    camera2: SystemStatus
    fullSystemStatus: SystemStatus;

}

enum AdminGameState {
    NotLoaded,
    Loaded,
    Locked
}

interface AdminSecuritySystemProps extends Types.GameComponentProps<AdminSecurityState> {
    onLogout: Function;
}

interface AdminSecuritySystemState {
    currentState: AdminGameState
}

class AdminSecuritySystem extends React.Component<AdminSecuritySystemProps, AdminSecuritySystemState> {
    state: AdminSecuritySystemState = { currentState: AdminGameState.NotLoaded }

    componentDidMount() {
        this.props.clearLines(() => {
            this.props.writeText({ message: "Admin Console Access v2.3.4" }, () => {
                this.props.writeText({ message: "Type 'help' for command listing" }, () => {
                    this.goToCommandLine();
                })
            })
        })
    }

    goToCommandLine = () => {
        this.setState({ currentState: AdminGameState.Loaded })
    }

    handleCommandAction = (command: string, args: string[], fullText: string) => {
        this.props.addLine([fullText], () => {
            switch (command.toLowerCase()) {
                case 'system_check': {
                    this.doSystemCheck();
                    break;
                }
                case 'help': {
                    this.doHelp();
                    break;
                }
                case 'view': {
                    if (args[0]) {
                        this.doView(args[0].toLowerCase());
                    }
                    else {
                        this.props.addLine(['Unable to comply: View command used incorrectly, please include system name to view ex: "view camera_two"']);
                    }
                    break;
                }
                case 'enable': {
                    if (args[0]) {
                        this.doEnable(args[0].toLowerCase());
                    }
                    else {
                        this.props.addLine(['Unable to comply: View command used incorrectly, please include system name to enable ex: "enable camera_two"']);
                    }
                    break;
                }
                case 'disable': {
                    if (args[0]) {
                        this.doDisable(args[0].toLowerCase());
                    }
                    else {
                        this.props.addLine(['Unable to comply: View command used incorrectly, please include system name to enable ex: "disable camera_two"']);
                    }
                    break;
                }
                case 'clear': {
                    this.props.clearLines();
                    break;
                }
                case 'shutdown': {
                    this.doShutdown();
                    break;
                }
                case 'logout': {
                    this.doLogout();
                    break;
                }
                default: {
                    this.props.addLine(['Command not recognized']);
                }

            }
        })

    }

    doDisable = (system: string) => {
        this.setState({ currentState: AdminGameState.NotLoaded }, () => {
            switch (system) {
                case 'camera_one': {
                    if (this.props.overallState.camera1 === SystemStatus.Online) {
                        let newOverallState = { ...this.props.overallState };
                        newOverallState.camera1 = SystemStatus.Offline;
                        this.props.updateOverallState(newOverallState, () => {
                            this.props.writeText({ message: 'Attempting to comply...' }, () => {
                                this.props.addLine(["camera_one disabled"], () => {
                                    this.goToCommandLine();
                                })
                            })
                        })
                    }
                    else {
                        this.props.addLine(['Unable to comply: System is already disabled.'], () => {
                            this.goToCommandLine();
                        })
                    }
                    break;
                }
                case 'camera_two': {
                    if (this.props.overallState.camera2 === SystemStatus.Online) {
                        let newOverallState = { ...this.props.overallState };
                        newOverallState.camera2 = SystemStatus.Offline;
                        this.props.updateOverallState(newOverallState, () => {
                            this.props.writeText({ message: 'Attempting to comply...' }, () => {
                                this.props.addLine(["camera_two disabled"], () => {
                                    this.goToCommandLine();
                                })
                            })
                        })
                    }
                    else {
                        this.props.addLine(['Unable to comply: System is already disabled.'], () => {
                            this.goToCommandLine();
                        })
                    }
                    break;
                }
                default: {
                    this.props.addLine(["Unable to display: System not recognized"])
                    this.goToCommandLine();
                    break;
                }
            }

        })
    }

    doEnable = (system: string) => {
        this.setState({ currentState: AdminGameState.NotLoaded }, () => {
            switch (system) {
                case 'camera_one': {
                    if (this.props.overallState.camera1 === SystemStatus.Offline) {
                        let newOverallState = { ...this.props.overallState };
                        newOverallState.camera1 = SystemStatus.Online;
                        this.props.updateOverallState(newOverallState, () => {
                            this.props.writeText({ message: 'Attempting to comply...' }, () => {
                                this.props.addLine(["camera_one enabled"], () => {
                                    this.goToCommandLine();
                                })
                            })
                        })
                    }
                    else {
                        this.props.addLine(['Unable to comply: System is already enabled.'], () => {
                            this.goToCommandLine();
                        })
                    }
                    break;
                }
                case 'camera_two': {
                    if (this.props.overallState.camera2 === SystemStatus.Offline) {
                        let newOverallState = { ...this.props.overallState };
                        newOverallState.camera2 = SystemStatus.Online;
                        this.props.updateOverallState(newOverallState, () => {
                            this.props.writeText({ message: 'Attempting to comply...' }, () => {
                                this.props.addLine(["camera_two enabled"], () => {
                                    this.goToCommandLine();
                                })
                            })
                        })
                    }
                    else {
                        this.props.addLine(['Unable to comply: System is already enabled.'], () => {
                            this.goToCommandLine();
                        })
                    }
                    break;
                }
                default: {
                    this.props.addLine(["Unable to display: System not recognized"])
                    this.goToCommandLine();
                    break;
                }
            }

        })
    }

    doView = (system: string) => {
        this.setState({ currentState: AdminGameState.NotLoaded }, () => {
            switch (system) {
                case 'camera_one': {
                    if (this.props.overallState.camera1 === SystemStatus.Offline) {
                        this.props.addLine(["Unable to display: System is offline"])
                    }
                    else {
                        let newOverallState = { ...this.props.overallState };
                        newOverallState.media = { show: true, target: <ReactPlayer loop={true} height={'100%'} width={"100%"} playing={true} muted={true} url={Camera1} />, name: 'Camera One' };
                        this.props.writeText({ message: 'Attempting to comply...' }, () => {
                            this.props.updateOverallState(newOverallState, () => {
                                this.props.addLine(["Now displaying camera one"], () => {
                                    this.goToCommandLine();
                                })
                            })
                        })
                    }
                    break;
                }
                case 'camera_two': {
                    if (this.props.overallState.camera2 === SystemStatus.Offline) {
                        this.props.addLine(["Unable to display: System is offline"])
                    }
                    else {
                        let newOverallState = { ...this.props.overallState };
                        newOverallState.media = { show: true, target: <ReactPlayer loop={true} height={'100%'} width={"100%"} playing={true} muted={true} url={Camera1} />, name: 'Camera Two' };
                        this.props.writeText({ message: 'Attempting to comply...' }, () => {
                            this.props.updateOverallState(newOverallState, () => {
                                this.props.addLine(["Now displaying camera two"], () => {
                                    this.goToCommandLine();
                                })
                            })
                        })
                    }
                    break;
                }
                default: {
                    this.props.addLine(["Unable to display: System not recognized"])
                    this.goToCommandLine();
                    break;
                }
            }

        })
    }

    doSystemCheck = () => {
        this.setState({ currentState: AdminGameState.NotLoaded }, () => {
            this.props.addLine([<LoadingHelper message={"Running system check"} startPercent={0} endPercent={100} onFinish={() => {
                let cameraOne = (<div>
                    {`camera_one -- ${this.props.overallState.camera1 === SystemStatus.Online ? 'Online' : 'Offline'}`}
                </div>);
                let cameraTwo = (<div>
                    {`camera_two -- ${this.props.overallState.camera2 === SystemStatus.Online ? 'Online' : 'Offline'}`}
                </div>)
                this.props.addLine(["Current system status", cameraOne, cameraTwo], () => {
                    this.goToCommandLine()
                })
            }} />])
        })
    }

    doHelp = () => {
        this.setState({ currentState: AdminGameState.NotLoaded }, () => {
            this.props.addLine(["Commands available for use:",
                <div>system_check -- Runs system diagnostics<br /> {'Usage: "> system_check"'}</div>,
                <div>help -- Opens this screen<br /> {'Usage: "> help"'}</div>,
                <div>view -- Displays output on viewscreen<br />{'Usage: "> view <camera name>"'}</div>,
                <div>enable -- Enables system or camera<br />{'Usage: "> enable <camera or system name>"'}</div>,
                <div>disable -- Disables system or camera<br />{'Usage: "> disable <camera or system name>"'}</div>,
                <div>clear -- Clears the console<br />{'Usage: "> clear"'}</div>,
                <div>logout -- Logs out of this account<br />{'Usage: "> logout"'}</div>,
                <div>shutdown -- Locks and shuts down all security systems (not recommended)<br />{'Usage: "> shutdown"'}</div>
            ], () => {
                this.goToCommandLine();
            })
        })
    }

    doLogout = () => {
        this.props.onLogout();
    }

    doShutdown = () => {
        if (this.props.overallState.camera1 === SystemStatus.Online || this.props.overallState.camera2 === SystemStatus.Online) {
            this.setState({ currentState: AdminGameState.NotLoaded }, () => {
                this.props.addLine(["Unable to shutdown security system. Camera system is still online."], () => {
                    this.goToCommandLine()
                })
            })
        }
        else {
            this.setState({ currentState: AdminGameState.NotLoaded }, () => {
                this.props.writeText({ message: 'Warning! Security station shutdown in progress!', color: 'red' }, () => {
                    this.props.addLine([
                        <LoadingHelper
                            startPercent={100}
                            endPercent={0}
                            color={true}
                            showPercent={true}
                            transitionSpeed={300}
                            message="Power levels"
                            onFinish={() => {
                                this.setState({ currentState: AdminGameState.Locked }, () => {
                                    this.props.clearLines(() => {
                                        this.props.writeText({ message: 'This terminal has been disabled.', color: 'red' })
                                    })

                                })
                            }}
                        />])
                })
            })
        }
    }

    render() {
        return (<div>
            {this.state.currentState === AdminGameState.Loaded && <TerminalInputHelper onSumbitCommand={this.handleCommandAction} />}
        </div>);
    }
}

export default AdminSecuritySystem;



