//Command / Register Behavior from Sapphire Framework
const { Command, RegisterBehavior } = require('@sapphire/framework');
// Slash Command Builder
const { SlashCommandBuilder } = require('@discordjs/builders');
// Stopwatch
const { Stopwatch } = require('@sapphire/stopwatch');
// Message
const { Collection , MessageEmbed, MessageAttachment } = require('discord.js');
// Env
const { env } = require('../.././config');
// Robinhood
const rh  = require('robinhood');
const { Body } = require('node-fetch');
// Node HTML to Image
const nodeHtmlToImage = require('node-html-to-image');
// Axios 
const axios = require('axios');



// Glue Code Warning - 
// Most of these commands are only meant for test cases, do not use in production! :)
class FundCommand extends Command {

//  Constructor - Fund Concept 
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'fund',
            description: 'KBVE Fund Bot',
            chatInputCommand: {
                register: true,
                behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
                guildIds: [process.env.GUILD_ID],
                idHints: ['']
            }
        });
    }

    
    
 // https://github.com/KBVE/archive/blob/main/nodejs/_function/_axios_post.js   
    async _post(url,data) {    try {   const resp = await axios.post(url,data);    return resp.data;   } catch (err) {     console.error(err);     return err;     }   };

    robinhood_fund_data()
            {   
                    return new Promise(function (res, rej) {
                                var _RH = rh({token : env.ROBINHOOD_TOKEN }, function(){}); 
                                    _RH.accounts(function(error, response, body) { 
                                        if (error) { rej(error); } var _data = body; res(_data); })
                                });           
            }
    
    async _rh_fund_data() {         let _rh = await this.robinhood_fund_data();             return await _rh;   } // Async Pass Through Function

    
    robinhood_data(_ticker)
            {
                    return new Promise(function (res, rej) {
                                    if(!_ticker) rej('Missing Ticker');              
                                    const _RH = rh({token : env.ROBINHOOD_TOKEN }, function(){}); _RH.quote_data(_ticker, function(error, response, body) 
                                        { if (error) { rej(error); } var _data = body; res(_data);  })
                                });           
        
            }
    async _rh_data(_ticker) {                               let _rh = await this.robinhood_data(_ticker);                                      return await _rh;   } // Async Pass Through


    robinhood_buy_data(_ticker, _url, _price , _shares)
            {
                return new Promise(function (res, rej) {
                    if(!_ticker) rej('Missing Ticker');          
                    const _RH = rh({token : env.ROBINHOOD_TOKEN }, function(){
                        let options = {
                                type: 'market',
                                quantity: _shares,
                                bid_price: _price,
                                instrument: {
                                    url: _url,
                                    symbol: _ticker
                                }
                        }
                        _RH.place_buy_order(options, function(error, response, body){
                            if (error) { rej(error); }
                            var _data = body;
                            //console.log(_data)
                            res(_data);
                            })
                    })     
                });           
            }
    async _rh_buy(_ticker, _url, _price , _shares) {        let _rh = await this.robinhood_buy_data(_ticker, _url, _price , _shares);       return await _rh;   }


