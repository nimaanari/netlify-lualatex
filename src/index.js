import request from 'request';
import tar from 'tar';
import tmp from 'tmp-promise';
import stream from 'stream';
import path from 'path';
import { promisify } from 'util';
import { spawn, exec } from 'child-process-promise';
import fs from 'fs-extra';
import lockfile from 'proper-lockfile';
import os from 'os';
import whichOriginal from 'which';

import profile from './profile';

const pipeline = promisify(stream.pipeline);
const which = promisify(whichOriginal);

const tarURL = 'http://mirror.ctan.org/systems/texlive/tlnet/install-tl-unx.tar.gz';
const searchForLocalTexlive = true;
const arch = `${{x86: 'x86_32', x64: 'x86_64'}[process.arch]}-${process.platform}`;

const installTexlive = async (basePath) => {
    const checkPath = path.join(basePath, 'latest');
    const release = await lockfile.lock(basePath, {
        retries: {
            maxTimeout: 10000,
            forever: true
        }
    });
    try{
        if (await fs.exists(checkPath)){
            return;
        }
        const { path: tmpPath, cleanup } = await tmp.dir({ unsafeCleanup: true });
        try{
            await pipeline(
                request(tarURL),
                tar.x({ strip: 1, cwd: tmpPath })
            );
            const profilePath = path.join(tmpPath, 'netlify-tex.profile');
            await fs.writeFile(profilePath, profile(basePath, arch));
            await spawn(
                path.join(tmpPath, 'install-tl'),
                [`--profile=${profilePath}`],
                { stdio: 'inherit', cwd: basePath}
            );
        }
        finally {
            await cleanup();
        }
    }
    finally {
        await release();
    }
};

const findTexlive = async () => {
    const basePath = process.env.NETLIFY_BUILD_BASE ? path.join(process.env.NETLIFY_BUILD_BASE, 'cache', 'netlify-lualatex') : path.join(os.tmpdir(), 'netlify-lualatex');
    if (searchForLocalTexlive && !process.env.NETLIFY_BUILD_BASE){
        try{
            const texPath = await fs.realpath(await which('tex'));
            return path.dirname(texPath);
        }
        catch{}
    }
    const flagPath = path.join(basePath, 'netlify-lualatex.done');
    if (!await fs.exists(flagPath)){
        await fs.ensureDir(basePath);
        await installTexlive(basePath);
        await fs.writeFile(flagPath, `${Date.now()}`);
    }
    return path.join(basePath, 'latest', 'bin', arch);
};

const compile = async (output, texSource, cwd=process.cwd()) => {
    const binPath = await findTexlive();
    const { path: tmpPath, cleanup } = await tmp.dir({ unsafeCleanup: true });
    try{
        await fs.writeFile(path.join(tmpPath, 'root.tex'), texSource);
        await spawn('python', [
            path.join(binPath, '..', '..', 'texmf-dist', 'scripts', 'texliveonfly', 'texliveonfly.py'),
            '-c',
            'latexmk',
            '-a',
            `"-g -pdflua -interaction=nonstopmode -outdir=${tmpPath}"`,
            path.join(tmpPath, 'root.tex')
        ], {
            stdio: 'inherit',
            shell: true,
            cwd: cwd,
            env: {
                ...process.env,
                PATH: `${binPath}:${process.env.PATH}`
            }
        });
        await fs.copyFile(path.join(tmpPath, 'root.pdf'), output);
    }
    finally{
        await cleanup();
    }
};

export default compile;