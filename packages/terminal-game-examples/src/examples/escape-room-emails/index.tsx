import * as React from 'react';
import { Types, OptionsHelper, LoginWorkflow, ShowTextHelper, TerminalInputHelper, LoadingHelper } from 'react-terminal-game-builder'
import { emails, userGroups, RecievedMessage, SentMessage, doorCode, PersonalEmails } from './data';

export interface EscapeRoomEmailsProps extends Types.GameComponentProps<EmailOverallState> {

}

enum GameState {
    MainScreen,
    Login,
    RoomCode,
    LoggedIn,
    Sent,
    Recieved,
    Victory,
    VictoryRoad,
    NotLoaded
}

export interface EscapeRoomEmailsState {
    screenState: GameState,
    failedLogins: number
}

// accounts lferretti (password) -> jfraiser (cassandra) -> djackson (vala) -> scarter (scarter) -> joneal (strg8)


export interface EmailOverallState {
    emails: Record<string, PersonalEmails>
    login: any
}

/**
 * Basic story: 
 *  You get locked into a room, it's your job to find the code to the room through the messages.
 * 
 */

class EscapeRoomEmails extends React.Component<EscapeRoomEmailsProps, EscapeRoomEmailsState> {
    state: EscapeRoomEmailsState = { screenState: GameState.NotLoaded, failedLogins: 0 };

    componentDidMount() {

        let overallState = { ...this.props.overallState };
        overallState.emails = emails;
        this.props.updateOverallState(overallState, () => {
            this.moveToMainPage();
        });

    }

    handleFailedLogin = () => {
        if (this.state.failedLogins > 3) {
            this.setState({ failedLogins: 0 }, () => {
                this.moveToMainPage();
            })
        }
        else {
            this.setState({ failedLogins: this.state.failedLogins + 1 })
        }
    }

    handleUserLogout = () => {
        let overallState = { ...this.props.overallState };
        overallState.login = {};
        this.props.updateOverallState(overallState, () => {
            this.setState({ screenState: GameState.NotLoaded }, () => {
                this.moveToMainPage();
            })

        });

    }

    handleRoomCodeAttempt = (command: string, args: string[], fullText: string) => {
        let trueFullText = fullText.replace("> ", '');

        if (trueFullText === doorCode) {
            this.setState({ screenState: GameState.NotLoaded }, () => {
                this.props.writeText({ message: "Door Code Accepted!" }, () => {
                    this.moveToVictoryRoad();
                })
            })

        }
        else {
            this.setState({ screenState: GameState.NotLoaded }, () => {
                this.props.writeText({ message: "Door Code Incorrect." }, () => {
                    this.moveToMainPage();
                })
            })

        }
    }

    moveToMainPage = () => {
        this.setState({ screenState: GameState.NotLoaded }, () => {
            this.props.clearLines(() => {
                this.props.writeText({ message: "Welcome to message server v2.3!" }, () => {
                    this.props.writeText({ message: "Remember that all entries are in lower case" }, () => {
                        this.setState({ screenState: GameState.MainScreen });
                    })
                })
            })
        })


    }

    moveToLoginPage = () => {
        this.props.clearLines(() => {
            this.setState({ screenState: GameState.Login });

        });
    }

    moveToDoorCode = () => {
        this.props.clearLines(() => {
            this.props.addLine(['Door code: '], () => {
                this.setState({ screenState: GameState.RoomCode })
            })

        });

    }

    moveToMessageServer = () => {
        this.props.clearLines(() => {
            this.props.addLine([`Welcome ${this.props.overallState.login.username}!`], () => {
                this.setState({ screenState: GameState.LoggedIn });
            })

        });

    }

    moveToRecievedMessages = () => {
        this.props.clearLines(() => {
            this.props.addLine([`${this.props.overallState.login.username}'s recieved messages`], () => {
                this.setState({ screenState: GameState.Recieved });
            })

        });

    }

    moveToSentMessages = () => {
        this.props.clearLines(() => {
            this.props.addLine([`${this.props.overallState.login.username}'s sent messages`], () => {
                this.setState({ screenState: GameState.Sent })
            })
        });

    }

