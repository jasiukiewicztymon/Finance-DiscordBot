var { Client, Intents } = require('discord.js')
var DiscordJS = require('discord.js')
var config = require('./config.json')
var fs = require('fs')
var util = require('util');
const yahooFinance = require('yahoo-finance')

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_PRESENCES,
    ],
})

setInterval(() => {
    
}, 1000)

client.on('ready', () => {
    console.log(`The bot connected to the server`)
    client.user.setPresence({ activities: [{ name: `${config.prefix}help`, type: 'LISTENING' }], status: 'online' });
})

client.on('messageCreate', (message) => {
    const guild = message.guild
    var serverName = guild.name

    var DataPath = `./datas/${serverName}`  
    fs.access(DataPath, fs.F_OK, function(err) {
        if (err) {
            fs.writeFile(DataPath, '', function (err) {
                console.log(err);
            })
        }
    })

    if (message.content.startsWith(config.prefix)) {
        let args = message.content.slice(config.prefix.length).split(' ');
        let command = args.shift().toLowerCase();

        switch(command) {
            case 'alert': 
                var AlertPath = `./alerts/${serverName}`  
                fs.access(AlertPath, fs.F_OK, function(err) {
                    if (err) {
                        fs.writeFile(AlertPath, '', function (err) {
                        })
                    }
                })

                var PriceSymbol = args[0];

                const adata = fs.readFileSync(AlertPath, 'UTF-8');
                const alines = adata.split('\n');

                alines.forEach((line) => {
                    var lineargs = line.split(',');
                    if (line.length > 4) {
                        if (lineargs[0] == PriceSymbol)
                            PriceSymbol = lineargs[0];
                        }    
                    });
                var addtofile = PriceSymbol
                addtofile += ',' + args[1] + ',' + message.author.id + '\n'
                fs.appendFileSync(AlertPath, addtofile)

                message.reply(`**REMEMBER FOREX OR OTHER SITES OF THIS KIND CAN BE DANGEROUS!**\nThe alert have been set for ${PriceSymbol} at price of ${args[1]}`)
                break;
            case 'api':
                const apiEmbed = new DiscordJS.MessageEmbed()
                    .setTitle('API information')
                    .setColor('#18A31F')
                    .setDescription('All information about the usage of the Yahoo finance API')
                    .addFields(
                        { name: 'Why Yahoo finance API', value: 'We have choose the Yahoo finance API, because it\'s free and have a relative good docs and easy in use' },
                        { name: '\u200B', value: '\u200B' },
                        { name: 'More information', value: 'You can get more information, clicking the button below' },
                    );

                client.api.channels(message.channel.id).messages.post({
                data: {
                    embeds: [apiEmbed],
                    components: [
                    {
                        type: 1,
                        components: [
                        {
                            type: 2,
                            style: 5,
                            label: "More",
                            url: "https://www.yahoofinanceapi.com/"
                        }
                        ]
                    }
                    ]
                }
                });
                break;
            case 'author':
                const authorEmbed = new DiscordJS.MessageEmbed()
                        .setTitle('Author information')
                        .setColor('#18A31F')
                        .setDescription('Here you can yound some information about the author')
                        .addFields(
                            { name: 'Who I am', value: 'I\' a junior discord.js developer who learn using public APIs' },
                            { name: 'Some social', value: 'The links below, are my media' },
                        );
            
                    client.api.channels(message.channel.id).messages.post({
                        data: {
                            embeds: [authorEmbed],
                            components: [
                              {
                                type: 1,
                                components: [
                                  {
                                    type: 2,
                                    style: 5,
                                    label: "GitHub",
                                    url: "https://github.com/jasiukiewicztymon"
                                }
                                ]
                            },
                            {
                                type: 1,
                                components: [
                                  {
                                    type: 2,
                                    style: 5,
                                    label: "Instagram",
                                    url: "https://www.instagram.com/titi_2115/?hl=fr"
                                  }
                                ]
                            }
                        ]
                      }
                    });
                    break;
                    case 'add-symbol':
                        if (args.length != 2) {
                            message.reply(`**The arguments are invalide, do the command ${config.prefix}help ${command} to get the doc**`)
                        }
                        else {
                            const data = fs.readFileSync(DataPath, 'UTF-8');
                            const lines = data.split('\n');
                            var verify = true

                            lines.forEach((line) => {
                                var lineargs = line.split(',');
                                if (lineargs[0].toLowerCase() == args[0].toLowerCase())
                                    verify = false;
                            });

                            if (verify) {
                                fs.appendFile(DataPath, `${args[0]},${args[1]}\n`, function (err) {
                                    if (err) 
                                        message.reply('An unexpected error have interrupt the operation');
                                    else 
                                    message.channel.send(`The name ${args[0]} is linked with the ${args[1]} symbol`);
                                })
                            }
                            else {
                                message.reply('This symbol already exist');
                            }
                        }
                        break;
                      case 'del-symbol':
                            if (args.length != 1) {
                                message.reply(`**The arguments are invalide, do the command ${config.prefix}help ${command} to get the doc**`)
                            }
                            else {
                                var newcontent = '';
                
                                const data = fs.readFileSync(DataPath, 'UTF-8');
                                const lines = data.split('\n');
                      
                                lines.forEach((line) => {
                                    if(!(line.includes(args[0])))
                                        newcontent += line + '\n';
                                });
                          
                                fs.writeFile(DataPath, newcontent, err => {
                                    if (err)
                                        message.reply('An unexpected error have interrupt the operation');
                                    else 
                                        message.channel.send(`The value ${args[0]} has been remove from symbol database`);
                                });
                            }
                        break;
                        case 'list-symbol':
                            const data = fs.readFileSync(DataPath, 'UTF-8');
                            const lines = data.split('\n');
                
                            const listEmbed = new DiscordJS.MessageEmbed()
                                .setTitle('List of added symbol')
                                .setColor('#18A31F')
                                .setDescription('Here you can found all the symbols you have added before');

                            lines.forEach((line) => {
                                var lineargs = line.split(',');
                                if (line.length > 4)
                                    listEmbed.addField(lineargs[0], lineargs[1])     
                            });

                            message.channel.send({ embeds: [listEmbed] })
                            break;
                        case 'default-currency':
                            const dcEmbed = new DiscordJS.MessageEmbed()
                                .setTitle('Choose the default currency you want to use')
                                .setColor('GREEN');

                            client.api.channels(message.channel.id).messages.post({
                            data: {
                                embeds: [dcEmbed],
                                components: [
                                {
                                    "type": 1,
                                    "components": [
                                        {
                                        "type": 3,
                                        "custom_id": "defaultcurrencydd",
                                        "options":[
                                            {
                                                "label": "US dollar (USD)",
                                                "value": "USD",
                                                "description": "USD"
                                            },
                                            {
                                                "label": "Euro (EUR)",
                                                "value": "EUR",
                                                "description": "EUR"
                                            },
                                            {
                                                "label": "Franc Suisse (CHF)",
                                                "value": "CHF",
                                                "description": "CHF"
                                            },
                                            {
                                                "label": "Pound sterling (GBP)",
                                                "value": "GBP",
                                                "description": "GBP"
                                            },
                                            {
                                                "label": "Zloty (PLN)",
                                                "value": "PLN",
                                                "description": "PLN"
                                            }
                                            ],
                                            "placeholder": "Choose the default currency",
                                            "min_values": 1,
                                            "max_values": 5
                                        }
                                    ]
                                    }
                                ]
                            }
                            });
                            break;
                        case 'price':
                            if (args.length != 2) {
                                message.reply('The arguments are invalid!')
                            }
                            else {
                                if (args[1] == 'cm') {
                                    var PriceSymbol = args[0];

                                    const data = fs.readFileSync(DataPath, 'UTF-8');
                                    const lines = data.split('\n');

                                    lines.forEach((line) => {
                                        var lineargs = line.split(',');
                                        if (line.length > 4) {
                                            if (lineargs[0] == PriceSymbol)
                                                PriceSymbol = lineargs[1];
                                        }    
                                    });

                                    yahooFinance.quote({
                                        symbol: `${PriceSymbol}-USD`
                                    }).then(function(res) {
                                        var response = JSON.stringify(res, null, 2)
                                        var restext = response.toString()
                                        
                                        var regularMarketChangePercent, regularMarketPrice,
                                        regularMarketDayHigh, regularMarketDayLow, quoteType,
                                        shortName;

                                        var resobj = restext.split('\n')
                                        for (let i = 0; i < resobj.length; i++) {
                                            if (resobj[i].includes('regularMarketChangePercent')) {
                                                var obj = resobj[i].split(':')
                                                regularMarketChangePercent = obj[1]
                                            }
                                            else if (resobj[i].includes('regularMarketPrice')) {
                                                var obj = resobj[i].split(':')
                                                regularMarketPrice = obj[1]
                                            }
                                            else if (resobj[i].includes('regularMarketDayHigh')) {
                                                var obj = resobj[i].split(':')
                                                regularMarketDayHigh = obj[1]
                                            }
                                            else if (resobj[i].includes('regularMarketDayLow')) {
                                                var obj = resobj[i].split(':')
                                                regularMarketDayLow = obj[1]
                                            }
                                            else if (resobj[i].includes('quoteType')) {
                                                var obj = resobj[i].split(':')
                                                quoteType = obj[1]
                                            }
                                            else if (resobj[i].includes('shortName')) {
                                                var obj = resobj[i].split(':')
                                                shortName = obj[1]
                                            }
                                        }

                                        var l = regularMarketChangePercent.length;
                                        regularMarketChangePercent = regularMarketChangePercent.substring(0, l - 1);
                                        l = regularMarketPrice.length;
                                        regularMarketPrice = regularMarketPrice.substring(0, l - 1);
                                        l = regularMarketDayHigh.length;
                                        regularMarketDayHigh = regularMarketDayHigh.substring(0, l - 1);
                                        l = regularMarketDayLow.length;
                                        regularMarketDayLow = regularMarketDayLow.substring(0, l - 1);
                                        l = quoteType.length;
                                        quoteType = quoteType.substring(2, l - 2);
                                        l = shortName.length;
                                        shortName = shortName.substring(2, l - 5);

                                        const Embed = new DiscordJS.MessageEmbed()
                                            .setTitle(`${args[0]}/${config['default-currency']}`)
                                            .setDescription(`${quoteType}`)

                                        if (regularMarketChangePercent > 0)
                                            Embed.setColor('GREEN')
                                        else if (regularMarketChangePercent < 0)
                                            Embed.setColor('RED')

                                        yahooFinance.quote({
                                            symbol: `USD${config['default-currency']}=X`
                                        }).then(function(quotes) {
                                            var quotesJS = JSON.stringify(quotes, null, 2)
                                            var quote = quotesJS.toString()

                                            var obj = quote.split('\n')
                                            for (let i = 0; i < obj.length; i++) {
                                                if (obj[i].includes('regularMarketPrice')) {
                                                    var tp = obj[i].split(':')
                                                    tp[1].substring(1, l - 1);
                                                    var pq = parseFloat(tp[1])

                                                    regularMarketPrice = parseFloat(regularMarketPrice)
                                                    regularMarketPrice *= pq
                                                    regularMarketPrice = regularMarketPrice.toFixed(2)

                                                    regularMarketDayHigh = parseFloat(regularMarketDayHigh)
                                                    regularMarketDayHigh *= pq
                                                    regularMarketDayHigh = regularMarketDayHigh.toFixed(2)

                                                    regularMarketDayLow = parseFloat(regularMarketDayLow)
                                                    regularMarketDayLow *= pq
                                                    regularMarketDayLow = regularMarketDayLow.toFixed(2)

                                                    regularMarketChangePercent = parseFloat(regularMarketChangePercent)
                                                    regularMarketChangePercent = regularMarketChangePercent.toFixed(4)
                                                    regularMarketChangePercent = regularMarketChangePercent.toString()

                                                    Embed.addField('Price: ', regularMarketPrice.toString())
                                                    Embed.addField('Percentage: ', `${regularMarketChangePercent}%`)
                                                    Embed.addField('Hightest today: ', regularMarketDayHigh.toString())
                                                    Embed.addField('Lowest today: ', regularMarketDayLow.toString())

                                                    client.api.channels(message.channel.id).messages.post({
                                                        data: {
                                                            embeds: [Embed]
                                                        }
                                                    })
                                                }
                                            }
                                        })
                                    })
                                }
                                else if (args[1] == 'co') {
                                    var PriceSymbol = args[0];

                                    const data = fs.readFileSync(DataPath, 'UTF-8');
                                    const lines = data.split('\n');

                                    lines.forEach((line) => {
                                        var lineargs = line.split(',');
                                        if (line.length > 4) {
                                            if (lineargs[0] == PriceSymbol)
                                                PriceSymbol = lineargs[1];
                                        }    
                                    });

                                    yahooFinance.quote({
                                        symbol: `${PriceSymbol}`
                                    }).then(function(res) {
                                        var response = JSON.stringify(res, null, 2)
                                        var restext = response.toString()
                                        
                                        var regularMarketChangePercent, regularMarketPrice,
                                        regularMarketDayHigh, regularMarketDayLow, quoteType,
                                        shortName;

                                        var resobj = restext.split('\n')
                                        for (let i = 0; i < resobj.length; i++) {
                                            if (resobj[i].includes('regularMarketChangePercent')) {
                                                var obj = resobj[i].split(':')
                                                regularMarketChangePercent = obj[1]
                                            }
                                            else if (resobj[i].includes('regularMarketPrice')) {
                                                var obj = resobj[i].split(':')
                                                regularMarketPrice = obj[1]
                                            }
                                            else if (resobj[i].includes('regularMarketDayHigh')) {
                                                var obj = resobj[i].split(':')
                                                regularMarketDayHigh = obj[1]
                                            }
                                            else if (resobj[i].includes('regularMarketDayLow')) {
                                                var obj = resobj[i].split(':')
                                                regularMarketDayLow = obj[1]
                                            }
                                            else if (resobj[i].includes('quoteType')) {
                                                var obj = resobj[i].split(':')
                                                quoteType = obj[1]
                                            }
                                            else if (resobj[i].includes('shortName')) {
                                                var obj = resobj[i].split(':')
                                                shortName = obj[1]
                                            }
                                        }

                                        var l = regularMarketChangePercent.length;
                                        regularMarketChangePercent = regularMarketChangePercent.substring(0, l - 1);
                                        l = regularMarketPrice.length;
                                        regularMarketPrice = regularMarketPrice.substring(0, l - 1);
                                        l = regularMarketDayHigh.length;
                                        regularMarketDayHigh = regularMarketDayHigh.substring(0, l - 1);
                                        l = regularMarketDayLow.length;
                                        regularMarketDayLow = regularMarketDayLow.substring(0, l - 1);
                                        l = quoteType.length;
                                        quoteType = quoteType.substring(2, l - 2);
                                        l = shortName.length;
                                        shortName = shortName.substring(2, l - 2);

                                        const Embed = new DiscordJS.MessageEmbed()
                                            .setTitle(`${shortName}`)
                                            .setDescription(`${quoteType}`)

                                        if (regularMarketChangePercent > 0)
                                            Embed.setColor('GREEN')
                                        else if (regularMarketChangePercent < 0)
                                            Embed.setColor('RED')

                                        yahooFinance.quote({
                                            symbol: `USD${config['default-currency']}=X`
                                        }).then(function(quotes) {
                                            var quotesJS = JSON.stringify(quotes, null, 2)
                                            var quote = quotesJS.toString()

                                            var obj = quote.split('\n')
                                            for (let i = 0; i < obj.length; i++) {
                                                if (obj[i].includes('regularMarketPrice')) {
                                                    var tp = obj[i].split(':')
                                                    tp[1].substring(1, l - 1);
                                                    var pq = parseFloat(tp[1])

                                                    regularMarketPrice = parseFloat(regularMarketPrice)
                                                    regularMarketPrice *= pq
                                                    regularMarketPrice = regularMarketPrice.toFixed(2)

                                                    regularMarketDayHigh = parseFloat(regularMarketDayHigh)
                                                    regularMarketDayHigh *= pq
                                                    regularMarketDayHigh = regularMarketDayHigh.toFixed(2)

                                                    regularMarketDayLow = parseFloat(regularMarketDayLow)
                                                    regularMarketDayLow *= pq
                                                    regularMarketDayLow = regularMarketDayLow.toFixed(2)

                                                    regularMarketChangePercent = parseFloat(regularMarketChangePercent)
                                                    regularMarketChangePercent = regularMarketChangePercent.toFixed(4)
                                                    regularMarketChangePercent = regularMarketChangePercent.toString()

                                                    Embed.addField('Price: ', regularMarketPrice.toString())
                                                    Embed.addField('Percentage: ', `${regularMarketChangePercent}%`)
                                                    Embed.addField('Hightest today: ', regularMarketDayHigh.toString())
                                                    Embed.addField('Lowest today: ', regularMarketDayLow.toString())

                                                    client.api.channels(message.channel.id).messages.post({
                                                        data: {
                                                            embeds: [Embed]
                                                        }
                                                    })
                                                }
                                            }
                                        })
                                    
                                    })
                                }
                                else {
                                    var PriceSymbol = args[0];
                                    var PriceSymbol2 = args[1];

                                    const data = fs.readFileSync(DataPath, 'UTF-8');
                                    const lines = data.split('\n');

                                    lines.forEach((line) => {
                                        var lineargs = line.split(',');
                                        if (line.length > 4) {
                                            if (lineargs[0] == PriceSymbol)
                                                PriceSymbol = lineargs[1];
                                            else if (lineargs[0] == PriceSymbol2)
                                                PriceSymbol2 = lineargs[1];
                                        }    
                                    });

                                    yahooFinance.quote({
                                        symbol: `${PriceSymbol}${PriceSymbol2}=X`
                                    }, function (err, res) {
                                        var response = JSON.stringify(res, null, 2)
                                        var restext = response.toString()
                                        
                                        var regularMarketChangePercent, regularMarketPrice,
                                        regularMarketDayHigh, regularMarketDayLow, quoteType,
                                        shortName;

                                        var resobj = restext.split('\n')
                                        for (let i = 0; i < resobj.length; i++) {
                                            if (resobj[i].includes('regularMarketChangePercent')) {
                                                var obj = resobj[i].split(':')
                                                regularMarketChangePercent = obj[1]
                                            }
                                            else if (resobj[i].includes('regularMarketPrice')) {
                                                var obj = resobj[i].split(':')
                                                regularMarketPrice = obj[1]
                                            }
                                            else if (resobj[i].includes('regularMarketDayHigh')) {
                                                var obj = resobj[i].split(':')
                                                regularMarketDayHigh = obj[1]
                                            }
                                            else if (resobj[i].includes('regularMarketDayLow')) {
                                                var obj = resobj[i].split(':')
                                                regularMarketDayLow = obj[1]
                                            }
                                            else if (resobj[i].includes('quoteType')) {
                                                var obj = resobj[i].split(':')
                                                quoteType = obj[1]
                                            }
                                            else if (resobj[i].includes('shortName')) {
                                                var obj = resobj[i].split(':')
                                                shortName = obj[1]
                                            }
                                        }

                                        var l = regularMarketChangePercent.length;
                                        regularMarketChangePercent = regularMarketChangePercent.substring(0, l - 1);
                                        l = regularMarketPrice.length;
                                        regularMarketPrice = regularMarketPrice.substring(0, l - 1);
                                        l = regularMarketDayHigh.length;
                                        regularMarketDayHigh = regularMarketDayHigh.substring(0, l - 1);
                                        l = regularMarketDayLow.length;
                                        regularMarketDayLow = regularMarketDayLow.substring(0, l - 1);
                                        l = quoteType.length;
                                        quoteType = quoteType.substring(2, l - 2);
                                        l = shortName.length;
                                        shortName = shortName.substring(2, l - 5);

                                        const Embed = new DiscordJS.MessageEmbed()
                                            .setTitle(`${shortName}${config['default-currency']}`)
                                            .setDescription(`${quoteType}`)

                                        if (regularMarketChangePercent > 0)
                                            Embed.setColor('GREEN')
                                        else if (regularMarketChangePercent < 0)
                                            Embed.setColor('RED')

                                        yahooFinance.quote({
                                            symbol: `USD${config['default-currency']}=X`
                                        }).then(function(quotes) {
                                            var quotesJS = JSON.stringify(quotes, null, 2)
                                            var quote = quotesJS.toString()

                                            var obj = quote.split('\n')
                                            for (let i = 0; i < obj.length; i++) {
                                                if (obj[i].includes('regularMarketPrice')) {
                                                    var tp = obj[i].split(':')
                                                    tp[1].substring(1, l - 1);
                                                    var pq = parseFloat(tp[1])

                                                    regularMarketPrice = parseFloat(regularMarketPrice)
                                                    regularMarketPrice *= pq
                                                    regularMarketPrice = regularMarketPrice.toFixed(2)

                                                    regularMarketDayHigh = parseFloat(regularMarketDayHigh)
                                                    regularMarketDayHigh *= pq
                                                    regularMarketDayHigh = regularMarketDayHigh.toFixed(2)

                                                    regularMarketDayLow = parseFloat(regularMarketDayLow)
                                                    regularMarketDayLow *= pq
                                                    regularMarketDayLow = regularMarketDayLow.toFixed(2)

                                                    regularMarketChangePercent = parseFloat(regularMarketChangePercent)
                                                    regularMarketChangePercent = regularMarketChangePercent.toFixed(4)
                                                    regularMarketChangePercent = regularMarketChangePercent.toString()

                                                    Embed.addField('Price: ', regularMarketPrice.toString())
                                                    Embed.addField('Percentage: ', `${regularMarketChangePercent}%`)
                                                    Embed.addField('Hightest today: ', regularMarketDayHigh.toString())
                                                    Embed.addField('Lowest today: ', regularMarketDayLow.toString())

                                                    client.api.channels(message.channel.id).messages.post({
                                                        data: {
                                                            embeds: [Embed]
                                                        }
                                                    })
                                                }
                                            }
                                        })
                                    })
                                }
                            }
                            break;
        }
    }
})

client.on('interactionCreate', interaction => {
	if (!interaction.isSelectMenu()) return;
    if (interaction.values.length > 1)
        interaction.reply('The selection is invalid, please select only one argument!')
    else {
        const data = fs.readFileSync('./config.json', 'UTF-8');
        const lines = data.split('\n');

        var newJSON = '';

        lines.forEach((line) => {
            if(line.includes("\"default-currency\""))
                newJSON += `\t"default-currency": "${interaction.values[0]}"\n`
            else 
                newJSON += line+'\n'
        });

        fs.writeFileSync('./config.json', newJSON);

        interaction.reply(`The currency ${interaction.values[0]} has been set as the default currency`)
    }
});

client.login(config.token)