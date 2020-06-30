import * as React from 'react';
import { OptionChoice } from '../types';
import TerminalInputHelper from '../terminal-input-helper';


export interface OptionHelperProps {
    options: OptionChoice[],
    addLine: Function,
    allowNumberChoice?: boolean,
}


class OptionHelper extends React.Component<OptionHelperProps> {

    componentDidMount() {
        this.props.addLine(["Please select an option - Type 'clear' to redisplay list", this.generateOptionText()]);
    }


    handleTerminalSelection = (command: string, args: string[], fullCommand: string) => {
        if (command) {
            if (command.toLowerCase() === 'clear') {
                this.props.addLine(["Please select an option - Type 'clear' to redisplay list", this.generateOptionText()]);
                return;
            }
            if (this.props.allowNumberChoice && !isNaN(parseInt(command))) {
                let int = parseInt(command) - 1;
                this.props.options[int] && this.props.options[int].action();
                return;
            }
            let optionArray = this.props.options.filter((each) => {
                if (each.name.toLowerCase() === command.toLowerCase()) {
                    return true;
                }
                else {
                    return false;
                }
            });
            if (optionArray.length) {
                optionArray[0].action();
            }
            else {
                this.props.addLine(["Option not found"])
            }
        }

    }
    generateOptionText = () => {
        return (
            <div>
                {this.props.options.map((each, index) => {
                    if (this.props.allowNumberChoice) {
                        return <div key={each.name + " " + index}>{index + 1}. {each.name} - {each.description}</div>
                    }
                    else {
                        return <div key={each.name + " " + index}>{each.name} - {each.description}</div>
                    }
                })}
            </div>
        )

    }
    render() {
        return (<div>
            <TerminalInputHelper onSumbitCommand={this.handleTerminalSelection} />
        </div>);
    }
}

export default OptionHelper;