# frozen_string_literal: true

require "decidim/core"
# require "decidim/posts/menu"

module Decidim
  module Posts
    # This is the engine that runs on the public interface of `Posts`.
    class AdminEngine < ::Rails::Engine
      isolate_namespace Decidim::Posts::Admin

      paths["db/migrate"] = nil
      paths["lib/tasks"] = nil

      routes do
        resources :posts
        root to: "posts#index"
      end

      def load_seed
        nil
      end
    end
  end
end
