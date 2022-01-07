import { HackerTerminalOverallState } from "./types";

export function generateDefaultState(): HackerTerminalOverallState {
    return {
        connected: false,
        firstHack: false,
        finishedJamming: false,
        ivan_ed: false
    }
}