import * as React from 'react';
import { Component } from 'react';
import { ConsolePicker, LoadingHelper, TerminalInputHelper, Types } from 'react-terminal-game-builder';
import { LogsType, SCVintageTerminalOverallState } from './types';

enum GameState {
    NotStarted,
    Login,
    LoggedIn,
    Logs,
    Messages,
    Firewall,
    Security

}

interface SpaceCenterVintageTerminalProps extends Types.GameComponentProps<SCVintageTerminalOverallState> {

}

interface SpaceCenterVintageTerminalState {
    gameState: GameState,
    logs: LogsType[]
    accessCode: string
    loaded: boolean
}

class SpaceCenterVintageTerminal extends React.Component<SpaceCenterVintageTerminalProps, SpaceCenterVintageTerminalState> {
    state: SpaceCenterVintageTerminalState = { gameState: GameState.NotStarted, logs: [], accessCode: new Date().valueOf().toString().slice(-4), loaded: false }

    componentDidMount() {
        console.log(this.props.overallState)
        if (this.props.overallState.accessCode) {
            console.log("has code", this.props.overallState.accessCode);
            this.setState({ accessCode: this.props.overallState.accessCode }, () => this.startupSystem())
        }
        else {
            this.startupSystem()
        }

    }

    componentDidUpdate() {
        if (this.state.accessCode !== this.props.overallState.accessCode && this.props.overallState.accessCode !== undefined) {
            this.setState({ accessCode: this.props.overallState.accessCode })
        }
    }

    startupSystem = () => {
        this.props.writeText({ message: `${this.generateTerminalName()} login...` }, () => {
            if (this.props.overallState.loginType === 'password') {
                this.props.writeText({ message: 'Please enter your access passcode below: ' }, () => {
                    this.setState({ gameState: GameState.Login })
                })
            }
            else {
                this.props.writeText({ message: 'Please enter your 4 digit access passcode below: ' }, () => {
                    this.setState({ gameState: GameState.Login })
                })
            }
        })
    }

    restartSystem = () => {
        this.setState({ gameState: GameState.NotStarted }, () => {
            this.props.clearLines(() => {
                this.props.writeText({ message: `Initializing ${this.generateTerminalName()}...` }, () => {
                    this.props.writeText({ message: `Please make a choice from the options below.` }, () => {
                        this.setState({ gameState: GameState.LoggedIn })
                    })
                })

            })
        })
    }

    systemRestate = () => {
        this.setState({ gameState: GameState.NotStarted }, () => setTimeout(() => {
            this.props.clearLines(() => {
                this.props.addLine([`${this.generateTerminalName()}`, `Please make a choice from the options below.`], () => {
                    this.setState({ gameState: GameState.LoggedIn })
                })

            })
        }, 1000))
    }

    generateTerminalName = () => {
        return this.props.overallState.terminalName ? this.props.overallState.terminalName : `Da'kor terminal v2.3.4`;
    }

    removeCommandLine = (callback?: () => void) => {
        this.setState({ gameState: GameState.NotStarted }, callback);
    }

    addToLog = (text: string, callback?: () => void) => {
        let logs = [...this.state.logs];
        let newDate = new Date().valueOf().toString();
        logs.push({
            title: `Log ${newDate}`,
            description: `${text}`,
            text: `On date ${newDate}, this occurred: ${text}`
        });
        this.setState({ logs: logs }, callback);
    }

    handleLoginCommand = (command: string, args: string[], fullText: string) => {
        this.removeCommandLine(() => {
            switch (this.props.overallState.loginType) {
                case 'password': {
                    let correctPassword = this.props.overallState.correctPassword;
                    if (correctPassword) {
                        if (correctPassword === command) {
                            // Successful login
                            this.addToLog("Successful Login", () => this.handleSuccessfulLogin())
                        }
                        else {
                            // Failure Login
                            this.addToLog("Login attempt failure", () => {
                                this.props.addLine(['Passcode was incorrect, please try again'], () => {
                                    this.setState({ gameState: GameState.Login })
                                })
                            })
                        }
                    }
                    else { //Successful Login (cause no password)

                        this.addToLog("Successful Login", () => this.handleSuccessfulLogin())

                    }
                    break;
                }
                default: {
                    //Access-code
                    if (command === this.state.accessCode) {
                        this.addToLog("Successful Login", () => this.handleSuccessfulLogin())
                    }
                    else if (command.length !== 4) {
                        this.addToLog("Login Attempt Detected", () => {
                            this.props.addLine(['Passcode was incorrect: Make sure the length of the code is 4 digits'], () => {
                                this.setState({ gameState: GameState.Login })
                            })
                        })
                    }
                    else if (isNaN(Number(command))) {
                        this.addToLog("Login Attempt Detected", () => {
                            this.props.addLine(['Passcode was incorrect: Make sure you only use digits in your passcode'], () => {
                                this.setState({ gameState: GameState.Login })
                            })
                        })
                    }
                    else {
                        let returnedString = ''
                        for (let i = 0; i < 4; i++) {
                            let correctNumb = Number(this.state.accessCode[i]);
                            let quessedNumb = Number(command[i]);
                            let diff = correctNumb - quessedNumb;
                            if (diff === 0) {
                                returnedString += '*';
                            }
                            else if (diff > 0) {
                                returnedString += '↑';
                            }
                            else {
                                returnedString += '↓';
                            }
                        };
                        this.props.addLine([`Your guess was ${command}`, <div style={{ display: 'flex', alignItems: 'baseline' }}><span>{`The computer analysed, and found this difference:`}</span><span style={{ fontSize: 'xx-large', marginLeft: '1rem' }}>{returnedString}</span></div>], () => {
                            this.props.addLine(['Please try a 4 digit passcode again.'], () => {
                                this.addToLog("Login Attempt Detected", () => {
                                    this.setState({ gameState: GameState.Login })
                                })
                            })
                        })
                    }

                }
            }
        })

    }

