import getRootURL from "./getRootURL";


function getImgUrl (name) {
    console.log(import.meta.url);
    return new URL(`src/assets/books/${name}`, getRootURL());
}

export {getImgUrl}