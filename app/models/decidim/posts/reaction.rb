# frozen_string_literal: true

module Decidim
  module Posts
    class Reaction < ApplicationRecord
      include Decidim::Authorable

      belongs_to :resource, polymorphic: true, counter_cache: true#, touch: true
      belongs_to :reaction_type, class_name: "Decidim::Posts::ReactionType"

      validates :reaction_type, presence: true

      def self.reaction_types
        Decidim::Posts::ReactionType.all
      end

      def organization
        resource&.component&.organization
      end
    end
  end
end
