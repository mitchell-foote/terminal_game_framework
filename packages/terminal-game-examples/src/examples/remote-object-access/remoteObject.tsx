import * as React from 'react';
import { Types, LoadingHelper, OptionsHelper, TerminalInputHelper } from 'react-terminal-game-builder';
import { generateHackedText } from './helpers';
import { Logs } from './data';

enum GameState {
    NotLoaded,
    MainPage,
    Logs,
    SystemCheck
}


export interface RemoteObjectProps extends Types.GameComponentProps {
    onLogout: Function;
}

export interface RemoteObjectState {
    gameState: GameState,
    commandsUsed: number,
    hack1: boolean,
    hack2: boolean,
    finalHack: boolean,
    hasUsedSensors: boolean
}

class RemoteObject extends React.Component<RemoteObjectProps, RemoteObjectState> {
    state: RemoteObjectState = { gameState: GameState.NotLoaded, commandsUsed: 0, hack1: false, hack2: false, finalHack: false, hasUsedSensors: false }

    componentDidMount() {
        this.props.clearLines(() => {
            this.props.writeText({ message: "Sat-1254 Access Terminal" }, () => {
                this.props.writeText({ message: "Type 'help' for command listings" }, () => {
                    this.setState({ gameState: GameState.MainPage });
                })
            })
        })
    }

    componentDidUpdate() {
        if (this.state.commandsUsed > 6 && !this.state.hack1) {
            this.handleHack1();
        }
        else if (this.state.commandsUsed > 10 && !this.state.hack2) {
            this.handleHack2();
        }
        else if (this.state.commandsUsed > 15 && !this.state.finalHack) {
            this.handleFinalHack();
        }
    }

    handleHack1 = () => {
        this.setState({ hack1: true, gameState: GameState.NotLoaded }, () => {
            this.props.writeText({ message: 'Unauthorized signal detected...', color: "yellow" }, () => {
                this.setState({ gameState: GameState.MainPage });
            })

        })
    }

    handleHack2 = () => {
        this.setState({ hack2: true, gameState: GameState.NotLoaded }, () => {
            this.props.writeText({ message: "Firewall breach det", color: 'yellow' }, () => {
                this.props.writeText({ message: "Where... Are... YOU?", color: 'red', keystrokeTimeing: 300 }, () => {
                    this.setState({ gameState: GameState.MainPage })
                })

            })
        })
    }

    handleFinalHack = () => {
        this.setState({ finalHack: true, gameState: GameState.NotLoaded }, () => {
            this.props.clearLines(() => {
                this.props.writeText({ message: "I... Found.... YOU... XD", nextComponentDelay: 2, keystrokeTimeing: 500, color: 'red' }, () => {
                    this.props.writeText({ message: "Connection Terminated", nextComponentDelay: 5 }, () => {
                        this.props.onLogout();
                    })
                })
            })

        })
    }

    handleCommandAction = (command: string, args: string[], fullText: string) => {
        switch (command.toLowerCase()) {
            case 'logs': {
                this.doLogs();
                break;
            }
            case 'system_check': {
                this.doSystemCheck();
                break;
            }
            case 'clear': {
                this.props.clearLines();
                break;
            }
            case 'help': {
                this.doHelp();
                break;
            }
            case 'repair': {
                this.doRepair(args[0]);
                break;
            }
            case 'restart': {
                this.doRestart(args[0])
                break
            }
            case 'use': {
                this.doUse(args[0]);
                break;
            }
            case 'logout': {
                this.doLogout();
                break;
            }
            case 'self_destruct': {
                this.doSelfDestruct();
                break;
            }
            default: {
                this.props.addLine([generateHackedText("Command not recognized", this.state.commandsUsed)])
            }
        }
    }

