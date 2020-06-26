import * as React from 'react';
import { configure, addDecorator } from '@storybook/react'
import { StoryWrapper } from './layout';

const req = require.context('../stories', true, /\.story\.(ts|tsx)$/)

addDecorator(story => <StoryWrapper>{story()}</StoryWrapper>)

configure(() => {
  req.keys().forEach(filename => req(filename))
}, module);
