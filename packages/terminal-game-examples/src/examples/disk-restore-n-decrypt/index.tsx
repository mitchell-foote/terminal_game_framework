import * as React from 'react';
import { Component } from 'react';
import { ConsolePicker, LoadingHelper, TerminalInputHelper, Types } from 'react-terminal-game-builder';
import DiskRepairHelper from './repair';
import { DifficultyMode, ExternalState } from './types';

interface DiskRestoreAndDecryptProps extends Types.GameComponentProps<ExternalState> {

}

interface DiskRestoreAndDecryptState {
    gameState: GameState
    decodeAttempts: number
}

enum GameState {
    NOT_LOADED,
    COMMAND_LINE,
    LOGS,
    SECTOR_SCAN,
    REPAIR_DISK,
    DECRYPT
}

class DiskRestoreAndDecrypt extends React.Component<DiskRestoreAndDecryptProps, DiskRestoreAndDecryptState> {
    state = { gameState: GameState.NOT_LOADED, decodeAttempts: 0 }

    componentDidMount() {
        this.restartSystem()
    }

    removeCommandLine = (callback?: () => void) => {
        this.setState({ gameState: GameState.NOT_LOADED }, callback)
    }

    goToCommandLine = (fullText: boolean = true) => {
        this.setState({ gameState: GameState.NOT_LOADED }, () => {
            if (fullText) {
                this.props.writeText({ message: `Command line ready, please type "help" for a list of available commands` }, () => {
                    this.setState({ gameState: GameState.COMMAND_LINE })
                })
            }
            else {
                this.setState({ gameState: GameState.COMMAND_LINE })
            }
        })

    }

    restartSystem = () => {
        this.props.writeText({ message: `Initalizing Starfleet Intelligence Recovery and Decryption System` }, () => {
            this.props.writeText({ message: `New disk detected, attempting to load profile and status` }, () => {
                this.props.addLine([
                    <LoadingHelper
                        startPercent={0}
                        endPercent={100}
                        message="Scanning Disk..."
                        color
                        transitionSpeed={200}
                        showPercent
                        onFinish={() => {
                            this.props.writeText({ message: 'Disk scan complete. Disk is damaged and encrypted.' }, () => {
                                this.goToCommandLine()
                            })
                        }} />
                ])
            })
        })
    }

    doHelp = () => {
        let helpArray: any[] = [];
        helpArray.push(`repair - If needed, will scan and attempt to fix the device.`, `Example: "> repair"`, "");
        this.props.overallState.hasTempFix && helpArray.push(`logs - Download and display available logs found on the device.`, `Example: "> logs"`, "");
        this.props.overallState.hasTempFix && helpArray.push(`sector_scan - Scans the device for readable sectors.`, `Example: > sector_scan`, "");
        this.props.overallState.hasTempFix && helpArray.push(`decrypt - Allows a password to be entered to decrypt the device.`, `Example: "> decrypt [password]" like "> decrypt swordfish`, "");
        this.props.overallState.hasTempFix && helpArray.push(`command - Runs a command on the device.`, `Example: "> command [command name]" like "> command batman.exe"`, "");
        helpArray.push(`help - Displays this list.`, `Example: "> help"`, "");
        helpArray.push(`clear - Clears the current terminal`, `Example: "> clear"`, "");
        this.props.addLine(helpArray, () => this.goToCommandLine(false));
    }

    doUnknownCommand = () => {
        this.props.addLine(["Command not recognized. Please type 'help' for a list of available commands."], () => {
            this.goToCommandLine(false);
        })
    }

    doPolymorphicAlgorithim = () => {
        this.removeCommandLine(() => {
            this.props.clearLines(() => {
                this.props.writeText({ message: `WARNING!!! Booby trap triggered!`, color: 'red' }, () => {
                    this.props.writeText({ message: 'Device is activating polymorphic algorithms, code fragments have been encrypted!', color: 'red' }, () => {
                        let newState = { ...this.props.overallState }
                        newState.hasLogsFragment = false;
                        newState.hasSectorFragment = false;
                        this.props.updateOverallState(newState, () => {
                            this.props.writeText({ message: 'Codes will need to be rediscovered.', color: 'red' }, () => {
                                this.goToCommandLine();
                            })
                        })
                    })
                })
            })
        })

    }

