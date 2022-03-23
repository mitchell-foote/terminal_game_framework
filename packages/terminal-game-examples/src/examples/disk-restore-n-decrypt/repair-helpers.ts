export const EasyTempLines = [
    "The device needs to be set to a specific temperture in order to run correctly",
    "Please input a temperture between 0 and 100 C",
    "Type 'help' for the information above, or 'back' to go back"
]

export const HardTempLines = [
    "The device needs to be set to a specific temperture in order to run correctly",
    "Please input a temperture between 0 and 10000 K",
    "Type 'help' for the information above, or 'back' to go back"
]

export const EasyFragmentationLines = [
    "The data on the device is out of order, and needs to be defragmented",
    "Each segment of the device can hold 10 MB, based on the following, how many minimum blocks do we need?",
    "Blocks 1-10 have 7MB each",
    "Type 'help' for the information above, or 'back' to go back"
]

export function generateHardFragmentationLines(other: boolean) {

    let array1 = [
        "The data on the device is out of order, and needs to be defragmented",
        "Each segment of the device can hold 12 MB, except for the thrid and fourth block, which can only hold 8. Based on the following, how many minimum blocks do we need?",
        "Blocks 1-8 have 6MB each, 9-20 have 11MB each, block 21 is overflowing with 15MB, and blocks 22-54 each have 2MB",
        "",
        "Example: If you have 70MB total you would need 7 segments",
        "S1 12/12 + S2 12/12 + S3 8/8 + S4 8/8 + S5 12/12 + S6 12/12 + S7 6/12",
        "Type 'help' for the information above, or 'back' to go back"
    ]

    // 70 - 16 = 54
    // 54 / 12 = 4.5 or 5 + 2 = 7

    // 48 + 132 + 15 + 18 + 20 + 20 + 8 = 261
    // 261 - 16 = 245
    // 245 / 12 = 20.something 21 + 2 23
    let array2 = [
        "The data on the device is out of order, and needs to be defragmented",
        "Each segment of the device can hold 12 MB, except for the thrid and fourth block, which can only hold 5. Based on the following, how many minimum blocks do we need?",
        "Blocks 1-8 have 6MB each, 9-20 have 11MB each, block 21 is overflowing with 15MB, and blocks 22-65 each have 2MB",
        "",
        "Example: If you have 65MB total you would need 7 segments",
        "S1 12/12 + S2 12/12 + S3 5/5 + S4 5/5 + S5 12/12 + S6 12/12 + S7 7/12",
        "Type 'help' for the information above, or 'back' to go back"
    ]
    // 48 + 132 + 15 + 18(22 to 30) + 20(31 to 40) + 20(41 - 50) + 20 (51 - 60) + 10 (61 - 65) = 283
    // 283 - 10 = 273
    // 273 / 12 = 22.something 23 + 2 25
    if (other) {
        return array2
    }
    else {
        return array1
    }
}

export const EasyElectricalLines = [
    "The device has a broken circut, which requires repair",
    "",
    "Please enter the correct voltage (V) for the circut described below",
    "The circut has a current (I) of 6 amps, and a resistance (R) of 3 Ohms",
    "",
    "Note: Ohm's law states that V = I * R ",
    "Example: If (I) was 3 amps, and (R) was 2 Ohms, the voltage (V), would be 6",
    "Type 'help' for the information above, or 'back' to go back"
]

export const HardElectricalLines = [
    "The device has a broken circut, which requires repair",
    "",
    "We need to reverse the devices's polarity. It's current polarity is -24 Volts (V)",
    "The circut has a resistance (R) of 3 Ohms. How many amps (I) do we need to run through the circut to reverse the polarity?",
    "",
    "Note: Ohm's law states that V = I * R ",
    "Example: If (I) was 3 amps, and (R) was 2 Ohms, the voltage (V), would be 6",
    "Type 'help' for the information above, or 'back' to go back"

]

export const EasyPartitionLines = [
    "The device's partition table is corrupted, and requires repair",
    "",
    "Please solve the following sequence:",
    "21 -> 32 -> 43 -> 54 -> 65 -> ?",
    "",
    "Type 'help' for the information above, or 'back' to go back"
]

export const HardPartitionLines = [
    "The device's partition table is corrupted, and requires repair",
    "",
    "Please solve the following sequence:",
    "1 -> 1 -> 2 -> 3 -> 5 -> 8 -> 13 -> 21 -> 34 -> ?",
    "",
    "Type 'help' for the information above, or 'back' to go back"
]