// [0] Async Break down for the chatInputRun
// Check #kbve discord for the new template. 


    async chatInputRun(interaction) {
        //_[START]
        //Init Message
        const embed = new MessageEmbed().setColor(0xfee75c).setDescription(`**Grabbing FUND Data** Please wait...`);
        const bonus = new MessageEmbed().setColor(0xfee75c).setDescription(`**Bonus Message!** Please wait...`);
        //_[END]

        // Console Log
        //console.log(interaction.member.user.id);
        
        const message = await interaction.reply({
            embeds: [embed,bonus],
            fetchReply: true
        });

        const type = interaction.options.getSubcommand(true);
      
        switch (type) {
            case 'buy':
                    // TO-DO : Sanitize Input Parameters
                    // TO-DO : Convert Credits to USD
                    const stock = interaction.options.getString('stock');
                    const amount = interaction.options.getString('amount').replace('K','000').replace(',','');
                    const _amount = amount;
                    if(interaction.member.user.id != '121512134390579200') {                                 embed.setColor(0x0000FF).setDescription(`Only holy can ask me to buy!`);                        await interaction.editReply({ embeds: [embed] });       break; }
                    if(isNaN(amount)) {                                 embed.setColor(0xFF0000).setDescription(`Amount is not a valid number`);                        await interaction.editReply({ embeds: [embed] });       break; }
                    if(stock.length > 5) {                              embed.setColor(0xFF0000).setDescription(`Stock Ticker is too long`);                            await interaction.editReply({ embeds: [embed] });       break; }

                    // TO-DO: Executioner - interaction.member.user.id - has to have enough credits inside their account to execute the exchange.
                    // TO-DO: Executioner - interaction.member.user.id - start pending transaction and remove the credits from their account.
                    

                    const _ticker = stock.replaceAll('$','').substr(0, 5);
                
                    let price = await(this._rh_data(_ticker));
                    
                    if (price == null || price.results == null) {       embed.setColor(0xFF0000).setDescription(`Error with the pricing, yall trying to rob the hood?`); await interaction.editReply({ embeds: [embed] });      break; }
                    
                    let _price = await price.results[0].ask_price;
                    let _url = await price.results[0].instrument;
                    let _shares = (_amount / _price ).toFixed(4);


                    // TO-DO: Move the trade execution from within this application and migrate towards an isolated environment.
                    let buy_data = await this._rh_buy(_ticker, _url, _price, _shares);

                    console.log(buy_data);




                embed
                .setColor(0x57f287)
                .setDescription(`📈 Buying Stock: ${stock} Ticker\n💸 Amount: ${amount} credits \n  Share Units: ${_shares} \n `);

                bonus
                .setColor(0x0000FF)
                .setDescription(`Trade Block
                \n Data:
                \n Stock Price Execution: ${buy_data.results[0].price}               
                \n Shares: ${buy_data.result[0].quantity}
                \n Object: ${buy_data.result[0].instrument_id}
                `)
                await interaction.editReply({ embeds: [embed,bonus] });            
                break; 
            //
            case 'igbc':

                let data = await this._rh_fund_data();
                    if(typeof data.detail !== 'undefined') {
                        embed
                            .setColor(0xFF0000)
                            .setDescription(`Error: ${data.detail}`);
                        await interaction.editReply({ embeds: [embed] });            
                        break;  
                    }

                //console.log(data);

                embed
                .setColor(0x57f287)
                .setDescription(`📈 KBVE Fund \n Margin $: ${data.results[0].cash} USD
                \n 💸 Cash $: ${data.results[0].cash_available_for_withdrawal} USD 
                \n 💰 RustyClan Lannister Debt $: ${data.results[0].unsettled_debit} 
                \n 🐖 Piggy Pending Pank $: ${data.results[0].cash_held_for_orders} 
                \n ❤️‍🔥 Cash Held $: ${data.results[0].cash_held_for_options_collateral}  
                \n 🪙 Crypto ₿uyin Power $: ${data.results[0].crypto_buying_power} `);

                if( Math.random() < 0.1 ) { bonus   .setColor(0x0000FF)  .setDescription(` InterGalatic Banking Clan, \n with the partnership of the Iron Bank of Braavos, \n thanks you for your service against *Black* Crack *Rock* Cocks.`);    }

                await interaction.editReply(    { embeds: [embed,bonus] }   );            


                break;
            ///\
            case 'stock':
                const _stock = interaction.options.getString('stock');
                const _pticker = _stock.replaceAll('$','').substr(0, 5);
                
                let __price = await(this._rh_data(_pticker))
                  
                        if (__price == null || __price.results == null) { embed.setColor(0xFF0000).setDescription(`Error with the pricing, yall trying to rob the hood?`); await interaction.editReply({ embeds: [embed] });  break; }

                        //console.log(__price.results[0]);
                        embed
                                .setColor(0x57f287)
                                .setDescription(`📈 [KBVE FUND](https://kbve.com/fund/) $${_pticker} : Stock Information
                                \n
                                |Emjoi_1 Ask Price      |: $ ${__price.results[0].ask_price} USD 
                                -------------------------
                                |Emjoi_2 Ask Size Vol   |: # ${__price.results[0].ask_size} 
                                -------------------------
                                |Emjoi_3 Bid Price      |: $ ${__price.results[0].bid_price} USD 
                                -------------------------
                                |Emjoi_4 Bid Size Vol   |: # ${__price.results[0].bid_size}  
                                \n
                                ---------------------------------
                                |Emjoi_5 Last Trade Price        |: $ ${__price.results[0].last_trade_price} 
                                ---------------------------------
                                |Emjoi_6 Extended Hours Price    |: $ ${__price.results[0].last_extended_hours_trade_price}
                                ---------------------------------
                                |Emjoi_7 Previous Close Price    |: $ ${__price.results[0].previous_close}
                                ---------------------------------
                                ---------------------------------
                                \n Emjoi_8 Object ID            |: ${__price.results[0].instrument_id}
                                \n
                                
                                `);
                        await interaction.editReply({ embeds: [embed] });           
                break;
            case 'coinlib': 
                embed.setColor(0x57f287).setDescription(`📈 Crypto Lib`);    
                
                const image = await nodeHtmlToImage({
                    quality: 100,
                    type: 'png',
                    waitUntil: 'load',
                    html: `
                             <!DOCTYPE html>
                                <html lang="en">
                                <head>
                                    <meta charset="UTF-8" />
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                                    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                                    <style>
                                    body {
                                        font-family: "Poppins", Arial, Helvetica, sans-serif;
                                        background: rgb(22, 22, 22);
                                        color: #fff;
                                        max-width: 300px;
                                    }

                                    .app {
                                        max-width: 300px;
                                        padding: 20px;
                                        display: flex;
                                        flex-direction: row;
                                        border-top: 3px solid rgb(16, 180, 209);
                                        background: rgb(31, 31, 31);
                                        align-items: center;
                                    }

                                    img {
                                        width: 50px;
                                        height: 50px;
                                        margin-right: 20px;
                                        border-radius: 50%;
                                        border: 1px solid #fff;
                                        padding: 5px;
                                    }
                                    </style>
                                </head>
                                <body>
                                    <div class="app">
                                    <div style="height:560px; background-color: #1D2330; overflow:hidden; box-sizing: border-box; border: 1px solid #282E3B; border-radius: 4px; text-align: right; line-height:14px; font-size: 12px; font-feature-settings: normal; text-size-adjust: 100%; box-shadow: inset 0 -20px 0 0 #262B38;padding:1px;padding: 0px; margin: 0px; width: 100%;"><div style="height:540px; padding:0px; margin:0px; width: 100%;"><iframe src="https://widget.coinlib.io/widget?type=chart&theme=dark&coin_id=859&pref_coin_id=1505" width="100%" height="536px" scrolling="auto" marginwidth="0" marginheight="0" frameborder="0" border="0" style="border:0;margin:0;padding:0;line-height:14px;"></iframe></div><div style="color: #626B7F; line-height: 14px; font-weight: 400; font-size: 11px; box-sizing: border-box; padding: 2px 6px; width: 100%; font-family: Verdana, Tahoma, Arial, sans-serif;"><a href="https://coinlib.io" target="_blank" style="font-weight: 500; color: #626B7F; text-decoration:none; font-size:11px">Cryptocurrency Prices</a>&nbsp;by Coinlib</div></div>
                                    </div>
                                </body>
                                </html>
                    `
                });
                const _chart = new MessageAttachment(image, 'meme.png');
                
                //bonus.setColor(0x57f287).setImage('attachment://meme.png');
                await interaction.editReply({ 
                    embeds: [embed,bonus],
                    files: [_chart]
                    });    
                break;


            case 'api': 
                embed.setColor(0x57f287).setDescription(`API Call`);    

                // API 
                // Two ways that we can do this, via Axios or via Fetch.
                // Going to continue development on the slave-node-3 and slave-node-4, then repo for next update.
                const api_image = await nodeHtmlToImage({
                    quality: 100,
                    type: 'png',
                    waitUntil: 'load',
                    html: ``
                });
                const api_chart = new MessageAttachment(api_image, 'meme.png');
            
                await interaction.editReply({ 
                    embeds: [embed,bonus],
                    files: [api_chart]
                    });    
                break;
             
            
            default:
                //_[DEAD]
                //timer.start();
                //await Promise.all(
                //    this.container.stores.map(store => store.loadAll())
                //);
                //[DEAD]_
                embed
                .setColor(0x57f287)
                .setDescription(`- No Type -`);
                await interaction.editReply({ embeds: [embed] });
                break;
                
        }



    }


    autocompleteRun(interaction) {
        const type = interaction.options.getSubcommand(true);
        const query = interaction.options.getFocused();

        const options =
            type === 'piece'
                ? new Collection()
                      .concat(...this.container.stores.values())
                      .filter(
                          piece => !piece.location.full.includes('node_modules')
                      )
                : this.container.stores;

        return interaction.respond(
            [...options.values()]
                .map(piece => ({
                    name: piece.name,
                    value: piece.name
                }))
                .filter(option => !query.trim() || option.name.includes(query))
        );
    }

    

    
    registerApplicationCommands(registry) {
        const command = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addSubcommand(subcommand =>
                subcommand
                    .setName('buy')
                    .setDescription('Buy Stock')
                    .addStringOption(option =>
                        option
                            .setName('stock')
                            .setDescription('The name of the stock ticker') 
                            .setRequired(true)
                    )
                    .addStringOption(option =>
                        option
                            .setName('amount')
                            .setDescription('The amount of credits for the ticker') 
                            .setRequired(true)
                    )
            )
            .addSubcommand(subcommand =>
                        subcommand
                            .setName('igbc')
                            .setDescription('InterGalactic Banking Clan')
                           
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('coinlib')
                    .setDescription('Coinlib')
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('stock')
                    .setDescription('Stock Information')
                    .addStringOption(option =>
                        option
                            .setName('stock')
                            .setDescription('The name of the stock ticker') 
                            .setRequired(true)
                    )
            ).addSubcommand(subcommand =>
                subcommand
                    .setName('crypto')
                    .setDescription('Crypto Information')
                    .addStringOption(option =>
                        option
                            .setName('crypto')
                            .setDescription('The name of the crypto!') 
                            .setRequired(true)
                    )
            );
            
          

        registry.registerChatInputCommand(command, {
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
            guildIds: [process.env.GUILD_ID]
        });
    }





}



// Export the Final Module

module.exports = {
    FundCommand
};
