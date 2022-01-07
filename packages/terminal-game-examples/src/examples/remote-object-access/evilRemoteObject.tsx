import * as React from 'react';
import { Types, LoadingHelper, TerminalInputHelper } from 'react-terminal-game-builder';
import { SateliteOverallState } from '.';

export interface EvilRemoteObjectProps extends Types.GameComponentProps<SateliteOverallState> {
    onLogout: Function;
}

export interface EvilRemoteObjectState {
    gameState: GameState
}

enum GameState {
    MainPage,
    NotLoaded,
    Victory
}

class EvilRemoteObject extends React.Component<EvilRemoteObjectProps, EvilRemoteObjectState> {
    state: EvilRemoteObjectState = { gameState: GameState.NotLoaded }
    componentDidMount() {
        this.props.clearLines(() => {
            this.props.writeText({ message: 'Welcome to Evil Corp satellite 123' }, () => {
                this.setState({ gameState: GameState.MainPage });
            })
        })

    }

    handleTerminalCommand = (command: string, args: string[], fullText: string) => {
        switch (command.toLowerCase()) {
            case 'help': {
                this.doHelp();
                break;
            }
            case 'logout': {
                this.props.onLogout();
                break;
            }
            case 'self_destruct': {
                this.doSelfDestruct();
                break;
            }
            default: {
                this.props.addLine(["Unauthorized to use that command"])
            }
        }
    }

    goToVictory = () => {
        this.props.writeText({ message: "NOOOOOOOO!", color: 'red' }, () => {
            this.setState({ gameState: GameState.Victory });
        })
    }

    doSelfDestruct = () => {
        this.setState({ gameState: GameState.NotLoaded }, () => {
            this.props.writeText({ message: "Wait... NO! YOU CAN'T DO THIS!", color: 'red' }, () => {
                this.props.addLine([<LoadingHelper
                    message="Self destruct countdown"
                    startPercent={100}
                    endPercent={0}
                    color={true}
                    onFinish={() => {
                        this.props.writeText({ message: 'Self destruct complete' }, () => {
                            this.goToVictory();
                        })
                    }}
                />])
            })

        })
    }

    doHelp = () => {
        this.setState({ gameState: GameState.NotLoaded }, () => {
            this.props.addLine(["Commands available for use:",
                <div>logs -- Pulls up the logs for the satellite"<br /> {'Usage: "> logs"'} </div>,
                <div>system_check -- Runs system diagnosics<br /> {'Usage: "> system_check"'} </div>,
                <div>help -- Opens this screen<br /> {'Usage: "> help"'} </div>,
                <div>repair -- Repairs systems that have errors<br /> {'Usage: "> repair <system name>"'} </div>,
                <div>restart -- Restarts offline systems<br /> {'Usage: "> restart <system name>"'} </div>,
                <div>use -- Uses a system<br /> {'Usage: "> use <system name>"'} </div>,
                <div>logout -- Logs out of satellite<br /> {'Usage: "> logout"'} </div>,
                <div>self_destruct -- start self destruct sequence (not recommended)<br /> {'Usage "> self_destruct"'} </div>,
            ], () => {
                this.setState({ gameState: GameState.MainPage });
            })
        })
    }

    render() {
        return (<div>
            {this.state.gameState === GameState.MainPage && <TerminalInputHelper onSumbitCommand={this.handleTerminalCommand} />}
            {this.state.gameState === GameState.Victory && <div>YOU WON!</div>}
        </div>);
    }
}

export default EvilRemoteObject;
