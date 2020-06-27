import * as React from 'react';
import styles from '../styles/styles.module.css'

export interface ShowTextHelperProps {
    message: string;
    nextComponent: React.ElementType;
    onChangeComponent: Function;
    onAddLine: Function;
    terminalLine?: boolean;
    keystrokeTiming?: number;
    nextComponentDelay?: number;
}

export interface ShowTextHelperState {
    currText: string;
}

class ShowTextHelper extends React.Component<ShowTextHelperProps, ShowTextHelperState> {
    state: ShowTextHelperState = { currText: '' };
    constructor(props: ShowTextHelperProps) {
        super(props);
    }
    componentDidMount() {
        let message = this.props.message;
        this.props.terminalLine && (message = "> " + message);
        let keystrokeTiming = this.props.keystrokeTiming === undefined || this.props.keystrokeTiming === null ? 75 : this.props.keystrokeTiming;
        let delay = this.props.nextComponentDelay ? this.props.nextComponentDelay * 1000 : 0;
        for (let i = 0; i < message.length; i++) {
            setTimeout(() => {
                document.getElementById('show-text-helper-txt-line') && (document.getElementById('show-text-helper-txt-line').innerText = message.slice(0, i + 1))
            }, keystrokeTiming * i);
        };
        setTimeout(() => {
            this.props.onAddLine([message]);
            this.props.onChangeComponent(this.props.nextComponent)
        }, (keystrokeTiming * (message.length + 3) + delay))

    }
    render() {
        return (<div id="show-text-helper-txt-line">

        </div>);
    }
}

export default ShowTextHelper;

