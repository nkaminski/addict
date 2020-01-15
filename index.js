const AD = require('ad');
const express = require("express");
const bodyParser = require('body-parser');
const swagpi = require('swagpi');  
const vorpal = require('vorpal')();

const swagpiConfig = require('./src/swagpi.config.js');
const loadConfig = require('./src/loadConfig');
const routes = require('./src/routes');
const commands = require('./src/commands');
const auth_middleware = require('./auth_middleware');
const chalk = vorpal.chalk;

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

const init = (args) => {
	try {
    // Load config
		const config = loadConfig(args);
		const ad = new AD(config).cache(true);

    // Add authentication middleware
		const authinfo = {};
    authinfo[config.user] = config.pass;
    auth_middleware(app, authinfo);

    //Instantiate API
    swagpi(app, {
	    logo: './src/img/logo.png',
	    config: swagpiConfig
    });
		routes(app, config, ad);
		app.listen(process.env.PORT || 3000);
		vorpal.use(commands, {ad});
	} catch(err) {
		vorpal.log(err.message);
		process.exit();
	}
}

vorpal.command('_start')
	.hidden()
	.option('-u, --user [user]', 'Domain admin username.')
	.option('-p, --pass [pass]', 'Domain admin password.')
	.option('--url [url]', 'URL for Active Directory.')
	.action(function(args, cbk) {
		init(args);
		cbk();
	})

vorpal.exec(`_start ${process.argv.slice(2).join(' ')}`);
vorpal.log('\nAddict Active Directory API\n');
vorpal.delimiter(chalk.cyan('Addict:')).show();
