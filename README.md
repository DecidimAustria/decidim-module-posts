# Decidim::Posts component

This Feeds component adds social posts functionality to Decidim.

## Constraints

**Participatory Space**

Until now this component was only tested with the "feeds" Participatory space, but it should also work within other PS.

**Content Block**

We tried to implement everything as a content block to display the social feed on the start page, but decidim makes it very hard to add actions on content block elements, because at that point you are in the homepage controller and not in your components controller, so everything would have to work with AJAX. Because of that we didn't put much effort into creating the content block. But this can be improved to nicely display a read only version of the latest posts.

## Features

- social posts
- attached images
- comments
- reactions with emojis
- different categories of posts (post, share&care, survey, host/admin)
- simple surveys
- meetings can be  displayed as posts
- Highlighting posts
- Fix posts on top of the feed

## Categories

Posts can be of different categories/types which have individual features.

### post

A normal social post. It contains a body text and you can attach images to it that are then displayed with a kind of simple carousel.

### share&care

This is a category for people to offer things or services within their community or ask for favors or borrowing items.

### survey

You can create a very simple survey that can have multiple single- and multiple-choice questions.

### host/admin

This category is designed for members to have a way to contact the admins/hosts of the platform with issues.

It is then possible for admins to change the status of those issues/posts to:

- Unread
- Processing
- Done

This way people can always see the status of this issue without having to ask multiple times.

### meeting

Meeting is not really a category of post, but it actually displays and creates meetings in a separate decidim-meetings component that has to exist in the same participatory space.

We added some functionality to allow a simplified way of creating new meetings directly within the posts/feed.

## Usage

Posts is a component that can be added to a participatory space. All posts are displayed in a chronological list. They can have a body, attached images, comments and reactions.

Reactions are part of this module and are an alternative to endorsements. The idea is that endorsements are a more official way to support something, but in social feeds you want to be able to react in different ways to posts without endorsing it. You can react with a few selected emojis. Similar to other social media platforms.

## Installation

Add this line to your application's Gemfile:

```ruby
gem "decidim-posts"
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
