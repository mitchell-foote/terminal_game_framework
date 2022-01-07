import * as React from 'react';
import { Component } from 'react';
import { LoadingHelper, TerminalInputHelper, Types } from 'react-terminal-game-builder';
import HackingTerminalBeamBattle from './beam-battle';
import { HackerTerminalOverallState } from './types';

enum GameState {
    NOT_LOADED,
    TERMINAL,
    JAMMED,
}

interface HackerTerminalProps extends Types.GameComponentProps<HackerTerminalOverallState> {

}

interface HackerTerminalState {
    gameState: GameState
}

/**
 * Main commands
 * 
 * connect
 * infect
 * crazy_ivan
 */

class HackerTerminal extends React.Component<HackerTerminalProps, HackerTerminalState> {
    state: HackerTerminalState = { gameState: GameState.NOT_LOADED }

    componentDidMount() {
        this.props.writeText({ message: `${this.generateSystemName()} starting up...` }, () => {
            this.props.writeText({ message: `Please type 'help' for command list` }, () => {
                this.goToCommandLine();
            })
        })
    }

    generateAdversaryName = () => {
        return this.props.overallState.hackerName ? this.props.overallState.hackerName : 'Ramius'
    }

    generateTargetName = () => {
        return this.props.overallState.targetName ? this.props.overallState.targetName : 'Target'
    }

    generateSystemName = () => {
        return this.props.overallState.systemName ? this.props.overallState.systemName : 'Digital Aggressive Negotiations System'
    }

    generateShortSystemName = () => {
        return this.props.overallState.systemShortName ? this.props.overallState.systemShortName : 'Us'
    }

    goToJammedCommandLine = (callback?: () => void) => {
        this.setState({ gameState: GameState.JAMMED }, callback)
    }

    goToCommandLine = (callback?: () => void) => {
        this.setState({ gameState: GameState.TERMINAL }, callback);
    }

    removeCommandLine = (callback?: () => void) => {
        this.setState({ gameState: GameState.NOT_LOADED }, callback);
    }

    doConnect = () => {
        if (this.props.overallState.connected) {
            this.props.addLine([`The ${this.generateSystemName()} is already connected to the ${this.generateTargetName()} system`, "Recommend running the '> infect' or '> crazy_ivan' command."], () => this.goToCommandLine());
            // Tell them that you're already connected
        }
        else {
            // Do connection
            this.props.writeText({ message: `Attempting to connect to the ${this.generateTargetName()} system.` }, () => {
                this.props.addLine([
                    <LoadingHelper
                        startPercent={0}
                        endPercent={100}
                        message='Negotiating host... '
                        onFinish={() => {
                            this.props.writeText({ message: `Successfully connected to the ${this.generateTargetName()} system.` }, () => {
                                let overallState = { ...this.props.overallState };
                                overallState.connected = true;
                                this.props.updateOverallState(overallState, () => {
                                    this.goToCommandLine();
                                })
                            })
                        }}
                    />
                ])
            })
        }
    }

    doInfect = () => {
        if (!this.props.overallState.connected) {
            // Can't because not connected
            this.props.addLine([
                `Cannot infect: This system is not connected to any system.`,
                `Recommend running the '> connect' command`
            ], () => {
                this.goToCommandLine();
            })

        }
        else {
            // do infection
            this.props.writeText({ message: 'Now attempting to infect connected system...' }, () => {
                this.props.addLine([
                    <LoadingHelper
                        startPercent={0}
                        endPercent={100}
                        message='Searching for entry point...'
                        onFinish={() => {
                            this.props.addLine([
                                <LoadingHelper
                                    startPercent={0}
                                    endPercent={100}
                                    message='Infecting level 9 systems...'
                                    transitionSpeed={25}
                                    onFinish={() => {
                                        this.props.addLine([
                                            <LoadingHelper
                                                startPercent={0}
                                                endPercent={100}
                                                message='Infecting level 8 systems...'
                                                transitionSpeed={25}
                                                onFinish={() => {
                                                    this.props.addLine([
                                                        <LoadingHelper
                                                            startPercent={0}
                                                            endPercent={100}
                                                            message='Infecting level 7 systems...'
                                                            transitionSpeed={25}
                                                            onFinish={() => {
                                                                this.props.addLine([
                                                                    <LoadingHelper
                                                                        startPercent={0}
                                                                        endPercent={100}
                                                                        message='Infecting level 6 systems...'
                                                                        transitionSpeed={25}
                                                                        onFinish={() => {
                                                                            this.props.addLine([
                                                                                <LoadingHelper
                                                                                    startPercent={0}
                                                                                    endPercent={100}
                                                                                    message='Infecting level 5 systems...'
                                                                                    transitionSpeed={25}
                                                                                    onFinish={() => {
                                                                                        this.props.addLine([
                                                                                            <LoadingHelper
                                                                                                startPercent={0}
                                                                                                endPercent={33}
                                                                                                message='Infecting level 4 systems...'
                                                                                                transitionSpeed={25}
                                                                                                onFinish={() => {
                                                                                                    let scrollTimeout = setInterval(() => this.props.updateScroll(), 100);
                                                                                                    this.props.writeText({ message: `WARNING! The ${this.generateSystemName()} has been detected and is being jammed by the admin process ${this.generateAdversaryName()}`, color: 'red' }, () => {
                                                                                                        let overallState = { ...this.props.overallState };
                                                                                                        overallState.firstHack = true;
                                                                                                        this.props.updateOverallState(overallState, () => {
                                                                                                            clearInterval(scrollTimeout);
                                                                                                            this.handleJammingProcess()
                                                                                                        })
                                                                                                    })
                                                                                                }}
                                                                                            />
                                                                                        ])
                                                                                    }}
                                                                                />
                                                                            ])
                                                                        }}
                                                                    />
                                                                ])
                                                            }}
                                                        />
                                                    ])
                                                }}
                                            />
                                        ])
                                    }}
                                />
                            ])
                        }}
                    />
                ])
            })
        }
    }

