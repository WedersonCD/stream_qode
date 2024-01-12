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