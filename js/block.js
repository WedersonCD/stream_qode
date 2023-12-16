const BLOCKS = {
    block_list: []
}
BLOCKS.add_block = (block)=>BLOCKS.block_list.push(block);
BLOCKS.get_blocks = ()=>BLOCKS.block_list;   
BLOCKS.get_block = (blockId) =>  BLOCKS.block_list.find(block => block.id === blockId);
BLOCKS.get_blocks_rendered = () => BLOCKS.block_list.find(block => block.status === 'rendered');
BLOCKS.get_blocks_selected = () => BLOCKS.block_list.find(block => block.status === 'selected');
BLOCKS.make_it_draggable = (element) => new PlainDraggable(element);


BLOCKS.render_stream_block_start = () => {
    const startBlock = document.getElementsByClassName('stream-block-start')[0]
    startBlock.style.display = 'flex'
}

BLOCKS.get_block_template = async (blockTempalteName, format) => {

    format = format || 'text'

    rawHtml = await fetch('./blocks/' + blockTempalteName + '.html', { mode: "no-cors", credentials: "same-origin" }).then(response => response.text())

    if (format === 'text') {
        return rawHtml
    }

    if (format === 'html') {
        return UTILS.text_to_html(rawHtml)
    }

}

BLOCKS.render_block_miniature = (block)=>{

    const blockViewSection = document.getElementsByClassName('content-blockView')[0];
    blockViewSection.appendChild(block.html.miniature)
    BLOCKS.make_it_draggable(block.html.miniature)
    
    block.html.miniature.addEventListener("click",(event)=>{
        const blockId=event.target.closest('div[block-id]').getAttribute('block-id')
        BLOCKS.make_it_selected(blockId)
    })


    

}

BLOCKS.make_it_selected = (block) =>{

    //check if is't a string parameter
    if (typeof (block) === 'string') {
        block = BLOCKS.get_block(block)
    }

    //remove the current select block.

    const currentSelectedBlock = BLOCKS.get_blocks_selected()

    if(currentSelectedBlock){

        if (currentSelectedBlock.id == block.id)return;

        currentSelectedBlock.html.setup.remove()
        currentSelectedBlock.html.miniature.classList.remove('selected')
        currentSelectedBlock.status='rendered'

    }

    //render the new select block
    const streamSection = document.getElementsByClassName('content-blockSetup')[0];
    streamSection.appendChild(block.html.setup)

    block.html.miniature.classList.add('selected')
    block.status='selected'

}

BLOCKS.render_block_setup = (block) => {

    if (typeof (block) === 'string') {
        block = BLOCKS.get_block(block)
    }

    BLOCKS.make_it_selected(block)

}

BLOCKS.create_block_empty = async () => {

    const block_empty = {
        id: Date.now().toString() + '-' + Math.random().toString(16).slice(2),
        type: '',
        html: {},
        status: 'created',
        name: ''
    }

    return block_empty

}

BLOCKS.create_stream_block_code_miniature = async () => await BLOCKS.get_block_template('stream_block_code_miniature', 'html');

BLOCKS.set_block_name = (blockId,newName)=>{
    
    //prevent the new name to be blank
    newName = newName.replace(/[\r\n]+/gm, '') || 'Invalid Block Name'

    const block = BLOCKS.get_block(blockId)
    
    const blockLabelMiniature = block.html.miniature.querySelector('.stream-block-code-miniature-label-value')
    blockLabelMiniature.textContent=newName

    const blockLabelSetup = block.html.setup.querySelector('.stream-block-header-name-label-value')
    blockLabelSetup.textContent=newName

    
}

BLOCKS.create_stream_block_code_setup = async () => {

    const block_code_html = await BLOCKS.get_block_template('stream_block_code_setup', 'html')
    
    //Set editable code
    const block_code_body = block_code_html.querySelector('.stream-block-code-body')
    ace.edit(block_code_body)

    //add event to change the block name
    const block_code_label = block_code_html.querySelector('.stream-block-header-name-label-value')

    block_code_label.addEventListener('focusout',(event)=>{
        console.log(event)
        const blockId=event.target.closest('div[block-id]').getAttribute('block-id')
        BLOCKS.set_block_name(blockId,event.target.textContent)
    })

    

    return block_code_html

}


BLOCKS.create_stream_block_code= async () =>{
    const block_object = await BLOCKS.create_block_empty()
    block_object.type = 'code'
    block_object.html.setup= await BLOCKS.create_stream_block_code_setup()
    block_object.html.miniature = await BLOCKS.create_stream_block_code_miniature()

    block_object.html.setup.setAttribute('block-id',block_object.id)
    block_object.html.miniature.setAttribute('block-id',block_object.id)

    return block_object;
}



BLOCKS.render_new_block_code = async () => {

    const block_code = await BLOCKS.create_stream_block_code();
    BLOCKS.render_block_setup(block_code)
    BLOCKS.render_block_miniature(block_code)
    BLOCKS.add_block(block_code)

}