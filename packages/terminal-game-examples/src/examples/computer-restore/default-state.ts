import { ComputerRecoveryOverallState } from "./types";

export function generateDefaultState(): ComputerRecoveryOverallState {
    return {
        backupsAvailable: false,
        restoreAvailable: false,
        finishedBackupTransfer: false,
        finishedSystemRestore: false
    }
}