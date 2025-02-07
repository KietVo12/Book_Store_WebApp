import { getRepoUrl } from "./getRepoURL";
function getImgUrl (name) {
    return new URL(`images/${name}`, getRepoUrl(name));
}

export {getImgUrl}