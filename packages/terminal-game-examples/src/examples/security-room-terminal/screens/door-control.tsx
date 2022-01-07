import * as React from 'react';
import { Component } from 'react';
import { LoadingHelper, OptionsHelper, TerminalInputHelper, Types } from 'react-terminal-game-builder';
import { LogsType, SystemStatus } from '../types';


enum DoorControlGameState {
    Loaded,
    Unloaded,
    Logs
}

interface DoorControlProps extends Types.GameComponentProps<DoorControlState> {
    onLogout: Function
}

export interface DoorControlState {
    doorControlLogs: LogsType[]
    doors: Record<string, SystemStatus>
}

interface DoorControlComponentState {
    currentState: DoorControlGameState
}

class DoorControl extends React.Component<DoorControlProps, DoorControlComponentState> {
    state: DoorControlComponentState = { currentState: DoorControlGameState.Unloaded }


    componentDidMount() {
        this.props.clearLines(() => {
            this.props.writeText({ message: "Door Remote Access Control v26.2.93" }, () => {
                this.props.writeText({ message: "Type 'help' for command listing" }, () => {
                    this.goToCommandLine()
                })
            })
        })
    }

    doStatus = () => {
        this.setState({ currentState: DoorControlGameState.Unloaded }, () => {
            this.props.addLine([
                <LoadingHelper
                    startPercent={0}
                    endPercent={100}
                    message='Retreaving door list...'
                    onFinish={() => {
                        this.props.addLine(Object.keys(this.props.overallState.doors).map((each) => {
                            let status = this.props.overallState.doors[each];
                            return <div style={{ width: '25rem', display: 'flex', justifyContent: 'space-between' }}><div>{each}</div><div> - </div><div>{status === SystemStatus.Online ? "Door locked" : "Door unlocked"}</div></div>
                        }), () => {
                            this.goToCommandLine();
                        })
                    }} />
            ])
        })
    }

    doLogs = () => {
        this.setState({ currentState: DoorControlGameState.Logs })
    }

    doLock = (target: string) => {
        let value = this.props.overallState.doors[target];
        if (value === undefined) {
            this.props.addLine(["Unable to lock door: Invalid Target - Recommend running 'status' to get available door names"], () => {
                this.goToCommandLine();
            })
        }
        else if (value === SystemStatus.Online) {
            this.props.addLine(['Unable to lock door: Target is already locked'], () => {
                this.goToCommandLine();
            })
        }
        else {
            this.setState({ currentState: DoorControlGameState.Unloaded }, () => {
                this.props.writeText({ message: 'Attempting to lock door...' }, () => {
                    this.props.addLine([
                        <LoadingHelper
                            startPercent={0}
                            endPercent={100}
                            message='Locking Door'
                            color={true}
                            onFinish={() => {
                                let overallState = { ...this.props.overallState };
                                overallState.doors[target] = SystemStatus.Online;
                                this.props.updateOverallState(overallState);
                                this.props.writeText({ message: `${target} is now locked` }, () => {
                                    this.goToCommandLine();
                                });
                            }} />
                    ])
                })
            })
        }
    }

    doUnlock = (target: string) => {
        let value = this.props.overallState.doors[target];
        if (value === undefined) {
            this.props.addLine(["Unable to unlock door: Invalid Target - Recommend running 'status' to get available door names"], () => {
                this.goToCommandLine();
            })
        }
        else if (value === SystemStatus.Offline) {
            this.props.addLine(['Unable to unlock door: Door is already unlocked'], () => {
                this.goToCommandLine();
            })
        }
        else {
            this.setState({ currentState: DoorControlGameState.Unloaded }, () => {
                this.props.writeText({ message: 'Attempting to unlock door...' }, () => {
                    this.props.addLine([
                        <LoadingHelper
                            startPercent={0}
                            endPercent={100}
                            message='Unlocking Door'
                            color={true}
                            onFinish={() => {
                                let overallState = { ...this.props.overallState };
                                overallState.doors[target] = SystemStatus.Offline;
                                this.props.updateOverallState(overallState);
                                this.props.writeText({ message: `${target} has been unlocked` }, () => {
                                    this.goToCommandLine();
                                });
                            }} />
                    ])
                })
            })
        }
    }

    doLockdown = () => {
        this.setState({ currentState: DoorControlGameState.Unloaded }, () => {
            this.props.writeText({ message: "Initiating door lockdown" }, () => {
                this.props.addLine([
                    <LoadingHelper
                        startPercent={0}
                        endPercent={100}
                        message='Lockdown starting...'
                        onFinish={() => {
                            let overallState = { ...this.props.overallState };
                            let doors = { ...overallState.doors };
                            Object.keys(overallState.doors).forEach((each) => {
                                doors[each] = SystemStatus.Online;
                            });
                            overallState.doors = doors;
                            this.props.updateOverallState(overallState);
                            this.props.writeText({ message: `Lockdown complete: All doors locked` }, () => {
                                this.goToCommandLine();
                            });
                        }} />
                ])
            })
        })
    }

    doHelp = () => {
        this.setState({ currentState: DoorControlGameState.Unloaded }, () => {
            this.props.addLine(['Commands available for use:',
                <div>status -- Gets status for available doors<br /> {'Usage: "> status"'}</div>,
                <div>help -- Opens this screen<br /> {'Usage: "> help"'}</div>,
                <div>logs -- Displays available logs<br />{'Usage: "> logs"'}</div>,
                <div>lock -- Attempts to lock a door<br />{'Usage: "> lock <door_name>"'}</div>,
                <div>unlock -- Attempt to unlock a door<br />{'Usage: "> unlock <door_name>"'}</div>,
                <div>lockdown -- Locks all doors, and sets an alert<br />{'Usage: "> lockdown"'}</div>,
                <div>clear -- Clears the console<br />{'Usage: "> clear"'}</div>,
                <div>logout -- Logs out of this account<br />{'Usage: "> logout"'}</div>,
            ], () => {
                this.goToCommandLine();
            })
        })
    }

    handleCommandAction = (command: string, args: string[], fullText: string) => {
        switch (command.toLowerCase()) {
            case 'status': {
                this.doStatus();
                break;
            }
            case 'help': {
                this.doHelp();
                break;
            }
            case 'lock': {
                this.doLock(args[0]);
                break;
            }
            case 'unlock': {
                this.doUnlock(args[0]);
                break;
            }
            case 'lockdown': {
                this.doLockdown();
                break
            }
            case 'logs': {
                this.doLogs();
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
    }

    generateLogsSection = () => {
        let logs = [...this.props.overallState.doorControlLogs];
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

    goToCommandLine = () => {
        this.setState({ currentState: DoorControlGameState.Loaded })
    }

    render() {
        return (<div>
            {this.state.currentState == DoorControlGameState.Loaded && <TerminalInputHelper onSumbitCommand={this.handleCommandAction} />}
            {this.state.currentState == DoorControlGameState.Logs && this.generateLogsSection()}
        </div>);
    }
}

export default DoorControl;