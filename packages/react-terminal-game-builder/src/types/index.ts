export interface GameComponentProps {
    overallState: any;
    clearLines: () => void;
    updateOverallState: (state: any) => void;
    addLine: (newLines: any[]) => void;
    updateComponent: (newComponent: React.ElementType) => void;
    showGlobalHelp: () => void;
    onWriteText: (messageProps: any, callback?: Function) => void;
}

export interface OptionChoice {
    name: string,
    description: string,
    action: Function
}
