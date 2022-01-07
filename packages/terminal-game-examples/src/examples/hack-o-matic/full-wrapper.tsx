import * as React from 'react';
import { Component } from 'react';
import { StaticContext, withRouter } from 'react-router';
import { RouteComponentProps } from 'react-router-dom';
import { GameWrapper } from 'react-terminal-game-builder';
import HackerTerminal from '.';
import { generateDefaultState } from './defaultState';


interface VirusHackingWrappedProps extends RouteComponentProps<any, StaticContext, any> {

}

interface VirusHackingWrappedState {
    hackingState: any
}

class VirusHackingWrapped extends React.Component<VirusHackingWrappedProps, VirusHackingWrappedState> {
    state: VirusHackingWrappedState = { hackingState: {} }
    constructor(props: any) {
        super(props)
        this.state.hackingState = generateDefaultState();
        const search = this.props.location.search;
        const params = new URLSearchParams(search);
        let hackerName = params.get('hacker_name') !== null ? params.get('hacker_name') as string : undefined;
        let targetName = params.get('target_name') !== null ? params.get('target_name') as string : undefined;
        let systemName = params.get('system_name') !== null ? params.get('system_name') as string : undefined;
        let systemShortName = params.get('system_name_short') !== null ? params.get('system_name_short') as string : undefined;
        this.state.hackingState.hackerName = hackerName;
        this.state.hackingState.targetName = targetName;
        this.state.hackingState.systemName = systemName;
        this.state.hackingState.systemShortName = systemShortName;
    }


    render() {
        return (
            <div className='total-page terminal-background'>
                <div className='terminal-holder'>
                    <GameWrapper overallState={this.state.hackingState} onUpdateExternalState={(state, callback) => { this.setState({ hackingState: state }, callback) }} startingComponent={HackerTerminal} />
                </div>
            </div>
        );
    }
}

export default withRouter(VirusHackingWrapped);