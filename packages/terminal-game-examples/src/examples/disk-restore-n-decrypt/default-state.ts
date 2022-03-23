import { DifficultyMode, ExternalState } from "./types"

// default final words
// overlord



const generateDefaultState: () => ExternalState = () => {
    return {
        hasElectricalFix: false,
        electricalFragment: 'alpha-164-mOtor',
        hasFragmentationFix: false,
        fragmentationFragment: 'omega-334-anVil',
        hasPartitionFix: false,
        partitionFragment: 'thEta-990-part',
        hasTempFix: false,
        tempFragment: 'roh-R55-zeta',
        hasLogsFragment: false,
        logsFragment: 'episLOn-5ww-activate',
        hasSectorFragment: false,
        sectorFragment: 'omicRon-723-lambDa',
        hasCompleteDecode: false,
        decodeCode: 'overlord',
        finalFragment: 'override-phi-kappa-omega-33672',
        difficultyMode: DifficultyMode.HARD
    }
}


export default generateDefaultState