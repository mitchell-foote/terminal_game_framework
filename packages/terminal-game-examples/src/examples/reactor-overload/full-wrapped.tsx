import * as React from 'react';
import { StaticContext } from 'react-router';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { GameWrapper } from 'react-terminal-game-builder';
import ReactorOverload from '.';
import '../../App.css';
import './styles.css'

import { generateDefaultState } from './defaultState';
//import { Flex, Heading } from '@adobe/react-spectrum';

interface ReactorControlFullComponentProps extends RouteComponentProps<any, StaticContext, any> {

}

interface ReactorControlFullComponentState {
    reactorState: any
    timer: number
    shipName?: string
    reactorName?: string
}

class ReactorControlFullComponent extends React.Component<ReactorControlFullComponentProps, ReactorControlFullComponentState> {
    state: ReactorControlFullComponentState = { reactorState: {}, timer: 60 * 10 }
    timer: any;
    componentDidMount() {
        const search = this.props.location.search;
        const params = new URLSearchParams(search)
        let overload = params.get('overload') ? true : false;
        let overloadTroubledVent = params.get('vent');
        let restartTroubledInjector = params.get('injector');
        let shipName = params.get('ship_name') !== null ? params.get('ship_name') as string : undefined;
        let reactorName = params.get('reactor_name') !== null ? params.get('reactor_name') as string : undefined;
        let defaultState = generateDefaultState(overload);
        overloadTroubledVent && (defaultState.overloadTroubledVent = overloadTroubledVent);
        restartTroubledInjector && (defaultState.restartTroubledInjector = restartTroubledInjector);
        shipName && (defaultState.shipName = shipName);
        reactorName && (defaultState.reactorName = reactorName);
        // Set up timer stuff here
        this.timer = setInterval(() => {
            if (this.state.reactorState.restartFinalRestart || this.state.reactorState.overloadFinalFlush) {
                clearInterval(this.timer);
                this.setState({ timer: 1111 })
            }
            else if (this.state.timer === 0) {
                clearInterval(this.timer);
            }
            else {
                this.setState({ timer: this.state.timer - 1 })
            }
        }, 1000)
        this.setState({ reactorState: defaultState, shipName, reactorName })
    }

    generateTimerHeader = () => {
        if (this.state.reactorState.overload !== undefined) {
            if (this.state.reactorState.overload) {
                return (<div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: "center" }}>
                    <div>
                        {this.state.reactorState.overloadFinalFlush ? "Reactor overload rectified" : "Overload in Progress! Reactor explosion imminent!"}
                    </div>
                    {this.state.reactorState.overloadFinalFlush ? <div /> : (
                        <div style={{ fontSize: '10rem', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {this.getTimeLeft()}
                        </div>
                    )}

                </div>)
            }
            else {
                return (<div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div >
                        {this.state.reactorState.restartFinalRestart ? "Reactor is online" : "Reactor is offline! Life support failure imminent!"}
                    </div>
                    {this.state.reactorState.restartFinalRestart ? <div /> : (
                        <div style={{ fontSize: '10rem', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {this.getTimeLeft()}
                        </div>
                    )}

                </div>)
            }
        }
        return <div />
    }

    getTimeLeft = () => {
        let minutes = Math.floor(this.state.timer / 60);
        let seconds = this.state.timer % 60;
        seconds < 10 && (seconds = '0' + seconds as any)

        return `${minutes}:${seconds}`;
    }

    generateReactorTerminal = () => {
        let backgroundStyle = {}
        if (this.state.timer % 2 === 0) {
            if (this.state.timer > 60) {
                backgroundStyle = { borderColor: "yellow", color: 'yellow' }
            }
            else {
                backgroundStyle = { borderColor: "red", color: 'red' }
            }
        }
        else {
            backgroundStyle = {}
        }
        if (this.state.reactorState.overload !== undefined && this.state.timer) {
            return (
                <div className="total-page terminal-background">
                    <Link to="/">To Remote Access</Link>
                    <div className="terminal-title">
                    </div>
                    <div style={{ display: 'flex', justifyContent: "space-between", alignItems: 'center' }}>
                        <div className="terminal-holder">
                            <GameWrapper overallState={this.state.reactorState} onUpdateExternalState={(state, callback) => { this.setState({ reactorState: state }, callback) }} startingComponent={ReactorOverload} />
                        </div>
                        <div className="timer-parent" style={backgroundStyle}>
                            {this.generateTimerHeader()}
                        </div>
                    </div>

                </div>
            )
        }
        else if (!this.state.timer) {
            return (<div className="total-page terminal-background">
                <Link to="/">To Remote Access</Link>
                <div className="terminal-title">
                    { }
                </div>
                <div style={{ display: 'flex', justifyContent: "space-between", alignItems: 'center' }}>
                    <div className="terminal-holder" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {"YOU ARE DEAD"}
                    </div>
                    <div className="timer-parent" style={backgroundStyle}>
                        {this.generateTimerHeader()}
                    </div>
                </div>
            </div>)
        }
        else {
            return (<div className="total-page terminal-background">
                <Link to="/">To Remote Access</Link>
                <div className="terminal-title">
                    { }
                </div>
                <div className="terminal-holder">
                    {"YOU ARE DEAD"}
                </div>
                <div className="timer-parent">
                    {this.generateTimerHeader()}
                </div>
            </div>)
        }
    }

    render() {
        return (<div>
            {this.generateReactorTerminal()}
        </div>);
    }
}

export default withRouter(ReactorControlFullComponent);