import request from 'request';
import tar from 'tar';
import tmp from 'tmp-promise';
import stream from 'stream';
import path from 'path';
import { promisify } from 'util';
import { spawn } from 'child-process-promise';
import fs from 'fs-extra';

import profile from './profile';

const pipeline = promisify(stream.pipeline);

const tarURL = 'http://mirror.ctan.org/systems/texlive/tlnet/install-tl-unx.tar.gz';
const installerName = 'install-tl';
const arch = `${{x86: 'x86_32', x64: 'x86_64'}[process.arch]}-${process.platform}`;

export const installTexlive = async (basePath) => {
    const { path: tmpPath, cleanup } = await tmp.dir({ unsafeCleanup: true });
    try{
        console.log(tmpPath);
        await pipeline(
            request(tarURL),
            tar.x({ strip: 1, cwd: tmpPath })
        );
        const profilePath = path.join(tmpPath, 'netlify-tex.profile');
        await fs.writeFile(profilePath, profile(basePath, arch));
        const env = {...process.env, TEXLIVE_INSTALL_PREFIX: basePath};
        await spawn(path.join(tmpPath, installerName), [`--profile=${profilePath}`], { stdio: 'inherit', cwd: basePath, env: env});
    }
    finally{
        cleanup();
    }
};

const findTexlive = async () => {
    
};

const compile = async () => {

};

export default compile;