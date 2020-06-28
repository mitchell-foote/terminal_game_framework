import * as React from 'react';
import { storiesOf } from "@storybook/react"
import GameWrapper from '../src/game-wrapper'
import ShowTextHelper from '../src/show-text-helper';
import TerminalInputHelper from '../src/terminal-input-helper'
import LoadingHelper from '../src/loading-helper'
import LoginWorkflow from '../src/login-workflow'
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
})