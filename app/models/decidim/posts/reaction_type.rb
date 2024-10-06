# frozen_string_literal: true

module Decidim
  module Posts
    # A reaction type for posts.
    class ReactionType < Decidim::ApplicationRecord
      has_many :reactions, dependent: :destroy

      validates :name, presence: true, uniqueness: true
      validates :icon_name, presence: true
    end
  end
end