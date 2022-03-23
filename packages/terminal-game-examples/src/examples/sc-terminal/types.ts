export interface SCVintageTerminalOverallState {
    messages: LogsType[]
    loginType: string
    accessCode?: string
    correctPassword?: string
    firewall: boolean
    terminalName?: string
    security: boolean
}

export type LogsType = {
    title: string
    description: string
    text: string
}

