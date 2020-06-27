import * as React from 'react';
import { storiesOf } from "@storybook/react"
import GameWrapper from '../src/game-wrapper'
storiesOf("Game Wrapper", module).add('test init', () => {
    return (<>
        <div style={{ height: '50vh' }}>
            <GameWrapper startingComponent={() => { return (<></>) }} />
        </div>
    </>)
})