import * as React from 'react';
import { ConsolePicker, LoadingHelper, TerminalInputHelper, Types } from 'react-terminal-game-builder';
import { ComputerRecoveryOverallState } from './types';

/**
 * This is going to be a "Restore/Recovery disk"
 * 3 options
 *  - transfer backups (easy)
 *     - select destination
 *  - restore system/data (medium)
 *     - number puzzle
 */

/**
 * variables
 *  - system_name (Name of the system being currently used)
 *  - good_destination
 *  - destinations
 *  - rebooted_system_name
 *  
 */

enum GameState {
    NOT_LOADED,
    DISPLAY_CHOICES,
    TRANSFER_BACKUPS,
    RESTORE_DATA,
}

interface ComputerRestoreProps extends Types.GameComponentProps<ComputerRecoveryOverallState> {

}

interface ComputerRestoreState {
    gameState: GameState
}

const PuzzleArray = ["Finish the following sequence", '5 -> 7 -> 11 -> 13 -> 17 -> ??']

class ComputerRestore extends React.Component<ComputerRestoreProps, ComputerRestoreState> {
    state: ComputerRestoreState = { gameState: GameState.NOT_LOADED }

    componentDidMount() {
        this.restartSystem();
    }

    removeUserInput = (callback?: () => void) => {
        this.setState({ gameState: GameState.NOT_LOADED }, callback)
    }

    generateSystemName = () => {
        return this.props.overallState.recoverySystemName ? this.props.overallState.recoverySystemName : 'Computer core recovery disk';
    }

    generateRebootedSystemName = () => {
        return this.props.overallState.rebootedSystemName ? this.props.overallState.rebootedSystemName : 'data-disk-1136'
    }

    generateDestinations = () => {
        return this.props.overallState.destinations ? this.props.overallState.destinations : ["System-admin-776", "Unknown-access-request-port:77654"]
    }

    restartSystem = () => {
        this.setState({ gameState: GameState.NOT_LOADED }, () => {
            this.props.clearLines(() => {
                this.props.writeText({ message: `Initializing ${this.generateSystemName()}...` }, () => {
                    this.props.writeText({ message: `Please make a choice from the options below.` }, () => {
                        this.setState({ gameState: GameState.DISPLAY_CHOICES })
                    })
                })

            })
        })
    }

    generateChoices = () => {
        let choices: Types.OptionChoice[] = [
            {
                name: 'Transfer Backups',
                description: "Move internal backups to external systems that are in range.",
                action: this.doBackupTransfer
            },
            {
                name: 'Restore System/Data',
                description: "Repair and restore the connected system to an operational state",
                action: this.doSystemRestore
            }
        ];
        return (
            <ConsolePicker
                onBackout={() => {
                    this.restartSystem()
                }}
                options={choices}
                scrollToBottom={this.props.updateScroll}
            />
        )
    }

    generateBackupChoices = () => {
        let mappedChoices = this.generateDestinations().map((each) => {
            return {
                name: each,
                description: `Transfers backups to ${each}`,
                action: () => {
                    this.removeUserInput(() => {
                        this.props.writeText({ message: `Attempting to send backups to ${each}` }, () => {
                            this.props.addLine([
                                <LoadingHelper
                                    startPercent={0}
                                    endPercent={100}
                                    message='Transfer starting...'
                                    color
                                    transitionSpeed={200}
                                    showPercent
                                    onFinish={() => {
                                        this.props.writeText({ message: 'Successfully sent backups. Now returning to main menu.' }, () => {
                                            let overallState = { ...this.props.overallState };
                                            overallState.finishedBackupTransfer = true;
                                            this.props.updateOverallState(overallState, () => {
                                                this.restartSystem();
                                            })
                                        })
                                    }}
                                />
                            ])
                        })
                    })
                }
            }
        });
        return (
            <ConsolePicker
                options={mappedChoices}
                scrollToBottom={this.props.updateScroll}
                onBackout={() => {
                    this.setState({ gameState: GameState.DISPLAY_CHOICES })
                }}
            />
        )
    }

    doBackupTransfer = () => {
        if (this.props.overallState.backupsAvailable) {
            this.removeUserInput(() => {
                this.props.addLine(["Please select the location for the backup transfer"], () => {
                    this.setState({ gameState: GameState.TRANSFER_BACKUPS })
                })
            })
        }
        else {
            this.props.addLine(["This system is not detecting any available backups"]);
        }

    }

