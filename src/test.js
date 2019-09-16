import { installTexlive } from './index'

installTexlive('/tmp/test-tex').then(() => {
    console.log('Successfully installed Texlive');
});