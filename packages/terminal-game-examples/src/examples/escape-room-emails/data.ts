export interface SentMessage {
    to: string,
    title: string,
    text: string
}

export interface RecievedMessage {
    from: string,
    title: string,
    text: string
}

export const doorCode = 'qwertystaplemonkey'

export const userGroups = {
    lFerretti: 'password',
    jFraiser: 'cassandra',
    dJackson: 'vala',
    sCarter: 'scarter',
    jOneal: 'strg8'
}

export const emails = {
    lFerretti: {
        sent: [{
            to: 'lFerretti',
            title: 'Test email',
            text: 'Does this email work?'
        }, {
            to: 'tJohnson',
            title: 'Access Request Accepted',
            text: 'The user lFerretti has been given access to the message server'
        }],
        recieved: [{
            from: 'lFerretti',
            title: 'Test email',
            text: 'Does this email work?'
        }, {
            from: 'jFraiser',
            title: 'Thank you!',
            text: "I really appreciate you looking after 'Cassandra' during my shift. Next time i'll give you some advance notice. This parenting thing is full of suprises."
        }, {
            from: 'aHab',
            title: 'Book Club',
            text: "The book for this month is called Moby Dick, it's one of my favorite, and should be a great read."
        }]
    },
    jFraiser: {
        sent: [{
            to: 'lFerretti',
            title: 'Thank you!',
            text: "I really appreciate you looking after Cassandra during my shift. Next time i'll give you some advance notice. This parenting thing is full of suprises."
        }, {
            to: 'dPeterson',
            title: 'Medical Exam Reminder',
            text: "This is a message reminding you of your appointment at 0830 hours tomorrow. Please be prompt."
        }, {
            to: 'dJackson',
            title: 'On My Way',
            text: "Daniel, just got your message. I'll head down to the vault now, clear a space so I can work."
        }, {
            to: 'dJackson',
            title: 'P.S',
            text: "Also, tell 'Vala' that I have her results back. I figure you'll see her before I do, you know, cause you're both buddies now. ;)"
        }],
        recieved: []
    },
    dJackson: {
        sent: [{
            to: 'jOneal',
            title: 'Need my book back',
            text: 'Hey Jack. I know you swipped my book from the library yesterday. I. Need. It. Back.'
        }, {
            to: 'security',
            title: 'Remote password change request',
            text: "Security team, I know Cpt. S Carter asked to have their username 'scarter' and password be the same. They're doing some special security work, please allow the request"
        }],
        recieved: [{
            from: 'larry',
            title: 'Limited time offer!!!!! (flagged for spam)',
            text: 'Act now for this limited time offer, click here to learn the secrets of patent selling!'
        }, {
            from: 'jOneal',
            title: 'What book?',
            text: 'This message has no body text'
        }, {
            from: 'jOneal',
            title: 'Oh that book...',
            text: "I needed something to hold open my door. I figured nobody was going to read it, as it was super dusty, and unreadable. You can't have it back, cause I don't know where it is anymore. We can talk later in the vault."
        }, {
            from: 'sCarter',
            title: "Found something of yours",
            text: "Found your book being used as a door stop, I would ask who stole it, but I think you and I know who's responsible."
        }]
    },
    sCarter: {
        sent: [{
            to: 'security',
            title: 'Password change request',
            text: 'Please set my username and password to be the same. dJackson can fill in details'
        }, {
            to: 'dJackson',
            title: "Found something of yours",
            text: "Found your book being used as a door stop, I would ask who stole it, but I think you and I know who's responsible."
        }],
        recieved: [{
            from: 'jOneal',
            title: "Re: New team name",
            text: "Captain Carter. I don't appreciate you shutting down our new team name. I think 'strg8' is a solid name. Less letters, saves money."
        }]
    },
    jOneal: {
        sent: [{
            to: "security",
            title: 'New vault code',
            text: "I don't appreciate the constant changing of the vault code. How am I supposed to remember 'qwertystaplemonkey'?"

        }],
        recieved: []
    }
}