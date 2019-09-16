import path from 'path';

const profile = (basePath, arch) => `
selected_scheme scheme-custom
TEXMFCONFIG \\$TEXMFSYSCONFIG
TEXMFHOME \\$TEXMFLOCAL
TEXMFVAR \\$TEXMFSYSVAR
binary_${arch} 1
collection-basic 1
collection-binextra 1
collection-latex 1
instopt_adjustpath 1
instopt_adjustrepo 1
instopt_letter 0
instopt_portable 1
instopt_write18_restricted 1
tlpdbopt_autobackup 1
tlpdbopt_backupdir tlpkg/backups
tlpdbopt_create_formats 1
tlpdbopt_desktop_integration 1
tlpdbopt_file_assocs 1
tlpdbopt_generate_updmap 0
tlpdbopt_install_docfiles 1
tlpdbopt_install_srcfiles 1
tlpdbopt_post_code 1
tlpdbopt_sys_bin /usr/local/bin
tlpdbopt_sys_info /usr/local/share/info
tlpdbopt_sys_man /usr/local/share/man
tlpdbopt_w32_multi_user 1
TEXDIR ${path.join(basePath, 'latest')}
TEXMFLOCAL ${path.join(basePath, 'texmf-local')}
TEXMFSYSCONFIG ${path.join(basePath, 'latest', 'texmf-config')}
TEXMFSYSVAR ${path.join(basePath, 'latest', 'texmf-var')}
`;

export default profile;