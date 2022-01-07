import * as React from 'react';

export function generateBeamBattleBarLengths(numbChars: number, hero: number, partial: number, villian: number) {
    let unfinishedAscii = '░';
    let partialAscii = '▒';
    let completeAscii = '▓';
    let targetString = '';
    for (let i = 0; i < numbChars; i++) {
        if (hero) {
            targetString += completeAscii;
            hero--;
        }
        else if (partial) {
            targetString += partialAscii;
            partial--;
        }
        else {
            targetString += unfinishedAscii;
            villian--;
        }
    }
    return { targetString, hero, partial, villian };

}

export function generateBattleBar(percent: number, length: number) {
    let complete = Math.floor(length * (percent / 100));
    let partial = 0;
    let incomplete = 0
    if (complete !== length && percent !== 0) {
        partial = 1;
        incomplete = length - complete - partial;
    }
    let totalStringResult = generateBeamBattleBarLengths(length, complete, partial, incomplete);
    return (
        <span>[{totalStringResult.targetString}]</span>
    )
}

interface HackingTerminalBeamBattleProps {
    heroName: string
    villianName: string
    heroWins: boolean
    heroStarts: boolean;
    transitionSpeed?: number
    message1: string
    message2: string
    message3: string
    onFinish: () => void;
}

interface HackingTerminalBeamBattleState {
    currentLevel: number
    targetLevel: number
    stageNumber: number
}

class HackingTerminalBeamBattle extends React.Component<HackingTerminalBeamBattleProps, HackingTerminalBeamBattleState> {
    state: HackingTerminalBeamBattleState = { currentLevel: 0, targetLevel: 50, stageNumber: 0 }
    constructor(props: HackingTerminalBeamBattleProps) {
        super(props);
        if (props.heroStarts) {
            this.state.currentLevel = 100
        }
    }
    componentDidMount() {
        this.transitionPercent();
    }

    transitionPercent = () => {
        let speed = 100;
        this.props.transitionSpeed && (speed = this.props.transitionSpeed);
        if (this.state.currentLevel === this.state.targetLevel) {
            this.incrementStageNumber();
        }
        else if (this.state.currentLevel > this.state.targetLevel) {
            this.setState({ currentLevel: this.state.currentLevel - 1 }, () => {
                setTimeout(() => {
                    this.transitionPercent()
                }, speed)
            })
        }
        else {
            this.setState({ currentLevel: this.state.currentLevel + 1 }, () => {
                setTimeout(() => {
                    this.transitionPercent()
                }, speed)
            })
        }
    }

    incrementStageNumber = () => {
        if (this.props.heroWins) {
            switch (this.state.stageNumber) {
                case 0: {
                    this.setState({ stageNumber: 1, targetLevel: 25 }, () => this.transitionPercent())
                    break;
                }
                case 1: {
                    this.setState({ stageNumber: 2, targetLevel: 100 }, () => this.transitionPercent())
                    break;
                }
                case 2: {
                    this.setState({ stageNumber: 3 }, () => this.props.onFinish())
                    break;
                }
                default: {
                    // shouldn't get here
                }
            }
        }
        else {
            switch (this.state.stageNumber) {
                case 0: {
                    this.setState({ stageNumber: 1, targetLevel: 75 }, () => this.transitionPercent())
                    break;
                }
                case 1: {
                    this.setState({ stageNumber: 2, targetLevel: 0 }, () => this.transitionPercent())
                    break;
                }
                case 2: {
                    this.setState({ stageNumber: 3 }, () => this.props.onFinish())
                    break;
                }
                default: {
                    // shouldn't get here
                }
            }
        }
    }

    generateMessage = () => {
        switch (this.state.stageNumber) {
            case 0: {
                return this.props.message1
            }
            case 1: {
                return this.props.message2
            }
            case 2: {
                return this.props.message3
            }
            default: {
                return ''
            }
        }
    }

    generateExclusiveRandom = () => {
        if (this.state.currentLevel > 95) {
            return this.state.currentLevel
        }
        else if (this.state.currentLevel < 5) {
            return this.state.currentLevel
        }
        else {
            let randomNumb = Math.floor(Math.random() * 4);
            if (randomNumb % 2) {
                randomNumb *= -1;
            }
            return this.state.currentLevel + randomNumb;
        }
    }

    render() {
        return (<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: '0.5rem' }}>
                <div>{this.props.heroName}</div>
                {generateBattleBar(this.generateExclusiveRandom(), 40)}
                <div>{this.props.villianName}</div>
            </div>
            <div style={{ paddingTop: '5px' }}>{this.generateMessage()}</div>
        </div>);
    }
}

export default HackingTerminalBeamBattle;