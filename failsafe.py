import discord
import datetime
from discord.ext import commands
from discord.ext.commands import Bot
import asyncio
import time


Client = discord.Client()
client = commands.Bot(command_prefix="<@391023589463162880> ")

banned_word_list_global = ["NIGGER", "NIGER", "NIGGAR", "NEGER"]
adminroleidlist = ["372163580361179138", "381585370074054658", "372551153809883167"]

dobbyuserid = "391023589463162880"

def each_in_x_in_y(x, y):
    for each in x:
        if each.upper() in y.upper():
            return True
def isadminrole(rolelist, adminroleidlist):
    for each in rolelist:
        if each.id in adminroleidlist:
            return True
def get_channel(server_channels, channel_name):
    for each in server_channels:
        if each.name.upper() == channel_name.upper():
            return each
def makeroleembed(title):
    roleEmbedTitle = title
    roleEmbed = discord.Embed(title=roleEmbedTitle, colour=0xff1d25, description="===================================\nClick the <:check:388402362735394828> to assign yourself the role, or hit the <:xmark:388402335501647875> to remove it.")
    return roleEmbed

#bot logging on / setting game and status

@client.event
async def on_ready():
    print("Connected to Discord API.")
    print("Connected to " + client.user.name + " client.")
    print("User ID: " + client.user.id + ".")
    await client.change_presence(game=discord.Game(name="@Failsafe help"), status=discord.Status.dnd, afk=False)

#autoroles on member join

def get_role(rolelist, target):
    for each in rolelist:
        if each.name.upper() == target.upper():
            return each

@client.event
async def on_member_join(member):
    try:
        await client.add_roles(member, get_role(client.get_server(member.server.id).roles, "Walker"))
    except discord.errors.Forbidden:
        pass

#leave/join messages

#registernig a user with speedrun.com

def checkforvalid(sr):
    try:
        apiheader = {"X-API-Key": sr}
        response = requests.get("https://www.speedrun.com/api/v1/profile", headers=apiheader)
        response_json = response.json()
        final = response_json["data"]["names"]["international"]
        print("Your username is " + final)
        return final
    except:
        return False

@client.event
async def on_message(message):
    if message.content.upper().startswith("<@391023589463162880> REGISTER"):
        if not message.channel.is_private:
            await client.delete_message(message)
            await client.send_message(message.channel, "You have been sent a DM with instructions :check:")
        else:
            listthing = message.content.split(" ")
            APIKEY = listthing[2]
            print(APIKEY)
            response = checkforvalid(APIKEY)
            if response != False:
                await client.send_message(message.channel, "Success! The account " + response + " was linked to your Discord account.")
            else:
                await client.send_message(message.channel, "Your supplied API Key was invalid.")

