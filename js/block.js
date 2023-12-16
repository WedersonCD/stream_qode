const BLOCKS ={}
BLOCKS.BLOCKS_LIST = []

BLOCKS.make_it_draggable=(element)=>{
    return new PlainDraggable(element);
 }

BLOCKS.delete_stream_block_start = ()=>{
    const startBlock = document.getElementsByClassName('stream-block-start')[0]
    startBlock.style.display='none'
}

BLOCKS.render_stream_block_start = ()=>{
    const startBlock = document.getElementsByClassName('stream-block-start')[0]
    startBlock.style.display='flex'
}

BLOCKS.get_block_template =async (blockTempalteName,format)=>{

    format=format || 'text'

    rawHtml=await fetch('./blocks/'+blockTempalteName+'.html',{mode: "no-cors",credentials: "same-origin"}).then(response=>response.text())

    if(format==='text'){
        return rawHtml
    }

    if(format==='html'){
        return UTILS.text_to_html(rawHtml)
    }

}
BLOCKS.get_block=(blockId)=>{

    return BLOCKS.BLOCKS_LIST.find(block => block.id === blockId);
}
BLOCKS.get_blocks_rendered=()=>{

    return BLOCKS.BLOCKS_LIST.find(block => block.status === 'rendered');
}


BLOCKS.render_block=(block)=>{

    if(BLOCKS.BLOCKS_LIST.length=1){
        BLOCKS.delete_stream_block_start()
    }

    if(typeof(block)==='string'){
        block=BLOCKS.get_block(block)
    }

    const streamSection = document.getElementsByClassName('content-blockSetup')[0];
    streamSection.appendChild(block.html)
    block.status='rendered'
    if(BLOCKS.BLOCKS_LIST.length>1){
        BLOCKS.delete_stream_block_start()
    }

}

BLOCKS.create_block_empty=async ()=>{
    
    const block_new_html= await BLOCKS.get_block_template('stream_block_empty','html');

    const block_empty ={
        id: Date.now().toString()+'-'+Math.random().toString(16).slice(2),
        type: '',
        html: block_new_html,
        status: 'created',
    }

    BLOCKS.BLOCKS_LIST.push[block_empty]

    return block_empty

}


BLOCKS.create_new_stream_block_code=async ()=>{

    const block_object=  await BLOCKS.create_block_empty()
    block_object.type='code'

    const block_code_html=   await BLOCKS.get_block_template('stream_block_code_setup','html')
    const block_code_body = block_code_html.querySelector('.stream-block-code-body')

    ace.edit(block_code_body)
    console.log(block_code_html)
    block_object.html.appendChild(block_code_html)

    return block_object
}

BLOCKS.render_new_block_code=async()=>{
    block_code=await BLOCKS.create_new_stream_block_code();
    BLOCKS.render_block(block_code)
}