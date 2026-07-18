console.log(Object.keys(process.env).filter(k => !k.startsWith('npm_') && !k.startsWith('NVM_') && k !== 'PATH'));
