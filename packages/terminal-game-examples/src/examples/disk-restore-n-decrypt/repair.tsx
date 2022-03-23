import * as React from 'react';
import { Component } from 'react';
import { LoadingHelper, TerminalInputHelper, Types } from 'react-terminal-game-builder';
import { EasyElectricalLines, EasyFragmentationLines, EasyPartitionLines, EasyTempLines, generateHardFragmentationLines, HardElectricalLines, HardPartitionLines, HardTempLines } from './repair-helpers';
import { DifficultyMode, ExternalState } from './types';


interface DiskRepairHelperProps extends Types.GameComponentProps<ExternalState> {
    onBack: () => void;
}

interface DiskRepairHelperState {
    repairState: RepairState
    // Currently the bottom two are not implemented. But if hard mode isn't hard enough, we can add some difficulty here. 
    bonusFragHard: boolean
    numbFragHardAttempts: number;
}

enum RepairState {
    NOT_STARTED,
    EASY_ELE,
    HARD_ELE,
    EASY_FRAG,
    HARD_FRAG,
    EASY_PART,
    HARD_PART,
    EASY_TEMP,
    HARD_TEMP
}

class DiskRepairHelper extends React.Component<DiskRepairHelperProps, DiskRepairHelperState> {
    state = { repairState: RepairState.NOT_STARTED, bonusFragHard: false, numbFragHardAttempts: 0 }

    removeCommandLine = (callback?: () => void) => {
        this.setState({ repairState: RepairState.NOT_STARTED }, callback)
    }

    doEasyElectricalFix = () => {
        this.props.addLine(EasyElectricalLines, () => {
            this.setState({ repairState: RepairState.EASY_ELE })
        })
    }
    doHardElectricalFix = () => {
        this.props.addLine(HardElectricalLines, () => {
            this.setState({ repairState: RepairState.HARD_ELE })
        })
    }

    doEasyFragmentationFix = () => {
        this.props.addLine(EasyFragmentationLines, () => {
            this.setState({ repairState: RepairState.EASY_FRAG })
        })
    }

    doHardFragmentationFix = () => {
        this.props.addLine(generateHardFragmentationLines(this.state.bonusFragHard), () => {
            this.setState({ repairState: RepairState.HARD_FRAG })
        })
    }

    doEasyPartitionFix = () => {
        this.props.addLine(EasyPartitionLines, () => {
            this.setState({ repairState: RepairState.EASY_PART })
        })
    }

    doHardPartitionFix = () => {
        this.props.addLine(HardPartitionLines, () => {
            this.setState({ repairState: RepairState.HARD_PART })
        })
    }

    doEasyTempFix = () => {
        this.props.addLine(EasyTempLines, () => {
            this.setState({ repairState: RepairState.EASY_TEMP })
        })
    }

    doHardTempFix = () => {
        this.props.addLine(HardTempLines, () => {
            this.setState({ repairState: RepairState.HARD_TEMP })
        })
    }


