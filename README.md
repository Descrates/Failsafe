# Failsafe
Failsafe is a Discord Bot made by M4V3R1C8 and Descrates. Link to our server: https://discord.gg/vvWW29c

# How to add Failsafe to your server
Step 1: Use this site to get the link: https://failsafebot.wixsite.com/failsafe

Step 2: Click the link and hit "Authorize" 

Step 3: Done!

(Note: The bot has all permissions except "Administrator" so it can be easily confined to certain channels. 

# Features

`- All commands will be prefixed by ‘s!’ to avoid interfering with other bots.`
`- Our currency is ‘Glimmer’`

_**General Commands**_

`s!purge:`

Usage:
*s!purge @user*

- Deletes 50 messages from the specified user.
(Note: this command is only for Admin use)

`s!dailies:`

Usage:
*s!dailies*

- Can be called only once per 24 hours, rewards the user with 200 Glimmer

`s!glimmer`

Usage
*s!glimmer* or *s!glimmer @user*

- Displays how much Glimmer a user has on their account.

`s!wr:`

Usage:
*!wr <sub-category> <leaderboard>*
*(Example: s!wr Destiny NG+)

- Displays a table of data fetched from speedrun.com of a leaderboard the bot messages in chat.

`s!level:`

Usage:
*s!level* or *s!level @user*

- Displays the specified user's level

`s!clear:`

Usage:
'*!clear* or *s!clear @user*

-  Deletes 200 messages from the specified user. If no user is specified, the bot will delete 200 messages from everyone.
(Note: this command is only for Admin use.)

`s!help`

Usage:
*s!help*

- Displays a help document, filled with information about our bot.
`s!nuke`

Usage:
*s!nuke*

- Removes as many messages as possible from the specified channel
(Note: this command is only for Admin use.)

`s!top`

Usage:
*s!top <level> or <glimmer> <3, 5, 10, 25>*

- This will display a leaderboard of people in the server based on a variable given when you call the command.

`s!give`

Usage: 
*s!give @user <amount>*

- This command is used to gift any user any amount of Glimmer from your account. If you have enough Glimmer in your account to satisfy the amount, it will be subtracted from your account and added to the account of the user specified. 

`s!website`

Usage:
*s!website*

- Displays failsafebot.com, https://failsafebot.wixsite.com/failsafe

_**Gambling**_

`s!war:`

*Usage:*
*!war <amount>* and *s!war @user <amount>*

- This command works just like the card game:

- user1 messages `s!war <amount>`
- user2 messages `s!war @user1 <amount>`
- Both Glimmer bets are added together into a prize pool
- The bot then runs a 50/50 randomization of both players and the winner will be granted the prize pool total, the loser gets nothing.

`Solo user gambling: s!wheel`

Usage:
*s!wheel <bet>*

- When s!wheel is called, an array of 8 emojis in a square pattern are posted, with one emoji in the middle. Using \ | / and -, an animation will be created by constantly editing the message. Each emoji has a different value (positive or negative), which are calculated via percentages, so the more you bet, the more you could win.

Emoji Values and Percentages:
:grapes: - `neutral, 35% chance to hit, grants the same amount of glimmer you had back to you.`
:dolphin: -`positive, 25% chance to hit, grants 40% more glimmer.`
:gem: - `positive, 10% chance to hit, grants 80% more glimmer.`
:zzz: - `negative, 55% chance to hit, takes all the glimmer you bet.`
:hot_pepper: - `negative, 2.5% chance to hit, removes all the glimmer you bet, and 200 more.`
:seven: - `positive, 1% chance to hit, grants 100% more glimmer.`
:green_apple: - `negative, 40% chance to hit, removes all of your bet.`
:dvd: - `positive, 30% chance to hit, grants 15% more glimmer back to you.`
**Sprite:**
:grapes:          :dolphin:         :gem:  

             **\**     **|**    **/**

:zzz:    **--**   :grinning:  **-- **  :dvd: 
            
             **/**     **|**     **\**

:hot_pepper:          :seven:         :green_apple:

Responses:
**User:** “s!wheel <bet>”
**Bot:**
*All edits except last:*
Same emojis, but hand spinning across the wheel (clockwise or counterclockwise, random when the hand will stop).
Last edit:
*Displayed below the wheel sprite:* “@user hit a **<Pepper, Apple, Diamond, etc.>** and lost all their Glimmer/ won **<% based amount>** Glimmer!”
