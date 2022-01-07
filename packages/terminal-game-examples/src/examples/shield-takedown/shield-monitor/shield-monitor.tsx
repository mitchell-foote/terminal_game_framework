import * as React from 'react';
import { NormalShields1, NormalShields2 } from './shields/normal-shield';
import { MildShields1, MildShields2, MildShields3, MildShields4 } from './shields/mild-shield';
import { ModerateShields1, ModerateShields2, ModerateShields3, ModerateShields4 } from './shields/moderate-shield';
import { CriticalShields1, CriticalShields2, CriticalShields3, CriticalShields4 } from './shields/critical-shield';
import { FailingShields1, FailingShields2, FailingShields3, FailingShields4 } from './shields/failing-shields';
import { NoShields1 } from './shields/no-shield';

export enum ShieldMonitorStatus {
    NORMAL,
    MILD_ISSUES,
    MODERATE_ISSUES,
    DANGEROUS_ISSUES,
    CRITICAL_ISSUES,
    SHIELDS_FAILING,
    NO_SHIELD

}

export const NormalShieldArray = [NormalShields1, NormalShields2, NormalShields1, NormalShields2];
export const MildShieldArray = [MildShields1, MildShields2, MildShields3, MildShields4]
export const ModerateShieldArray = [ModerateShields1, ModerateShields2, ModerateShields3, ModerateShields4];
export const DangerousShieldArray = [CriticalShields1, CriticalShields2, CriticalShields3, CriticalShields4]
export const CriticalShieldArray = [CriticalShields1, CriticalShields2, FailingShields1, FailingShields2];
export const FailingShieldArray = [FailingShields1, FailingShields2, FailingShields1, FailingShields3, FailingShields2, FailingShields3, FailingShields4, FailingShields3, FailingShields4, NoShields1, FailingShields4, NoShields1];

export function generateNormalShields(step: number) {
    let targetStep = step % 4;
    return <span>{NormalShieldArray[targetStep]}</span>
}

export function generateMildShields(step: number) {
    let targetStep = step % 4;
    return <span>{MildShieldArray[targetStep]}</span>
}

export function generateModerateShilds(step: number) {
    let targetStep = step % 4;
    return <span>{ModerateShieldArray[targetStep]}</span>;
}

export function generateDangerousShields(step: number) {
    let targetStep = step % 4;
    return <span>{DangerousShieldArray[targetStep]}</span>
}

export function generateCriticalShields(step: number) {
    let targetStep = step % 4;
    return <span>{CriticalShieldArray[targetStep]}</span>
}

export function generateFailingShields(step: number) {
    let targetStep = step % 12;
    return <span>{FailingShieldArray[targetStep]}</span>
}

interface ShieldMonitorProps {
    onFinishedAnimation: () => void;
    shieldsType: ShieldMonitorStatus
    color?: string
    transitionSpeed?: number
    totalSteps?: number;
}

interface ShieldMonitorState {
    step: number;
    totalSteps: number;
}

class ShieldMonitor extends React.Component<ShieldMonitorProps, ShieldMonitorState> {
    state: ShieldMonitorState = { step: 0, totalSteps: 8 }

    componentDidMount() {
        let transitionSpeed: number;
        let totalSteps
        if (this.props.shieldsType === ShieldMonitorStatus.SHIELDS_FAILING) {
            transitionSpeed = this.props.transitionSpeed ? this.props.transitionSpeed : 500;
            totalSteps = this.props.totalSteps ? this.props.totalSteps : 12
        }
        else {
            transitionSpeed = this.props.transitionSpeed ? this.props.transitionSpeed : 125;
            totalSteps = this.props.totalSteps ? this.props.totalSteps : 24
        }
        this.setState({ step: 0, totalSteps: totalSteps }, () => {
            setTimeout(this.headToNextStep(transitionSpeed), transitionSpeed)
        })
    }

    headToNextStep = (transitionSpeed: number) => {
        return () => {
            if (this.state.step < this.state.totalSteps - 1) {
                this.setState({ step: this.state.step + 1 }, () => {
                    setTimeout(this.headToNextStep(transitionSpeed), transitionSpeed)
                })
            }
            else {
                this.props.onFinishedAnimation();
            }
        }

    }

    generateText = () => {
        switch (this.props.shieldsType) {
            case ShieldMonitorStatus.NORMAL: {
                return generateNormalShields(this.state.step);
            }
            case ShieldMonitorStatus.MILD_ISSUES: {
                return generateMildShields(this.state.step);
            }
            case ShieldMonitorStatus.MODERATE_ISSUES: {
                return generateModerateShilds(this.state.step);
            }
            case ShieldMonitorStatus.DANGEROUS_ISSUES: {
                return generateDangerousShields(this.state.step);
            }
            case ShieldMonitorStatus.CRITICAL_ISSUES: {
                return generateCriticalShields(this.state.step);
            }
            case ShieldMonitorStatus.SHIELDS_FAILING: {
                return generateFailingShields(this.state.step)
            }
            case ShieldMonitorStatus.NO_SHIELD: {
                return <span>{NoShields1}</span>
            }
        }
    }

    render() {
        return (<div style={{ color: this.props.color ? this.props.color : 'inherit' }}>{this.generateText()}</div>);
    }
}

export default ShieldMonitor;