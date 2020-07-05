import * as React from 'react';
import styles from '../styles/styles.module.css';
import ShowTextHelper from '../show-text-helper';

export interface GameWrapperProps {
    theme?: string
    startingComponent: React.ElementType
}

export interface GameWrapperState {
    overallState: any;
    textChain: any[];
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
        this.onWriteText = this.onWriteText.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }

    onUpdateTextChain(textArray: any[], callback?: Function) {
        this.setState({ textChain: textArray }, () => {
            this.scrollToBottom();
            this.forceUpdate();
            callback && callback();
        });
    }
    onClearTextChain(callback?: Function) {
        this.setState({ textChain: [] }, () => {
            callback && callback();
        });
    }
    onUpdateCurrentComponent(newComponent: React.ElementType) {
        this.setState({ currentComponent: newComponent });
    }
    onUpdateOverallState(overallState: any, callback?: Function) {
        this.setState({ overallState: overallState }, () => {
            callback && callback();
        });
    }

    onAddTextChain(text: any[], callback?: Function) {
        let newArray = [...this.state.textChain, ...text];
        this.onUpdateTextChain(newArray, callback);
    }
    onDisplayGlobalHelp(callback?: Function) {
        let newArray = [...this.state.textChain, 'Global Commands', 'Clear: Clears the terminal', 'Reset: Restarts the terminal', 'Help: Opens this menu', 'Exit: Shuts down the terminal']
        this.onUpdateTextChain(newArray, callback);
    }

    onWriteText(messageProps: any, callback?: Function) {
        this.onAddTextChain([<ShowTextHelper {...messageProps} onComplete={callback} />])
    }

    scrollToBottom() {
        let objDiv = document.getElementById("terminal-text-area");
        objDiv && (objDiv.scrollTop = objDiv.scrollHeight);
    }

    render() {
        let CurrentComponent = this.state.currentComponent;
        return (<div className={`${styles['full-wrapped-terminal']} ${styles['hacker-font']} `} id="root-terminal-area">
            <div id="terminal-text-area" className={`${styles['terminal-text-area']} ${styles['scrollbar']}`}>
                {this.state.textChain.map((each, index) => {
                    return (<div key={index + ' text'} className={`${styles['line-wrapper']}`}>{each}</div>)
                })}
                <div className={`${styles['line-wrapper']}`}>
                    <CurrentComponent
                        clearLines={this.onClearTextChain}
                        addLine={this.onAddTextChain}
                        showGlobalHelp={this.onDisplayGlobalHelp}
                        updateComponent={this.onUpdateCurrentComponent}
                        overallState={this.state.overallState}
                        updateOverallState={this.onUpdateOverallState}
                        onWriteText={this.onWriteText}
                        updateScroll={this.scrollToBottom}
                    />
                </div>

            </div>
        </div>);
    }
}

export default GameWrapper;