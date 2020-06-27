import * as React from 'react';
import styles from '../styles/styles.module.css';

export interface GameWrapperProps {
    theme?: string
    startingComponent: React.ElementType
}

export interface GameWrapperState {
    overallState: any;
    textChain: string[];
    currentComponent: React.ElementType
}

class GameWrapper extends React.Component<GameWrapperProps, GameWrapperState> {
    state: GameWrapperState = { overallState: {}, textChain: [], currentComponent: () => { return (<></>) } };
    constructor(props: GameWrapperProps) {
        super(props);
        this.state.currentComponent = this.props.startingComponent;
        this.onUpdateTextChain = this.onUpdateTextChain.bind(this);
        this.onClearTextChain = this.onClearTextChain.bind(this);
        this.onUpdateCurrentComponent = this.onUpdateCurrentComponent.bind(this);
        this.onUpdateOverallState = this.onUpdateOverallState.bind(this);
        this.onAddTextChain = this.onAddTextChain.bind(this);
        this.onDisplayGlobalHelp = this.onDisplayGlobalHelp.bind(this);
    }

    onUpdateTextChain(textArray: string[]) {
        this.setState({ textChain: textArray });
    }
    onClearTextChain() {
        this.setState({ textChain: [] });
    }
    onUpdateCurrentComponent(newComponent: React.ElementType) {
        this.setState({ currentComponent: newComponent });
    }
    onUpdateOverallState(overallState: any) {
        this.setState({ overallState: overallState });
    }

    onAddTextChain(text: string[]) {
        let newArray = [...this.state.textChain, ...text];
        this.onUpdateTextChain(newArray);
    }
    onDisplayGlobalHelp() {
        let newArray = [...this.state.textChain, 'Global Commands', 'Clear: Clears the terminal', 'Reset: Restarts the terminal', 'Help: Opens this menu', 'Exit: Shuts down the terminal']
        this.onUpdateTextChain(newArray);
    }

    render() {
        let CurrentComponent = this.state.currentComponent;
        return (<div className={`${styles['full-wrapped-terminal']} ${styles['hacker-font']}`} id="root-terminal-area">
            <div id="terminal-text-area" className={`${styles['terminal-text-area']}`}>
                {this.state.textChain.map((each) => {
                    return (<div className={`${styles['line-wrapper']}`}>{each}</div>)
                })}
                <div className={`${styles['line-wrapper']}`}>
                    <CurrentComponent
                        clearLines={this.onClearTextChain}
                        addLine={this.onAddTextChain}
                        showGlobalHelp={this.onDisplayGlobalHelp}
                        updateComponent={this.onUpdateCurrentComponent}
                        overallState={this.state.overallState}
                        updateOverallState={this.onUpdateOverallState}
                    />
                </div>

            </div>
        </div>);
    }
}

export default GameWrapper;