const BLOCKS = {
    block_list: []
}
BLOCKS.get_blocks = () => BLOCKS.block_list;
BLOCKS.get_block = (blockId) => BLOCKS.block_list.find(block => block.id === blockId);
BLOCKS.get_block_lastest = () => BLOCKS.block_list[BLOCKS.block_list.length - 1];
BLOCKS.get_block_first = () => BLOCKS.block_list[0];
BLOCKS.get_block_list_size = () => BLOCKS.block_list.length;

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


BLOCKS.add_block = (block) => {

    if (BLOCKS.get_block_list_size() > 0) {
        const block_lastest = BLOCKS.get_block_lastest()
        block_lastest.right = block
        block.left = block_lastest

    }

    BLOCKS.block_list.push(block);

}

BLOCKS.render_block_miniature_draggable = (block) => {

    block.draggable = BLOCKS.make_it_draggable(block.html.miniature)

    block.draggable.onMove = () => {
        if (block.left) block.line.left.position();
        if (block.right) block.line.right.position();
    }

}

BLOCKS.render_block_miniature = (block) => {

    const blockViewSection = document.getElementsByClassName('content-blockView')[0];
    blockViewSection.appendChild(block.html.miniature)

    BLOCKS.render_block_miniature_draggable(block)

    block.html.miniature.addEventListener("click", (event) => {
        const blockId = event.target.closest('div[block-id]').getAttribute('block-id')
        BLOCKS.make_it_selected(blockId)
    })

    if (BLOCKS.block_list.length >= 1) {
        BLOCKS.create_blocks_lines(BLOCKS.get_block_lastest(),block)

    }

}

BLOCKS.make_it_selected = (block) => {

    //check if is't a string parameter
    if (typeof (block) === 'string') {
        block = BLOCKS.get_block(block)
    }

    //remove the current select block.

    const currentSelectedBlock = BLOCKS.get_blocks_selected()

    if (currentSelectedBlock) {

        if (currentSelectedBlock.id == block.id) return;

        currentSelectedBlock.html.setup.remove()
        currentSelectedBlock.html.miniature.classList.remove('selected')
        currentSelectedBlock.status = 'rendered'

    }

    //render the new select block
    const streamSection = document.getElementsByClassName('content-blockSetup')[0];
    streamSection.appendChild(block.html.setup)

    block.html.miniature.classList.add('selected')
    block.status = 'selected'

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
        line: { left: null, right: null },
        left: null,
        right: null,
        draggable: null,
        status: 'created',
        editor: null,
        code: '',
        changedAt: null,
        createdAt: Date.now(),
        name: '',
        template_base: null
    }

    return block_empty

}

BLOCKS.create_stream_block_code_miniature = async () => await BLOCKS.get_block_template('stream_block_code_miniature', 'html');

BLOCKS.set_block_name = (blockId, newName) => {

    //prevent the new name to be blank
    newName = newName.replace(/[\r\n]+/gm, '') || 'Invalid Block Name'

    const block = BLOCKS.get_block(blockId)

    const blockLabelMiniature = block.html.miniature.querySelector('.stream-block-code-miniature-label-value')
    blockLabelMiniature.textContent = newName

    const blockLabelSetup = block.html.setup.querySelector('.stream-block-header-name-label-value')
    blockLabelSetup.textContent = newName

    block.name = newName

    BLOCKS.save_block(blockId)

}

BLOCKS.delete_block_line_side = (block,side) => {

    if(block.line[side]){
        block.line[side].remove()
        block.line[side]=null
    }

}


BLOCKS.delete_block_lines = (block) => {
    
    BLOCKS.delete_block_line_side(block,'left')
    BLOCKS.delete_block_line_side(block,'right')

}


BLOCKS.create_blocks_lines = (block_left,block_right) => {

    //clean blocks lines
    BLOCKS.delete_block_line_side(block_left,'right')
    BLOCKS.delete_block_line_side(block_right,'left')

    const newLine = new LeaderLine(block_left.html.miniature, block_right.html.miniature)

    block_left.line.right = newLine
    block_right.line.left = newLine

}

BLOCKS.detach_block_lines = (block) => {

    //is the lastest block
    if (block.right == null) {
        BLOCKS.delete_block_line_side(block.left,'right')
        
        //is the first block
    } else if (block.left == null) {
        BLOCKS.delete_block_line_side(block.right,'left')

        //is a middle block
    } else {
        BLOCKS.create_blocks_lines(block.left,block.right)

    }

}

BLOCKS.detach_block = (block) => {

    //is the lastest block
    if (block.right == null) {
        block.left.right = null;
        
        //is the first block
    } else if (block.left == null) {
        block.right.left = null

        //is a middle block
    } else {
        block.left.right = block.right
        block.right.left = block.left
    }

}

BLOCKS.delete_block = (blockId) => {

    const block = BLOCKS.get_block(blockId)

    block.html.miniature.remove()
    block.html.setup.remove()

    if (BLOCKS.get_block_list_size() > 1) {
        BLOCKS.detach_block_lines(block)
        BLOCKS.detach_block(block)

    }

    UTILS.remove_element_from_object_list(BLOCKS.get_blocks(),'id',blockId)

}

