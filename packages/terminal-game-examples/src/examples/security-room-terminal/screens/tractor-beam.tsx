import * as React from 'react';
import { Component } from 'react';
import { LoadingHelper, OptionsHelper, TerminalInputHelper, Types } from 'react-terminal-game-builder';
import { LogsType, SystemStatus } from '../types';

enum TractorBeamControlGameState {
    Loaded,
    Unloaded,
    Logs
}

interface TractorBeamControlProps extends Types.GameComponentProps<TractorBeamControlState> {
    onLogout: Function;
}

export interface TractorBeamControlState {
    tractorBeamLogs: LogsType[];
    tractorTargets: Record<string, SystemStatus>
}

interface TractorBeamControlComponentState {
    currentState: TractorBeamControlGameState
}

class TractorBeamControl extends React.Component<TractorBeamControlProps, TractorBeamControlComponentState> {
    state: TractorBeamControlComponentState = { currentState: TractorBeamControlGameState.Unloaded }

    componentDidMount() {
        this.props.clearLines(() => {
            this.props.writeText({ message: "Tractor Beam Remote Access Control v1.14.3" }, () => {
                this.props.writeText({ message: "Type 'help' for command listing" }, () => {
                    this.goToCommandLine()
                })
            })
        })
    }

    goToCommandLine = () => {
        this.setState({ currentState: TractorBeamControlGameState.Loaded })
    }

    doSearch = () => {
        this.setState({ currentState: TractorBeamControlGameState.Unloaded }, () => {
            this.props.addLine([
                <LoadingHelper
                    startPercent={0}
                    endPercent={100}
                    message='Sensor sweep in progress'
                    onFinish={() => {
                        this.props.addLine(Object.keys(this.props.overallState.tractorTargets).map((each) => {
                            let status = this.props.overallState.tractorTargets[each];
                            return <div>{each} - {status === SystemStatus.Online ? "Tractor beam activated" : "Available to tractor beam"}</div>
                        }), () => {
                            this.goToCommandLine();
                        })
                    }} />
            ])
        })
    }

    doLogs = () => {
        this.setState({ currentState: TractorBeamControlGameState.Logs });
    }

    doEngage = (target: string) => {
        let value = this.props.overallState.tractorTargets[target];
        if (value === undefined) {
            this.props.addLine(["Unable to engage: Invalid Target - Recommend running 'search' to get available ship names"], () => {
                this.goToCommandLine();
            })
        }
        else if (value === SystemStatus.Online) {
            this.props.addLine(['Unable to engage: Target is already being tractored'], () => {
                this.goToCommandLine();
            })
        }
        else {
            this.setState({ currentState: TractorBeamControlGameState.Unloaded }, () => {
                this.props.writeText({ message: 'Attempting to lock target...' }, () => {
                    this.props.addLine([
                        <LoadingHelper
                            startPercent={0}
                            endPercent={100}
                            message='Locking Target'
                            color={true}
                            onFinish={() => {
                                let overallState = { ...this.props.overallState };
                                overallState.tractorTargets[target] = SystemStatus.Online;
                                this.props.updateOverallState(overallState);
                                this.props.writeText({ message: `${target} is now being tractor beamed` }, () => {
                                    this.goToCommandLine();
                                });
                            }} />
                    ])
                })
            })
        }
    }

    doDisengage = (target: string) => {
        let value = this.props.overallState.tractorTargets[target];
        if (value === undefined) {
            this.props.addLine(["Unable to disengage: Invalid Target - Recommend running 'search' to get available ship names"], () => {
                this.goToCommandLine();
            })
        }
        else if (value === SystemStatus.Offline) {
            this.props.addLine(['Unable to disengage: Target is not being tractored'], () => {
                this.goToCommandLine();
            })
        }
        else {
            this.setState({ currentState: TractorBeamControlGameState.Unloaded }, () => {
                this.props.writeText({ message: 'Disengaging target lock...' }, () => {
                    this.props.addLine([
                        <LoadingHelper
                            startPercent={100}
                            endPercent={0}
                            message='Releasing Target'
                            color={true}
                            onFinish={() => {
                                let overallState = { ...this.props.overallState };
                                overallState.tractorTargets[target] = SystemStatus.Offline;
                                this.props.updateOverallState(overallState);
                                this.props.writeText({ message: `${target} has been released` }, () => {
                                    this.goToCommandLine();
                                });
                            }} />
                    ])
                })
            })
        }
    }

    doHelp = () => {
        this.setState({ currentState: TractorBeamControlGameState.Unloaded }, () => {
            this.props.addLine(["Commands available for use:",
                <div>search -- Seaches for tractor beam targets<br /> {'Usage: "> search"'}</div>,
                <div>help -- Opens this screen<br /> {'Usage: "> help"'}</div>,
                <div>logs -- Displays available logs<br />{'Usage: "> logs"'}</div>,
                <div>engage -- Engages tractor beam<br />{'Usage: "> engage <ship_name>"'}</div>,
                <div>disengage -- Disengages the tractor beam<br />{'Usage: "> disengage <ship_name>"'}</div>,
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
                case 'search': {
                    this.doSearch();
                    break;
                }
                case 'logs': {
                    this.doLogs();
                    break;
                }
                case 'engage': {
                    this.doEngage(args[0]);
                    break;
                }
                case 'disengage': {
                    this.doDisengage(args[0]);
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
                    this.props.onLogout()
                    break;
                }
                default: {
                    this.props.addLine(['Unknown command. Type "help" to get a list of commands'])
                }
            }
        })


    }

    generateLogsSection = () => {
        let logs = [...this.props.overallState.tractorBeamLogs];
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
            {this.state.currentState === TractorBeamControlGameState.Loaded && <TerminalInputHelper onSumbitCommand={this.handleCommandAction} />}
            {this.state.currentState === TractorBeamControlGameState.Logs && this.generateLogsSection()}
        </div>);
    }
}

export default TractorBeamControl;