    doCrazyIvan = () => {
        if (!this.props.overallState.finishedJamming) {
            this.props.addLine([`Unable to activate crazy_ivan: ${this.generateTargetName()} has not been fully infected.`], () => this.goToCommandLine())
        }
        else {
            this.props.clearLines(() => {
                this.props.writeText({ message: `Initalizing crazy_ivan.exe...` }, () => {
                    this.props.writeText({ message: `Ooof, they're not going to like this.... ;)`, color: 'yellow', keystrokeTiming: 200 }, () => {
                        this.props.addLine([
                            <LoadingHelper
                                startPercent={0}
                                endPercent={100}
                                transitionSpeed={70}
                                message={`Prank calling ${this.generateAdversaryName()}'s parents...`}
                                onFinish={() => {
                                    this.props.addLine([
                                        <LoadingHelper
                                            startPercent={0}
                                            endPercent={100}
                                            transitionSpeed={70}
                                            message={`Removing ${this.generateAdversaryName()}'s AM alarms...`}
                                            onFinish={() => {
                                                this.props.addLine([
                                                    <LoadingHelper
                                                        startPercent={0}
                                                        endPercent={100}
                                                        transitionSpeed={70}
                                                        message={`Replacing all ${this.generateAdversaryName()}'s contacts with "???"`}
                                                        onFinish={() => {
                                                            this.props.addLine([
                                                                <LoadingHelper
                                                                    startPercent={0}
                                                                    endPercent={100}
                                                                    transitionSpeed={70}
                                                                    message={`Logging all other users out...`}
                                                                    onFinish={() => {
                                                                        this.props.addLine([
                                                                            <LoadingHelper
                                                                                startPercent={0}
                                                                                endPercent={100}
                                                                                transitionSpeed={70}
                                                                                message={`Deleteing password files...`}
                                                                                onFinish={() => {
                                                                                    this.props.addLine([
                                                                                        <LoadingHelper
                                                                                            startPercent={0}
                                                                                            endPercent={100}
                                                                                            transitionSpeed={70}
                                                                                            message={`Corrupting backups...`}
                                                                                            onFinish={() => {
                                                                                                this.props.addLine([
                                                                                                    <LoadingHelper
                                                                                                        startPercent={0}
                                                                                                        endPercent={100}
                                                                                                        message={`Sending crazy_ivan finish....`}
                                                                                                        color={true}
                                                                                                        transitionSpeed={300}
                                                                                                        showPercent={true}
                                                                                                        onFinish={() => {
                                                                                                            this.props.writeText({ message: 'crazy_ivan successfully delivered!', color: 'yellow' }, () => {
                                                                                                                let overallState = { ...this.props.overallState };
                                                                                                                overallState.ivan_ed = true;
                                                                                                                this.props.updateOverallState(overallState, () => {
                                                                                                                    this.props.addLine(['This terminal is in standby mode, no available targets detected'])
                                                                                                                })
                                                                                                            })
                                                                                                        }}
                                                                                                    />
                                                                                                ])
                                                                                            }}
                                                                                        />
                                                                                    ])
                                                                                }}
                                                                            />
                                                                        ])
                                                                    }}
                                                                />
                                                            ])
                                                        }}
                                                    />
                                                ])
                                            }}
                                        />
                                    ])
                                }}
                            />
                        ])
                    })

                })
            })
        }
    }


    doHelp = () => {
        this.props.addLine([
            <div>
                <div>
                    {`help - displays this screen`}
                </div>
                <div>
                    {"Usage: '> help'"}
                </div>
            </div>,
            <div>
                <div>
                    {`connect - connects the ${this.generateSystemName().toLowerCase()} to vulnerable systems.`}
                </div>
                <div>
                    {"Usage: '> connect'"}
                </div>
            </div>,
            <div>
                <div>
                    {`infect - the ${this.generateSystemName().toLowerCase()} will attempt to infect the systems it has connected with`}
                </div>
                <div>
                    {"Usage: '> infect'"}
                </div>
            </div>,
            <div>
                <div>
                    {`crazy_ivan - after the ${this.generateSystemName().toLowerCase()} has fully infected a system, this command will execute code to fully disable that system.`}
                </div>
                <div>
                    {"Usage: '> crazy_ivan'"}
                </div>
            </div>

        ], () => {
            this.goToCommandLine();
        })
    }

