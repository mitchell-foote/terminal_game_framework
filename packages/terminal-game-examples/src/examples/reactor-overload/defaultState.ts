import { ReactorControlManual, ReactorControlOverallState } from "./types";

export function generateDefaultState(overload: boolean): ReactorControlOverallState {
    return {
        overload: overload,
        overloadFinalFlush: false,
        overloadEmergencyOverride: false,
        overloadFirstFlush: false,
        overloadTroubledVent: "vent_alpha",
        overloadVentsOpen: false,
        restartFlush: false,
        restartPrime: false,
        restartEmergencyOverride: false,
        restartFinalRestart: false,
        restartFirstRestart: false,
        restartTroubledInjector: "injector_beta"
    }
}

export function generateManual(): ReactorControlManual[] {
    return [
        {
            name: "Reactor Startup Procedure",
            description: "Instructions to restart the reactor",
            steps: [
                "Run the 'flush_system' command to flush system of excess particals",
                "Run the 'prime_system' command to prepare system for energy transfer",
                "Run the 'restart' command to restart system.",
                "If the restart was unsuccessful, you may need to run the 'emergency_override <injector name>' command to override a system. See the 'help' command for an example on how to use it. Then run 'restart' again."
            ]
        },
        {
            name: "Reactor Overload Procedure",
            description: "Instructions when reactor is overloading",
            steps: [
                "Run the 'open_vents' command to prepare to flush the system",
                "Run the 'flush_system' to purge the overloading reactor",
                "If the system was not successfully flushed, you may need to run the 'emergency_override <vent name>' command to override one of the vents.",
                "Continue trying the 'flush_system' command after doing the emergency_override until the reactor is flushed"
            ]
        }
    ]
}