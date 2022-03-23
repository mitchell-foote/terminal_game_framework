import { SCVintageTerminalOverallState } from "./types";

export function generateDefaultState(): SCVintageTerminalOverallState {
    return {
        messages: [],
        loginType: '',
        firewall: true,
        security: true
    }
}