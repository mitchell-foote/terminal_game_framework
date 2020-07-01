import * as React from 'react';
import styles from '../styles/styles.module.css'


export interface TerminalInputHelperProps {
    onSumbitCommand: (command: string, args: string[], fullText: string) => void;
}

export interface TerminalInputHelperState {
    input: string;
}

class TerminalInputHelper extends React.Component<TerminalInputHelperProps, TerminalInputHelperState> {
    state = { input: "> " };
    constructor(props: TerminalInputHelperProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
    }
    componentDidMount() {
        document.getElementById('terminal-input-helper-input').focus();
    }
    handleChange(event: any) {
        let newText = event.target.value;
        if (newText.indexOf("> ") === -1) {
            newText = "> ";
        }
        this.setState({ input: newText })
    }
    handleOnSubmit(event: any) {
        let submittedText = this.state.input;
        submittedText = submittedText.replace("> ", "");
        let commandArray = submittedText.split(" ");
        let command = commandArray[0];
        commandArray.shift();
        event.preventDefault();
        this.props.onSumbitCommand(command, commandArray, this.state.input);
        this.setState({ input: '> ' })
    }
    render() {
        return (<form autoComplete="off" onSubmit={this.handleOnSubmit}>
            <input autoComplete="off" id="terminal-input-helper-input" className={`${styles['terminal-input']} ${styles['hacker-font']}`} type="text" value={this.state.input} onChange={this.handleChange} />
        </form>);
    }
}

export default TerminalInputHelper;