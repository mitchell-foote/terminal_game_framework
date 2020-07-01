export interface GameComponentProps {
    overallState: any;
    clearLines: (callback?: Function) => void;
    updateOverallState: (state: any, callback?: Function) => void;
    addLine: (newLines: any[], callback?: Function) => void;
    updateComponent: (newComponent: React.ElementType) => void;
    showGlobalHelp: (callback?: Function) => void;
    onWriteText: (messageProps: any, callback?: Function) => void;
}

export interface OptionChoice {
    name: string,
    description: string,
    action: Function
}