    handleEasyEletricalFix = (command: string, args: string[], fullText: string) => {
        this.removeCommandLine(() => {
            let numb = Number(command);
            if (!isNaN(numb)) {
                if (numb === 18) {
                    // Success
                    this.props.clearLines(() => {
                        this.props.writeText({ message: 'Attempting reboot of circut...' }, () => {
                            this.props.addLine([
                                <LoadingHelper
                                    startPercent={0}
                                    endPercent={100}
                                    message="Rebooting..."
                                    showPercent
                                    onFinish={() => {
                                        this.props.writeText({ message: 'Circut reboot success!' }, () => {
                                            this.props.writeText({ message: "Detecting code fragment in onboard circut memory, downloading now..." }, () => {
                                                this.props.addLine([
                                                    <LoadingHelper
                                                        startPercent={0}
                                                        endPercent={100}
                                                        transitionSpeed={200}
                                                        message="Downloading..."
                                                        showPercent
                                                        onFinish={() => {
                                                            this.props.writeText({ message: 'Code fragment download success!' }, () => {
                                                                let newState = { ...this.props.overallState };
                                                                newState.hasElectricalFix = true;
                                                                this.props.updateOverallState(newState, () => this.props.onBack());
                                                            })
                                                        }} />
                                                ])

                                            })
                                        })
                                    }} />
                            ])
                        })
                    })
                }
                else {
                    this.props.addLine([command + " is incorrect, circut is still offline"], () => {
                        this.setState({ repairState: RepairState.EASY_ELE })
                    })
                }
            }
            else if (command.toLowerCase() === 'back') {
                this.props.onBack();
            }
            else if (command.toLowerCase() === 'help') {
                this.doEasyElectricalFix()
            }
            else {
                this.props.addLine([command + " is not a number"], () => {
                    this.setState({ repairState: RepairState.EASY_ELE })
                })
            }
        })

    }
    handleHardElectricalFix = (command: string, args: string[], fullText: string) => {
        this.removeCommandLine(() => {
            let numb = Number(command);
            if (!isNaN(numb)) {
                if (numb === 16) {
                    // Success
                    this.props.clearLines(() => {
                        this.props.writeText({ message: 'Attempting reboot of circut...' }, () => {
                            this.props.addLine([
                                <LoadingHelper
                                    startPercent={0}
                                    endPercent={100}
                                    message="Rebooting..."
                                    showPercent
                                    onFinish={() => {
                                        this.props.writeText({ message: 'Circut reboot success!' }, () => {
                                            this.props.writeText({ message: "Detecting code fragment in onboard circut memory, downloading now..." }, () => {
                                                this.props.addLine([
                                                    <LoadingHelper
                                                        startPercent={0}
                                                        endPercent={100}
                                                        transitionSpeed={200}
                                                        message="Downloading..."
                                                        showPercent
                                                        onFinish={() => {
                                                            this.props.writeText({ message: 'Code fragment download success!' }, () => {
                                                                let newState = { ...this.props.overallState };
                                                                newState.hasElectricalFix = true;
                                                                this.props.updateOverallState(newState, () => this.props.onBack());
                                                            })
                                                        }} />
                                                ])
                                            })
                                        })
                                    }} />
                            ])
                        })
                    })
                }
                else if (numb === 8) {
                    this.props.writeText({ message: 'Checking...' }, () => {
                        setTimeout(() => {
                            this.props.addLine(["Circut now has no polarity, but is still offline. Please try again."], () => {
                                this.setState({ repairState: RepairState.HARD_ELE })
                            })
                        }, 5000)

                    })

                }
                else {
                    this.props.writeText({ message: 'Checking...' }, () => {
                        setTimeout(() => {
                            this.props.addLine([command + " is incorrect, circut is still offline"], () => {
                                this.setState({ repairState: RepairState.HARD_ELE })
                            })
                        }, 5000)

                    })

                }
            }
            else if (command.toLowerCase() === 'back') {
                this.props.onBack();
            }
            else if (command.toLowerCase() === 'help') {
                this.doHardElectricalFix()
            }
            else {
                this.props.addLine([command + " is not a number"], () => {
                    this.setState({ repairState: RepairState.HARD_ELE })
                })
            }
        })
    }
    handleEasyFragFix = (command: string, args: string[], fullText: string) => {
        this.removeCommandLine(() => {
            if (command.toLowerCase() === 'help') {
                this.doEasyFragmentationFix();
            }
            else if (command.toLowerCase() === 'back') {
                this.props.onBack();
            }
            else if (!isNaN(Number(command))) {
                // Then we have a number!
                if (Number(command) != 10) {
                    this.props.addLine([command + " is incorrect, disk is still fragmented"], () => {
                        this.setState({ repairState: RepairState.EASY_FRAG })
                    })
                }
                else {
                    this.props.clearLines(() => {
                        this.props.writeText({ message: 'Defragmenting disk...' }, () => {
                            this.props.addLine([
                                <LoadingHelper
                                    startPercent={0}
                                    endPercent={100}
                                    message="Transferring..."
                                    showPercent
                                    transitionSpeed={200}
                                    onFinish={() => {
                                        this.props.writeText({ message: 'Defragmentation success!' }, () => {
                                            this.props.writeText({ message: "Detecting code fragment in newly freed memory, downloading now..." }, () => {
                                                this.props.addLine([
                                                    <LoadingHelper
                                                        startPercent={0}
                                                        endPercent={100}
                                                        transitionSpeed={200}
                                                        message="Downloading..."
                                                        showPercent
                                                        onFinish={() => {
                                                            this.props.writeText({ message: 'Code fragment download success!' }, () => {
                                                                let newState = { ...this.props.overallState };
                                                                newState.hasFragmentationFix = true;
                                                                this.props.updateOverallState(newState, () => this.props.onBack());
                                                            })
                                                        }} />
                                                ])
                                            })
                                        })
                                    }} />
                            ])
                        })
                    })
                }

            }
            else {
                this.props.addLine([command + " is not a number"], () => {
                    this.setState({ repairState: RepairState.EASY_FRAG });
                })
            }
        })
    }

