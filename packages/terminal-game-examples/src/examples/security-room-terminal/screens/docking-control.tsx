import * as React from 'react';
import { Component } from 'react';
import { LoadingHelper, OptionsHelper, TerminalInputHelper, Types } from 'react-terminal-game-builder';
import { LogsType, SystemStatus } from '../types';


enum DockingControlGameState {
    Loaded,
    Unloaded,
    Logs
}

interface DockingControlProps extends Types.GameComponentProps<DockingControlState> {
    onLogout: Function
}

export interface DockingControlState {
    dockingLogs: LogsType[]
    targets: Record<string, SystemStatus>
}
interface DockingControlComponentState {
    currentState: DockingControlGameState
}

class DockingControl extends React.Component<DockingControlProps, DockingControlComponentState> {
    state: DockingControlComponentState = { currentState: DockingControlGameState.Unloaded }

    componentDidMount() {
        this.props.clearLines(() => {
            this.props.writeText({ message: "Docking Remote Access Control v0.0.3-beta.0" }, () => {
                this.props.writeText({ message: "Type 'help' for command listing" }, () => {
                    this.goToCommandLine();
                })
            })
        })
    }
    goToCommandLine = () => {
        this.setState({ currentState: DockingControlGameState.Loaded })
    }

    doStatus = () => {
        this.setState({ currentState: DockingControlGameState.Unloaded }, () => {
            this.props.addLine([
                <LoadingHelper
                    startPercent={0}
                    endPercent={100}
                    message='Retreaving ship list'
                    onFinish={() => {
                        this.props.addLine(Object.keys(this.props.overallState.targets).map((each) => {
                            let status = this.props.overallState.targets[each];
                            return <div>{each} - {status === SystemStatus.Online ? "Force docked" : "Available to depart"}</div>
                        }), () => {
                            this.goToCommandLine();
                        })
                    }} />
            ])
        })
    }

    doLogs = () => {
        this.setState({ currentState: DockingControlGameState.Logs })
    }

    doForceDock = (target: string) => {
        let value = this.props.overallState.targets[target];
        if (value === undefined) {
            this.props.addLine(["Unable to force dock: Invalid Target - Recommend running 'status' to get available ship names"], () => {
                this.goToCommandLine();
            })
        }
        else if (value === SystemStatus.Online) {
            this.props.addLine(['Unable to force dock: Target is already force docked'], () => {
                this.goToCommandLine();
            })
        }
        else {
            this.setState({ currentState: DockingControlGameState.Unloaded }, () => {
                this.props.writeText({ message: 'Attempting to force dock target...' }, () => {
                    this.props.addLine([
                        <LoadingHelper
                            startPercent={0}
                            endPercent={100}
                            message='Locking Target'
                            color={true}
                            onFinish={() => {
                                let overallState = { ...this.props.overallState };
                                overallState.targets[target] = SystemStatus.Online;
                                this.props.updateOverallState(overallState);
                                this.props.writeText({ message: `${target} is now force docked` }, () => {
                                    this.goToCommandLine();
                                });
                            }} />
                    ])
                })
            })
        }
    }

    doUndock = (target: string) => {
        let value = this.props.overallState.targets[target];
        if (value === undefined) {
            this.props.addLine(["Unable to clear for undocking: Invalid Target - Recommend running 'status' to get available ship names"], () => {
                this.goToCommandLine();
            })
        }
        else if (value === SystemStatus.Offline) {
            this.props.addLine(['Unable to clear for undocking: Target is not being force docked'], () => {
                this.goToCommandLine();
            })
        }
        else {
            this.setState({ currentState: DockingControlGameState.Unloaded }, () => {
                this.props.writeText({ message: 'Clearing for undocking...' }, () => {
                    this.props.addLine([
                        <LoadingHelper
                            startPercent={0}
                            endPercent={100}
                            message='Clearning target'
                            color={true}
                            onFinish={() => {
                                let overallState = { ...this.props.overallState };
                                overallState.targets[target] = SystemStatus.Offline;
                                this.props.updateOverallState(overallState);
                                this.props.writeText({ message: `${target} has been cleared for undocking` }, () => {
                                    this.goToCommandLine();
                                });
                            }} />
                    ])
                })
            })
        }
    }
    doHelp = () => {
        this.setState({ currentState: DockingControlGameState.Unloaded }, () => {
            this.props.addLine(["Commands available for use:",
                <div>status -- Gets status for docked vessels<br /> {'Usage: "> status"'}</div>,
                <div>help -- Opens this screen<br /> {'Usage: "> help"'}</div>,
                <div>logs -- Displays available logs<br />{'Usage: "> logs"'}</div>,
                <div>force_dock -- Attempts to force dock a vessel<br />{'Usage: "> force_dock <ship_name>"'}</div>,
                <div>undock -- Clears a vessel to undock<br />{'Usage: "> undock <ship_name>"'}</div>,
                <div>clear -- Clears the console<br />{'Usage: "> clear"'}</div>,
                <div>logout -- Logs out of this account<br />{'Usage: "> logout"'}</div>,
            ], () => {
                this.goToCommandLine();
            })
        })
    }

    handleCommandAction = (command: string, args: string[], fullText: string) => {
        this.props.addLine([fullText], () => {
            switch (command.toLowerCase()) {
                case 'status': {
                    this.doStatus();
                    break;
                }
                case 'logs': {
                    this.doLogs();
                    break;
                }
                case 'force_dock': {
                    this.doForceDock(args[0]);
                    break;
                }
                case 'undock': {
                    this.doUndock(args[0]);
                    break;
                }
                case 'help': {
                    this.doHelp();
                    break;
                }
                case 'clear': {
                    this.props.clearLines();
                    break;
                }
                case 'logout': {
                    this.props.onLogout();
                    break;
                }
                default: {
                    this.props.addLine(['Unknown command. Type "help" to get a list of commands'])
                }
            }
        })


    }

    generateLogsSection = () => {
        let logs = [...this.props.overallState.dockingLogs];
        let mappedLogs: Types.OptionChoice[] = logs.map((each) => {
            return {
                name: each.title,
                description: each.description,
                action: () => {
                    this.props.addLine(["--------------------", `Log: ${each.title}`, `Title: ${each.description}`, each.text, "-------------------"])
                }
            }
        });
        mappedLogs.push({
            name: 'back',
            description: 'return to previous page',
            action: () => {
                this.goToCommandLine()
            }
        });
        return (<OptionsHelper options={mappedLogs} addLine={this.props.addLine} allowNumberChoice={true} />)
    }

    render() {
        return (<div>
            {this.state.currentState === DockingControlGameState.Loaded && <TerminalInputHelper onSumbitCommand={this.handleCommandAction} />}
            {this.state.currentState === DockingControlGameState.Logs && this.generateLogsSection()}
        </div>);
    }
}

export default DockingControl;