#help

    if message.content.upper().startswith("<@391023589463162880> HELP"):
        helpembed = discord.Embed(title="Failsafe v0.1.3", colour=0xff1d25)
        helpembed.add_field(name="Page 1 of 4 -  Commands",
                            value="===============================\n**Register your speedrun.com account**\n*@Failsafe register "
                                  "\n****\nRefreshes your roles and stats.\n\n"
                                  "**!dobbyunregister**\nRemoves all user data from DobbyBot.\n\n**!dobbyoptout <pc/ps4/xbox>**\nRemoves one of your LFG roles assigned to your upon registration.\n\n"
                                  "**!dobbyoptin <pc/ps4/xbox>**\nAssigns you an LFG role you previously opted out of.\n\n**!dobbyprefer <pc/ps4/xbox>**\nChanges your platform preference and refreshes your stats with the new ones.")
        helpembed.set_thumbnail(url="https://i.imgur.com/ZBOT6zo.png")
        helpembed.set_footer(text="DobbyBot by High Skill Destiny", icon_url="https://i.imgur.com/0yW77NT.png")
        helpmsg = await client.send_message(message.channel, embed=helpembed)
        await client.add_reaction(helpmsg, emoji="419724110915043328")
        await client.add_reaction(helpmsg, emoji="419724670351441920")
        await client.add_reaction(helpmsg, emoji="419724687376121856")
        await client.add_reaction(helpmsg, emoji="419724701779361803")
        await client.add_reaction(helpmsg, emoji="419724722318737409")
        await client.add_reaction(helpmsg, emoji="419724776593162241")
        await client.add_reaction(helpmsg, emoji="x")
        counter = 0
        for x in range(1, 180):
            rea = await client.wait_for_reaction(timeout=1, user=message.author)
            if rea is not None:
                if rea.reaction.emoji == "▶":
                    await client.remove_reaction(helpmsg, emoji="▶", member=message.author)
                    counter += 1
                    if counter >= 4:
                        counter = 0
                if rea.reaction.emoji == "🇽":
                    break
                if rea.reaction.emoji == "◀":
                    await client.remove_reaction(helpmsg, emoji="◀", member=message.author)
                    counter -= 1
                    if counter <= -1:
                        counter = 3
                if counter == 0:
                    helpembed = discord.Embed(title="DobbyBot v2.0 - Commands", colour=0xff1d25)
                    helpembed.add_field(name="Page 1 of 4 - Destiny Commands",
                                        value="==========================\n**!dobbyregister <pc/ps4/xbox>**\nStarts the D2 account sync "
                                              "process for your preferred platform.\n\n**!dobbyrefresh**\nRefreshes your roles and stats.\n\n"
                                              "**!dobbyunregister**\nRemoves all user data from DobbyBot.\n\n**!dobbyoptout <pc/ps4/xbox>**\nRemoves one of your LFG roles assigned to your upon registration.\n\n"
                                              "**!dobbyoptin <pc/ps4/xbox>**\nAssigns you an LFG role you previously opted out of.\n\n**!dobbyprefer <pc/ps4/xbox>**\nChanges your platform preference and refreshes your stats with the new ones.")
                    helpembed.set_thumbnail(url="https://i.imgur.com/ZBOT6zo.png")
                    helpembed.set_footer(text="DobbyBot by High Skill Destiny",
                                         icon_url="https://i.imgur.com/0yW77NT.png")
                    await client.edit_message(helpmsg, embed=None)
                    await client.edit_message(helpmsg, embed=helpembed)
                elif counter == 1:
                    helpembed = discord.Embed(title="DobbyBot v2.0 - Commands", colour=0xff1d25)
                    helpembed.add_field(name="Page 2 of 4 - General Commands",
                                        value="==========================\n**!dobbyhelp**\nYou're using this command!\n\n**!dobbymembers**\nDisplays a breakdown of server members.\n\n**!dobbyuptime**\nShows how long I've been up and running for.\n\n**!dobbyinfo @user**\nDisplays some info about the specified member. Extra information is provided if they are registered with me.\n\n**!dobbycredits**\nLists some of the wonderful people who have helped create DobbyBot.")
                    helpembed.set_thumbnail(url="https://i.imgur.com/ZBOT6zo.png")
                    helpembed.set_footer(text="DobbyBot by High Skill Destiny",
                                         icon_url="https://i.imgur.com/0yW77NT.png")
                    await client.edit_message(helpmsg, embed=None)
                    await client.edit_message(helpmsg, embed=helpembed)
                elif counter == 2:
                    helpembed = discord.Embed(title="DobbyBot v2.0 - Commands", colour=0xff1d25)
                    helpembed.add_field(name="Page 3 of 4 - Moderator Commands",
                                        value="==========================\n**!dobbyevent ^Title ^Activity ^Date ^Time ^Server ^Description**\nCreates an event embed based on information you supply. Don't forget the ^ to separate!\n\n**!dobbypurge <amount>**\nPurges a specified amount of messages from the channel in which the message was created in.\n\n**!dobbyspawnall**\n Creates the role assigners. Keep in mind that since DobbyBot v2.0, the role assigner channel gets re-populated upon startup.")
                    helpembed.set_thumbnail(url="https://i.imgur.com/ZBOT6zo.png")
                    helpembed.set_footer(text="DobbyBot by High Skill Destiny",
                                         icon_url="https://i.imgur.com/0yW77NT.png")
                    await client.edit_message(helpmsg, embed=None)
                    await client.edit_message(helpmsg, embed=helpembed)
                elif counter == 3:
                    helpembed = discord.Embed(title="DobbyBot v2.0 - Commands", colour=0xff1d25)
                    helpembed.add_field(name="Page 4 of 4 - Quote Commands",
                                        value="==========================\n**!quote add <quote>**\nAdds a quote to the server list. You must be a Quote Mod for this to work.\n\n**!quote remove <ID>**\nRemoves a quote with the specified ID. Requires Quote Mod.\n\n**!quote list**\nRequires Quote Mod. Lists all quotes on the server.\n\n**!quote read <random/ID>**\nReads a specified or random quote. Anyone can use this one.")
                    helpembed.set_thumbnail(url="https://i.imgur.com/ZBOT6zo.png")
                    helpembed.set_footer(text="DobbyBot by High Skill Destiny",
                                         icon_url="https://i.imgur.com/0yW77NT.png")
                    await client.edit_message(helpmsg, embed=None)
                    await client.edit_message(helpmsg, embed=helpembed)
        await client.delete_message(message)
        await client.delete_message(helpmsg)