    doSectorScan = () => {
        this.removeCommandLine(() => {
            this.props.clearLines(() => {
                this.props.writeText({ message: `Scanning for available sectors...` }, () => {
                    this.props.addLine([
                        <LoadingHelper
                            startPercent={0}
                            endPercent={100}
                            message="Searching..."
                            transitionSpeed={50}
                            showPercent
                            onFinish={() => {
                                this.props.writeText({ message: 'Sector search complete, please select an option from the list below' }, () => {
                                    this.props.writeText({ message: "Selections chosen below will be executed to printed to the terminal" }, () => {
                                        this.setState({ gameState: GameState.SECTOR_SCAN })
                                    })

                                })
                            }} />
                    ])
                })
            })

        })
    }

    handleCommandLineFeedback = (command: string, args: string[], fullText: string) => {
        this.props.addLine([fullText], () => {
            this.removeCommandLine(() => {
                switch (command.toLowerCase()) {
                    case 'repair': {
                        if (!this.props.overallState.hasTempFix) {
                            this.setState({ gameState: GameState.REPAIR_DISK })
                        }
                        else {
                            // Already repaired
                            this.props.addLine(["Disk is already repaired, repair command not needed"], () => {
                                this.goToCommandLine(false);
                            })
                        }
                        break;
                    }
                    case 'logs': {
                        if (!this.props.overallState.hasTempFix) {
                            this.doUnknownCommand()
                        }
                        else {
                            this.props.writeText({ message: "Accessing disk logs..." }, () => {
                                this.props.addLine([<LoadingHelper
                                    startPercent={0}
                                    endPercent={100}
                                    message="Downloading logs..."
                                    transitionSpeed={50}
                                    showPercent
                                    onFinish={() => {
                                        this.props.writeText({ message: 'Log download complete, please select an option from the list below' }, () => {
                                            this.setState({ gameState: GameState.LOGS })
                                        })
                                    }} />])
                            })
                        }
                        break;
                    }
                    case 'command': {
                        if (!this.props.overallState.hasTempFix) {
                            this.doUnknownCommand()
                        }
                        else {
                            switch (args[0] ? args[0].toLowerCase() : '') {
                                case "falcon": {
                                    // get the fragement
                                    this.props.writeText({ message: `Executing falcon script...` }, () => {
                                        this.props.addLine([
                                            <LoadingHelper
                                                startPercent={0}
                                                endPercent={100}
                                                message="Code fragment recompiling"
                                                transitionSpeed={200}
                                                showPercent
                                                onFinish={() => {
                                                    this.props.writeText({ message: 'Code segment repaired!' }, () => {
                                                        let newState = { ...this.props.overallState };
                                                        newState.hasLogsFragment = true
                                                        this.props.updateOverallState(newState, () => {
                                                            this.goToCommandLine();
                                                        })
                                                    })
                                                }} />
                                        ])
                                    })
                                    break;
                                }
                                case "pineapple": {
                                    // bad...
                                    this.doPolymorphicAlgorithim();
                                    break;
                                }
                                case "firefly": {
                                    // bad...
                                    this.doPolymorphicAlgorithim();
                                    break;
                                }
                                default: {
                                    this.props.addLine(['External command not recognized. Nothing was executed.'], () => this.goToCommandLine(false));
                                    break;
                                }
                            }
                        }
                        break;
                    }
                    case 'sector_scan': {
                        if (!this.props.overallState.hasTempFix) {
                            this.doUnknownCommand()
                        }
                        else {
                            this.doSectorScan()

                        }
                        break;
                    }
                    case 'decrypt': {
                        if (!this.props.overallState.hasTempFix) {
                            this.doUnknownCommand()
                        }
                        else if (args[0] && args[0].toLowerCase() === this.props.overallState.decodeCode) {
                            this.handleVictoryDecode();
                        }
                        else {
                            this.props.writeText({ message: "Attempting to decode device..." }, () => {
                                if (this.props.overallState.difficultyMode === DifficultyMode.HARD) {
                                    if (this.state.decodeAttempts === 3) {
                                        this.setState({ decodeAttempts: 0 }, () => {
                                            this.doPolymorphicAlgorithim()
                                        })
                                    }
                                    else {
                                        let decodeAttempts = this.state.decodeAttempts + 1;
                                        this.setState({ decodeAttempts: decodeAttempts }, () => {
                                            this.props.addLine(['Decode unsuccessful. Please try again.'], () => this.goToCommandLine(false));
                                        })
                                    }
                                }
                                else {
                                    this.props.addLine(['Decode unsuccessful. Please try again.'], () => this.goToCommandLine(false));
                                }
                            })
                        }
                        break;
                    }
                    case 'help': {
                        this.doHelp()
                        break;
                    }
                    case 'clear': {
                        this.props.clearLines(() => this.goToCommandLine())
                        break;
                    }
                    default: {
                        this.doUnknownCommand();
                        break;
                    }
                }
            })
        })
    }

