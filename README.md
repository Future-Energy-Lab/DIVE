<p align="center">
  <a href="https://www.energyweb.org" target="blank"><img src="./images/EW.png" width="120" alt="Energy Web Foundation Logo" /></a>
</p>

# dena-dive-use-case

## Description

Service for connecting and certifying energy flow

dena-dive-use-case is a component of the [Energy Web Decentralized Operating System](#ew-dos)

### Requirements

Before installing, download and install Node.js. Node.js 21 or higher is required.

Installation is done using the following commands:

```sh
$ yarn install
```

## Build

```sh
$ yarn build
```

## Run

```sh
$ yarn start
```

## Docker

Instructions how to run app with Docker.

```
docker run --rm -p 8000:8000 dena-dive-use-case
```

Build docker image:

```
docker build --tag dena-dive-use-case -f Dockerfile .
```

### Integration Tests

Integration tests require to setup the external components.
Run `make setup` to setup the database and the rabbit mq docker containers.
Use the link `http://localhost:15672` to login to management console of rabbit mq with default credentials username and password `guest`. Create an exchange and a queue and bind them using the queue name as a routing key.
Then run:

```sh
$ yarn run test
```

For more details, visit the [installation guide](//LINK TO READ THE DOCS INSTALL PAGE)

## Documentation

## Contributing Guidelines

See [contributing.md](./contributing.md)

## Questions and Support

For questions and support please use Energy Web's [Discord channel](https://discord.com/channels/706103009205288990/843970822254362664)

Or reach out to our contributing team members

- TeamMember: email address@energyweb.org

# EW-DOS

The Energy Web Decentralized Operating System is a blockchain-based, multi-layer digital infrastructure.

The purpose of EW-DOS is to develop and deploy an open and decentralized digital operating system for the energy sector in support of a low-carbon, customer-centric energy future.

We develop blockchain technology, full-stack applications and middleware packages that facilitate participation of Distributed Energy Resources on the grid and create open market places for transparent and efficient renewable energy trading.

- To learn more about the EW-DOS tech stack, see our [documentation](https://app.gitbook.com/@energy-web-foundation/s/energy-web/).

- For an overview of the energy-sector challenges our use cases address, go [here](https://app.gitbook.com/@energy-web-foundation/s/energy-web/our-mission).

For a deep-dive into the motivation and methodology behind our technical solutions, we encourage you to read our White Papers:

- [Energy Web White Paper on Vision and Purpose](https://www.energyweb.org/reports/EWDOS-Vision-Purpose/)
- [Energy Web White Paper on Technology Detail](https://www.energyweb.org/wp-content/uploads/2020/06/EnergyWeb-EWDOS-PART2-TechnologyDetail-202006-vFinal.pdf)

## Connect with Energy Web

- [Twitter](https://twitter.com/energywebx)
- [Discord](https://discord.com/channels/706103009205288990/843970822254362664)
- [Telegram](https://t.me/energyweb)

## License

This project is licensed under the GNU General Public License v3.0 or later - see the [LICENSE](LICENSE) file for details
