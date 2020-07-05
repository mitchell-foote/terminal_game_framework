export function generateHackedText(text: string, hackedAmount: number) {
    if (hackedAmount < 5) {
        return text;
    }
    else if (hackedAmount < 10) {
        let newText = text.split('').map((each) => {
            if (getRandomInt(8) === 0) {
                return '░'
            }
            else {
                return each;
            }
        }).join('');
        return newText;

    }
    else {
        let newText = text.split('').map((each) => {
            if (getRandomInt(6) === 0) {
                return '░'
            }
            else {
                return each;
            }
        }).join('');
        return newText;
    }
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}


