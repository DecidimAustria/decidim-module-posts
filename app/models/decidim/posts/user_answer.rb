module Decidim
  module Posts
    class UserAnswer < Feeds::ApplicationRecord
      belongs_to :decidim_posts_answer, class_name: 'Decidim::Posts::Answer', foreign_key: "decidim_posts_answer_id"
      belongs_to :decidim_user, class_name: 'Decidim::User', foreign_key: "decidim_user_id"

      # validate combination of user and answer
      validates :decidim_user_id, uniqueness: { scope: :decidim_posts_answer_id }
    end
  end
end
