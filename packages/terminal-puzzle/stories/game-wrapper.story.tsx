import * as React from 'react';
import { storiesOf } from "@storybook/react"
import GameWrapper from '../src/game-wrapper'
import ShowTextHelper from '../src/show-text-helper';
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
})