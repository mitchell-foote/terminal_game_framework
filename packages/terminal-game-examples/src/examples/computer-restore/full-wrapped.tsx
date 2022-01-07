import * as React from 'react';
import { Component } from 'react';
import { StaticContext } from 'react-router';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { GameWrapper } from 'react-terminal-game-builder';
import '../../App.css';
import { generateDefaultState } from './default-state';
import ComputerRestore from '.';


interface ComputerRepairFullWrappedProps extends RouteComponentProps<any, StaticContext, any> {

}

interface ComputerRepairFullWrappedState {
    overallState: any
}

class ComputerRepairFullWrapped extends React.Component<ComputerRepairFullWrappedProps, ComputerRepairFullWrappedState> {
    state = { overallState: {} }
    componentDidMount() {
        let defaultState = generateDefaultState();
        const search = this.props.location.search;
        const params = new URLSearchParams(search);
        let backupsAvail = params.get('backups') ? true : false;
        let restoreAvail = params.get('restore') ? true : false;
        let destinations = params.get('destinations') !== null ? (params.get('destinations') as string).split(',') : undefined;
        let systemName = params.get('system_name') ? params.get('system_name') as string : undefined;
        let restoredSysName = params.get('restore_system') ? params.get('restore_system') as string : undefined;
        defaultState.backupsAvailable = backupsAvail;
        defaultState.restoreAvailable = restoreAvail;
        defaultState.destinations = destinations;
        defaultState.rebootedSystemName = restoredSysName;
        defaultState.recoverySystemName = systemName;
        this.setState({ overallState: defaultState })
    }
    render() {
        return (
            <div className='total-page terminal-background'>
                <div className='terminal-holder'>
                    <GameWrapper overallState={this.state.overallState} onUpdateExternalState={(state, callback) => { this.setState({ overallState: state }, callback) }} startingComponent={ComputerRestore} />
                </div>
            </div>
        );
    }
}

export default withRouter(ComputerRepairFullWrapped);