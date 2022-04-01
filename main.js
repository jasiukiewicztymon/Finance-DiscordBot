var { Client, Intents } = require('discord.js')
var DiscordJS = require('discord.js')
var config = require('./config.json')
var fs = require('fs')
const yahooFinance = require('yahoo-finance')
const ChartJsImage = require('chartjs-to-image');

var configdc = 'USD'

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    ],
})

client.on('ready', () => {
    console.log(`The bot connected to the server`)
    client.user.setPresence({ activities: [{ name: `${config.prefix}help`, type: 'LISTENING' }], status: 'online' });
})

client.on('messageCreate', (message) => {
    const guild = message.guild
    var serverName = guild.id

    var DataPath = `./datas/${serverName}`  
    fs.access(DataPath, fs.F_OK, function(err) {
        if (err) {
            fs.writeFile(DataPath, '', function (err) {
                console.log(err);
            })
        }
    })

    var CurrPath = `./currency/${serverName}`  
    fs.access(CurrPath, fs.F_OK, function(err) {
        if (err) {
            fs.writeFile(CurrPath, 'USD', function (err) {
                console.log(err);
            })
        }
        else {
            fs.readFileSync(CurrPath, 'utf8', function(datas) {
                configdc = datas
            }) 
        }
    })

    
    try {
        if (message.content.startsWith(config.prefix)) {
            let args = message.content.slice(config.prefix.length).split(' ');
            let command = args.shift().toLowerCase();
    
            switch(command) {
                /* 
                    Help command:
                    Send the help for all the commands
                */
                case 'help':
                    const help = new DiscordJS.MessageEmbed()
                        .setTitle('Help')
                        .setColor('#18A31F')
                        .setDescription('Here you can find all the necessary help to use the bot')
                        .addFields(
                            { name: '$api', value: 'Send all informations about the api the bot use', inline: true },
                            { name: '$author', value: 'Send all informations about the author', inline: true },
                            { name: '\u200B', value: '\u200B' },
                            { name: '$add-symbol <[name] / [symbol]>', value: 'You can link economic symbol and name to use them', inline: true },
                            { name: '$del-symbol <[name] / [symbol]>', value: 'You can removed linked economic symbol and name from the list', inline: true },
                            { name: '$list-symbol', value: 'You can list all the symbol from a list', inline: true },
                            { name: '\u200B', value: '\u200B' },
                            { name: '$price <[name] / [symbol]> <cm | co | [name] / [symbol]>', value: 'Use price command with argument to get all the informations about an item\n\ncm - cryptomoney | co - corporation\n[symbol] / [value] - money exchange', inline: true },
                            { name: '$historial <[name] / [symbol]> <cm | co | [name] / [symbol]> <d | w | m>', value: 'Use historial command with argument to get archived informations about an item with an specific interval\n\ncm - cryptomoney | co - corporation\n[symbol] / [value] - money exchange\nd - day | w - week | m - month', inline: true },
                        );
    
                    message.channel.send({ embeds: [help] })
                    break
                /* 
                    API command:
                    Send all the information about the API the bot use
                */
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
                /* 
                    Author command:
                    Send all the information about the author of the bot
                */
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
                /* 
                    Add-symbol command:
                    Add a name as a symbol to the symbol list 
                */
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
                /* 
                    Del-symbol command:
                    Del a name saved as a symbol from the symbol list 
                */
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
                /* 
                    List-symbol command:
                    List all the name and symbols that are link with them from the symbol list 
                */
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
                /* 
                    Default-currency command:
                    Set the default currency for the server 
                */
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
                            ]}
                        ]}
                    });
                    break;
                /* 
                    Price command:
                    Send an embed message with all the informations about the currency
                */
                case 'price':
                    fs.readFileSync(CurrPath, 'utf8', function(datas) {
                        configdc = datas
                    }) 
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
                                var jsonres = JSON.parse(response)

                                var regularMarketChangePercent = jsonres["price"].regularMarketChangePercent, 
                                regularMarketPrice = jsonres["price"].regularMarketPrice,
                                regularMarketDayHigh = jsonres["price"].regularMarketDayHigh, 
                                regularMarketDayLow = jsonres["price"].regularMarketDayLow, 
                                quoteType = jsonres["price"].quoteType;
        
                                const Embed = new DiscordJS.MessageEmbed()
                                    .setTitle(`${args[0]}/${configdc}`)
                                    .setDescription(`${quoteType}`)
        
                                if (regularMarketChangePercent > 0)
                                    Embed.setColor('GREEN')
                                else if (regularMarketChangePercent < 0)
                                    Embed.setColor('RED')
        
                                yahooFinance.quote({
                                    symbol: `USD${configdc}=X`
                                }).then(function(quotes) {
                                    var quotesJS = JSON.stringify(quotes, null, 2)
                                    var quote = JSON.parse(quotesJS)
        
                                    var pq = quote["price"].regularMarketPrice;

                                    regularMarketChangePercent *= pq
                                    regularMarketChangePercent = regularMarketChangePercent.toFixed(2)
                                    regularMarketChangePercent = regularMarketChangePercent.toString()

                                    regularMarketPrice *= pq
                                    regularMarketPrice = regularMarketPrice.toFixed(2)

                                    regularMarketDayHigh *= pq
                                    regularMarketDayHigh = regularMarketDayHigh.toFixed(2)

                                    regularMarketDayLow *= pq
                                    regularMarketDayLow = regularMarketDayLow.toFixed(2)

                                    Embed.addField('Price: ', regularMarketPrice.toString())
                                    Embed.addField('Percentage: ', `${regularMarketChangePercent}%`)
                                    Embed.addField('Hightest today: ', regularMarketDayHigh.toString())
                                    Embed.addField('Lowest today: ', regularMarketDayLow.toString())

                                    client.api.channels(message.channel.id).messages.post({
                                        data: {
                                            embeds: [Embed]
                                        }
                                    })
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
                                var jsonres = JSON.parse(response)

                                var regularMarketChangePercent = jsonres["price"].regularMarketChangePercent, 
                                regularMarketPrice = jsonres["price"].regularMarketPrice,
                                regularMarketDayHigh = jsonres["price"].regularMarketDayHigh, 
                                regularMarketDayLow = jsonres["price"].regularMarketDayLow, 
                                quoteType = jsonres["price"].quoteType,
                                shortName = jsonres["price"].shortName;
        
                                const Embed = new DiscordJS.MessageEmbed()
                                    .setTitle(`${shortName}`)
                                    .setDescription(`${quoteType}`)
        
                                if (regularMarketChangePercent > 0)
                                    Embed.setColor('GREEN')
                                else if (regularMarketChangePercent < 0)
                                    Embed.setColor('RED')
        
                                yahooFinance.quote({
                                    symbol: `USD${configdc}=X`
                                }).then(function(quotes) {
                                    var quotesJS = JSON.stringify(quotes, null, 2)
                                    var quote = JSON.parse(quotesJS)
        
                                    var pq = quote["price"].regularMarketPrice;

                                    regularMarketChangePercent *= pq
                                    regularMarketChangePercent = regularMarketChangePercent.toFixed(2)
                                    regularMarketChangePercent = regularMarketChangePercent.toString()

                                    regularMarketPrice *= pq
                                    regularMarketPrice = regularMarketPrice.toFixed(2)

                                    regularMarketDayHigh *= pq
                                    regularMarketDayHigh = regularMarketDayHigh.toFixed(2)

                                    regularMarketDayLow *= pq
                                    regularMarketDayLow = regularMarketDayLow.toFixed(2)

                                    Embed.addField('Price: ', regularMarketPrice.toString())
                                    Embed.addField('Percentage: ', `${regularMarketChangePercent}%`)
                                    Embed.addField('Hightest today: ', regularMarketDayHigh.toString())
                                    Embed.addField('Lowest today: ', regularMarketDayLow.toString())

                                    client.api.channels(message.channel.id).messages.post({
                                        data: {
                                            embeds: [Embed]
                                        }
                                    })
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
                                var jsonres = JSON.parse(response)

                                var regularMarketChangePercent = jsonres["price"].regularMarketChangePercent.toFixed(2), 
                                regularMarketPrice = jsonres["price"].regularMarketPrice.toFixed(2),
                                regularMarketDayHigh = jsonres["price"].regularMarketDayHigh.toFixed(2), 
                                regularMarketDayLow = jsonres["price"].regularMarketDayLow.toFixed(2), 
                                quoteType = jsonres["price"].quoteType;
        
                                const Embed = new DiscordJS.MessageEmbed()
                                    .setTitle(`${PriceSymbol.toUpperCase()}/${PriceSymbol2.toUpperCase()}`)
                                    .setDescription(`${quoteType}`)
        
                                if (regularMarketChangePercent > 0)
                                    Embed.setColor('GREEN')
                                else if (regularMarketChangePercent < 0)
                                    Embed.setColor('RED')
        
                                Embed.addField('Price: ', regularMarketPrice.toString())
                                Embed.addField('Percentage: ', `${regularMarketChangePercent}%`)
                                Embed.addField('Hightest today: ', regularMarketDayHigh.toString())
                                Embed.addField('Lowest today: ', regularMarketDayLow.toString())

                                client.api.channels(message.channel.id).messages.post({
                                    data: {
                                        embeds: [Embed]
                                    }
                                })
                            })
                        }
                    }
                    break;
                /*
                    Historial command 
                    Return a graph of information about the price 
                */
                case 'historial':
                    fs.readFileSync(CurrPath, 'utf8', function(datas) {
                        configdc = datas
                    }) 
                    if (args.length != 3 || (args[2] != 'd' && args[2] != 'w' && args[2] != 'm' )) {
                        message.reply('The arguments are invalid!')
                    }
                    else {
                        var pq
                        yahooFinance.quote({
                            symbol: `USD${configdc}=X`
                        }).then(function(quotes) {
                            var quotesJS = JSON.stringify(quotes, null, 2)
                            var quote = JSON.parse(quotesJS)
        
                            pq = quote["price"].regularMarketPrice;
                        })
    
    
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
    
                            var fulldate = new Date().toISOString().split('T')[0]
    
                            var open = [], close = [], date = []

                            yahooFinance.historical({
                                symbol: `${PriceSymbol}-USD`,
                                from: '2018-12-31',
                                to: fulldate,
                                period: args[2]
                            }).then(function(res) {
                                var response = JSON.stringify(res, null, 2)
                                var jsonres = JSON.parse(response)
                                var out

                                for (let i = 0; i < jsonres.length && i < 24; i++) {
                                    out = jsonres[i].date.split('T')[0]
                                    date.push(out)
                                    out = jsonres[i].open
                                    out *= pq
                                    out = out.toFixed(2)
                                    open.push(out)
                                    out = jsonres[i].close
                                    out *= pq
                                    out = out.toFixed(2)
                                    close.push(out)
                                }

                                date.reverse()
                                open.reverse()
                                close.reverse()
                                const Graph = new ChartJsImage();
                                Graph.width = 1200
                                Graph.height = 750
                                Graph.backgroundColor = '#2E2D2E'
                                Graph.setConfig({
                                    type: 'line',
                                    data: {
                                      labels: date,
                                      datasets: [{
                                          label: 'Open',
                                          data: open,
                                          borderColor: '#CC0631',
                                          fill: false,
                                      }, {
                                          label: 'Close',
                                          data: close,
                                          borderColor: '#08D416',
                                          fill: false,
                                      }]
                                    },
                                    options: {
                                        legend: {
                                            labels: {
                                                fontColor: 'white'
                                            }
                                        },
                                        scales: { 
                                            yAxes: [{
                                                ticks: {
                                                    fontColor: "white",
                                                    beginAtZero: true
                                                }
                                            }],
                                            xAxes: [{
                                                ticks: {
                                                    fontColor: "white"
                                                }
                                            }]
                                        }
                                    },
                                });
    
                                Graph.toDataUrl()
                                const url = Graph.getUrl()
                                
                                message.channel.send(url);
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
    
                            var fulldate = new Date().toISOString().split('T')[0]
    
                            var open = [], close = [], date = []
    
                            yahooFinance.historical({
                                symbol: `${PriceSymbol}`,
                                from: '2018-12-31',
                                to: fulldate,
                                period: args[2]
                            }).then(function(res) {
                                var response = JSON.stringify(res, null, 2)
                                var jsonres = JSON.parse(response)
                                var out

                                for (let i = 0; i < jsonres.length && i < 24; i++) {
                                    out = jsonres[i].date.split('T')[0]
                                    date.push(out)
                                    out = jsonres[i].open
                                    out *= pq
                                    out = out.toFixed(2)
                                    open.push(out)
                                    out = jsonres[i].close
                                    out *= pq
                                    out = out.toFixed(2)
                                    close.push(out)
                                }

                                date.reverse()
                                open.reverse()
                                close.reverse()
                                const Graph = new ChartJsImage();
                                Graph.width = 1200
                                Graph.height = 750
                                Graph.backgroundColor = '#2E2D2E'
                                Graph.setConfig({
                                    type: 'line',
                                    data: {
                                      labels: date,
                                      datasets: [{
                                          label: 'Open',
                                          data: open,
                                          borderColor: '#CC0631',
                                          fill: false,
                                      }, {
                                          label: 'Close',
                                          data: close,
                                          borderColor: '#08D416',
                                          fill: false,
                                      }]
                                    },
                                    options: {
                                        legend: {
                                            labels: {
                                                fontColor: 'white'
                                            }
                                        },
                                        scales: { 
                                            yAxes: [{
                                                ticks: {
                                                    fontColor: "white",
                                                    beginAtZero: true
                                                }
                                            }],
                                            xAxes: [{
                                                ticks: {
                                                    fontColor: "white"
                                                }
                                            }]
                                        }
                                    },
                                });
    
                                Graph.toDataUrl()
                                const url = Graph.getUrl()
                                
                                message.channel.send(url);
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
    
                            var fulldate = new Date().toISOString().split('T')[0]
    
                            var open = [], close = [], date = []
    
                            yahooFinance.historical({
                                symbol: `${PriceSymbol}${PriceSymbol2}=X`,
                                from: '2018-12-31',
                                to: fulldate,
                                period: args[2]
                            }).then(function(res) {
                                var response = JSON.stringify(res, null, 2)
                                var jsonres = JSON.parse(response)
                                var out

                                for (let i = 0; i < jsonres.length && i < 24; i++) {
                                    out = jsonres[i].date.split('T')[0]
                                    date.push(out)
                                    out = jsonres[i].open
                                    out = out.toFixed(2)
                                    open.push(out)
                                    out = jsonres[i].close
                                    out = out.toFixed(2)
                                    close.push(out)
                                }

                                date.reverse()
                                open.reverse()
                                close.reverse()
                                const Graph = new ChartJsImage();
                                Graph.width = 1200
                                Graph.height = 750
                                Graph.backgroundColor = '#2E2D2E'
                                Graph.setConfig({
                                    type: 'line',
                                    data: {
                                      labels: date,
                                      datasets: [{
                                          label: 'Open',
                                          data: open,
                                          borderColor: '#CC0631',
                                          fill: false,
                                      }, {
                                          label: 'Close',
                                          data: close,
                                          borderColor: '#08D416',
                                          fill: false,
                                      }]
                                    },
                                    options: {
                                        legend: {
                                            labels: {
                                                fontColor: 'white'
                                            }
                                        },
                                        scales: { 
                                            yAxes: [{
                                                ticks: {
                                                    fontColor: "white",
                                                    beginAtZero: true
                                                }
                                            }],
                                            xAxes: [{
                                                ticks: {
                                                    fontColor: "white"
                                                }
                                            }]
                                        }
                                    },
                                });
    
                                Graph.toDataUrl()
                                const url = Graph.getUrl()
                                
                                message.channel.send(url);
                            })
                    }
                    break;
                }
            }
        }
    }
    catch (err) {
        console.log(err)
    }
})

client.on('interactionCreate', interaction => {
	if (!interaction.isSelectMenu()) return;
    if (interaction.values.length > 1)
        interaction.reply('The selection is invalid, please select only one argument!')
    else {
        const guild = interaction.guild
        var serverName = guild.name
        var CurrPath = `./currency/${serverName}`  
        fs.writeFile(CurrPath, interaction.values[0], function (err) {
            console.log(err);
        })

        configdc = interaction.values[0]
        interaction.reply(`The currency ${interaction.values[0]} has been set as the default currency`)
    }
});

client.login(config.token)