    moveToVictoryRoad = () => {
        this.props.clearLines(() => {
            this.setState({ screenState: GameState.VictoryRoad })
        })
    }

    moveToVictory = () => {
        this.setState({ screenState: GameState.Victory });
    }

    generateMessageView = (header: string, title: string, text: string) => {
        return () => {
            this.props.addLine(['-----------------------------', header, "Subject: " + title, text, '-----------------------------'])
        }
    }

    generateMainScreen = () => {
        let choices: Types.OptionChoice[] = [
            { name: "Message Server", description: "Log on to the message server", action: this.moveToLoginPage },
            { name: "Door Controls", description: "Attempt a door code", action: this.moveToDoorCode }
        ];
        return (<OptionsHelper addLine={this.props.addLine} options={choices} allowNumberChoice={true} />)
    }

    generateLoginScreen = () => {
        let allowedLogin = userGroups;
        return <LoginWorkflow allowedLogins={allowedLogin} onLoginComplete={this.moveToMessageServer} disableWelcome={true} {...this.props} onLoginFailure={this.handleFailedLogin} />
    }

    generateLoggedInScreen = () => {

        let choices: Types.OptionChoice[] = [
            { name: "recieved", description: "View recieved messages", action: this.moveToRecievedMessages },
            { name: "sent", description: "View sent messages", action: this.moveToSentMessages },
            { name: "logout", description: "Return to the main page", action: this.handleUserLogout }
        ];
        return <OptionsHelper addLine={this.props.addLine} options={choices} allowNumberChoice={true} />
    }

    generateRecievedScreen = () => {
        let currentlyLoggedIn = this.props.overallState.login.username;
        let messages = this.props.overallState.emails[currentlyLoggedIn];
        let choices: Types.OptionChoice[] = messages.recieved.map((each: RecievedMessage) => {
            return {
                name: each.from,
                description: each.title,
                action: this.generateMessageView("From: " + each.from, each.title, each.text)
            }
        });
        choices.push({ name: "back", description: "Go back to previous page", action: this.moveToMessageServer });
        return (<OptionsHelper addLine={this.props.addLine} options={choices} allowNumberChoice={true} />)
    }

    generateSentScreen = () => {
        let currentlyLoggedIn = this.props.overallState.login.username;
        let messages = this.props.overallState.emails[currentlyLoggedIn];
        let choices: Types.OptionChoice[] = messages.sent.map((each: SentMessage) => {
            return {
                name: each.to,
                description: each.title,
                action: this.generateMessageView("To: " + each.to, each.title, each.text)
            }
        });
        choices.push({ name: "back", description: "Go back to previous page", action: this.moveToMessageServer });
        return (<OptionsHelper addLine={this.props.addLine} options={choices} allowNumberChoice={true} />)
    }

    generateRoomCodeScreen = () => {
        return <TerminalInputHelper onSumbitCommand={this.handleRoomCodeAttempt} />
    }

    generateVictoryRoadScreen = () => {
        return <LoadingHelper message={"Unlocking Room"} startPercent={0} endPercent={100} showPercent={true} color={true} onFinish={this.moveToVictory} />
    }

    generateVictoryScreen = () => {
        return <ShowTextHelper message={"YOU WIN!!! Thanks for playing!"} nextComponent={() => { return (<div />) }} />
    }

    render() {
        return (<div>
            {this.state.screenState === GameState.MainScreen && this.generateMainScreen()}
            {this.state.screenState === GameState.Login && this.generateLoginScreen()}
            {this.state.screenState === GameState.LoggedIn && this.generateLoggedInScreen()}
            {this.state.screenState === GameState.Recieved && this.generateRecievedScreen()}
            {this.state.screenState === GameState.Sent && this.generateSentScreen()}
            {this.state.screenState === GameState.RoomCode && this.generateRoomCodeScreen()}
            {this.state.screenState === GameState.VictoryRoad && this.generateVictoryRoadScreen()}
            {this.state.screenState === GameState.Victory && this.generateVictoryScreen()}
        </div>);
    }
}

export default EscapeRoomEmails;