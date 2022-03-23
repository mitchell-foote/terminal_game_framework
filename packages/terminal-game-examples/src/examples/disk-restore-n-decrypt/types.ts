export interface ExternalState {
    hasElectricalFix: boolean
    electricalFragment: string
    hasFragmentationFix: boolean
    fragmentationFragment: string
    hasPartitionFix: boolean
    partitionFragment: string
    hasTempFix: boolean
    tempFragment: string
    hasLogsFragment: boolean
    logsFragment: string
    hasSectorFragment: boolean
    sectorFragment: string
    hasCompleteDecode: boolean
    decodeCode: string
    finalFragment: string
    difficultyMode: DifficultyMode
}


export enum DifficultyMode {
    EASY,
    HARD
}
