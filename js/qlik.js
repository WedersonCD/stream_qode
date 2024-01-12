var prefix = window.location.pathname.substr( 0, window.location.pathname.toLowerCase().lastIndexOf( "/extensions" ) + 1 );

var config = {
	host: window.location.hostname,
	prefix: prefix,
	port: window.location.port,
	isSecure: window.location.protocol === "https:"
};

require.config( {
	baseUrl: ( config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources"
} );

const QLIK ={
    qlik: new Promise((resolve, reject) => {
        require(['js/qlik'], function(qlik) {
            resolve(qlik);
        });
    }),
    host: window.location.protocol+'//'+window.location.host

}

QLIK.get_template_app_list = async()=>{
    const rawText = await fetch('./template_apps.json',{ mode: "no-cors", credentials: "same-origin" }).then(response => response.text());
    return UTILS.text_to_json(rawText)

}

QLIK.open_app_link = ()=>{

    if(QLIK.host=='localhost:4848')
        extension='.qvf';
    else
        extension='';

    ;

    link=encodeURI(QLIK.host+'/sense/app/'+QLIK.currentAppId+extension+'/overview')

    window.open(link,'_blank')
}

QLIK.getCurrentApp = async ()=>QLIK.qlik.then((qlik)=>qlik.openApp(QLIK.currentAppId));

QLIK.upload_template_app_list_options = (option)=>{
    optionRawText='<option value="'+option.id+'">'+option.name+'</option>'


    return UTILS.text_to_html(optionRawText)
}


QLIK.upload_template_app_list = async()=>{
    
    const templateAppList = await QLIK.get_template_app_list();

    const appSelector=document.getElementsByClassName('header-appSelecion-select')[0]

    templateAppList.forEach((app)=>{
        appSelector.appendChild(QLIK.upload_template_app_list_options(app))

    })

    QLIK.currentAppId=templateAppList[0].id

    appSelector.addEventListener('change',(event)=>{
        var selectedOption = event.target.options[event.target.selectedIndex];
        QLIK.currentAppId = selectedOption.value
    })
}

QLIK.run_code = async()=>{

    const fullCode = BLOCKS.get_full_code();
    const currentApp = await QLIK.getCurrentApp()

    await currentApp.setScript(fullCode)
    await currentApp.doSave()

    const runDiv = document.getElementsByClassName('header-run')[0]

    const playButton = document.getElementsByClassName('header-run-play-icon')[0]
    const loadintButton = document.getElementsByClassName('header-run-loading-icon')[0]
    
    playButton.classList.add('display-none')
    loadintButton.classList.remove('display-none')

    runDiv.style.backgroundColor='#c2c2c2'

    await currentApp.doReload();
    
    runDiv.style.backgroundColor='#75ed03'
    loadintButton.classList.add('display-none')
    playButton.classList.remove('display-none')


}
