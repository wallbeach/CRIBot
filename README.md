# CRIBot
**Crypto Rebalancing Index Bot (CRIBot) is designed as the name describes as an index fund with an integrated treshold rebalancing strategy.**

**It is designed as an equal weighted portfolio of the top crypto currencies by market cap..**

### Coin Selection Range
CRIBot let’s you define in which coin it will invest. You can either create a large cap index by using the top 10 assets by market cap (rank 1–10) or a mid cap index with a coins ranked from 10 to 30. It’s totally up to you what you select.
If a coin falls out of this selection it will automatically be replaced by the coin overtaking it in market cap to maintain the desired coin allocation.
As we don’t want to invest in stable coins or some other unwanted coins, we can specify those in the settings as well.
Please be aware that the bot can only invest im coins listed on crypto.com exchange. If a selected coin is not available it will automatically be replaced by the next coin according to market cap.

### Equal Weights
In an equal weighted index every coin is allocated the same percentage of the portfolio. If there are 10 coins in the portfolio, each will receive 10% of the total value of the portfolio. If there are 20 coins, each will receive 5%.

### Rebalancing
The bot uses a treshold strategy to maintain an equaly weighted portfolio. As soon as a coin deviates more than a certain percentage from the desired allocation it will be rebalanced. Coins which are over allocation will be sold, coins under allocation will be bougth.

### Dollar cost average investing
On top of that, the bot offers a possibility to dollar cost average (DCA) invest your money. You can specify until which day of the month (eg. every 25th) your USDT should be invested and how many DCA intervalls there should be daily. The bot will then automatically divide the USDT amount into equal parts which will then be invested.

## Requirements

### Crypto.com exchange
The bot is based on crypto.com exchange. In order to run the bot you need a trading account for which you can sign up here: https://crypto.com/exch/vk3ymp3msw

### NodeJS
The bot is running on NodeJS and it is presumed you will want to run it with a process manager such as PM2, to automatically restart it in case of failure and keep it running when you detach from the terminal session. The following steps will make sure you have all prerequisits installed and the repository downloaded.
##### Install NodeJS
Both the bot itself as well as the process manager will be run on NodeJS. You can install NodeJS with `apt-get install nodejs`.

After NodeJS is installed, check the version with `node -v`. The required minimum version is 14. If the version shown is lower than that, you can upgrade it by executing the following command:

`curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -`

After you have done that, you can install the new NodeJS version by executing `apt-get install nodejs` again.
##### Install NPM
The Node Package Manager (NPM) is required to install package requirements for the bot and can be installed with `apt-get install npm`, if it has no been installed already.
##### Install PM2
PM2 is a process manager that will keep your bot running as well as restart it after failure. It can be installed with `npm install pm2 -g`.
##### Install Git
Git will be used to clone the repository and keep the bot up to date. You can install it with `apt-get install git`.

## Setup
We now need to download and compile the source code and install the package requirements. The following steps will lead you through that process.
##### Clone CRIBot
Navigate to the folder you want CRIBot to be located in. Then run `git clone https://github.com/wallbeach/CRIBot.git` to clone the repository.
##### Compile the Bot
Navigate into the bot folder and run `sh install.sh` to download all package requirements and compile the source code. You will be asked to give this bot a unique name, so the process manager can tell them apart, in case you want to run more than one.

## Configuration
To configure the bot, open the `config.ts` file with your favorite file editor and you should see the following list of configuration options.

| Option                     | Type     | Description
| -------------------------- | -------- | ---
| apiKey                     | string   | The API key from the crypto.com exchange.
| apiSecret                  | string   | The secret key from the crypto.com exchange.
| exclStableCoins            | string[] | A list of stable coins to never invest in or rebalance, even if they are within the market cap.
| exclCoins                  | string[] | A list of coins to never invest in or rebalance, even if they are within the market cap.
| inclCoins                  | string[] | A list of coins to always invest in and rebalance, even if they are not within the market cap.
| rebalInterval              | number   | Rebalances per day (min. 1, max 24) eg. 6 would mean the bot rebalances every 4 hours
| rebalTreshold              | number   | The threshold in percent that a coin's value can deviate from the average before being rebalanced.
| dcaUseMoney                | number   | The day of the month until the usdt holdings should be invested by DCA. The bot will split the investings in equal portions in order to be fully invested by that date
| mcFrom                     | number   | Market cap rank starting    
| mcTo                       | number   | Market cap rank ending eg. mcFrom = 1 and mcTo = 10 would invest into the top 10 coins by market cap    

## Starting, Restarting and Stopping
You can easily start, restart and stop the bot by executing the corresponding scripts, either with `sh start.sh`, `sh restart.sh` or `sh stop.sh`.

## Monitoring and Logs
To monitor your currently running bot, enter `pm2 monit` and select it with the arrow keys in the list on the left.
If you would like to check the log files, you can usually find them under `/root/.pm2/logs/` or you can check the latest log lines with `pm2 logs <BotName>`. For more PM2 commands, visit the [Quick Start Page](https://pm2.keymetrics.io/docs/usage/quick-start/).

## Updating the Bot
To update the bot to the newest version, execute `sh update.sh`. This will also automatically restart your bot after the update. Your current configuration will remain the same.
