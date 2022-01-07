import { AdminSecurityState } from "./screens/admin";
import { LogsType, SystemStatus } from "./types";

export const DoorControlDefaultState: Record<string, SystemStatus> = {
    armory: SystemStatus.Offline,
    brig: SystemStatus.Online,
    bridge: SystemStatus.Offline,
    security: SystemStatus.Offline,
    engineering: SystemStatus.Offline,
    engines: SystemStatus.Online,
    quarters: SystemStatus.Offline,
    docking: SystemStatus.Online
}

export const DoorControlLogs: LogsType[] = [
    {
        title: "Test log",
        description: "Not a password to the next section",
        text: "Tractor beam control = tractor-control -> grabb3r"
    }
]

export const TractorBeamTargets: Record<string, SystemStatus> = {
    hyperion: SystemStatus.Offline,
    falcon: SystemStatus.Offline,
    black_flag: SystemStatus.Offline,
    darkstar: SystemStatus.Offline,
    ss_flyboys: SystemStatus.Online
}

export const TractorBeamLogs: LogsType[] = [
    {
        title: "Test log",
        description: "Not a password to the next section",
        text: "Docking control = docking-control -> @nchor"
    }
];

export const DockingControlDefaultState: Record<string, SystemStatus> = {
    "fighters": SystemStatus.Offline,
    "ss_tremordius": SystemStatus.Offline,
    "fireache": SystemStatus.Offline,
    "ss_not_pirates": SystemStatus.Online,
    "uss_spyship": SystemStatus.Online
}

export const DockingLogs: LogsType[] = [
    {
        title: "Not an admin log",
        description: "Not a password to the next section",
        text: "Admin = admin -> overse3r"
    }
];

export const AdminDefaultState: AdminSecurityState = {
    camera1: SystemStatus.Online,
    camera2: SystemStatus.Online,
    fullSystemStatus: SystemStatus.Online
}