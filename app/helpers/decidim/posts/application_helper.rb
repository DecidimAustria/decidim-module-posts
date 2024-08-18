# frozen_string_literal: true

module Decidim
  module Posts
    # Custom helpers, scoped to the feeds engine.
    #
    module ApplicationHelper
      include PaginateHelper
      include SanitizeHelper
      # include Decidim::Posts::PostsHelper
      include ::Decidim::EndorsableHelper
      include ::Decidim::FollowableHelper
      include Decidim::Comments::CommentsHelper
    end
  end
end