    generateSectorOptions = () => {
        let options: Types.OptionChoice[] = [
            {
                name: "Sector 231",
                description: "Text file: Augruy Helper.bat",
                action: () => {
                    this.props.addLine([
                        "-----------------",
                        "0X5F 0XFF 0X94 0X77 0XCA 0X41 0X11 0X87",
                        "0X5F 0XFF 0X94 0X77 0XCA 0X41 0X11 0X87",
                        "0X5F 0XFF 0X94 0X77 0XCA 0X41 0X11 0X87",
                        "The sequence repeats for 93 additional lines...",
                        "-----------------"
                    ])
                }
            },
            {
                name: "Sector 5531",
                description: "Text file: Admin Note",
                action: () => {
                    this.props.addLine([
                        "-----------------",
                        "Note text: 'The new decrypt key will need all other code fragments. It will be a CAPITAL crime if you can't figure it out.'",
                        "'Check the keys, and hopefully everything will make more sense'",
                        "-----------------"
                    ])
                }
            },
            {
                name: "Sector 0002",
                description: "Executable 'pineapple.sh'",
                action: () => {
                    this.doPolymorphicAlgorithim()
                }
            },
            {
                name: "Sector 9001",
                description: "Executable 'firefly.sh'",
                action: () => {
                    this.doPolymorphicAlgorithim()
                }
            },
            {
                name: "Sector 46632",
                description: "Binary file: 101101.io",
                action: () => {
                    this.props.addLine([
                        "-----------------",
                        "101101001101001010110010100011001010001001000100100101010100101110010010",
                        "100101011101011010101010100011011010000001010100100101010100101000010000",
                        "101001010110101001010101010100101001010101101001010001010100111010100101",
                        "010010101101010101100100101010010010110101010100101011010101010010100100",
                        "-----------------"
                    ])
                }
            },
            {
                name: "Sector 88392",
                description: "Binary file: blackmail.io",
                action: () => {
                    this.props.addLine([
                        "-----------------",
                        "The file is corrupted, and cannot be read",
                        "-----------------"
                    ])
                }
            },
            {
                name: "Sector 3002",
                description: "Executable 'mourning.sh'",
                action: () => {
                    this.props.addLine([
                        "----------------",
                        "Alarm set for 0600 tomorrow morning",
                        "----------------"
                    ])
                }
            },
            {
                name: "Sector 2311",
                description: "Text file: exFault.bat",
                action: () => {
                    this.props.addLine([
                        "-----------------",
                        "0X5F 0XFF 0X94 0X77 0XCA 0X41 0X11 0X87",
                        "0X5F 0XFF 0X94 0X77 0XCA 0X41 0X11 0X87",
                        "0X5F 0XFF 0X94 0X77 0XCA 0X41 0X11 0X87",
                        "0X50 0XF0 0X90 0X70 0XC0 0X40 0X11 0X87",
                        "0X5F 0XFF 0X94 0X77 0XCA 0X41 0X11 0X87",
                        "The sequence repeats for 98 additional lines...",
                        "-----------------"
                    ])
                }
            },
            {
                name: "Sector 33092",
                description: "Text file: 9985745.bat",
                action: () => {
                    this.props.addLine([
                        "-----------------",
                        "0X58 0XF8 0X98 0X78 0XC8 0X48 0X18 0X88",
                        "0X5F 0XFF 0X94 0X77 0XCA 0X41 0X11 0X87",
                        "0X5F 0XFF 0X94 0X77 0XCA 0X41 0X11 0X87",
                        "0X50 0XF0 0X90 0X70 0XC0 0X40 0X11 0X87",
                        "0X5F 0XFF 0X94 0X77 0XCA 0X41 0X11 0X87",
                        "The sequence repeats for 98 additional lines...",
                        "-----------------"
                    ])
                }
            },
            {
                name: "Sector 0092",
                description: "Corrupted file, unknown type or name",
                action: () => {
                    if (this.props.overallState.difficultyMode === DifficultyMode.HARD) {
                        this.doPolymorphicAlgorithim()
                    }
                    else {
                        this.props.addLine([
                            "-----------------",
                            "The file is corrupted, and cannot be read",
                            "-----------------"
                        ])
                    }

                }
            },
            {
                name: "Sector 0101",
                description: "Corrupted file, unknown type or name",
                action: () => {
                    this.removeCommandLine(() => {
                        this.props.clearLines(() => {
                            this.props.writeText({ message: "Code fragment found, now attempting to download," }, () => {
                                this.props.addLine([
                                    <LoadingHelper
                                        startPercent={0}
                                        endPercent={100}
                                        message="Downloading..."
                                        transitionSpeed={200}
                                        showPercent
                                        onFinish={() => {
                                            this.props.writeText({ message: 'Code segment repaired!' }, () => {
                                                let newState = { ...this.props.overallState };
                                                newState.hasSectorFragment = true
                                                this.props.updateOverallState(newState, () => {
                                                    this.goToCommandLine();
                                                })
                                            })
                                        }} />
                                ])
                            })
                        })
                    })
                }
            },
            {
                name: "Sector 6604",
                description: "Corrupted file, unknown type or name",
                action: () => {
                    if (this.props.overallState.difficultyMode === DifficultyMode.HARD) {
                        this.doPolymorphicAlgorithim()
                    }
                    else {
                        this.props.addLine([
                            "-----------------",
                            "The file is corrupted, and cannot be read",
                            "-----------------"
                        ])
                    }
                }
            }
        ];

        let numbArray: number[] = [];
        for (let i = 0; i < 6; i++) {
            let randomNumb = Math.floor(Math.random() * 12);
            if (randomNumb === 12) {
                randomNumb = 0;
            }
            numbArray.push(randomNumb);
        }
        let optionsArray = numbArray.map((each) => {
            return options[each];
        });
        optionsArray.push({
            name: "Search",
            description: "Do a search for other available sectors",
            action: () => {
                this.doSectorScan()
            }
        });
        return optionsArray;

    }

