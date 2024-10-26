# frozen_string_literal: true

$LOAD_PATH.push File.expand_path("lib", __dir__)

require "decidim/posts/version"

Gem::Specification.new do |s|
  s.version = Decidim::Posts::VERSION
  s.authors = ["Alexander Rusa", "Piero Chiussi"]
  s.email = ["alex@rusa.at", "info@webchroma.de"]
  s.license = "AGPL-3.0"
  s.homepage = "https://github.com/DecidimAustria/decidim-module-posts/"
  s.metadata = {
    "bug_tracker_uri" => "https://github.com/DecidimAustria/decidim-module-posts/issues",
    "source_code_uri" => "https://github.com/DecidimAustria/decidim-module-posts/"
  }
  s.required_ruby_version = ">= 3.1"

  s.name = "decidim-posts"
  s.summary = "A social posts decidim component"
  s.description = "Social posts component for Decidim that should be used in combination with decidim-feeds."

  s.files = Dir["{app,config,lib}/**/*", "LICENSE-AGPLv3.txt", "Rakefile", "README.md"]

  s.add_dependency "decidim-core", Decidim::Posts::COMPAT_DECIDIM_VERSION
end
