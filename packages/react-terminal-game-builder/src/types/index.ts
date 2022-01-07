export interface GameComponentProps<OverallStateTypes> {
    overallState: OverallStateTypes;
    clearLines: (callback?: Function) => void;
    updateOverallState: (state: any, callback?: Function) => void;
    addLine: (newLines: any[], callback?: Function) => void;
    updateComponent: (newComponent: React.ElementType) => void;
    showGlobalHelp: (callback?: Function) => void;
    writeText: (messageProps: WriteTextOptions, callback?: Function) => void;
    updateScroll: () => void;
}

export interface OptionChoice {
    name: string,
    description: string,
    action: Function
}

export interface LoginOverallState {
    login: {
        username: string;
        password: string
    }
}

export interface OverallStateMediaPlayer {
    media?: {
        show: boolean
        target?: any
        name?: any
        config?: any
    }
}

export interface WriteTextOptions {
    message: string
    terminalLine?: boolean
    keystrokeTiming?: number
    nextComponentDelay?: number
    color?: string
}
