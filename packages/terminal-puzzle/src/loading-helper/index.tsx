import * as React from 'react';
import styles from '../styles/styles.module.css'

export interface LoadingHelperProps {
    message: string;
    startPercent: number;
    endPercent: number;
    onFinish: () => void;
    color?: boolean;
    transitionSpeed?: number;
    showPercent?: boolean;
    maxPercent?: number
}

export interface LoadingHelperState {
    currentPercent: number;
}

export function generateLoadingBarLengths(numbChars: number, complete: number, partial: number, incomplete: number) {
    let unfinishedAscii = '░';
    let partialAscii = '▒';
    let completeAscii = '▓';
    let targetString = '';
    for (let i = 0; i < numbChars; i++) {
        if (complete) {
            targetString += completeAscii;
            complete--;
        }
        else if (partial) {
            targetString += partialAscii;
            partial--;
        }
        else {
            targetString += unfinishedAscii;
            incomplete--;
        }
    }
    return { targetString, complete, partial, incomplete };
}

export function generateLoadingBar(percent: number, length: number, color?: boolean) {


    let complete = Math.floor(length * (percent / 100));
    let partial = 0;
    let incomplete = 0
    if (complete !== length && percent !== 0) {
        partial = 1;
        incomplete = length - complete - partial;
    }
    if (color) {
        let offColor = Math.floor(length / 3);
        let regColor = length - (offColor * 2);
        let badColorResult = generateLoadingBarLengths(offColor, complete, partial, incomplete);
        let medColorResult = generateLoadingBarLengths(offColor, badColorResult.complete, badColorResult.partial, badColorResult.incomplete);
        let regColorResult = generateLoadingBarLengths(regColor, medColorResult.complete, medColorResult.partial, medColorResult.incomplete);


        return (
            <span>
                <span key="bad" className={`${styles['bad-color']}`}>[{badColorResult.targetString}</span>
                <span key="med" className={`${styles['med-color']}`}>{medColorResult.targetString}</span>
                <span key="reg" className={`${styles['reg-color']}`}>{regColorResult.targetString}]</span>
            </span>
        )

    }
    else {
        let totalStringResult = generateLoadingBarLengths(length, complete, partial, incomplete);
        return (
            <span>[{totalStringResult.targetString}]</span>
        )
    }

}

export function generatePercentage(percent: number, color?: boolean) {
    if (color) {
        if (percent > 66) {
            return (<span key="reg" className={`${styles['reg-color']} ${styles['percent-padding']}`}>{percent + '%'}</span>)
        }
        else if (percent > 33) {
            return (<span key="med" className={`${styles['med-color']} ${styles['percent-padding']}`}>{percent + '%'}</span>)
        }
        else {
            return (<span key="bad" className={`${styles['bad-color']} ${styles['percent-padding']}`}>{percent + '%'}</span>)
        }
    }
    else {
        return (<span key="reg" className={`${styles['percent-padding']}`}>{percent + '%'}</span>);
    }
}

class LoadingHelper extends React.Component<LoadingHelperProps, LoadingHelperState> {
    state: LoadingHelperState = { currentPercent: 0 }
    constructor(props) {
        super(props);
        this.transitionPercent = this.transitionPercent.bind(this);
        this.state.currentPercent = this.props.startPercent
    }

    componentDidMount() {
        this.transitionPercent();
    }

    transitionPercent() {
        let speed = 100;
        this.props.transitionSpeed && (speed = this.props.transitionSpeed);
        if (this.state.currentPercent === this.props.endPercent) {
            this.props.onFinish();
            return;
        }
        else if (this.state.currentPercent > this.props.endPercent) {
            this.setState({ currentPercent: this.state.currentPercent - 1 }, () => {
                setTimeout(() => {
                    this.transitionPercent();
                }, speed)
            })
        }
        else {
            this.setState({ currentPercent: this.state.currentPercent + 1 }, () => {
                setTimeout(() => {
                    this.transitionPercent();
                }, speed)
            })
        }
    }

    render() {
        return (
            <div className={`${styles['flex-column']}`}>
                <div className={`${styles['flex-row']}`}>
                    {generateLoadingBar(this.state.currentPercent, 40, this.props.color)}
                    {this.props.showPercent && generatePercentage(this.state.currentPercent, this.props.color)}
                </div>
                <div style={{ paddingTop: '5px' }}>{this.props.message}</div>
            </div>
        );
    }
}

export default LoadingHelper;
