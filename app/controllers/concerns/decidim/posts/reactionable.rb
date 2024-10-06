# frozen_string_literal: true

module Decidim
  # This concern contains the logic related with resources that can be reacted to.
  # Thus, it is expected to be included into a resource that is wanted to be reactionable.
  # This resource will have many `Decidim::Posts::Reactions.
  module Posts
    module Reactionable
      extend ActiveSupport::Concern

      included do
        has_many :reactions,
                as: :resource,
                dependent: :destroy,
                counter_cache: "reactions_count"

        # Public: Check if the user has reacted to the resource.
        # - user_group: may be nil if user is not representing any user_group.
        #
        # Returns Boolean.
        def reacted_by?(user, user_group = nil)
          if user_group
            reactions.where(user_group:).any?
          else
            reactions.where(author: user, user_group: 0).any?
          end
        end
      end
    end
  end
end