    generateLogs = () => {
        let choices: Types.OptionChoice[] = [
            {
                name: "Log 224511.3",
                description: "Internal Access Log",
                action: () => {
                    this.props.addLine([
                        "-----------------",
                        "User access granted on 224511.3",
                        "User was logged on for 15 minutes before logging out",
                        "-----------------"
                    ])
                }
            },
            {
                name: "Log 224512.4",
                description: "Access rejection log",
                action: () => {
                    this.props.addLine([
                        "-----------------",
                        "Hacking attemped detected on 224512.4",
                        "Access request was logged. This is not a recommended action",
                        "-----------------"
                    ])
                }
            },
            {
                name: "Log 224514.5",
                description: "Access rejection log",
                action: () => {
                    this.props.addLine([
                        "-----------------",
                        "Hacking attemped detected on 224514.5",
                        "Access request was logged. This is not a recommended action",
                        "-----------------"
                    ])
                }
            },
            {
                name: "Log 224517.1",
                description: "Security override",
                action: () => {
                    this.props.addLine([
                        "-----------------",
                        "Security override command 'falcon' is executed. Security backdoor has been accessed.",
                        "Decryption request accepted. Security is down, and data is readable",
                        "-----------------"
                    ])
                }
            },
            {
                name: "Log 224518.4",
                description: "Note created",
                action: () => {
                    this.props.addLine([
                        "-----------------",
                        "Note created: 'Decrypt pass help' : 224518.4",
                        "Note text: 'The new decrypt key will need all other code fragments. It will be a CAPITAL crime if you can't figure it out.'",
                        "'Check the keys, and hopefully everything will make more sense'",
                        "-----------------"
                    ])
                }
            },
            {
                name: "Log 224518.9",
                description: "Command creation",
                action: () => {
                    this.props.addLine([
                        "-----------------",
                        "Command 'pineapple' is created on 224518.9. Code has been integrated",
                        "Command does the following: () => this.doPolymoricAlgorithim()",
                        "-----------------"
                    ])
                }
            },
            {
                name: "Log 224520.6",
                description: "Command creation",
                action: () => {
                    this.props.addLine([
                        "-----------------",
                        "Command 'firefly' is created on 224520.6. Code has been integrated",
                        "Command does the following: () => this.doPolymoricAlgorithim()",
                        "-----------------"
                    ])
                }
            }
        ];
        if (this.props.overallState.difficultyMode === DifficultyMode.HARD) {
            choices.push({
                name: "CoDe FrAgMeNt",
                description: "The DeCode KeY iS HeRe",
                action: () => {
                    this.doPolymorphicAlgorithim()
                }
            })
        }
        return choices;
    }

