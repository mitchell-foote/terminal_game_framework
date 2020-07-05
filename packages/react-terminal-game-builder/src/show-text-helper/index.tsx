import * as React from 'react';
import styles from '../styles/styles.module.css'
import { v4 } from 'uuid'
export interface ShowTextHelperProps {
    message: string;
    nextComponent: React.ElementType;
    onChangeComponent?: Function;
    onAddLine?: Function;
    terminalLine?: boolean;
    keystrokeTiming?: number;
    nextComponentDelay?: number;
    onComplete?: Function;
    color?: string;
}

export interface ShowTextHelperState {
    currText: string;
    uniqueId: string;
}

class ShowTextHelper extends React.Component<ShowTextHelperProps, ShowTextHelperState> {
    state: ShowTextHelperState = { currText: '', uniqueId: v4() };
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
                document.getElementById('show-text-helper-txt-line-' + this.state.uniqueId) && (document.getElementById('show-text-helper-txt-line-' + this.state.uniqueId).innerText = message.slice(0, i + 1))
            }, keystrokeTiming * i);
        };
        setTimeout(() => {
            this.props.onAddLine && this.props.onAddLine([message]);
            this.props.onChangeComponent && this.props.onChangeComponent(this.props.nextComponent)
            this.props.onComplete && this.props.onComplete();
        }, (keystrokeTiming * (message.length + 3) + delay))

    }
    render() {
        return (<div style={{ color: this.props.color ? this.props.color : 'inherit' }} id={'show-text-helper-txt-line-' + this.state.uniqueId}>

        </div>);
    }
}

export default ShowTextHelper;

