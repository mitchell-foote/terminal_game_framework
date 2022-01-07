import * as React from 'react';
import { Component } from 'react';
import { RouteComponentProps, StaticContext, withRouter } from 'react-router';
import { ConsolePicker, LoadingHelper, TerminalInputHelper, Types } from 'react-terminal-game-builder';
import { generateManual } from './defaultState';
import { ReactorControlOverallState } from './types';



/**
 * Reactor Overload
 * 
 * This minigame can go 1 of 2 ways. We either need to start or stop an overload in the reactor to stop some sort of terrible thing.
 * 
 * Basically, you'll have three steps to do in order to stop or save the reactor. 
 * 
 * For starting a reactor, the game is to use the help command, look at the manual, flush the system, prime reactor coils, attempt to restart, do an emergency override on one injector, and finally restart.
 * 
 * For stopping an overload, the game is to use the help command, look at the manual, open all the vents, flush the system, do an emergency override on one vent, flush again. 
 *  
 */

enum GameState {
    NOT_STARTED,
    MANUAL,
    COMMAND_LINE
}

interface ReactorOverloadProps extends Types.GameComponentProps<ReactorControlOverallState> {

}

interface ReactorOverloadState {
    gameState: GameState
}

class ReactorOverload extends React.Component<ReactorOverloadProps, ReactorOverloadState> {
    state: ReactorOverloadState = { gameState: GameState.NOT_STARTED }

    componentDidMount() {
        this.props.addLine([this.generateFirstLine()], () => {
            this.props.writeText({ message: "Access terminal initiating, loading reactor profile..." }, () => {
                this.props.writeText({ message: "Type 'help' to gain access to command list." }, () => {
                    this.goToCommandLine();
                })
            })
        })
    }

    generateFirstLine = () => {
        if (this.generateShipName().length) {
            return `${this.generateShipName()} ${this.generateReactorName()} Access v3.2.7`
        }
        else if (this.generateReactorName() !== 'reactor') {
            return `${this.generateReactorName()} Access v3.2.7`;
        }
        else {
            return 'Reactor Access v3.2.7'
        }
    }

    goToCommandLine = () => {
        this.setState({ gameState: GameState.COMMAND_LINE })
    }

    removeCommandLine = (callback?: () => void) => {
        this.setState({ gameState: GameState.NOT_STARTED }, callback);
    }

    generateShipName = () => {
        return this.props.overallState.shipName ? this.props.overallState.shipName : ""
    }

    generateReactorName = () => {
        return this.props.overallState.reactorName ? this.props.overallState.reactorName : "reactor"
    }