    handleHardFragFix = (command: string, args: string[], fullText: string) => {
        this.removeCommandLine(() => {
            if (command.toLowerCase() === 'help') {
                this.doHardFragmentationFix();
            }
            else if (command.toLowerCase() === 'back') {
                this.props.onBack();
            }
            else if (!isNaN(Number(command))) {
                // Then we have a number!
                let numb = Number(command);
                if (Number(command) != 23) {
                    this.props.writeText({ message: 'Checking...' }, () => {
                        setTimeout(() => {
                            this.props.addLine([command + " is incorrect, disk is still fragmented"], () => {
                                this.setState({ repairState: RepairState.HARD_FRAG })
                            })
                        }, 2000)

                    })

                }
                else {
                    this.props.clearLines(() => {
                        this.props.writeText({ message: 'Defragmenting disk...' }, () => {
                            this.props.addLine([
                                <LoadingHelper
                                    startPercent={0}
                                    endPercent={100}
                                    message="Transferring..."
                                    showPercent
                                    onFinish={() => {
                                        this.props.writeText({ message: 'Defragmentation success!' }, () => {
                                            this.props.writeText({ message: "Detecting code fragment in newly freed memory, downloading now..." }, () => {
                                                this.props.addLine([
                                                    <LoadingHelper
                                                        startPercent={0}
                                                        endPercent={100}
                                                        transitionSpeed={200}
                                                        message="Downloading..."
                                                        showPercent
                                                        onFinish={() => {
                                                            this.props.writeText({ message: 'Code fragment download success!' }, () => {
                                                                let newState = { ...this.props.overallState };
                                                                newState.hasFragmentationFix = true;
                                                                this.props.updateOverallState(newState, () => this.props.onBack());
                                                            })
                                                        }} />
                                                ])
                                            })
                                        })
                                    }} />
                            ])
                        })
                    })
                }

            }
            else {
                this.props.addLine([command + " is not a number"], () => {
                    this.setState({ repairState: RepairState.HARD_FRAG });
                })
            }
        })
    }

