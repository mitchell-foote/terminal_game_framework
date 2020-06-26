import * as React from 'react';
import { storiesOf } from "@storybook/react"
import TestClass from '../src/starting-folder'
storiesOf("Test class", module).add('test storybook', () => {
    return (<>
        <TestClass />
    </>)
})