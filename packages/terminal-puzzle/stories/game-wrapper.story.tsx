import * as React from 'react';
import { storiesOf } from "@storybook/react"
import GameWrapper from '../src/game-wrapper'
import ShowTextHelper from '../src/show-text-helper';
import TerminalInputHelper from '../src/terminal-input-helper'
import LoadingHelper from '../src/loading-helper'
import LoginWorkflow from '../src/login-workflow'
import OptionHelper from '../src/option-helper'
import { GameComponentProps } from '../src/types'

storiesOf("Game Wrapper", module).add('test init', () => {
    return (<>
        <div style={{ height: '50vh' }}>
            <GameWrapper startingComponent={(props: GameComponentProps) => {
                return (
                    <ShowTextHelper terminalLine={true} message="hello my name is batman" onAddLine={props.addLine} onChangeComponent={props.updateComponent} nextComponent={() => { return (<div></div>) }} />
                )
            }} />
        </div>
    </>)
}).add('test multiple showTextHelpers', () => {
    return (
        <div style={{ height: '50vh' }}>
            <GameWrapper startingComponent={(props: GameComponentProps) => {
                return (
                    <ShowTextHelper terminalLine={true} message="hello my name is batman" onAddLine={props.addLine} onChangeComponent={props.updateComponent} nextComponent={() => {
                        return (
                            <ShowTextHelper
                                terminalLine={true}
                                message="hello my name is batman 2"
                                onAddLine={props.addLine}
                                onChangeComponent={props.updateComponent}
                                nextComponent={() => {
                                    return (<ShowTextHelper
                                        terminalLine={true}
                                        message="hello my name is batman 3"
                                        onAddLine={props.addLine}
                                        onChangeComponent={props.updateComponent}
                                        nextComponent={() => { return (<div>Done!</div>) }}
                                    />)
                                }}
                            />
                        )
                    }} />
                )
            }} />
        </div>
    )
}).add('test TerminalInputHelper', () => {
    return (
        <div style={{ height: '50vh' }}>
            <GameWrapper startingComponent={(props: GameComponentProps) => {
                return (
                    <TerminalInputHelper onSumbitCommand={(command, args, fullText) => {
                        console.log(command, args, fullText)
                        props.addLine([fullText]);
                    }} />
                )
            }} />
        </div>
    )
}).add('test LoadingHelper regular', () => {
    return (
        <div style={{ height: '50vh' }}>
            <GameWrapper startingComponent={(props: GameComponentProps) => {
                return (
                    <LoadingHelper message={'Loading user data'} showPercent={true} startPercent={0} endPercent={100} onFinish={() => { console.log("finished!") }} />
                )
            }} />
        </div>
    )
}).add('LoadingHelper slow', () => {
    return (
        <div style={{ height: '50vh' }}>
            <GameWrapper startingComponent={(props: GameComponentProps) => {
                return (
                    <LoadingHelper message={'Loading user database'} showPercent={true} transitionSpeed={500} startPercent={0} endPercent={100} onFinish={() => { console.log("finished!") }} />
                )
            }} />
        </div>
    )
}).add('LoadingHelper backwards', () => {
    return (
        <div style={{ height: '50vh' }}>
            <GameWrapper startingComponent={(props: GameComponentProps) => {
                return (
                    <LoadingHelper message={'Venting atmosphere'} showPercent={true} startPercent={100} endPercent={0} onFinish={() => { console.log("finished!") }} />
                )
            }} />
        </div>
    )
}).add('LoadingHelper but in COLOR!', () => {
    return (
        <div style={{ height: '50vh' }}>
            <GameWrapper startingComponent={(props: GameComponentProps) => {
                return (
                    <LoadingHelper message={'Chargeing forward cannons'} showPercent={true} startPercent={0} endPercent={100} color={true} onFinish={() => { console.log("finished!") }} />
                )
            }} />
        </div>
    )
}).add('Login Workflow test', () => {
    return (
        <div style={{ height: '50vh' }}>
            <GameWrapper startingComponent={LoginWorkflow} />
        </div>
    )
}).add('OptionHelper test', () => {
    return (
        <div style={{ height: '50vh' }}>
            <GameWrapper startingComponent={(props: GameComponentProps) => {
                return (
                    <OptionHelper options={[
                        {
                            action: () => { console.log('called Gate_Control') },
                            name: 'Gate_Control',
                            description: 'Controls gate actions'
                        },
                        {
                            action: () => { console.log('called security') },
                            name: 'Security',
                            description: 'Controls security actions'
                        },
                        {
                            action: () => { console.log('called crew logs') },
                            name: 'Crew_Logs',
                            description: 'Access crew logs'
                        },
                        {
                            action: () => { console.log('called engineering') },
                            name: 'Engineering',
                            description: 'Access engineering actions'
                        },
                        {
                            action: () => { console.log('called back') },
                            name: 'Back',
                            description: 'Returns to previous screen'
                        }
                    ]} addLine={props.addLine} />
                )
            }} />
        </div>
    )
}).add('options helper w/numbers', () => {
    return (
        <div style={{ height: '50vh' }}>
            <GameWrapper startingComponent={(props: GameComponentProps) => {
                return (
                    <OptionHelper allowNumberChoice={true} options={[
                        {
                            action: () => { console.log('called Gate_Control') },
                            name: 'Gate_Control',
                            description: 'Controls gate actions'
                        },
                        {
                            action: () => { console.log('called security') },
                            name: 'Security',
                            description: 'Controls security actions'
                        },
                        {
                            action: () => { console.log('called crew logs') },
                            name: 'Crew_Logs',
                            description: 'Access crew logs'
                        },
                        {
                            action: () => { console.log('called engineering') },
                            name: 'Engineering',
                            description: 'Access engineering actions'
                        },
                        {
                            action: () => { console.log('called back') },
                            name: 'Back',
                            description: 'Returns to previous screen'
                        }
                    ]} addLine={props.addLine} />
                )
            }} />
        </div>
    )
})