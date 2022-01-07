export interface ComputerRecoveryOverallState {
    backupsAvailable: boolean,
    restoreAvailable: boolean,
    destinations?: string[]
    rebootedSystemName?: string
    recoverySystemName?: string
    finishedBackupTransfer: boolean
    finishedSystemRestore: boolean
}