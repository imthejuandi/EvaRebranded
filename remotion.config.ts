import {Config} from '@remotion/cli/config';
import path from 'node:path';
// Match the existing application alias when previewing compositions in Remotion.
Config.overrideWebpackConfig(config=>({...config,resolve:{...config.resolve,alias:{...config.resolve?.alias,'@':path.resolve('.')}}}));
