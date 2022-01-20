//Command / Register Behavior from Sapphire Framework
const { Command, RegisterBehavior } = require('@sapphire/framework');
// Slash Command Builder
const { SlashCommandBuilder } = require('@discordjs/builders');
// Stopwatch
const { Stopwatch } = require('@sapphire/stopwatch');
// Message
const { Collection , MessageEmbed } = require('discord.js');
// Env
const { env } = require('../.././config');
// Robinhood
const rh  = require('robinhood');
const { Body } = require('node-fetch');



// Glue Code Warning - 
// Most of these commands are only meant for test cases, do not use in production! :)
class FundCommand extends Command {

    //  Constructor - Fund Concept 
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'fund',
            description: 'KBVE Fund Bot',
            preconditions: ['OwnerOnly'],
            chatInputCommand: {
                register: true,
                behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
                guildIds: [process.env.GUILD_ID],
                idHints: ['']
            }
        });
    }


    robinhood_fund_data()
        {   
            console.log("Grabbing Robinhood Data");
            return new Promise(function (res, rej) {
               // if(!_ticker) rej('Missing Ticker');    
                var _RH = rh({token : env.ROBINHOOD_TOKEN }, function(){})

                _RH.accounts(function(error, response, body) {
                   if (error) { rej(error); }
                   var _data = body;
                   res(_data);
                   })
                
            });           
            
        }


    async _rh_fund_data()
    {
        let _rh = await this.robinhood_fund_data();
        return await _rh;

    }

    robinhood_data(_ticker)
    {
        return new Promise(function (res, rej) {
            if(!_ticker) rej('Missing Ticker');              
            const _RH = rh({token : env.ROBINHOOD_TOKEN }, function(){})
            _RH.quote_data(_ticker, function(error, response, body) {
               if (error) { rej(error); }
               var _data = body;
               res(_data);
               })
            
        });           
        
    }


    async _rh_data(_ticker)
    {
        let _rh = await this.robinhood_data(_ticker);
        return await _rh;

    }


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
                    // time: String,    // Defaults to "immediate"
                    // type: String     // Defaults to "market"
                    }
                    _RH.place_buy_order(options, function(error, response, body){
                        if (error) { rej(error); }
                        var _data = body;
                        console.log(_data)
                        res(_data);
                        })
                })
                
                    
               // _RH.accounts(function(error, response, body) {
                   
                
            });           
            
        }


    async _rh_buy(_ticker, _url, _price , _shares)
    {
        let _rh = await this.robinhood_buy_data(_ticker, _url, _price , _shares);
        return await _rh;

    }


// [0] Async Break down for the chatInputRun
// Check #kbve discord for the new template. 


    async chatInputRun(interaction) {
        //_[START]
        //Init Message
        const embed = new MessageEmbed()
            .setColor(0xfee75c)
            .setDescription(`**Grabbing FUND Data** Please wait...`);

        //_[END] 
        const message = await interaction.reply({
            embeds: [embed],
            fetchReply: true
        });



        const type = interaction.options.getSubcommand(true);
      
        switch (type) {
            case 'buy':
                    const stock = interaction.options.getString('stock');
                    const amount = interaction.options.getString('amount').replace('K','000').replace(',','');
                    const _amount = amount;
            
                    if(isNaN(amount)) {
                        embed
                            .setColor(0xFF0000)
                            .setDescription(`Amount is not a valid number`);
                        await interaction.editReply({ embeds: [embed] });            
                        break;  
                    }

                    if(stock.length > 5)
                    {
                        embed
                            .setColor(0xFF0000)
                            .setDescription(`Stock Ticker is too long`);
                        await interaction.editReply({ embeds: [embed] });            
                        break;  
                    }
                    const _ticker = stock.replaceAll('$','').substr(0, 5);
                    let price = await(this._rh_data(_ticker))
                    if(price == null || price.results == null) { return message.channel.send(`\`ERROR\` \`\`\`xl\n${'Error with the pricing, yall trying to rob the hood?'}\n\`\`\``) }
                    let _price = await price.results[0].ask_price
                    let _url = await price.results[0].instrument
                    let _shares = (_amount / _price ).toFixed(4)
            
                    let buy_data = await this._rh_buy(_ticker, _url, _price, _shares);






                embed
                .setColor(0x57f287)
                .setDescription(`📈 Buying Stock: ${stock} Ticker\n💸 Amount: ${amount} credits \n  Share Units: ${_shares} \n`);
                await interaction.editReply({ embeds: [embed] });            
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

                embed
                .setColor(0x57f287)
                .setDescription(`📈 Fund Cash $: ${data.results[0].cash} USD \n 💸 Withdrawal: ${data.results[0].cash_available_for_withdrawal} USD`);
                await interaction.editReply({ embeds: [embed] });            


                break;
            ///\
            case 'd':
                //_[DEAD] Dead Glue Code from Sapphire, only here for test casing.
                //                          const store = this.container.stores.get(name);
                //                          timer.start();
                //[DEAD]_                          await store.loadAll();
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
