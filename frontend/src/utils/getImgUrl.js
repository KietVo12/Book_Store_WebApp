import getRootURL from "./getRootURL";


function getImgUrl (name) {
    return new URL(`src/assets/books/${name}`, getRootURL());
}

export {getImgUrl}