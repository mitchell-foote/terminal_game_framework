export interface GameComponentProps {
    overallState: any;
    clearLines: () => void;
    updateOverallState: (state: any) => void;
    addLine: (newLines: string[]) => void;
    updateComponent: (newComponent: React.ElementType) => void;
    showGlobalHelp: () => void;
}