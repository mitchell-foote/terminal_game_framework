import * as React from 'react';
import { GameComponentProps, LoginOverallState } from '../types';
import TerminalInputHelper from '../terminal-input-helper';
import LoadingHelper from '../loading-helper';


export interface LoginWorkflowProps extends GameComponentProps<LoginOverallState> {
    allowedLogins?: { [index: string]: string };
    nextComponent?: React.ElementType;
    onLoginComplete?: Function;
    disableWelcome?: boolean;
    onLoginFailure?: Function;
    usernameLabel?: string;
    passwordLabel?: string
}

export interface LoginWorkflowState {
    showUsername: boolean;
    showPassword: boolean;
    showLoading: boolean;
}

class LoginWorkflow extends React.Component<LoginWorkflowProps, LoginWorkflowState> {
    state: LoginWorkflowState = { showLoading: false, showPassword: false, showUsername: false }
    constructor(props) {
        super(props);
        this.showInit = this.showInit.bind(this);
        this.showUsername = this.showUsername.bind(this);
        this.showPassword = this.showPassword.bind(this);
        this.showUsernamePrompt = this.showUsernamePrompt.bind(this);
        this.handleUsernameCommands = this.handleUsernameCommands.bind(this);
        this.handlePasswordCommands = this.handlePasswordCommands.bind(this);
        this.showPasswordPrompt = this.showPasswordPrompt.bind(this);
        this.loadComplete = this.loadComplete.bind(this);
        this.finishFlow = this.finishFlow.bind(this);
    }
    componentDidMount() {
        let overallState = { ...this.props.overallState };
        overallState.login = { username: '', password: '' };
        this.props.updateOverallState(overallState);
        this.showInit();
    }
    showInit = () => {
        this.props.writeText({ message: "Initializing..." }, this.showUsername)
    }
    showUsername = () => {
        this.props.writeText({ message: `${this.props.usernameLabel ? this.props.usernameLabel : 'Username'}: ` }, this.showUsernamePrompt)
    }
    showPassword = () => {
        this.setState({ showUsername: false }, () => {
            this.props.writeText({ message: `${this.props.passwordLabel ? this.props.passwordLabel : 'Password'}: ` }, this.showPasswordPrompt)
        })
    }
    showUsernamePrompt = () => {
        this.setState({ showUsername: true, showPassword: false });
    }
    handleUsernameCommands = (command: string, args: string[], fullText: string) => {
        if (fullText) {
            let overallState = { ...this.props.overallState };
            overallState.login.username = fullText.replace('> ', '');
            this.props.updateOverallState(overallState);
            this.showPassword();
        }
    }
    handlePasswordCommands = (command: string, args: string[], fullText: string) => {
        if (fullText) {
            let overallState = { ...this.props.overallState };
            overallState.login.password = fullText.replace('> ', '');
            if (this.props.allowedLogins) {
                if (this.props.allowedLogins[this.props.overallState.login.username]) {
                    if (this.props.allowedLogins[this.props.overallState.login.username] !== overallState.login.password) {
                        this.props.writeText({ message: "Login incorrect, please try again" }, this.showUsername);
                        this.props.onLoginFailure && this.props.onLoginFailure();
                        return;
                    }
                }
                else {
                    this.props.writeText({ message: "Login incorrect, please try again" }, this.showUsername);
                    this.props.onLoginFailure && this.props.onLoginFailure();
                    return;
                }
            }
            this.props.updateOverallState(overallState);
            this.finishFlow();
        }
    }
    showPasswordPrompt = () => {
        this.setState({ showPassword: true, showUsername: false });
    }
    loadComplete = () => {
        this.setState({ showLoading: false, showUsername: false, showPassword: false }, () => {
            this.props.writeText({ message: 'Login Success!' }, () => {
                this.completeLogin()
            })
        })
    }
    completeLogin = () => {
        this.props.nextComponent && this.props.updateComponent(this.props.nextComponent);
        this.props.onLoginComplete && this.props.onLoginComplete();
    }
    finishFlow = () => {
        this.setState({ showPassword: false, showUsername: false, showLoading: true });
    }
    render() {
        return (<div>
            {this.state.showUsername && <TerminalInputHelper onSumbitCommand={this.handleUsernameCommands} />}
            {this.state.showPassword && <TerminalInputHelper onSumbitCommand={this.handlePasswordCommands} />}
            {this.state.showLoading && <LoadingHelper message={"Loading user data"} startPercent={0} endPercent={100} showPercent={true} onFinish={this.loadComplete} />}
        </div>);
    }
}

export default LoginWorkflow;