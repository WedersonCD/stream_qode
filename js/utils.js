const UTILS={}

UTILS.text_to_html = (text)=>{

    const parser = new DOMParser();
    const fullHtml = parser.parseFromString(text,"text/html")
    
    return fullHtml.body.firstChild
}