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

function moyenne(score){
    let mean = 0;
    score.forEach(e => {
        mean += e;
    });
    mean /= score.length;
    return mean;
}


client.on('message',async message => {
    
    if(!message.author.bot && message.content[0] == '_'){
        
        let json_data = await open_json();

        if(message.content.startsWith('_monscore')){
            let score = json_data[message.author.id].score;
            let mean = moyenne(score);
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
        else if(message.content.startsWith('_leaderboard')){
            let score_tab = [];
            let keys = Object.keys(json_data);
            for(var i = 0;i<keys.length;i++){
                score_tab.push({
                    "pseudo":json_data[keys[i]].discordusr,
                    "moyenne":moyenne(json_data[keys[i]].score)
                })
            }
            score_tab.sort(function compare(a, b) {
                if (a.moyenne < b.moyenne)
                   return -1;
                if (a.moyenne > b.moyenne)
                   return 1;
                return 0;
              });
            let string = ":red_circle:\nLe classement du SUTOM est le suivant :\n\n";
            for(i = 0;i<keys.length;i++){
                string = string + (i+1) + ". " + score_tab[i].pseudo + " ("+score_tab[i].moyenne.toFixed(2) + " pts)" + ".\n";
            }
            message.reply(string);
        }
        else if(message.content.startsWith('_help')){
            message.reply("Le préfixe utilisé est '_'. \n\nLes différentes commandes sont :\n:red_circle:monscore (pour voir vos points moyens)\n:red_circle:ajouterscore (pour ajouter un point au classement)\n:red_circle:ajouternom (pour vous inscrire si vous n'êtes pas inscrits)\n:red_circle:leaderboard (pour avoir le classement)\n");
        }
    }
});