#global banned words

    if each_in_x_in_y(banned_word_list_global, message.content) and not isadminrole(message.author.roles, adminroleidlist):
        await client.delete_message(message)

#lfg autoroles

    if message.content.upper() == '<@391023589463162880> SPAWNALL':
        if isadminrole(message.author.roles, adminroleidlist):
            await client.delete_message(message)
            await client.send_message(message.channel, "**_Looking For Group (LFG) Roles._**")
            await asyncio.sleep(1)
            await client.send_message(message.channel, "!spawnxbox")
            await asyncio.sleep(1)
            await client.send_message(message.channel, "!spawnpc")
            await asyncio.sleep(1)
            await client.send_message(message.channel, "!spawnps4")

    if message.content.upper() == '!SPAWNXBOX' and message.author.id == dobbyuserid:
        roleEmbed = makeroleembed("Xbox")
        roleEmbed.set_thumbnail(url="https://cdn2.iconfinder.com/data/icons/metro-uinvert-dock/256/XBox_360.png")
        await client.delete_message(message)
        msg = await client.send_message(message.channel, embed=roleEmbed)
        await client.add_reaction(msg, discord.utils.get(client.get_all_emojis(), id='388402362735394828'))
        await asyncio.sleep(2)
        await client.add_reaction(msg, discord.utils.get(client.get_all_emojis(), id='388402335501647875'))
        await asyncio.sleep(2)
        while True:
            res = await client.wait_for_reaction([discord.utils.get(client.get_all_emojis(), id='388402362735394828'),
                                                 discord.utils.get(client.get_all_emojis(), id='388402335501647875')],
                                                 message=msg)
            if res.reaction.emoji == discord.utils.get(client.get_all_emojis(), id='388402362735394828'):
                await client.remove_reaction(msg, discord.utils.get(client.get_all_emojis(), id='388402362735394828'),
                                             res.user)  #removes the useradded join pvp reaction
                await asyncio.sleep(0.1)
                await client.add_roles(res.user, get_role(msg.server.roles, "Xbox"))
                await asyncio.sleep(0.1)
                await client.send_message(res.user, "Added **Xbox** <:check:388402362735394828>")
            if res.reaction.emoji == discord.utils.get(client.get_all_emojis(), id='388402335501647875'):
                await client.remove_reaction(msg, discord.utils.get(client.get_all_emojis(), id='388402335501647875'),
                                             res.user)  #removes the useradded join pvp reaction
                await asyncio.sleep(0.1)
                await client.remove_roles(res.user, get_role(msg.server.roles, "Xbox"))
                await asyncio.sleep(0.1)
                await client.send_message(res.user, "Removed **Xbox** <:xmark:388402335501647875>")
    if message.content.upper() == '!SPAWNPC' and message.author.id == dobbyuserid:
        roleEmbed = makeroleembed("PC")
        roleEmbed.set_thumbnail(url="http://upload2.inven.co.kr/upload/2016/12/28/per/i13407358112.png")
        await client.delete_message(message)
        msg = await client.send_message(message.channel, embed=roleEmbed)
        await client.add_reaction(msg, emoji=discord.utils.get(client.get_all_emojis(), id='388402362735394828'))
        await asyncio.sleep(2)
        await client.add_reaction(msg, discord.utils.get(client.get_all_emojis(), id='388402335501647875'))
        await asyncio.sleep(2)
        while True:
            res = await client.wait_for_reaction([discord.utils.get(client.get_all_emojis(), id='388402362735394828'),
                                                 discord.utils.get(client.get_all_emojis(), id='388402335501647875')],
                                                 message=msg)
            if res.reaction.emoji == discord.utils.get(client.get_all_emojis(), id='388402362735394828'):
                await client.remove_reaction(msg, discord.utils.get(client.get_all_emojis(), id='388402362735394828'),
                                             res.user)  #removes the useradded join pvp reaction
                await asyncio.sleep(0.1)
                await client.add_roles(res.user, get_role(msg.server.roles, "PC"))
                await asyncio.sleep(0.1)
                await client.send_message(res.user, "Added **PC** <:check:388402362735394828>")
            if res.reaction.emoji == discord.utils.get(client.get_all_emojis(), id='388402335501647875'):
                await client.remove_reaction(msg, discord.utils.get(client.get_all_emojis(), id='388402335501647875'),
                                             res.user)  #removes the useradded join pvp reaction
                await asyncio.sleep(0.1)
                await client.remove_roles(res.user, get_role(msg.server.roles, "PC"))
                await asyncio.sleep(0.1)
                await client.send_message(res.user, "Removed **PC** <:xmark:388402335501647875>")
    if message.content.upper() == '!SPAWNPS4' and message.author.id == dobbyuserid:
        roleEmbed = makeroleembed("PS4")
        roleEmbed.set_thumbnail(url="http://pluspng.com/img-png/playstation-png-png-file-name-playstation-512.png")
        await client.delete_message(message)
        msg = await client.send_message(message.channel, embed=roleEmbed)
        await client.add_reaction(msg, discord.utils.get(client.get_all_emojis(), id='388402362735394828'))
        await asyncio.sleep(2)
        await client.add_reaction(msg, discord.utils.get(client.get_all_emojis(), id='388402335501647875'))
        await asyncio.sleep(2)
        while True:
            res = await client.wait_for_reaction([discord.utils.get(client.get_all_emojis(), id='388402362735394828'),
                                                 discord.utils.get(client.get_all_emojis(), id='388402335501647875')],
                                                 message=msg)
            if res.reaction.emoji == discord.utils.get(client.get_all_emojis(), id='388402362735394828'):
                await client.remove_reaction(msg, discord.utils.get(client.get_all_emojis(), id='388402362735394828'),
                                             res.user)  #removes the useradded join pvp reaction
                await asyncio.sleep(0.1)
                await client.add_roles(res.user, get_role(msg.server.roles, "Playstation"))
                await asyncio.sleep(0.1)
                await client.send_message(res.user, "Added *Playstation** <:check:388402362735394828>")
            if res.reaction.emoji == discord.utils.get(client.get_all_emojis(), id='388402335501647875'):
                await client.remove_reaction(msg, discord.utils.get(client.get_all_emojis(), id='388402335501647875'),
                                             res.user)  #removes the useradded join pvp reaction
                await asyncio.sleep(0.1)
                await client.remove_roles(res.user, get_role(msg.server.roles, "Playstation"))
                await asyncio.sleep(0.1)
                await client.send_message(res.user, "Removed **Playstation** <:xmark:388402335501647875>")

#token

client.run("")