    generateJammedString = (length: number) => {
        let unfinishedAscii = '░';
        let partialAscii = '▒';
        let completeAscii = '▓';
        let jammedStringArray = [unfinishedAscii, partialAscii, completeAscii, ' ', ' '];
        let jammedString = ''
        for (let i = 0; i < length; i++) {
            let randomIndex = Math.floor(Math.random() * 4);
            jammedString += jammedStringArray[randomIndex];
        }
        return jammedString;
    }

    handleJammingProcess = () => {
        this.removeCommandLine(() => {
            let repeater = setInterval(() => this.props.updateScroll(), 100);
            this.props.writeText({ message: this.generateJammedString(10000), color: 'red', keystrokeTiming: 2 }, () => {
                clearInterval(repeater);
                this.props.addLine([
                    '---------------------',
                    `The ${this.generateSystemName()} has detected the location of the jamming signal. Would you like this computer to attempt to jam that signal back? (Yes or No)`
                ], () => this.goToJammedCommandLine())
            })
        })
    }

    handleSignalBeamBattle = () => {
        this.props.writeText({ message: `Attempting to jam signal from ${this.generateAdversaryName()}` }, () => {
            this.props.addLine([
                <HackingTerminalBeamBattle
                    heroName={this.generateShortSystemName()}
                    villianName={this.generateAdversaryName()}
                    heroWins={true}
                    heroStarts={false}
                    transitionSpeed={300}
                    message1='Attempting privilege escalation'
                    message2={`${this.generateAdversaryName()} is using junk packets to initalize a RAT program. Attempting to compensate...`}
                    message3='Activating last resort sequence program: ser3ntity-@ft3rburn'
                    onFinish={() => {
                        this.props.writeText({ message: 'Signal successfully jammed! Attempting to resume infection...' }, () => {
                            this.props.addLine([
                                <LoadingHelper
                                    startPercent={0}
                                    endPercent={100}
                                    message='Infecting level 4 systems...'
                                    transitionSpeed={55}
                                    onFinish={() => {
                                        this.props.addLine([
                                            <LoadingHelper
                                                startPercent={0}
                                                endPercent={100}
                                                message='Infecting level 3 systems...'
                                                transitionSpeed={55}
                                                onFinish={() => {
                                                    this.props.addLine([
                                                        <LoadingHelper
                                                            startPercent={0}
                                                            endPercent={100}
                                                            message='Infecting level 2 systems...'
                                                            transitionSpeed={55}
                                                            onFinish={() => {
                                                                this.props.addLine([
                                                                    <LoadingHelper
                                                                        startPercent={0}
                                                                        endPercent={100}
                                                                        message='Infecting level 1 systems...'
                                                                        onFinish={() => {
                                                                            let overallState = { ...this.props.overallState };
                                                                            overallState.finishedJamming = true;
                                                                            this.props.updateOverallState(overallState, () => {
                                                                                this.goToCommandLine();
                                                                            })
                                                                        }}
                                                                    />
                                                                ])
                                                            }}
                                                        />
                                                    ])
                                                }}
                                            />
                                        ])
                                    }}
                                />
                            ])
                        })
                    }}
                />
            ])
        })
    }

    handleJammedArgs = (command: string, args: string[], fullText: string) => {
        this.props.addLine([fullText], () => {
            this.removeCommandLine(() => {
                switch (command.toLowerCase()) {
                    case 'yes': {
                        this.handleSignalBeamBattle()
                        break;
                    }
                    case 'no': {
                        this.handleJammingProcess();
                        break;
                    }
                    case 'y': {
                        this.handleSignalBeamBattle()
                        break;
                    }
                    case 'n': {
                        this.handleJammingProcess();
                        break;
                    }
                    default: {
                        this.props.addLine([`Please enter either 'yes' or 'no'`], () => this.goToJammedCommandLine())

                    }
                }
            })
        })
    }

    handleCommandArgs = (command: string, args: string[], fullText: string) => {
        this.props.addLine([fullText], () => {
            this.removeCommandLine(() => {
                switch (command) {
                    case "connect": {
                        this.doConnect()
                        break;
                    }
                    case "infect": {
                        this.doInfect()
                        break;
                    }
                    case "crazy_ivan": {
                        this.doCrazyIvan()
                        break;
                    }
                    case "help": {
                        this.doHelp()
                        break;
                    }
                    default: {
                        this.props.addLine(["Unknown command used, please type 'help' for command list."], () => this.goToCommandLine())
                        break;
                    }
                }
            })
        })
    }

    render() {
        return (<div>
            {this.state.gameState === GameState.TERMINAL && <TerminalInputHelper onSumbitCommand={this.handleCommandArgs} />}
            {this.state.gameState === GameState.JAMMED && <TerminalInputHelper onSumbitCommand={this.handleJammedArgs} />}
        </div>);
    }
}

export default HackerTerminal;