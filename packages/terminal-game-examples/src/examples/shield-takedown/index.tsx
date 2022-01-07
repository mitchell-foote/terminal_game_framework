import * as React from 'react';
import { ConsolePicker, LoadingHelper, TerminalInputHelper, Types } from 'react-terminal-game-builder';
import { ArchiveList } from './archives';
import { generateShieldTakedownDefaultState } from './default-status';
import ShieldMonitor, { ShieldMonitorStatus } from './shield-monitor/shield-monitor';
import { LogsType } from './types';

/**
 * Look up fun mini puzzles
 */



export enum ShieldTakedownLeverPosition {
    NOT_ENGAGED = 'NOT_ENGAGED',
    UP = 'UP',
    MIDDLE = 'MIDDLE',
    DOWN = 'DOWN'
}

enum ShieldTakedownGameState {
    NOT_STARTED,
    ARCHIVES,
    COMMAND_LINE
}

export interface ShieldTakedownTotalState {
    lever1: ShieldTakedownLeverPosition
    lever2: ShieldTakedownLeverPosition
    lever3: ShieldTakedownLeverPosition
    lever4: ShieldTakedownLeverPosition
    archives: LogsType[]
    success: boolean
}

interface ShieldTakedownMainComponentProps extends Types.GameComponentProps<ShieldTakedownTotalState> {

}

interface ShieldTakedownMainComponentState {
    gameState: ShieldTakedownGameState
}

class ShieldTakedownMainComponent extends React.Component<ShieldTakedownMainComponentProps, ShieldTakedownMainComponentState> {
    state: ShieldTakedownMainComponentState = { gameState: ShieldTakedownGameState.NOT_STARTED }

    componentDidMount() {
        let overallState = { ...this.props.overallState };
        if (overallState.lever1 === undefined || overallState.lever1 === null) {
            overallState = generateShieldTakedownDefaultState();
            this.props.updateOverallState(overallState, () => {
                this.props.addLine(["Shield Generator Access v3.0"], () => {
                    this.props.writeText({ message: "Access terminal initiating, loading shield profile..." }, () => {
                        this.props.writeText({ message: "Type 'help' to gain access to command list." }, () => {
                            this.goToCommandLine();
                        })
                    })
                })
            })
        }
        else {
            this.props.addLine(["Shield Generator Access v3.0"], () => {
                this.props.writeText({ message: "Access terminal initiating, loading shield profile..." }, () => {
                    this.props.writeText({ message: "Type 'help' to gain access to command list." }, () => {
                        this.goToCommandLine();
                    })
                })
            })
        }

    }

    turnOffCommandLine = (callback?: () => void) => {
        this.setState({ gameState: ShieldTakedownGameState.NOT_STARTED }, callback)
    }

    goToCommandLine = (callback?: () => void) => {
        this.setState({ gameState: ShieldTakedownGameState.COMMAND_LINE }, callback);
    }

    doHelp = () => {
        this.props.addLine([
            "Here are the available commands:",
            "shield_check - Checks the current status of the shield. Ex: '> shield_check'",
            "lever_check - Checks the current status of the levers. Ex: '> lever_check'",
            "archives - Scans the archives for prominent data. Ex: '> archives'",
            "help - Shows the list of available commands. Ex: '> help'",
            "clear - Clears the terminal. Ex: '> clear'",
            "set_up - Sets the lever to the up position. Ex: '> set_up <lever name>'",
            "set_down - Sets the lever to the down position. Ex: '> set_down <lever name>'",
            "set_middle - Sets the lever to the down position. Ex:'> set_middle <lever name>'",
            "pulse - Sends an energy pulse through the shielding system. Ex: '> pulse'"
        ], () => {
            this.goToCommandLine()
        })
    }

    getCurrentShieldValue = () => {
        let shieldValue = ShieldMonitorStatus.NORMAL;
        let level = 0;
        if (this.props.overallState.success) {
            return ShieldMonitorStatus.NO_SHIELD;
        }
        if (this.props.overallState.lever1 === ShieldTakedownLeverPosition.MIDDLE) {
            level++;
        }
        if (this.props.overallState.lever2 === ShieldTakedownLeverPosition.DOWN) {
            level++;
        }
        if (this.props.overallState.lever3 === ShieldTakedownLeverPosition.UP) {
            level++;
        }
        if (this.props.overallState.lever4 === ShieldTakedownLeverPosition.UP) {
            level++
        }
        if (level === 4) {
            shieldValue = ShieldMonitorStatus.CRITICAL_ISSUES
        }
        else if (level === 3) {
            shieldValue = ShieldMonitorStatus.DANGEROUS_ISSUES
        }
        else if (level === 2) {
            shieldValue = ShieldMonitorStatus.MODERATE_ISSUES
        }
        else if (level === 1) {
            shieldValue = ShieldMonitorStatus.MILD_ISSUES
        }
        return shieldValue;
    }