    doSystemRestore = () => {
        if (this.props.overallState.restoreAvailable && !this.props.overallState.finishedSystemRestore) {
            this.removeUserInput(() => {
                this.props.writeText({ message: `Attempting to restore ${this.generateRebootedSystemName()}...` }, () => {
                    this.props.addLine([
                        <LoadingHelper
                            startPercent={0}
                            endPercent={100}
                            message='Scanning for security features....'
                            onFinish={() => {
                                this.props.writeText({ message: 'Security has been detected on this partition. Please solve the following query:' }, () => {
                                    this.props.addLine([...PuzzleArray], () => {
                                        this.setState({ gameState: GameState.RESTORE_DATA })
                                    })
                                })
                            }}
                        />
                    ])
                })
            })
        }
        else if (this.props.overallState.finishedSystemRestore) {
            this.removeUserInput(() => {
                this.props.addLine(["Unable to restore system: System has already been restored."], () => {
                    this.setState({ gameState: GameState.DISPLAY_CHOICES })
                })

            })
        }
        else {
            this.removeUserInput(() => {
                this.props.addLine(['Unable to restore system: No system to restore was found.'], () => {
                    this.setState({ gameState: GameState.DISPLAY_CHOICES })
                })

            })
        }
    }

    handleNumberKeyCommand = (command: string, args: string[], fullText: string) => {
        this.props.addLine([fullText], () => {
            if (command === "19") {
                this.removeUserInput(() => {
                    this.props.clearLines(() => {
                        this.props.writeText({ message: `Prime sequence complete, now restoring ${this.generateRebootedSystemName()}...` }, () => {
                            this.props.addLine([
                                <LoadingHelper
                                    startPercent={0}
                                    endPercent={100}
                                    showPercent={true}
                                    transitionSpeed={60}
                                    message='Repairing boot sector...'
                                    onFinish={() => { }}
                                />,
                                <LoadingHelper
                                    startPercent={0}
                                    endPercent={100}
                                    showPercent={true}
                                    transitionSpeed={120}
                                    message='Restoring pass storage...'
                                    onFinish={() => { }}
                                />,
                                <LoadingHelper
                                    startPercent={0}
                                    endPercent={100}
                                    showPercent={true}
                                    transitionSpeed={200}
                                    message='Retrieving readable sectors...'
                                    onFinish={() => {
                                        this.props.addLine([
                                            <LoadingHelper
                                                startPercent={0}
                                                endPercent={100}
                                                showPercent={true}
                                                transitionSpeed={150}
                                                color
                                                message='Finishing system restore...'
                                                onFinish={() => {
                                                    let overallState = { ...this.props.overallState };
                                                    overallState.finishedSystemRestore = true;
                                                    this.props.updateOverallState(overallState, () => {
                                                        this.props.writeText({ message: `${this.generateRebootedSystemName()} restore successful! Now returning to main screen.` }, () => {
                                                            this.restartSystem()
                                                        })
                                                    })
                                                }}
                                            />,
                                        ])
                                    }}
                                />,
                                <LoadingHelper
                                    startPercent={0}
                                    endPercent={100}
                                    showPercent={true}
                                    transitionSpeed={75}
                                    message='Executing code sniffer...'
                                    onFinish={() => { }}
                                />,
                                <LoadingHelper
                                    startPercent={0}
                                    endPercent={100}
                                    showPercent={true}
                                    transitionSpeed={150}
                                    message='Building image...'
                                    onFinish={() => { }}
                                />,
                            ])
                        })
                    })
                })

            }
            else if (command === 'back') {
                this.restartSystem()
            }
            else if (command === 'help') {
                this.props.addLine([...PuzzleArray])
            }
            else {
                this.props.addLine(['Prime sequencing failure, please try again. Type "help" to see the question again, or "back" to return to main menu.'])
            }
        })
    }

    render() {
        return (<div>
            {this.state.gameState === GameState.DISPLAY_CHOICES && this.generateChoices()}
            {this.state.gameState === GameState.TRANSFER_BACKUPS && this.generateBackupChoices()}
            {this.state.gameState === GameState.RESTORE_DATA && <TerminalInputHelper onSumbitCommand={this.handleNumberKeyCommand} />}
        </div>);

    }
}

export default ComputerRestore;