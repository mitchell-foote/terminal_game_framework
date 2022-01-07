import { ShieldTakedownLeverPosition, ShieldTakedownTotalState } from ".";

export const generateShieldTakedownDefaultState: () => ShieldTakedownTotalState = () => {
    return {
        lever1: ShieldTakedownLeverPosition.NOT_ENGAGED,
        lever2: ShieldTakedownLeverPosition.NOT_ENGAGED,
        lever3: ShieldTakedownLeverPosition.NOT_ENGAGED,
        lever4: ShieldTakedownLeverPosition.NOT_ENGAGED,
        archives: [
            {
                title: "File-14235",
                description: "Log-Lever Control Issue",
                text: "We've noticed a lot of issues with lever_1 in the MIDDLE position. Watch out for that."
            },
            {
                title: "File-24456",
                description: "Log-234-113-456-7",
                text: "Man, I forgot my lunch today, maybe i'll just go out and grab some. And by grab some, I mean swipe through the fridge until I find something I like."
            },
            {
                title: "File-33339",
                description: "Exe-File-33456",
                text: "01001101 01001001 01000100 01000100 01001100 01000101 00100000 01000100 01001111 01010111 01001110 00100000 01010101 01010000 00100000 01010101 01010000"
            },
            {
                title: "File-1101011",
                description: "Training Report 221",
                text: "We've noticed that there was an issue with the sheild system when lever_3 and lever_4. I can't remember which position they were in, but they were the same. Keep that in mind."
            },
            {
                title: "File-8833400",
                description: "Eng-Report-756",
                text: "If you want to shield system to have no fluxuations, make sure lever_3 is either DOWN or MIDDLE."
            },
            {
                title: "Corrupted-File-5",
                description: "01001010 00110101",
                text: "The s░ie░░░ will f░░l if the l░vers are ░ID░LE, ░O░░░ ░░, an░░░░"
            }
        ],
        success: false
    }
}

