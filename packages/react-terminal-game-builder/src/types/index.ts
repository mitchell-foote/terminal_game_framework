export interface GameComponentProps {
    overallState: any;
    clearLines: (callback?: Function) => void;
    updateOverallState: (state: any, callback?: Function) => void;
    addLine: (newLines: any[], callback?: Function) => void;
    updateComponent: (newComponent: React.ElementType) => void;
    showGlobalHelp: (callback?: Function) => void;
    writeText: (messageProps: any, callback?: Function) => void;
    updateScroll: () => void;
}

export interface OptionChoice {
    name: string,
    description: string,
    action: Function
}
