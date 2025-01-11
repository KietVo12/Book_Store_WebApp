function getImgUrl (name) {
    return new URL(`../books/${name}`, import.meta.url)
}

export {getImgUrl}