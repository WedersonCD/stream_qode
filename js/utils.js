const UTILS={}

UTILS.text_to_html = (text)=>{

    const parser = new DOMParser();
    const fullHtml = parser.parseFromString(text,"text/html")
    
    return fullHtml.body.firstChild
}

UTILS.remove_element_from_object_list=(list, objectField,objectValue)=>{

    // Encontrar o índice do elemento com o ID especificado
    const index = list.findIndex(element => element[objectField] === objectValue);

    // Se o elemento foi encontrado, removê-lo da lista
    if (index !== -1) {
        list.splice(index, 1);
    }

}