    getTargetOverrideSystem = () => {
        if (this.props.overallState.overload) {
            return this.props.overallState.overloadTroubledVent
        }
        else {
            return this.props.overallState.restartTroubledInjector
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
                    {`clear - clears the text of the terminal`}
                </div>
                <div>
                    {"Usage: '> clear'"}
                </div>
            </div>,
            <div>
                <div>
                    {`manual - opens the engineering manual for the ${this.generateShipName().toLowerCase()} ${this.generateReactorName().toLowerCase()}`}
                </div>
                <div>
                    {"Usage: '> manual'"}
                </div>
            </div>,
            <div>
                <div>
                    {`open_vents - attempts to open all the ${this.generateReactorName().toLowerCase()} vents`}
                </div>
                <div>
                    {"Usage: '> open_vents'"}
                </div>
            </div>,
            <div>
                <div>
                    {`flush_system - attempts to flush the ${this.generateReactorName().toLowerCase()} system of extra or latent energy.`}
                </div>
                <div>
                    {"Usage: '> flush_system'"}
                </div>
            </div>,
            <div>
                <div>
                    {`prime_system - beings priming sequence for the ${this.generateReactorName().toLowerCase()}, in preparation for a full restart.`}
                </div>
                <div>
                    {"Usage: '> prime_system'"}
                </div>
            </div>,
            <div>
                <div>
                    {`restart - Initiates the restart sequence for the ${this.generateShipName().toLowerCase()} ${this.generateReactorName().toLowerCase()}`}
                </div>
                <div>
                    {"Usage: '> restart'"}
                </div>
            </div>,
            <div>
                <div>
                    {`emergency_override - Activates the engineering override on a particular system.`}
                </div>
                <div>
                    {`Usage: '> emergency_override <system_name>' Example: '> emergency_override ${this.getTargetOverrideSystem()}'`}
                </div>
            </div>

        ], () => {
            this.goToCommandLine();
        })
    }

    doOpenVents = () => {
        if (this.props.overallState.overload) {
            if (!this.props.overallState.overloadVentsOpen) {
                this.props.writeText({ message: "Attempting to open reactor vents..." }, () => {
                    this.props.addLine([
                        <LoadingHelper
                            message=''
                            startPercent={0}
                            endPercent={100}
                            onFinish={() => {
                                let overallState = { ...this.props.overallState };
                                overallState.overloadVentsOpen = true;
                                this.props.writeText({ message: "Reactor vents have been opened" }, () => {
                                    this.props.updateOverallState(overallState, () => {
                                        this.goToCommandLine();
                                    })
                                })
                            }} />
                    ])
                })
            }
            else {
                this.props.addLine(["Unable to open vents: Vents have already been opened"], () => this.goToCommandLine())
            }
        }
        else {
            this.props.addLine(['Unable to open vents: Reactor is offline'], () => this.goToCommandLine())
        }
    }

    finishOverload = () => {
        let overallState = { ...this.props.overallState }
        this.props.clearLines(() => {
            this.props.writeText({ message: "Attempting to flush reactor system..." }, () => {
                this.props.addLine([
                    <LoadingHelper
                        message='Preparing flush coolant...'
                        startPercent={0}
                        endPercent={100}
                        showPercent={true}
                        transitionSpeed={100}
                        onFinish={() => {
                            this.props.addLine([
                                <LoadingHelper
                                    startPercent={0}
                                    endPercent={100}
                                    transitionSpeed={100}
                                    message='Opening reactor primary vents...'
                                    onFinish={() => {
                                        this.props.addLine([
                                            <LoadingHelper
                                                startPercent={0}
                                                endPercent={100}
                                                transitionSpeed={100}
                                                message='Initiating vent flush...'
                                                onFinish={() => {
                                                    this.props.addLine([
                                                        <LoadingHelper
                                                            startPercent={0}
                                                            endPercent={100}
                                                            color={true}
                                                            transitionSpeed={500}
                                                            message='Activating overload countermeasures...'
                                                            onFinish={() => {
                                                                this.props.writeText({ message: `Flush process success! Systems are begining to resolve...` }, () => {
                                                                    this.props.writeText({ message: `Reactor systems have returned to normal function` }, () => {
                                                                        overallState.overloadFinalFlush = true;
                                                                        this.props.updateOverallState(overallState, () => {
                                                                            this.props.addLine(["Terminal shutdown in progress: No emergency detected."], () => this.props.updateScroll())
                                                                        })
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
            })
        })
    }

    finishRestart = () => {
        let overallState = { ...this.props.overallState }
        this.props.clearLines(() => {
            this.props.writeText({ message: "Attempting to restart reactor..." }, () => {
                this.props.addLine([
                    <LoadingHelper
                        message='Building initial charge...'
                        startPercent={0}
                        endPercent={100}
                        showPercent={true}
                        transitionSpeed={100}
                        onFinish={() => {
                            this.props.addLine([
                                <LoadingHelper
                                    message='Setting prefire sequence...'
                                    startPercent={0}
                                    endPercent={100}
                                    showPercent={true}
                                    transitionSpeed={100}
                                    onFinish={() => {
                                        this.props.addLine([
                                            <LoadingHelper
                                                message='Initializing injectors...'
                                                startPercent={0}
                                                endPercent={100}
                                                showPercent={true}
                                                transitionSpeed={100}
                                                onFinish={() => {
                                                    this.props.addLine([
                                                        <LoadingHelper
                                                            message='Reactor Restart Process...'
                                                            startPercent={0}
                                                            endPercent={100}
                                                            showPercent={true}
                                                            color
                                                            transitionSpeed={500}
                                                            onFinish={() => {
                                                                this.props.writeText({ message: "Reactor restart complete!" }, () => {
                                                                    overallState.restartFinalRestart = true;
                                                                    this.props.updateOverallState(overallState, () => {
                                                                        this.props.addLine(["This terminal is disabled: No emergency detected"], () => this.props.updateScroll())
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
            })
        })
    }

    doFlushSystem = () => {
        let overallState = { ...this.props.overallState };
        if (overallState.overload) {
            if (overallState.overloadVentsOpen) { // Step 1 Done
                if (!overallState.overloadFirstFlush) { // On Step 2
                    this.props.writeText({ message: "Attempting to flush reactor system..." }, () => {
                        this.props.addLine([
                            <LoadingHelper
                                message='Preparing flush coolant...'
                                startPercent={0}
                                endPercent={100}
                                showPercent={true}
                                transitionSpeed={100}
                                onFinish={() => {
                                    this.props.addLine([
                                        <LoadingHelper
                                            startPercent={0}
                                            endPercent={100}
                                            transitionSpeed={100}
                                            message='Opening reactor primary vents...'
                                            onFinish={() => {
                                                this.props.addLine([
                                                    <LoadingHelper
                                                        startPercent={0}
                                                        endPercent={30}
                                                        transitionSpeed={100}
                                                        message='Initiating vent flush...'
                                                        onFinish={() => {
                                                            this.props.writeText({ color: 'red', message: `Flush process aborted: ${this.getTargetOverrideSystem()} has been jammed. '> emergency_override ${this.getTargetOverrideSystem()}' required before attempting another flush` }, () => {
                                                                overallState.overloadFirstFlush = true;
                                                                this.props.updateOverallState(overallState, () => {
                                                                    this.goToCommandLine();
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
                    })
                }
                else { // They've already flushed
                    if (overallState.overloadEmergencyOverride) { // They've done the override
                        this.finishOverload();
                    }
                    else { // They haven't done the override
                        this.props.addLine([`Unable to flush reactor system: ${this.getTargetOverrideSystem()} is still jammed. Recommend running '> emergency_override ${this.getTargetOverrideSystem()}' before proceeding.`], () => this.goToCommandLine())
                    }
                }
            }
            else { // Vents not open
                this.props.addLine(["Unable to flush reactor system: Reactor vents are not open."], () => this.goToCommandLine())
            }
        }
        else { // Restart
            if (this.props.overallState.restartFlush) {
                this.props.addLine(["Unable to flush reactor system: Reactor system has already been flushed"], () => this.goToCommandLine())
            }
            else {
                this.props.writeText({ message: "Attempting to flush reactor system" }, () => {
                    this.props.addLine([
                        <LoadingHelper
                            message='Detecting latent energy'
                            startPercent={0}
                            endPercent={100}
                            onFinish={() => {
                                this.props.addLine([
                                    <LoadingHelper
                                        message='Flushing energy'
                                        startPercent={0}
                                        endPercent={100}
                                        onFinish={() => {
                                            this.props.writeText({ message: `Flush process success!` }, () => {
                                                overallState.restartFlush = true;
                                                this.props.updateOverallState(overallState, () => {
                                                    this.goToCommandLine();
                                                })
                                            })
                                        }}
                                    />
                                ])

                            }}
                        />
                    ])
                })
            }
        }
    }

    doPrimeSystem = () => {
        if (!this.props.overallState.overload) {
            if (this.props.overallState.restartFlush) {
                if (this.props.overallState.restartPrime) {
                    this.props.addLine(["Unable to prime reactor: Reactor is already primed"], () => this.goToCommandLine())
                }
                else {
                    this.props.writeText({ message: "Reactor primeing sequence engaged..." }, () => {
                        this.props.addLine([
                            <LoadingHelper
                                startPercent={0}
                                endPercent={100}
                                showPercent
                                message='Running preflight checks...'
                                transitionSpeed={50}
                                onFinish={() => {
                                    this.props.addLine([
                                        <LoadingHelper
                                            startPercent={0}
                                            endPercent={100}
                                            showPercent
                                            message='Executing mainline code...'
                                            transitionSpeed={50}
                                            onFinish={() => {
                                                this.props.addLine([
                                                    <LoadingHelper
                                                        startPercent={0}
                                                        endPercent={100}
                                                        showPercent
                                                        message='Coils Ionizing...'
                                                        transitionSpeed={50}
                                                        onFinish={() => {
                                                            this.props.writeText({ message: "Reactor successfully primed" }, () => {
                                                                let overallState = { ...this.props.overallState };
                                                                overallState.restartPrime = true;
                                                                this.props.updateOverallState(overallState, () => this.goToCommandLine())
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
                    })
                }
            }
            else {
                this.props.addLine(["Unable to prime reactor: Reactor has not been flushed"], () => this.goToCommandLine())
            }
        }
        else {
            this.props.addLine(["Unable to prime reactor: Reactor is currently overloading"], () => this.goToCommandLine())
        }
    }

    doRestart = () => {
        if (this.props.overallState.overload) {
            this.props.addLine(['Unable to restart reactor: Reactor is currently overloading'], () => this.goToCommandLine())
        }
        else {
            if (this.props.overallState.restartPrime) {
                if (this.props.overallState.restartFirstRestart) {
                    if (this.props.overallState.restartEmergencyOverride) { // Do Finish
                        this.finishRestart()
                    }
                    else { // Tell them they need to override
                        this.props.addLine([`Unable to restart reactor: Injector ${this.getTargetOverrideSystem()} has been jammed. Use the '> emergency_override ${this.getTargetOverrideSystem()}' command before attempting another restart.`], () => this.goToCommandLine());
                    }
                }
                else { // Do the first restart
                    this.props.writeText({ message: "Attempting to restart reactor..." }, () => {
                        this.props.addLine([
                            <LoadingHelper
                                message='Building initial charge...'
                                startPercent={0}
                                endPercent={100}
                                showPercent={true}
                                transitionSpeed={100}
                                onFinish={() => {
                                    this.props.addLine([
                                        <LoadingHelper
                                            message='Setting prefire sequence...'
                                            startPercent={0}
                                            endPercent={100}
                                            showPercent={true}
                                            transitionSpeed={100}
                                            onFinish={() => {
                                                this.props.addLine([
                                                    <LoadingHelper
                                                        message='Initializing injectors...'
                                                        startPercent={0}
                                                        endPercent={40}
                                                        showPercent={true}
                                                        transitionSpeed={100}
                                                        onFinish={() => {
                                                            let overallState = { ...this.props.overallState };
                                                            overallState.restartFirstRestart = true;
                                                            this.props.updateOverallState(overallState, () => {
                                                                this.props.writeText({ color: "red", message: `Warning! Reactor restart aborted. ${this.getTargetOverrideSystem()} has jammed.  ` }, () => {
                                                                    this.props.writeText({ color: 'red', message: `Recommend running '> emergency_override ${this.getTargetOverrideSystem()}'` }, () => {
                                                                        this.props.writeText({ color: 'red', message: `Unable to proceed with restart until this is done.` }, () => this.goToCommandLine())
                                                                    })
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
                    })
                }
            }
            else {
                this.props.addLine(["Unable to restart reactor: Reactor has not been primed"], () => this.goToCommandLine())
            }
        }
    }

    doEmergencyOverride = (system: string) => {
        if (!system) {
            this.props.addLine(["Unable to do emergency override: System must be specified. Example: '> emergency_override " + this.getTargetOverrideSystem() + "'."], () => this.goToCommandLine())
        }
        else if (this.props.overallState.overload) {
            if (system === this.props.overallState.overloadTroubledVent) {
                if (this.props.overallState.overloadEmergencyOverride) {
                    this.props.addLine(["Unable to do emergency override: System has already been overridden"], () => this.goToCommandLine())
                }
                else {
                    this.props.writeText({ message: `System ${system} has been overridden.` }, () => {
                        let overallState = { ...this.props.overallState };
                        overallState.overloadEmergencyOverride = true;
                        this.props.updateOverallState(overallState, () => { this.goToCommandLine() });
                    })
                }
            }
            else {
                this.props.addLine([`Unable to do emergency override: System ${system} is not valid, or does not need override.`], () => this.goToCommandLine())
            }

        }
        else {
            if (system === this.props.overallState.restartTroubledInjector) {
                if (this.props.overallState.restartEmergencyOverride) {
                    this.props.addLine(["Unable to do emergency override: System has already been overridden"], () => this.goToCommandLine())
                }
                else {
                    this.props.writeText({ message: `System ${system} has been overridden.` }, () => {
                        let overallState = { ...this.props.overallState };
                        overallState.restartEmergencyOverride = true;
                        this.props.updateOverallState(overallState, () => { this.goToCommandLine() });
                    })
                }
            }
            else {
                this.props.addLine([`Unable to do emergency override: System ${system} is not valid, or does not need override.`], () => this.goToCommandLine())
            }
        }
    }

    handleCommandLine = (command: string, args: string[], fullText: string) => {
        this.removeCommandLine(() => {
            this.props.addLine([fullText], () => {
                switch (command.toLowerCase()) {
                    case 'help': {
                        this.doHelp();
                        break;
                    }
                    case 'clear': {
                        this.props.clearLines(() => {
                            this.goToCommandLine();
                        })
                        break;
                    }
                    case 'manual': {
                        this.props.writeText({ message: "Opening ENG manual..." }, () => {
                            this.setState({ gameState: GameState.MANUAL })
                        })
                        break;
                    }
                    case 'open_vents': {
                        this.doOpenVents();
                        break;
                    }
                    case 'flush_system': {
                        this.doFlushSystem();
                        break;
                    }
                    case 'prime_system': {
                        this.doPrimeSystem()
                        break;
                    }
                    case 'restart': {
                        this.doRestart();
                        break;
                    }
                    case 'emergency_override': {
                        this.doEmergencyOverride(args[0]);
                        break;
                    }
                    default: {
                        this.props.addLine(["Please enter a valid command, use the command 'help' if needed."], () => {
                            this.goToCommandLine();
                        })
                        break;
                    }
                }
            })
        })
    }

    generateManual = () => {
        let manuals = [...generateManual()];
        let mappedManuals: Types.OptionChoice[] = manuals.map((each, index) => {
            return {
                name: each.name,
                description: each.description,
                action: () => {
                    this.removeCommandLine(() => {
                        let stepArray = each.steps.map((each, index) => {
                            return `${index + 1}. ${each}`;
                        })
                        this.props.addLine(["------------------"].concat(stepArray).concat(["------------------"]), () => {
                            setTimeout(() => {
                                this.setState({ gameState: GameState.MANUAL })
                            })
                        })
                    })
                }
            }
        });
        return (
            <ConsolePicker
                onBackout={() => {
                    this.setState({ gameState: GameState.NOT_STARTED }, () => {
                        setTimeout(() => {
                            this.goToCommandLine();
                        }, 1000)
                    })
                }}
                scrollToBottom={this.props.updateScroll}
                options={mappedManuals}
            />
        )
    }

    render() {
        return (<div>
            {this.state.gameState === GameState.MANUAL && this.generateManual()}
            {this.state.gameState === GameState.COMMAND_LINE && <TerminalInputHelper onSumbitCommand={this.handleCommandLine} />}
        </div>);
    }
}

export default ReactorOverload;