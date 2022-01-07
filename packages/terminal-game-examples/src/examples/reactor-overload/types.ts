

export interface ReactorControlOverallState {
    overload: boolean
    overloadVentsOpen: boolean
    overloadFirstFlush: boolean
    overloadTroubledVent: string
    overloadEmergencyOverride: boolean
    overloadFinalFlush: boolean
    restartFlush: boolean
    restartPrime: boolean
    restartFirstRestart: boolean
    restartTroubledInjector: string
    restartEmergencyOverride: boolean
    restartFinalRestart: boolean
    reactorName?: string
    shipName?: string
}


export interface ReactorControlManual {
    name: string
    description: string
    steps: string[]
}