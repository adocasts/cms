![Adocasts](https://github.com/adocasts/.github/blob/main/assets/brand-banner-rounded.png?raw=true)

Adocasts provides education lessons, screencasts, and livestreams on AdonisJS, NodeJS, JavaScript, and more. We have a vast library of free lessons and resources that expands weekly to help get you up and running with AdonisJS. 

Get even more by joining [Adocasts Plus](https://adocasts.com/pricing)

📚 Ready to learn? [Check out adocasts.com](https://adocasts.com)  
🎉 New lessons every week!

---
[![YouTube Badge](https://img.shields.io/youtube/channel/subscribers/UCTEKX3KQAJi7_0-_rSz0Edg?logo=YouTube&style=for-the-badge)](https://youtube.com/adocasts)
[![Twitter Badge](https://img.shields.io/twitter/follow/adocasts?logo=twitter&logoColor=white&style=for-the-badge)](https://twitter.com/adocasts)
[![Twitch Badge](https://img.shields.io/twitch/status/adocasts?logo=twitch&logoColor=white&style=for-the-badge)](https://twitch.tv/adocasts)

___

### Before We Start
To simplify session management, email verification, and similar logic, 
the Adocasts CMS only offers limited authentication functionality. To register a new user, please clone down the [Adocasts](https://github.com/adocasts/adocasts) project which contains the full suite of authentication functionalities.

### Prerequisites
* **PostgreSQL** &mdash; We use PostgreSQL as our database driver so you'll either want it installed on your machine or a service that provides it.
* **SMTP Provider** &mdash; Locally, we like to use MailTrap
* **Redis Server** &mdash; We now require a Redis connection via [Bentocache](https://bentocache.dev/docs/introduction)
* **Node v20.6+** &mdash; Recommended

### Installation
1. Clone the repository
```sh
git clone https://github.com/adocasts/cms.git
```
2. Install NPM packages
```sh
npm i
```
3. Duplicate `.env.example` and rename `.env`
4. Fill out the `.env` variables

### Data
We provide a `StarterSeed` that will populate your database with faker data to populate pages on the Adocasts site.

I haven't tested this yet since our migration from AdonisJS 5 to 6. If you run into any problems, feel free to open an issue.

1. Migrate your database
```sh
node ace migration:run
```
2. _(Optional)_ If you'd like to start fresh (without faker data), open our `StarterSeed` at `database/seeders/StarterSeed.ts` and comment out the `seedUsersAndContent()` call within the run method.
```ts
public async run() {
  const trx = await db.transaction()
  
  try {
    await this.seedRoles(trx)

    if (!app.inTest) {
      // await this.seedUsersAndContent(trx)
    }

    await trx.commit()
  } catch (error) {
    await trx.rollback()
    console.log({ error })
  }
}
```
3. Seed our faker data
```sh
node ace db:seed
```
