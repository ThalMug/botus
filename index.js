const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
require('dotenv').config();

client.login(process.env.token);


function add_score(json_data,number,ID){
    json_data[ID].score.push(number);
    const data = JSON.stringify(json_data);
    fs.writeFileSync('infos.json',data);   
}

function open_json(){
    let user = fs.readFileSync('infos.json');
    user = JSON.parse(user.toString());
    return user;
}

function add_user(json_data,author){
    let id = author.id;
    let username = author.username;
    json_data[id] = {};
    json_data[id].discordusr = username;
    json_data[id].score = [];
    const data = JSON.stringify(json_data);
    fs.writeFileSync('infos.json',data); 
}


client.on('message',async message => {
    
    if(!message.author.bot && message.content[0] == '_'){
        
        let json_data = await open_json();

        if(message.content.startsWith('_monscore')){
            let score = json_data[message.author.id].score;
            let mean = 0;
            score.forEach(e => {
                mean += e;
            });
            mean /= score.length;
            message.reply(":red_circle: Ton score moyen au SUTOM est : "+ mean.toFixed(2) + " (je suis Thierry Beccaro)");
        }
        else if(message.content.startsWith('_ajouterscore')){
            let num = parseInt(message.content.substring(14));
            add_score(json_data,num,message.author.id);
        }
        else if(message.content.startsWith('_ajouternom')){
            add_user(json_data,message.author);
            message.reply("joins the battle !");
        }
        else if(message.content.startsWith('_help')){
            message.reply("Mes commandes sont :\n- _leaderboard pour avoir le ranking du SUTOM\n- _add [en cours de construction]");
        }
    }
});

