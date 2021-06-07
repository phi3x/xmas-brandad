

/**
 * @template T
 * @param {T} imports
 * @param {(imports:Promise<T>)=>Promise<void>} callback
 */
var scriptNesting = async function(imports, callback) {
    return callback(Promise.resolve(imports))
}

/**
 * @type {{[key:string]:Promise<any>}}
 */
let loadingSCriptsMap = {};
var module = {};
Object.defineProperty(module, 'exports', {
    get: () => {
        return document.currentScript['exports'] || {};
    },
    set: (obj) => {
        document.currentScript['exports'] = obj;
    }
});
const currentScript = document.currentScript;
// @ts-ignore
const scriptURL = new URL(currentScript.src);

const currentScriptUrl = new URL(scriptURL.href);
currentScriptUrl.search = ""

/**
 * 
 * @param {string} scriptLoadUrl 
 * @returns 
 */
async function importScript(scriptLoadUrl) {
    const scriptToUse = document.currentScript || currentScript;
    if(!scriptLoadUrl.endsWith('.js')) {
        scriptLoadUrl += '.js';
    }
    let newSrc;
    if('src' in scriptToUse) {
        const baseURL = new URL(scriptToUse.src);
        baseURL.search = '';
        newSrc = new URL(scriptLoadUrl, baseURL.href);
    } else {
        //idk
    }
    if(!loadingSCriptsMap[newSrc.href]) {
        loadingSCriptsMap[newSrc.href] = new Promise((resolv, thrower) => {
            const script = document.createElement('script');
            script.src = newSrc.href;
            /*const existingScript = [...document.scripts].find(scr => scr.src === script.src);
            if(existingScript) {
                let exps = existingScript['exports'];
 
                resolv(exps);
                return;
            }*/
            let timeout = setTimeout(() => {
                //debugger;
                console.warn(script.src + ' didnt load within 2 seconds');
            }, 2000);
            script.onload = () => {
                const ecps = script['exports'];
                if(!ecps && (script.src.includes('popup'))) {
                    //debugger;
                }
                resolv(ecps);
                clearTimeout(timeout);
            };
            script.onerror = e => {
                debugger;
                console.error(e);
            };
            document.body.appendChild(script);
        });
    }
    return loadingSCriptsMap[newSrc.href];
};


window.importScript = importScript
// @ts-ignore
window.require = importScript;

const url = scriptURL.searchParams.get('url');
if(!document.body) {
    window.addEventListener('load', () => {
        for(let requireUrl of url.split(',')) {
            importScript(requireUrl);
        }
    });
} else {
    for(let requireUrl of url.split(',')) {
        importScript(requireUrl);
    }
}