BLOCKS.save_block = (blockId) =>{

    const block = BLOCKS.get_block(blockId)
    
    block.code=block.editor.getValue()
    block.changedAt=Date.now()

}

BLOCKS.create_stream_block_code_setup = async (block_object) => {

    const block_code_html = await BLOCKS.get_block_template('stream_block_code_setup', 'html')

    //Set editable code
    const block_code_body = block_code_html.querySelector('.stream-block-code-body')
    block_object.editor= ace.edit(block_code_body)

    //add event to change the block name
    const block_code_label = block_code_html.querySelector('.stream-block-header-name-label-value')

    block_code_label.addEventListener('focusout', (event) => {
        const blockId = event.target.closest('div[block-id]').getAttribute('block-id')
        BLOCKS.set_block_name(blockId, event.target.textContent)
    })

    //add event to delete the block
    const block_code_trash = block_code_html.querySelector('.stream-block-header-delete-icon')
    block_code_trash.addEventListener('click', (event) => {
        const blockId = event.target.closest('div[block-id]').getAttribute('block-id')
        BLOCKS.delete_block(blockId)
    })

    //save on focus out
    block_code_html.addEventListener('focusout',(event)=>{
        const blockId = event.target.closest('div[block-id]').getAttribute('block-id')
        BLOCKS.save_block(blockId)
    })

    //Manual save
    const block_code_save = block_code_html.querySelector('.stream-block-header-save-icon')
    block_code_save.addEventListener('click',(event)=>{
        const blockId = event.target.closest('div[block-id]').getAttribute('block-id')
        BLOCKS.save_block(blockId)
    })

    const block_code_template = block_code_html.querySelector('.stream-block-header-template_load-icon')
    block_code_template.addEventListener('click',(event)=>{
        const blockId = event.target.closest('div[block-id]').getAttribute('block-id')
        BLOCKS.open_template_selector(blockId)
    })

    return block_code_html

}

BLOCKS.set_block_code=(block,code) =>{
    
    if(typeof(block)=='string')
        block = BLOCKS.get_block(block);

    block.code = code
    block.editor.setValue(code)

}

BLOCKS.set_block_code_from_template= async (fileName,blockId)=>{
    const code = await fetch('./templates/'+fileName,{ mode: "no-cors", credentials: "same-origin" }).then(response => response.text());
    BLOCKS.set_block_code(blockId,code)

}

BLOCKS.open_template_selector_get_li = (blockId,templateObject)=>{

    const liItem = '<li class="select-template-list-item pointer">'+templateObject.name+'</li>'
    const liItemHTML = UTILS.text_to_html(liItem)
    liItemHTML.setAttribute('file',templateObject.file)
    liItemHTML.setAttribute('block-id',blockId)

    liItemHTML.addEventListener('click',async (event)=>{
        const fileName = event.target.getAttribute('file')
        const blockId  = event.target.getAttribute('block-id')
        await BLOCKS.set_block_code_from_template(fileName,blockId)

        UTILS.close_popup_divs()
        
        //clean the UL

    })

    return liItemHTML
}

BLOCKS.open_template_selector= async (blockId)=>{

    const templateList = await BLOCKS.get_template_list()
    
    UTILS.open_outfocus_div()
    const templateSelectDIV = document.getElementsByClassName('select-template')[0]
    templateSelectDIV.classList.remove('display-none')

    const templateSelectList = templateSelectDIV.querySelector('.select-template-list')

    templateList.forEach((item)=>{
        
        const liItem = BLOCKS.open_template_selector_get_li(blockId,item)
        templateSelectList.appendChild(liItem)
    
    })

    templateSelectList.addEventListener('click',(event)=>{
        templateSelectList.innerHTML='';
    })

    

}

BLOCKS.get_template_list = async ()=>{

    const baseFile = await fetch('./template_files.json',{ mode: "no-cors", credentials: "same-origin" }).then(response => response.text());
    return UTILS.text_to_json(baseFile)

}

BLOCKS.create_stream_block_code = async () => {
    const block_object = await BLOCKS.create_block_empty()
    block_object.type = 'code'
    block_object.html.setup = await BLOCKS.create_stream_block_code_setup(block_object)
    block_object.html.miniature = await BLOCKS.create_stream_block_code_miniature()

    block_object.html.setup.setAttribute('block-id', block_object.id)
    block_object.html.miniature.setAttribute('block-id', block_object.id)

    return block_object;
}

BLOCKS.get_full_code = ()=>{

    fullCode = ''

    BLOCKS.block_list.forEach((block)=>{
        fullCode=fullCode+'//////Block Name>>>'+block.name+'\n\n\n'+block.code+'\n\n\n'
    })

    return fullCode

}

BLOCKS.render_new_block_code = async () => {

    const block_code = await BLOCKS.create_stream_block_code();
    BLOCKS.render_block_setup(block_code)
    BLOCKS.render_block_miniature(block_code)
    BLOCKS.add_block(block_code)

}