    generateLeverPosition = (position: ShieldTakedownLeverPosition) => {
        switch (position) {
            case ShieldTakedownLeverPosition.NOT_ENGAGED: {
                return "Lever is not engaged."
            }
            case ShieldTakedownLeverPosition.UP: {
                return "Lever is in the UP position."
            }
            case ShieldTakedownLeverPosition.MIDDLE: {
                return "Lever is in the MIDDLE position."
            }
            case ShieldTakedownLeverPosition.DOWN: {
                return "Lever is in the DOWN position"
            }
        }
    }

    generateShieldGraphic = (pulse: boolean, callback: () => void) => {
        let shieldValue = this.getCurrentShieldValue();
        if (pulse && shieldValue === ShieldMonitorStatus.CRITICAL_ISSUES) {
            let newOverallState = { ...this.props.overallState };
            newOverallState.success = true;
            this.props.writeText({ message: "Danger: Pulse execution destablizing shield grid!", color: "red" }, () => {
                this.props.addLine([
                    "Shield Stability...",
                    <LoadingHelper
                        startPercent={100}
                        endPercent={0}
                        transitionSpeed={100}
                        showPercent={true}
                        message={""}
                        onFinish={() => {
                            this.props.clearLines(() => {
                                this.props.writeText({ message: "Danger! Shield has failed!", color: 'red' }, () => {
                                    this.props.addLine([
                                        <ShieldMonitor
                                            onFinishedAnimation={() => {
                                                this.props.updateOverallState(newOverallState, () => {
                                                    this.goToCommandLine();
                                                })
                                            }}
                                            color='red'
                                            shieldsType={ShieldMonitorStatus.SHIELDS_FAILING}
                                        />
                                    ])
                                })

                            })

                        }}
                        color={true} />])
            })
        }
        else {
            let aboveText = ""
            let color
            switch (shieldValue) {
                case ShieldMonitorStatus.NORMAL: {
                    aboveText = "Shield is operating normally"
                    break;
                }
                case ShieldMonitorStatus.MILD_ISSUES: {
                    aboveText = "Shield is having minor fluctuations"
                    color = "yellow"
                    break;
                }
                case ShieldMonitorStatus.MODERATE_ISSUES: {
                    aboveText = "Moderate fluctuations detected";
                    color = "yellow"
                    break;
                }
                case ShieldMonitorStatus.DANGEROUS_ISSUES: {
                    aboveText = "Warning! Shield fluctuations at dangerous levels, please alert an officer immediately";
                    color = "yellow"
                    break;
                }
                case ShieldMonitorStatus.CRITICAL_ISSUES: {
                    aboveText = "Danger! Shield fluctuations are at critical. Do not run the 'pulse' command, as it could disable the shielding system!"
                    color = "red"
                    break;
                }
                case ShieldMonitorStatus.NO_SHIELD: {
                    aboveText = "Shielding systems are offline."
                    color = "red"
                }
            }
            this.props.addLine([aboveText,
                <ShieldMonitor
                    onFinishedAnimation={callback}
                    shieldsType={shieldValue}
                    color={color}
                />
            ])
        }
    }

    onArchives = () => {
        this.props.writeText({ message: "Searching archives for relevant information..." }, () => {
            this.props.addLine([
                <LoadingHelper
                    message=''
                    startPercent={0}
                    endPercent={100}
                    onFinish={() => {
                        this.setState({ gameState: ShieldTakedownGameState.ARCHIVES })
                    }}
                />])
        })
    }

    onShieldCheck = () => {
        this.props.writeText({ message: "Running shield diagnostics..." }, () => {
            this.props.addLine([<LoadingHelper
                message='Checking Shield...'
                startPercent={0}
                transitionSpeed={50}
                endPercent={100}
                onFinish={() => {
                    this.props.addLine([this.generateShieldGraphic(false, () => this.goToCommandLine())])
                }}
            />])
        })

    }
    onLeverCheck = () => {
        this.props.addLine([
            <div><span>lever_1</span><span>-</span><span>{this.generateLeverPosition(this.props.overallState.lever1)}</span></div>,
            <div><span>lever_2</span><span>-</span><span>{this.generateLeverPosition(this.props.overallState.lever2)}</span></div>,
            <div><span>lever_3</span><span>-</span><span>{this.generateLeverPosition(this.props.overallState.lever3)}</span></div>,
            <div><span>lever_4</span><span>-</span><span>{this.generateLeverPosition(this.props.overallState.lever4)}</span></div>,
        ], () => {
            this.goToCommandLine();
        })
    }