    handleEasyTempertureFix = (command: string, args: string[], fullText: string) => {
        this.removeCommandLine(() => {
            if (command.toLowerCase() === 'help') {
                this.doEasyTempFix();
            }
            else if (command.toLowerCase() === 'back') {
                this.props.onBack();
            }
            else if (!isNaN(Number(command))) {
                // Then we have a number!
                let numb = Number(command);
                if (numb > 62) {
                    this.props.addLine([command + " is making device too hot, please try again"], () => {
                        this.setState({ repairState: RepairState.EASY_TEMP })
                    })
                }
                else if (numb < 62) {
                    this.props.addLine([command + " is making device too cold, please try again"], () => {
                        this.setState({ repairState: RepairState.EASY_TEMP })
                    })
                }
                else {
                    this.props.clearLines(() => {
                        this.props.writeText({ message: 'Executing temp change...' }, () => {
                            this.props.addLine([
                                <LoadingHelper
                                    startPercent={0}
                                    endPercent={100}
                                    message="Executing..."
                                    transitionSpeed={200}
                                    showPercent
                                    onFinish={() => {
                                        this.props.writeText({ message: 'Temp regulation successful' }, () => {
                                            this.props.writeText({ message: "Detecting code fragment in temperature processor memory, downloading now..." }, () => {
                                                this.props.addLine([
                                                    <LoadingHelper
                                                        startPercent={0}
                                                        endPercent={100}
                                                        transitionSpeed={200}
                                                        message="Downloading..."
                                                        showPercent
                                                        onFinish={() => {
                                                            this.props.writeText({ message: 'Code fragment download success!' }, () => {
                                                                let newState = { ...this.props.overallState };
                                                                newState.hasTempFix = true;
                                                                this.props.updateOverallState(newState, () => this.props.onBack());
                                                            })
                                                        }} />
                                                ])
                                            })
                                        })
                                    }} />
                            ])
                        })
                    })
                }

            }
            else {
                this.props.addLine([command + " is not a number"], () => {
                    this.setState({ repairState: RepairState.EASY_TEMP })
                })
            }
        })
    }
    handleHardTempertureFix = (command: string, args: string[], fullText: string) => {
        this.removeCommandLine(() => {
            if (command.toLowerCase() === 'help') {
                this.doHardTempFix()
            }
            else if (command.toLowerCase() === 'back') {
                this.props.onBack();
            }
            else if (!isNaN(Number(command))) {
                // Then we have a number!
                let numb = Number(command);
                if (numb > 295) {
                    this.props.writeText({ message: 'Checking...' }, () => {
                        setTimeout(() => {
                            this.props.addLine([command + " is making device too hot, please try again"], () => {
                                this.setState({ repairState: RepairState.HARD_TEMP })
                            })
                        }, 2000)

                    })

                }
                else if (numb < 295) {
                    this.props.writeText({ message: 'Checking...' }, () => {
                        setTimeout(() => {
                            this.props.addLine([command + " is making device too cold, please try again"], () => {
                                this.setState({ repairState: RepairState.HARD_TEMP })
                            })
                        }, 2000)

                    })

                }
                else {
                    this.props.clearLines(() => {
                        this.props.writeText({ message: 'Executing temp change...' }, () => {
                            this.props.addLine([
                                <LoadingHelper
                                    startPercent={0}
                                    endPercent={100}
                                    message="Executing..."
                                    showPercent
                                    onFinish={() => {
                                        this.props.writeText({ message: 'Temp regulation successful' }, () => {
                                            this.props.writeText({ message: "Detecting code fragment in temperature processor memory, downloading now..." }, () => {
                                                this.props.addLine([
                                                    <LoadingHelper
                                                        startPercent={0}
                                                        endPercent={100}
                                                        transitionSpeed={200}
                                                        message="Downloading..."
                                                        showPercent
                                                        onFinish={() => {
                                                            this.props.writeText({ message: 'Code fragment download success!' }, () => {
                                                                let newState = { ...this.props.overallState };
                                                                newState.hasTempFix = true;
                                                                this.props.updateOverallState(newState, () => this.props.onBack());
                                                            })
                                                        }} />
                                                ])
                                            })
                                        })
                                    }} />
                            ])
                        })
                    })
                }

            }
            else {
                this.props.addLine([command + " is not a number"], () => {
                    this.setState({ repairState: RepairState.HARD_TEMP })
                })
            }
        })
    }
    handleEasyPartitionFix = (command: string, args: string[], fullText: string) => {
        this.removeCommandLine(() => {
            if (command.toLowerCase() === 'help') {
                this.doEasyPartitionFix()
            }
            else if (command.toLowerCase() === 'back') {
                this.props.onBack();
            }
            else if (!isNaN(Number(command))) {
                // Then we have a number!
                let numb = Number(command);
                if (numb != 76) {
                    this.props.writeText({ message: 'Checking...' }, () => {
                        setTimeout(() => {
                            this.props.addLine([command + " is incorrect, partition table still incomplete"], () => {
                                this.setState({ repairState: RepairState.EASY_PART })
                            })
                        }, 3000)

                    })
                }
                else {
                    this.props.clearLines(() => {
                        this.props.writeText({ message: 'Reparing partition...' }, () => {
                            this.props.addLine([
                                <LoadingHelper
                                    startPercent={0}
                                    endPercent={100}
                                    message="Reparing..."
                                    showPercent
                                    onFinish={() => {
                                        this.props.writeText({ message: 'Partition repair success!' }, () => {
                                            this.props.writeText({ message: "Detecting code fragment in partition manifest, downloading now..." }, () => {
                                                this.props.addLine([
                                                    <LoadingHelper
                                                        startPercent={0}
                                                        endPercent={100}
                                                        transitionSpeed={200}
                                                        message="Downloading..."
                                                        showPercent
                                                        onFinish={() => {
                                                            this.props.writeText({ message: 'Code fragment download success!' }, () => {
                                                                let newState = { ...this.props.overallState };
                                                                newState.hasPartitionFix = true;
                                                                this.props.updateOverallState(newState, () => this.props.onBack());
                                                            })
                                                        }} />
                                                ])
                                            })
                                        })
                                    }} />
                            ])
                        })
                    })
                }
            }
            else {
                this.props.addLine([command + " is not a number"], () => {
                    this.setState({ repairState: RepairState.EASY_PART })
                })
            }
        })
    }
    handleHardParitionFix = (command: string, args: string[], fullText: string) => {
        this.removeCommandLine(() => {
            if (command.toLowerCase() === 'help') {
                this.doHardPartitionFix();
            }
            else if (command.toLowerCase() === 'back') {
                this.props.onBack();
            }
            else if (!isNaN(Number(command))) {
                // Then we have a number!
                let numb = Number(command);
                if (Number(command) != 76) {
                    this.props.writeText({ message: 'Checking...' }, () => {
                        setTimeout(() => {
                            this.props.addLine([command + " is incorrect, partition table still incomplete"], () => {
                                this.setState({ repairState: RepairState.HARD_PART })
                            })
                        }, 5000)

                    })

                }
                else {
                    this.props.clearLines(() => {
                        this.props.writeText({ message: 'Reparing partition...' }, () => {
                            this.props.addLine([
                                <LoadingHelper
                                    startPercent={0}
                                    endPercent={100}
                                    message="Reparing..."
                                    showPercent
                                    onFinish={() => {
                                        this.props.writeText({ message: 'Partition repair success!' }, () => {
                                            this.props.writeText({ message: "Detecting code fragment in partition manifest, downloading now..." }, () => {
                                                this.props.addLine([
                                                    <LoadingHelper
                                                        startPercent={0}
                                                        endPercent={100}
                                                        transitionSpeed={200}
                                                        message="Downloading..."
                                                        showPercent
                                                        onFinish={() => {
                                                            this.props.writeText({ message: 'Code fragment download success!' }, () => {
                                                                let newState = { ...this.props.overallState };
                                                                newState.hasPartitionFix = true;
                                                                this.props.updateOverallState(newState, () => this.props.onBack());
                                                            })
                                                        }} />
                                                ])
                                            })
                                        })
                                    }} />
                            ])
                        })
                    })
                }

            }
            else {
                this.props.addLine([command + " is not a number"], () => {
                    this.setState({ repairState: RepairState.HARD_PART })
                })
            }
        })
    }

