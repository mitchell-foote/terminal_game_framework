import * as React from 'react';
import { Component } from 'react';

interface TextFragmenterProps {
    text: string
    show: boolean
    stop: boolean
    transitionSpeed?: number
}

interface TextFragmenterState {
    shownText: string;
    shouldShowChar: boolean[]
}

class TextFragmenter extends React.Component<TextFragmenterProps, TextFragmenterState> {
    state: TextFragmenterState = { shownText: "", shouldShowChar: [] }
    updateInterval: any
    showInterval: any
    componentWillUnmount() {
        clearInterval(this.updateInterval);
        clearInterval(this.showInterval);
    }
    componentDidMount() {
        this.updateInterval = setInterval(() => {
            if (this.props.stop) {
                clearInterval(this.updateInterval)
            }
            else {
                this.forceUpdate();
            }
        }, 100)
    }

    componentDidUpdate(oldProps: TextFragmenterProps) {
        if (oldProps.show === false && this.props.show === true) {
            // Start the interval
            console.log("Started interval")
            this.showInterval = setInterval(() => {
                if (this.state.shouldShowChar.length === this.props.text.length) {
                    console.log("Cleared interval");
                    clearInterval(this.showInterval);
                }
                else {
                    let array = [...this.state.shouldShowChar];
                    array.push(true);
                    this.setState({ shouldShowChar: array })
                }
            }, 500)

        }
        else if (oldProps.show === true && this.props.show === false) {
            // clear the array
            console.log("Cleared interval");
            clearInterval(this.showInterval);
            this.setState({ shouldShowChar: [] })
        }
    }

    generateFakeChar = () => {
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charLength = chars.length;
        return chars.charAt(Math.floor(Math.random() * charLength));
    }

    generateWord = () => {
        let stringArray = [];
        for (let i = 0; i < this.props.text.length; i++) {
            if (this.state.shouldShowChar[i]) {
                stringArray.push(this.props.text[i]);
            }
            else {
                stringArray.push(this.generateFakeChar())
            }
        };
        return stringArray.join('');
    }
    render() {
        return (<div>{this.generateWord()}</div>);
    }
}

export default TextFragmenter;