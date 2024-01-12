const UTILS = {}

UTILS.text_to_html = (text) => {

    const parser = new DOMParser();
    const fullHtml = parser.parseFromString(text, "text/html")

    return fullHtml.body.firstChild
}

UTILS.text_to_json = (text) => {

    return JSON.parse(text)
}


UTILS.remove_element_from_object_list = (list, objectField, objectValue) => {

    // Encontrar o índice do elemento com o ID especificado
    const index = list.findIndex(element => element[objectField] === objectValue);

    // Se o elemento foi encontrado, removê-lo da lista
    if (index !== -1) {
        list.splice(index, 1);
    }

}

UTILS.close_popup_divs = async () => {
    const popupDivs = document.getElementsByClassName('popup')

    for (item of popupDivs) {
        if (!item.classList.contains('display-none'))
            item.classList.add('display-none')
    }

}

UTILS.open_outfocus_div = () => {

    outFocusDiv = document.getElementsByClassName('outfocus')[0]
    outFocusDiv.classList.remove('display-none')

}

UTILS.clean_on_close_div = ()=>{
    outFocusDiv = document.getElementsByClassName('clean-on-close')[0]
    outFocusDiv.innerHTML=''
}

UTILS.close_outfocus_div = () => {

    outFocusDiv = document.getElementsByClassName('outfocus')[0]
    outFocusDiv.classList.add('display-none')
    UTILS.clean_on_close_div()
}
