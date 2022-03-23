import * as React from 'react';
import { Component } from 'react';
import { StaticContext } from 'react-router';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { GameWrapper } from 'react-terminal-game-builder';
import SpaceCenterVintageTerminal from '.';
import { generateDefaultState } from './defaultState';

interface SCVintageTerminalFullWrappedProps extends RouteComponentProps<any, StaticContext, any> {

}

interface SCVintageTerminalFullWrappedState {
    terminalState: any,
    loaded: boolean
}

class SCVintageTerminalFullWrapped extends React.Component<SCVintageTerminalFullWrappedProps, SCVintageTerminalFullWrappedState> {
    state = { terminalState: generateDefaultState(), loaded: false }

    componentDidMount() {
        const search = this.props.location.search;
        const params = new URLSearchParams(search)
        let loginType = params.get('login_type') ? params.get('login_type') as string : "";
        let accessCode = params.get('access_code') ? params.get('access_code') as string : undefined;
        let correctPassword = params.get('password') ? params.get('password') as string : undefined;
        let terminalName = params.get('name') ? params.get('name') as string : undefined;
        let defaultState = { ...generateDefaultState() };
        defaultState.loginType = loginType;
        defaultState.accessCode = accessCode;
        defaultState.correctPassword = correctPassword;
        defaultState.terminalName = terminalName;
        console.log(defaultState);
        this.setState({ terminalState: defaultState, loaded: true })
    }

    render() {
        return (<div className='total-page terminal-background'>
            <div className='terminal-holder'>
                {this.state.loaded && <GameWrapper overallState={this.state.terminalState} onUpdateExternalState={(state, callback) => { this.setState({ terminalState: state }, callback) }} startingComponent={SpaceCenterVintageTerminal} />}
            </div>
        </div>);
    }
}

export default withRouter(SCVintageTerminalFullWrapped);