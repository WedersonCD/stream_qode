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
    })
}

QLIK.get_template_app_list = async()=>{
    const rawText = await fetch('./template_apps.json',{ mode: "no-cors", credentials: "same-origin" }).then(response => response.text());
    return UTILS.text_to_json(rawText)

}

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

} 

QLIK.set_current_app = (event)=>{
    var selectedOption = event.target.options[event.target.selectedIndex];
    QLIK.currentAppId = selectedOption.value
}
