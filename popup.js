let problemListKey = 'algozenith_problems';

document.addEventListener("DOMContentLoaded", async()=>{
    chrome.storage.sync.get([problemListKey],(data) => {
        const currentBookmarks = data[problemListKey]? JSON.parse(data[problemListKey]): [];
        viewBookmarks(currentBookmarks);
    });
});

const viewBookmarks = (currentBookmarks = []) => {
    const bookmarksElement = document.getElementById("bookmarks");
    bookmarksElement.innerHTML = "";

    if(currentBookmarks.length >0){
        for(let i=0; i<currentBookmarks.length;i++){
            const bookmark = currentBookmarks[i];
            addNewBookmark(bookmarksElement, bookmark);
        }
    }
    else{
        bookmarksElement.innerHTML = '<i class = "row">No bookmarks to show </i>  ';
    }
    return;
};

const addNewBookmark = (bookmarks, bookmark) => {
    const bookmarkTitleElement = document.createElement("div");
    const controlsElement  = document.createElement("div");
    const newBookmarkElement = document.createElement("div");

    bookmarkTitleElement.textContent = bookmark.desc;
    bookmarkTitleElement.className = "bookmark-title";
    controlsElement.className = "bookmark-controls";

    setBookmarkAttributes("play", onplay,controlsElement);
    setBookmarkAttributes("delete", onDelete, controlsElement);

    newBookmarkElement.id = "bookmark-" + bookmark.url.toString().split("-").at(-1);
    newBookmarkElement.className = "bookmark";
    newBookmarkElement.setAttribute("url", bookmark.url);
    
    newBookmarkElement.appendChild(bookmarkTitleElement);
    newBookmarkElement.appendChild(controlsElement);

    bookmarks.appendChild(newBookmarkElement);
};

const setBookmarkAttributes = (src, EventListener, controlParentElement) => {
    const controlElement = document.createElement("img");
    controlElement.src = "assets/" + src + ".png";
    controlElement.title = src;
    controlElement.addEventListener("click", EventListener);
    controlParentElement.appendChild(controlElement);
};

const onplay = async e => {
    const bookmarUrl = e.target.parentNode.parentNode.getAttribute("url");
    window.open(bookmarUrl, "_blank");
};

const onDelete = async e => {
    const bookmarkUrl = e.target.parentNode.parentNode.getAttribute("url");
    console.log(bookmarkUrl);
    const bookmarkElementToDelete = document.getElementById(
        "bookmark-" + bookmarkUrl.toString().split("-").at(-1)
    );
    console.log(bookmarkElementToDelete);
    bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);
    await removeFromMemory(bookmarkUrl);
};

async function removeFromMemory(urltoremove){
    let bookmarkdata = [];
    chrome.storage.sync.get([problemListKey], (data) => {
        bookmarkdata = data[problemListKey]? JSON.parse(data[problemListKey]) : [];

      let findindex = -1;
      for(let index =0; index<bookmarkdata.length; index++){
        if(bookmarkdata[index].url == urltoremove){
            findindex = index; break;
        }
      }
      if(findindex >-1){
        bookmarkdata.splice(findindex,1);

        chrome.storage.sync.set({
            [problemListKey]: JSON.stringify(bookmarkdata)
        });
      }

    });
};