    doUse = (system: string) => {
        console.log('In use', system);
        this.setState({ gameState: GameState.NotLoaded }, () => {
            if (system) {
                let systemList = this.props.overallState.systemList;
                let systemStatus = systemList[system];
                if (systemStatus !== 'ready') {
                    this.props.addLine([generateHackedText(`system is unable to be used`, this.state.commandsUsed)], () => {
                        this.goToCommandLine();

                    })
                }
                else if (systemList['computer'] !== 'ready') {
                    this.props.addLine([generateHackedText(`Computer system must be ready in order to use other systems`, this.state.commandsUsed)], () => {
                        this.goToCommandLine();
                    })

                }
                else {
                    switch (system) {
                        case 'computer': {
                            this.props.addLine([generateHackedText(`Computer system is already in use`, this.state.commandsUsed)], () => {
                                this.goToCommandLine();
                            });

                            break;
                        }
                        case 'engines': {
                            this.props.addLine([generateHackedText(`Engine system cannot be used without authorization`, this.state.commandsUsed)], () => {
                                this.goToCommandLine();
                            });

                            break;
                        }
                        case 'communications': {
                            if (this.state.hasUsedSensors) {
                                this.setState({ gameState: GameState.NotLoaded }, () => {
                                    this.props.writeText({ message: 'Beginning backtrace of hacking signal...' }, () => {
                                        this.props.addLine([
                                            <LoadingHelper
                                                message="Backtracing..."
                                                startPercent={0}
                                                endPercent={100}
                                                color={true}
                                                showPercent={true}
                                                onFinish={
                                                    () => {
                                                        this.props.writeText({ message: 'Backtrace Successful: Sat-Name="evl-crp-123" Sat-Access-Code="8675309"' }, () => {
                                                            this.goToCommandLine();
                                                        })
                                                    }
                                                } />])
                                    })
                                })
                            }
                            else {
                                this.props.writeText({ message: 'No comunications target. Please use sensors first to gain target' }, () => {
                                    this.goToCommandLine();
                                })
                            }

                            break;
                        }
                        case 'repair': {
                            this.props.addLine(['Repair system is used via the main command line', 'Example "> repair engines"'], () => {
                                this.goToCommandLine();
                            });

                            break;
                        }
                        case 'restart': {
                            this.props.addLine(['Restart system is used via the main command line', 'Example "> restart communications"'], () => {
                                this.goToCommandLine();
                            });

                            break;

                        }
                        case 'sensors': {
                            if (this.props.overallState.systemList.engines === 'ready') {
                                this.props.writeText({ message: "Running sweep" }, () => {
                                    this.props.addLine([<LoadingHelper
                                        message="Scanning..."
                                        startPercent={0}
                                        endPercent={100}
                                        showPercent={true}
                                        onFinish={
                                            () => {
                                                this.props.writeText({ message: 'Hacking signal detected: Run communications system to get backtrace' }, () => {
                                                    this.setState({ hasUsedSensors: true }, () => {
                                                        this.goToCommandLine();
                                                    })

                                                })
                                            }
                                        } />])
                                })
                            }
                            else {
                                this.props.writeText({ message: 'Engine system needs to be ready in order to use sensors' }, () => {
                                    this.goToCommandLine();
                                })
                            }

                            break;
                        }
                        case 'self_destruct': {
                            this.props.addLine([<div>{generateHackedText("Self Destruct system is used via the main command line", this.state.commandsUsed)}<br />{'Example: "> self_destruct"'}</div>], () => {
                                this.goToCommandLine();
                            })
                            break;
                        }
                    }
                }
            }
            else {
                this.props.addLine([generateHackedText("Use command was used incorrectly", this.state.commandsUsed), generateHackedText("Example: '> use sensors", this.state.commandsUsed)], () => {
                    this.goToCommandLine();
                })

                // show usage
            }
        })


    }

    doLogs = () => {
        this.setState({ gameState: GameState.Logs })
    }

    handleLogsBack = () => {
        this.goToCommandLine();
    }

