import * as React from 'react';
import { Component } from 'react';
import { GameWrapper, LoadingHelper } from 'react-terminal-game-builder';
import DiskRestoreAndDecrypt from '.';
import generateDefaultState from './default-state';
import TextFragmenter from './text-fragmenter';
import { ExternalState } from './types';
import './styles.css'

interface DeviceRestoreFullWrappedProps {

}

interface DeviceRestoreFullWrappedState {
    deviceRestoreState: ExternalState
}

class DeviceRestoreFullWrapped extends React.Component<DeviceRestoreFullWrappedProps, DeviceRestoreFullWrappedState> {
    state: DeviceRestoreFullWrappedState = { deviceRestoreState: generateDefaultState() }

    generateDiskHealth = () => {
        if (!this.state.deviceRestoreState.hasElectricalFix) {
            return (
                <LoadingHelper
                    key={'alpha'}
                    startPercent={0}
                    endPercent={0}
                    color
                    showPercent
                    message={"Disk health"}
                    onFinish={() => { }}
                />
            )
        }
        else if (!this.state.deviceRestoreState.hasFragmentationFix) {
            return (
                <LoadingHelper
                    key={'alpha2'}
                    startPercent={0}
                    endPercent={25}
                    color
                    showPercent
                    message={"Disk health"}
                    onFinish={() => { }}
                />
            )
        }
        else if (!this.state.deviceRestoreState.hasPartitionFix) {
            return (
                <LoadingHelper
                    key={'alpha3'}
                    startPercent={25}
                    endPercent={50}
                    color
                    showPercent
                    message={"Disk health"}
                    onFinish={() => { }}
                />
            )
        }
        else if (!this.state.deviceRestoreState.hasTempFix) {
            return (
                <LoadingHelper
                    key={'alpha4'}
                    startPercent={50}
                    endPercent={75}
                    color
                    showPercent
                    message={"Disk health"}
                    onFinish={() => { }}
                />
            )
        }
        else {
            return (
                <LoadingHelper
                    key={'alpha5'}
                    startPercent={75}
                    endPercent={100}
                    color
                    showPercent
                    message={"Disk health"}
                    onFinish={() => { }}
                />
            )
        }

    }

    generateCodeFragment = () => {
        return (
            <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: "space-between" }}>
                    <div>Code Fragment 1</div>
                    <TextFragmenter show={this.state.deviceRestoreState.hasElectricalFix} text={this.state.deviceRestoreState.electricalFragment} stop={this.state.deviceRestoreState.hasCompleteDecode} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: "space-between" }}>
                    <div>Code Fragment 2</div>
                    <TextFragmenter show={this.state.deviceRestoreState.hasFragmentationFix} text={this.state.deviceRestoreState.fragmentationFragment} stop={this.state.deviceRestoreState.hasCompleteDecode} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: "space-between" }}>
                    <div>Code Fragment 3</div>
                    <TextFragmenter show={this.state.deviceRestoreState.hasPartitionFix} text={this.state.deviceRestoreState.partitionFragment} stop={this.state.deviceRestoreState.hasCompleteDecode} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: "space-between" }}>
                    <div>Code Fragment 4</div>
                    <TextFragmenter show={this.state.deviceRestoreState.hasTempFix} text={this.state.deviceRestoreState.tempFragment} stop={this.state.deviceRestoreState.hasCompleteDecode} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: "space-between" }}>
                    <div>Code Fragment 5</div>
                    <TextFragmenter show={this.state.deviceRestoreState.hasLogsFragment} text={this.state.deviceRestoreState.logsFragment} stop={this.state.deviceRestoreState.hasCompleteDecode} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: "space-between" }}>
                    <div>Code Fragment 6</div>
                    <TextFragmenter show={this.state.deviceRestoreState.hasSectorFragment} text={this.state.deviceRestoreState.sectorFragment} stop={this.state.deviceRestoreState.hasCompleteDecode} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: "space-between" }}>
                    <div>Code Fragment 7</div>
                    <TextFragmenter show={this.state.deviceRestoreState.hasCompleteDecode} text={this.state.deviceRestoreState.finalFragment} stop={false} />
                </div>
            </div>
        )
    }

    render() {
        return (<div className="total-page terminal-background">
            <div className="terminal-title"></div>
            <div style={{ display: 'flex', justifyContent: "space-between", alignItems: 'center' }}>
                <div className="terminal-holder">
                    <GameWrapper overallState={this.state.deviceRestoreState} onUpdateExternalState={(state, callback) => { this.setState({ deviceRestoreState: state }, callback) }} startingComponent={DiskRestoreAndDecrypt} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="timer-parent1">
                        {this.generateCodeFragment()}
                    </div>
                    <div className='timer-parent1'>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div>{this.generateDiskHealth()}</div>
                            {this.state.deviceRestoreState.hasTempFix && <div>This disk has been repaired! New commands are now available.</div>}
                        </div>
                    </div>
                </div>

            </div>

        </div>);
    }
}

export default DeviceRestoreFullWrapped;