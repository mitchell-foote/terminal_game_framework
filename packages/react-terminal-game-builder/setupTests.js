import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

const
    setupEnzyme = () => configure({ adapter: new Adapter() }),
    setupTestingEnvironment = () => { },
    setupApp = () => {
        setupEnzyme();
        setupTestingEnvironment();
        global.LightColorStop = {};
    };

setupApp();