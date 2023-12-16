const BLOCKS = {
    block_list: []
}
BLOCKS.add_block = (block)=>BLOCKS.block_list.push(block);
BLOCKS.get_blocks = ()=>BLOCKS.block_list;   
BLOCKS.make_it_draggable = (element) => new PlainDraggable(element);
BLOCKS.get_block = (blockId) =>  BLOCKS.block_list.find(block => block.id === blockId);
BLOCKS.get_blocks_rendered = () => BLOCKS.block_list.find(block => block.status === 'rendered');


BLOCKS.delete_stream_block_start = () => {
    const startBlock = document.getElementsByClassName('stream-block-start')[0]
    startBlock.style.display = 'none'
}

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
}

BLOCKS.render_block_setup = (block) => {

    if (BLOCKS.block_list.length == 1) {
        BLOCKS.delete_stream_block_start()
    }

    if (typeof (block) === 'string') {
        block = BLOCKS.get_block(block)
    }

    const streamSection = document.getElementsByClassName('content-blockSetup')[0];
    streamSection.appendChild(block.html.setup)

    if (BLOCKS.block_list.length > 1) {
        BLOCKS.delete_stream_block_start()
    }

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

BLOCKS.create_stream_block_code_setup = async () => {

    const block_code_html = await BLOCKS.get_block_template('stream_block_code_setup', 'html')
    const block_code_body = block_code_html.querySelector('.stream-block-code-body')

    ace.edit(block_code_body)

    return block_code_html

}

BLOCKS.create_stream_block_code= async () =>{
    const block_object = await BLOCKS.create_block_empty()
    block_object.type = 'code'
    block_object.html.setup= await BLOCKS.create_stream_block_code_setup()
    block_object.html.miniature = await BLOCKS.create_stream_block_code_miniature()

    return block_object;
}



BLOCKS.render_new_block_code = async () => {
    const block_code = await BLOCKS.create_stream_block_code();
    BLOCKS.render_block_setup(block_code)
    BLOCKS.render_block_miniature(block_code)
    block_code.status = 'rendered'
    BLOCKS.add_block(block_code)

}