    doSystemCheck = () => {
        this.setState({ gameState: GameState.NotLoaded }, () => {
            this.props.addLine([<LoadingHelper message={"Running system check"} startPercent={0} endPercent={100} onFinish={() => {
                let messageArray: any[] = [generateHackedText("Current System", this.state.commandsUsed)];
                let systemList = this.props.overallState.systemList;
                messageArray.push(<div>
                    {`computer -- ${systemList['computer']}`}<br />
                    {`engines -- ${systemList['engines']}`}<br />
                    {`communications -- ${systemList['communications']}`} <br />
                    {`repair -- ${systemList['repair']}`} <br />
                    {`sensors -- ${systemList['sensors']}`} <br />
                </div>);
                this.props.addLine(messageArray, () => {
                    this.goToCommandLine();
                })
            }} />])
        });
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
                <div>clear -- Clears the console <br />{'Usage: "> clear"'}</div>,
                <div>logout -- Logs out of satellite<br /> {'Usage: "> logout"'} </div>,
                <div>self_destruct -- start self destruct sequence (not recommended)<br /> {'Usage "> self_destruct"'} </div>,
            ], () => {
                this.goToCommandLine();
            })
        })
    }

    doRepair = (system: string) => {
        this.setState({ gameState: GameState.NotLoaded }, () => {
            let overallState = { ...this.props.overallState };
            if (system && overallState.systemList[system]) {
                switch (overallState.systemList[system]) {
                    case 'error': {
                        this.props.addLine([<LoadingHelper message={generateHackedText(`Repairing ${system}`, this.state.commandsUsed)} startPercent={0} endPercent={100} onFinish={() => {
                            overallState.systemList[system] = 'ready';
                            this.props.updateOverallState(overallState, () => {
                                this.props.writeText({ message: `System has been repaired` }, () => {
                                    this.goToCommandLine();
                                })

                            })
                        }} />]);
                        break;
                    }
                    default: {
                        this.props.addLine([`system does not need repair`], () => {
                            this.goToCommandLine();
                        })
                    }
                }
            }
            else {
                this.props.addLine(['Repair command used incorrectly', 'Example: "> repair engines"'], () => {
                    this.goToCommandLine();
                })
            }
        })
    }

    doRestart = (system: string) => {
        this.setState({ gameState: GameState.NotLoaded }, () => {
            let overallState = { ...this.props.overallState };
            if (system && overallState.systemList[system]) {
                switch (overallState.systemList[system]) {
                    case 'offline': {
                        this.props.addLine([<LoadingHelper message={generateHackedText(`Restarting ${system}`, this.state.commandsUsed)} startPercent={0} endPercent={100} onFinish={() => {
                            overallState.systemList[system] = 'ready';
                            this.props.updateOverallState(overallState, () => {
                                this.props.writeText({ message: `${system} has been restarted` }, () => {
                                    this.goToCommandLine();
                                })

                            })
                        }} />]);
                        break;
                    }
                    default: {
                        this.props.addLine([`${system} does not need restart`], () => {
                            this.goToCommandLine();
                        })
                    }
                }
            }
            else {
                this.props.addLine(['Restart command used incorrectly', 'Example: "> restart engines"'], () => {
                    this.goToCommandLine();
                })
            }
        })
    }

    doLogout = () => {
        this.props.onLogout();
    }

    doSelfDestruct = () => {
        this.setState({ gameState: GameState.NotLoaded }, () => {
            this.props.addLine([<LoadingHelper
                message="Self destruct countdown"
                startPercent={100}
                endPercent={23}
                color={true}
                onFinish={() => {
                    this.props.writeText({ message: 'Self destruct aborted by remote signal' }, () => {
                        this.goToCommandLine();
                    })
                }}
            />])
        })
    }

    goToCommandLine = () => {
        this.props.writeText({ message: generateHackedText(`Sat command line: type 'help' for command list`, this.state.commandsUsed) }, () => {
            this.setState({ gameState: GameState.MainPage, commandsUsed: this.state.commandsUsed + 1 });

        })
    }

    generateLogsSection = () => {
        let logs = Logs;
        let mappedLogs: Types.OptionChoice[] = logs.map((each) => {
            return {
                name: each.title,
                description: each.description,
                action: () => {
                    this.props.addLine(["--------------------", `Log: ${each.title}`, `Title: ${each.description}`, each.text, "-------------------"]);
                }
            }
        });
        mappedLogs.push({
            name: 'back',
            description: generateHackedText('return to previous page', this.state.commandsUsed),
            action: () => {
                this.goToCommandLine();
            }
        });
        return (<OptionsHelper options={mappedLogs} addLine={this.props.addLine} allowNumberChoice={true} />)
    }


    render() {
        return (<div>
            {this.state.gameState === GameState.MainPage && <TerminalInputHelper onSumbitCommand={this.handleCommandAction} />}
            {this.state.gameState === GameState.Logs && this.generateLogsSection()}
        </div>);
    }
}

export default RemoteObject;