    handleSuccessfulLogin = () => {
        this.props.writeText({ message: 'Passcode Accepted!' }, () => {
            this.props.clearLines(() => {
                this.props.writeText({ message: `${this.generateTerminalName()} online.` }, () => {
                    this.props.writeText({ message: `Please select an option below:` }, () => {
                        this.setState({ gameState: GameState.LoggedIn })
                    })
                })
            })
        })
    }

    handleLoggedInScreen = () => {
        let choices: Types.OptionChoice[] = [
            {
                name: 'Firewall Access',
                description: 'Turn the Firewall system on or off',
                action: () => {
                    this.removeCommandLine(() => {
                        this.setState({ gameState: GameState.Firewall })
                    })
                }
            },
            {
                name: 'Message Control',
                description: "Access message control",
                action: () => {
                    this.removeCommandLine(() => {
                        if (this.props.overallState.firewall) {
                            this.props.addLine(['Unable to access message control: Firewall is active'], () => {
                                this.setState({ gameState: GameState.LoggedIn })
                            })
                        }
                        else {
                            this.setState({ gameState: GameState.Messages })
                        }
                    })
                }
            },
            {
                name: 'Logs',
                description: 'Displays the logs for this terminal',
                action: () => {
                    this.removeCommandLine(() => {
                        if (this.props.overallState.firewall) {
                            this.props.addLine(['Unable to access logs: Firewall is active'], () => {
                                this.setState({ gameState: GameState.LoggedIn })
                            })
                        }
                        else {
                            this.setState({ gameState: GameState.Logs })
                        }
                    })
                }
            },
            {
                name: 'Internal Security Systems',
                description: `Displays the internal security systems`,
                action: () => {
                    if (this.props.overallState.firewall) {
                        this.props.addLine(['Unable to access ISS: Firewall is active'], () => {
                            this.setState({ gameState: GameState.LoggedIn })
                        })
                    }
                    else {
                        this.setState({ gameState: GameState.Security })
                    }
                }
            }
        ];
        return (
            <ConsolePicker
                onBackout={() => {
                    this.removeCommandLine(() => {
                        this.props.clearLines(() => {
                            this.startupSystem()
                        })
                    })
                }}
                options={choices}
                scrollToBottom={this.props.updateScroll}
            />
        )
    }

    generateFirewallChoices = () => {
        let choices: Types.OptionChoice[] = [
            {
                name: 'Engage',
                description: 'Engages the Firewall system',
                action: () => {
                    this.addToLog("Firewall engaged", () => {
                        this.removeCommandLine(() => {
                            this.props.writeText({ message: 'Firewall systems have been engaged' }, () => {
                                let overallState = { ...this.props.overallState };
                                overallState.firewall = true;
                                this.props.updateOverallState(overallState, () => {
                                    this.systemRestate();
                                })
                            })
                        })
                    })
                }
            },
            {
                name: 'Disengage',
                description: "Disengages the Firewall system. Warning! Not Recommended.",
                action: () => {
                    this.addToLog("Firewall disengaged", () => {
                        this.removeCommandLine(() => {
                            this.props.writeText({ message: 'Firewall systems have been disengaged' }, () => {
                                let overallState = { ...this.props.overallState };
                                overallState.firewall = false;
                                this.props.updateOverallState(overallState, () => {
                                    this.systemRestate();
                                })
                            })
                        })
                    })
                }
            }
        ];
        return (
            <ConsolePicker
                onBackout={() => {
                    this.systemRestate()
                }}
                options={choices}
                scrollToBottom={this.props.updateScroll}
            />
        )
    }