    onSetMiddle = (lever: string) => {
        if (lever) {
            switch (lever) {
                case "lever_1": {
                    let overallState = { ...this.props.overallState };
                    overallState.lever1 = ShieldTakedownLeverPosition.MIDDLE;
                    this.props.updateOverallState(overallState, () => {
                        this.props.addLine([`${lever} is now set to MIDDLE`], () => {
                            this.goToCommandLine();
                        })

                    })
                    break;
                }
                case "lever_2": {
                    let overallState = { ...this.props.overallState };
                    overallState.lever2 = ShieldTakedownLeverPosition.MIDDLE;
                    this.props.updateOverallState(overallState, () => {
                        this.props.addLine([`${lever} is now set to MIDDLE`], () => {
                            this.goToCommandLine();
                        })
                    })
                    break;
                }
                case "lever_3": {
                    let overallState = { ...this.props.overallState };
                    overallState.lever3 = ShieldTakedownLeverPosition.MIDDLE;
                    this.props.updateOverallState(overallState, () => {
                        this.props.addLine([`${lever} is now set to MIDDLE`], () => {
                            this.goToCommandLine();
                        })
                    })
                    break;
                }
                case "lever_4": {
                    let overallState = { ...this.props.overallState };
                    overallState.lever4 = ShieldTakedownLeverPosition.MIDDLE;
                    this.props.updateOverallState(overallState, () => {
                        this.props.addLine([`${lever} is now set to MIDDLE`], () => {
                            this.goToCommandLine();
                        })
                    })
                    break;
                }
                default: {
                    this.props.addLine([`Unable to move to MIDDLE: Lever ${lever} is invalid.`], () => {
                        this.goToCommandLine();
                    })
                }
            }
        }
        else {
            this.props.addLine(["Unable to move to MIDDLE: Lever was not specified."], () => {
                this.goToCommandLine()
            })
        }
    }

    onSetDown = (lever: string) => {
        if (lever) {
            switch (lever) {
                case "lever_1": {
                    let overallState = { ...this.props.overallState };
                    overallState.lever1 = ShieldTakedownLeverPosition.DOWN;
                    this.props.updateOverallState(overallState, () => {
                        this.props.addLine([`${lever} is now set to DOWN`], () => {
                            this.goToCommandLine();
                        })
                    })
                    break;
                }
                case "lever_2": {
                    let overallState = { ...this.props.overallState };
                    overallState.lever2 = ShieldTakedownLeverPosition.DOWN;
                    this.props.updateOverallState(overallState, () => {
                        this.props.addLine([`${lever} is now set to DOWN`], () => {
                            this.goToCommandLine();
                        })
                    })
                    break;
                }
                case "lever_3": {
                    let overallState = { ...this.props.overallState };
                    overallState.lever3 = ShieldTakedownLeverPosition.DOWN;
                    this.props.updateOverallState(overallState, () => {
                        this.props.addLine([`${lever} is now set to DOWN`], () => {
                            this.goToCommandLine();
                        })
                    })
                    break;
                }
                case "lever_4": {
                    let overallState = { ...this.props.overallState };
                    overallState.lever4 = ShieldTakedownLeverPosition.DOWN;
                    this.props.updateOverallState(overallState, () => {
                        this.props.addLine([`${lever} is now set to DOWN`], () => {
                            this.goToCommandLine();
                        })
                    })
                    break;
                }
                default: {
                    this.props.addLine([`Unable to move to DOWN: Lever ${lever} is invalid.`], () => {
                        this.goToCommandLine();
                    })
                }
            }
        }
        else {
            this.props.addLine(["Unable to move to DOWN: Lever was not specified."], () => {
                this.goToCommandLine()
            })
        }
    }

    onSetUp = (lever: string) => {
        if (lever) {
            switch (lever) {
                case "lever_1": {
                    let overallState = { ...this.props.overallState };
                    overallState.lever1 = ShieldTakedownLeverPosition.UP;
                    this.props.updateOverallState(overallState, () => {
                        this.props.addLine([`${lever} is now set to UP`], () => {
                            this.goToCommandLine();
                        })
                    })
                    break;
                }
                case "lever_2": {
                    let overallState = { ...this.props.overallState };
                    overallState.lever2 = ShieldTakedownLeverPosition.UP;
                    this.props.updateOverallState(overallState, () => {
                        this.props.addLine([`${lever} is now set to UP`], () => {
                            this.goToCommandLine();
                        })
                    })
                    break;
                }
                case "lever_3": {
                    let overallState = { ...this.props.overallState };
                    overallState.lever3 = ShieldTakedownLeverPosition.UP;
                    this.props.updateOverallState(overallState, () => {
                        this.props.addLine([`${lever} is now set to UP`], () => {
                            this.goToCommandLine();
                        })
                    })
                    break;
                }
                case "lever_4": {
                    let overallState = { ...this.props.overallState };
                    overallState.lever4 = ShieldTakedownLeverPosition.UP;
                    this.props.updateOverallState(overallState, () => {
                        this.props.addLine([`${lever} is now set to UP`], () => {
                            this.goToCommandLine();
                        })
                    })
                    break;
                }
                default: {
                    this.props.addLine([`Unable to move to UP: Lever ${lever} is invalid.`], () => {
                        this.goToCommandLine();
                    })
                }
            }
        }
        else {
            this.props.addLine(["Unable to move to UP: Lever was not specified."], () => {
                this.goToCommandLine()
            })
        }
    }

