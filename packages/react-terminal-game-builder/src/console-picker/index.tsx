import * as React from 'react';
import { OptionChoice } from '../types';

interface ConsolePickerProps {
    onBackout: () => void,
    options: OptionChoice[]
    scrollToBottom: () => void;
}

interface ConsolePickerState {
    currentStep: number
}

class ConsolePicker extends React.Component<ConsolePickerProps, ConsolePickerState> {
    state = { currentStep: 0 }

    componentDidMount(): void {
        document.addEventListener("keydown", this.onKeyDown as any);
        this.props.scrollToBottom();
    }
    componentWillUnmount(): void {
        document.removeEventListener("keydown", this.onKeyDown as any);
    }

    onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        console.log(e, this.state.currentStep);
        if (e.keyCode == 38) {
            console.log("ArrowUp")
            if (this.state.currentStep !== 0) {
                this.setState({ currentStep: this.state.currentStep - 1 });
            }
        }
        else if (e.keyCode == 40) {
            console.log("ArrowDown")
            if (this.state.currentStep !== this.props.options.length) {
                this.setState({ currentStep: this.state.currentStep + 1 });
            }
        }
        else if (e.keyCode == 13) {
            console.log("Enter")
            if (this.state.currentStep === this.props.options.length) {
                this.props.onBackout();
            }
            else {
                this.props.options[this.state.currentStep].action();
            }
        }
        this.props.scrollToBottom();
    }

    render() {
        return (<div id={"console-picker"}>
            {this.props.options.map((each, index) => {
                return (
                    <div key={each.name} style={{ width: '100%', backgroundColor: this.state.currentStep === index ? 'green' : 'inherit', color: this.state.currentStep === index ? 'black' : 'inherit' }}>
                        <span style={{ paddingRight: '1rem' }}>{each.name}</span><span style={{ paddingRight: '1rem' }}> - </span><span>{each.description}</span>
                    </div>
                )
            })}
            <div style={{ width: '100%', backgroundColor: this.state.currentStep === this.props.options.length ? 'green' : 'inherit', color: this.state.currentStep === this.props.options.length ? 'black' : 'inherit' }}>
                <span style={{ paddingRight: '1rem' }}>{"Back"}</span><span style={{ paddingRight: '1rem' }}> - </span><span>{"Return to the main terminal."}</span>
            </div>
        </div>);
    }
}

export default ConsolePicker;