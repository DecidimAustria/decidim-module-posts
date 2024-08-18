module Decidim
  module Posts
    class Question < Feeds::ApplicationRecord
      include Decidim::TranslatableResource
      include Decidim::TranslatableAttributes

      belongs_to :post, class_name: "Decidim::Posts::Post", foreign_key: "decidim_feeds_post_id"
      has_many :answers, class_name: "Decidim::Posts::Answer", dependent: :destroy, foreign_key: "decidim_feeds_question_id"
      # accepts_nested_attributes_for :answers, allow_destroy: true

      enum question_type: { single_choice: 0, multiple_choice: 1 }

      translatable_fields :title

    end
  end
end