    onSuccessCommand = () => {
        this.props.addLine(["Unable to run command: Shielding system is offline"], () => {
            this.goToCommandLine();
        })
    }

    onPulse = () => {
        if (this.getCurrentShieldValue() === ShieldMonitorStatus.CRITICAL_ISSUES) {
            this.generateShieldGraphic(true, () => {
                this.goToCommandLine();
            })
        }
        else {
            this.props.writeText({ message: "Executing shield pulse..." }, () => {
                this.props.addLine([
                    <LoadingHelper
                        startPercent={0}
                        endPercent={100}
                        showPercent={true}
                        message=''
                        transitionSpeed={25}
                        onFinish={() => {
                            this.props.writeText({ message: "Shield pulse success: System operational" }, () => {
                                this.goToCommandLine();
                            })
                        }}
                    />
                ])
            })
        }
    }

    onSubmitCommand = (command: string, args: string[], fullText: string) => {
        this.turnOffCommandLine(() => {
            this.props.addLine([fullText], () => {
                switch (command.toLowerCase()) {
                    case "shield_check": {
                        this.onShieldCheck();
                        break;
                    }
                    case "lever_check": {
                        !this.props.overallState.success && this.onLeverCheck();
                        this.props.overallState.success && this.onSuccessCommand()
                        break;
                    }
                    case "archives": {
                        this.onArchives();
                        break;
                    }
                    case "help": {
                        this.doHelp()
                        break;
                    }
                    case "clear": {
                        this.props.clearLines(() => {
                            this.goToCommandLine()
                        })
                        break;
                    }
                    case "set_up": {
                        !this.props.overallState.success && this.onSetUp(args[0]);
                        this.props.overallState.success && this.onSuccessCommand()
                        break;
                    }
                    case "set_down": {
                        !this.props.overallState.success && this.onSetDown(args[0]);
                        this.props.overallState.success && this.onSuccessCommand()
                        break;
                    }
                    case "set_middle": {
                        !this.props.overallState.success && this.onSetMiddle(args[0]);
                        this.props.overallState.success && this.onSuccessCommand()
                        break;
                    }
                    case "pulse": {
                        !this.props.overallState.success && this.onPulse();
                        this.props.overallState.success && this.onSuccessCommand()
                        break;
                    }
                    case "": {
                        this.goToCommandLine();
                        break;
                    }
                    default: {
                        this.props.addLine(["Please enter a valid command, use the command 'help' if needed."], () => {
                            this.goToCommandLine();
                        })
                    }
                }
            })
        })
    }

    generateArchivesSection = () => {
        let archives = [...this.props.overallState.archives];
        let mappedArchives: Types.OptionChoice[] = archives.map((each) => {
            return {
                name: each.title,
                description: each.description,
                action: () => {
                    this.setState({ gameState: ShieldTakedownGameState.NOT_STARTED }, () => {
                        this.props.addLine([
                            "--------------------",
                            `Name: ${each.title}`,
                            `Title: ${each.description}`,
                            each.text,
                            "--------------------",
                        ], () => {
                            setTimeout(() => {
                                this.setState({ gameState: ShieldTakedownGameState.ARCHIVES })
                            }, 1000)
                        })
                    })

                }
            }
        })
        return (
            <ConsolePicker
                onBackout={() => {
                    this.setState({ gameState: ShieldTakedownGameState.NOT_STARTED }, () => {
                        setTimeout(() => {
                            this.goToCommandLine();
                        }, 1000)
                    })
                }}
                scrollToBottom={this.props.updateScroll}
                options={mappedArchives} />
        )
    }

    render() {
        return (
            <div>
                {this.state.gameState === ShieldTakedownGameState.COMMAND_LINE && <TerminalInputHelper onSumbitCommand={this.onSubmitCommand} />}
                {this.state.gameState === ShieldTakedownGameState.ARCHIVES && this.generateArchivesSection()}

            </div>
        );
    }
}

export default ShieldTakedownMainComponent;