    componentDidMount() {
        this.props.clearLines(() => {
            this.props.writeText({ message: `Starting Starfleet Intelligence Device Repair...` }, () => {
                this.props.writeText({ message: `Scanning device for potential fixes...` }, () => {
                    this.props.addLine([
                        <LoadingHelper
                            startPercent={0}
                            endPercent={100}
                            message="Searching..."
                            transitionSpeed={200}
                            showPercent
                            onFinish={() => {
                                this.props.writeText({ message: "Possible fix detected!" }, () => {
                                    if (this.props.overallState.difficultyMode === DifficultyMode.EASY) {
                                        if (!this.props.overallState.hasElectricalFix) {
                                            this.doEasyElectricalFix()
                                        }
                                        else if (!this.props.overallState.hasFragmentationFix) {
                                            this.doEasyFragmentationFix()
                                        }
                                        else if (!this.props.overallState.hasPartitionFix) {
                                            this.doEasyPartitionFix()
                                        }
                                        else {
                                            this.doEasyTempFix()
                                        }
                                    }
                                    else {
                                        if (!this.props.overallState.hasElectricalFix) {
                                            this.doHardElectricalFix()
                                        }
                                        else if (!this.props.overallState.hasFragmentationFix) {
                                            this.doHardFragmentationFix()
                                        }
                                        else if (!this.props.overallState.hasPartitionFix) {
                                            this.doHardPartitionFix()
                                        }
                                        else {
                                            this.doHardTempFix()
                                        }
                                    }
                                })
                            }} />
                    ])
                })
            })
        })
    }

    render() {
        return (<div>
            {this.state.repairState === RepairState.EASY_ELE && <TerminalInputHelper onSumbitCommand={this.handleEasyEletricalFix} />}
            {this.state.repairState === RepairState.EASY_FRAG && <TerminalInputHelper onSumbitCommand={this.handleEasyFragFix} />}
            {this.state.repairState === RepairState.EASY_PART && <TerminalInputHelper onSumbitCommand={this.handleEasyPartitionFix} />}
            {this.state.repairState === RepairState.EASY_TEMP && <TerminalInputHelper onSumbitCommand={this.handleEasyTempertureFix} />}
            {this.state.repairState === RepairState.HARD_ELE && <TerminalInputHelper onSumbitCommand={this.handleHardElectricalFix} />}
            {this.state.repairState === RepairState.HARD_FRAG && <TerminalInputHelper onSumbitCommand={this.handleHardFragFix} />}
            {this.state.repairState === RepairState.HARD_PART && <TerminalInputHelper onSumbitCommand={this.handleHardParitionFix} />}
            {this.state.repairState === RepairState.HARD_TEMP && <TerminalInputHelper onSumbitCommand={this.handleHardTempertureFix} />}
        </div>);
    }
}

export default DiskRepairHelper;