    handleVictoryDecode = () => {
        this.props.writeText({ message: "Attempting to decrypt section 001..." }, () => {
            this.props.clearLines(() => {
                setTimeout(() => {
                    this.props.writeText({ message: "Decode section successful." }, () => {
                        setTimeout(() => {
                            this.props.writeText({ message: "This system will now decrypt the device.." }, () => {
                                this.props.addLine([
                                    <LoadingHelper
                                        startPercent={0}
                                        endPercent={100}
                                        color
                                        transitionSpeed={1000}
                                        showPercent
                                        message={"Decryption in progress..."}
                                        onFinish={() => {
                                            this.props.writeText({ message: "Decryption complete. Downloading final code now." }, () => {
                                                let state = { ...this.props.overallState };
                                                state.hasCompleteDecode = true;
                                                this.props.updateOverallState(state, () => {
                                                    this.props.addLine([
                                                        <LoadingHelper
                                                            startPercent={0}
                                                            endPercent={100}
                                                            color
                                                            transitionSpeed={500}
                                                            showPercent
                                                            message={"Downloading..."}
                                                            onFinish={() => {
                                                                this.props.writeText({ message: "Download complete." }, () => {
                                                                    setTimeout(() => {
                                                                        this.props.clearLines(() => {
                                                                            this.props.addLine([this.props.overallState.finalFragment]);

                                                                        })
                                                                    }, 5000)
                                                                })
                                                            }} />
                                                    ])
                                                })

                                            })
                                        }} />
                                ])
                            })
                        })
                    })
                }, 5000)
            })
        })

    }

    render() {
        return (<div>
            {this.state.gameState === GameState.LOGS && <ConsolePicker onBackout={() => this.props.clearLines(() => this.goToCommandLine())} options={this.generateLogs()} scrollToBottom={this.props.updateScroll} />}
            {this.state.gameState === GameState.SECTOR_SCAN && <ConsolePicker onBackout={() => this.props.clearLines(() => this.goToCommandLine())} options={this.generateSectorOptions()} scrollToBottom={this.props.updateScroll} />}
            {this.state.gameState === GameState.REPAIR_DISK && <DiskRepairHelper {...this.props} onBack={() => this.props.clearLines(() => this.goToCommandLine())} />}
            {this.state.gameState === GameState.COMMAND_LINE && <TerminalInputHelper onSumbitCommand={this.handleCommandLineFeedback} />}
        </div>);
    }
}

export default DiskRestoreAndDecrypt;