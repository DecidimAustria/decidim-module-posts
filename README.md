# Decidim::Posts component (under development)

This Feeds component adds social posts functionality to Decidim.

**The module is currently in development and not yet ready.**

## Usage

Feeds will be available as a Component for a Participatory
Space.

## Installation

Add this line to your application's Gemfile:

```ruby
gem "decidim-posts", git: "https://github.com/DecidimAustria/decidim-module-posts.git", branch: "main"
```

And then execute:

```bash
bundle
bundle exec rails decidim_posts:install:migrations
bundle exec rails db:migrate
```

## Contributing

Contributions are welcome !

We expect the contributions to follow the [Decidim's contribution guide](https://github.com/decidim/decidim/blob/develop/CONTRIBUTING.adoc).

## Security

Security is very important to us. If you have any issue regarding security, please disclose the information responsibly by sending an email to __security [at] mitgestalten [dot] jetzt__ and not by creating a Github issue.

## License

This engine is distributed under the GNU AFFERO GENERAL PUBLIC LICENSE.