    generateSecurityChoices = () => {
        let choices: Types.OptionChoice[] = [
            {
                name: 'Engage',
                description: 'Engages the Internal Security system',
                action: () => {
                    this.addToLog("Security engaged", () => {
                        this.removeCommandLine(() => {
                            this.props.writeText({ message: 'Internal security systems have been engaged' }, () => {
                                let overallState = { ...this.props.overallState };
                                overallState.security = true;
                                this.props.updateOverallState(overallState, () => {
                                    this.systemRestate();
                                })
                            })
                        })
                    })
                }
            },
            {
                name: 'Disengage',
                description: "Disengages the Internal Security system. Warning! Not Recommended.",
                action: () => {
                    this.addToLog("Internal Security disengaged", () => {
                        this.removeCommandLine(() => {
                            this.props.writeText({ message: 'Security systems have been disengaged' }, () => {
                                this.props.addLine([
                                    <LoadingHelper
                                        startPercent={0}
                                        endPercent={100}
                                        showPercent={true}
                                        transitionSpeed={60}
                                        message='Opening blast doors...'
                                        onFinish={() => { }}
                                    />,
                                    <LoadingHelper
                                        startPercent={0}
                                        endPercent={100}
                                        showPercent={true}
                                        transitionSpeed={120}
                                        message='Disengaging turret system...'
                                        onFinish={() => { }}
                                    />,
                                    <LoadingHelper
                                        startPercent={0}
                                        endPercent={100}
                                        showPercent={true}
                                        transitionSpeed={200}
                                        message='Standing down alert status...'
                                        onFinish={() => {
                                            this.props.addLine([
                                                <LoadingHelper
                                                    startPercent={0}
                                                    endPercent={100}
                                                    showPercent={true}
                                                    transitionSpeed={150}
                                                    color
                                                    message='Finishing security shutdown...'
                                                    onFinish={() => {
                                                        let overallState = { ...this.props.overallState };
                                                        overallState.security = false;
                                                        this.props.updateOverallState(overallState, () => {
                                                            this.props.writeText({ message: 'Internal Security system has been disengaged. Returning to main menu.' }, () => {
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
                                        message='Powering down internal threat sensors...'
                                        onFinish={() => { }}
                                    />,
                                ])
                            })
                        })
                    })
                }
            }
        ];
        return (
            <ConsolePicker
                onBackout={() => {
                    this.systemRestate()
                }}
                options={choices}
                scrollToBottom={this.props.updateScroll}
            />
        )
    }

    generateMessageControlSystem = () => {
        let choices: Types.OptionChoice[] = this.props.overallState.messages.map((each) => {
            return {
                name: each.title,
                description: each.description,
                action: () => {
                    this.addToLog("Read message: " + each.title, () => {
                        this.props.addLine([
                            '-------------------',
                            `${each.title}`,
                            `${each.text}`,
                            '-------------------'
                        ])
                    })

                }
            }
        });
        choices.push({
            name: 'Forward messages',
            description: 'Forwards messages to open and available ports',
            action: () => {
                this.removeCommandLine(() => {
                    this.props.writeText({ message: 'Forwarding to open ports' }, () => {
                        this.props.addLine([
                            <LoadingHelper
                                startPercent={0}
                                endPercent={100}
                                showPercent
                                onFinish={() => {
                                    this.props.writeText({ message: 'Messages forwarded. Returning to main menu.' }, () => {
                                        this.addToLog("Messages forwarded", () => { this.systemRestate() })
                                    })
                                }}
                                message='Sending all available messages'
                            />
                        ])
                    })
                })
            }
        });
        return (
            <ConsolePicker
                options={choices}
                onBackout={() => {
                    this.systemRestate()
                }}
                scrollToBottom={this.props.updateScroll}
            />
        )
    }
    generateLogsControlSystem = () => {
        let choices: Types.OptionChoice[] = this.state.logs.map((each) => {
            return {
                name: each.title,
                description: each.description,
                action: () => {
                    this.props.addLine([
                        '-------------------',
                        `${each.title}`,
                        `${each.text}`,
                        '-------------------'
                    ])
                }
            }
        });
        choices.push({
            name: 'Delete Logs',
            description: 'Removes all logs from this terminal. Warning: Against protocol.',
            action: () => {
                this.removeCommandLine(() => {
                    this.props.writeText({ message: 'Deleting all logs...' }, () => {
                        this.props.addLine([
                            <LoadingHelper
                                startPercent={0}
                                endPercent={100}
                                showPercent
                                onFinish={() => {
                                    this.props.writeText({ message: 'Logs deleted. Returning to main menu.' }, () => {
                                        this.setState({ logs: [] }, () => this.systemRestate())
                                    })
                                }}
                                message='Purging datacore'
                            />
                        ])
                    })
                })
            }
        });
        return (
            <ConsolePicker
                options={choices}
                onBackout={() => {
                    this.systemRestate()
                }}
                scrollToBottom={this.props.updateScroll}
            />
        )
    }

    render() {
        return (<div>
            {this.state.gameState === GameState.Login && <TerminalInputHelper onSumbitCommand={this.handleLoginCommand} />}
            {this.state.gameState === GameState.LoggedIn && this.handleLoggedInScreen()}
            {this.state.gameState === GameState.Firewall && this.generateFirewallChoices()}
            {this.state.gameState === GameState.Logs && this.generateLogsControlSystem()}
            {this.state.gameState === GameState.Messages && this.generateMessageControlSystem()}
            {this.state.gameState === GameState.Security && this.generateSecurityChoices()}
        </div>);
    }
}

export default SpaceCenterVintageTerminal;