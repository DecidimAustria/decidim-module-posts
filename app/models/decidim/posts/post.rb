module Decidim
  module Posts
    class Post < Feeds::ApplicationRecord
      include Decidim::Resourceable
      include Decidim::Authorable
      include Decidim::Reportable
      include Decidim::HasAttachments
      include Decidim::Comments::Commentable
      include Decidim::Searchable
      include Decidim::Endorsable
      include Decidim::TranslatableResource
      include Decidim::TranslatableAttributes
      include Decidim::Fingerprintable
      include Decidim::HasComponent
      include Decidim::FilterableResource
      include Decidim::Posts::Reactionable
      # include Decidim::Loggable
      # include Decidim::DownloadYourData
      # include Decidim::Randomable
      # include Decidim::ScopableResource
      # include Decidim::HasReference
      # include Decidim::HasCategory
      # include Decidim::Followable
      # include Decidim::Traceable
      # include Decidim::NewsletterParticipant

      # belongs_to :organization, class_name: "Decidim::Organization"

      has_many :questions, class_name: "Decidim::Posts::Question", dependent: :destroy, foreign_key: "decidim_posts_post_id"
      # accepts_nested_attributes_for :questions, reject_if: ->(attributes){ attributes['name'].blank? }, allow_destroy: true

      component_manifest_name "posts"

      translatable_fields :body

      fingerprint fields: [:body]

      validates :body, presence: true

      searchable_fields(
        {
          participatory_space: { component: :participatory_space },
          A: :body,
          datetime: :created_at
        },
        index_on_create: true,
        index_on_update: true
      )

      scope :filter_category, ->(category) { where(category: category) if category.present? }

      # Posts don't have a title, but Commentable requires it, so let's extract the first words of each translation of the body
      def title
        truncated_body = {}
        body.each do |locale, translations|
          if locale == "machine_translations"
            truncated_body[locale] = {}
            translations.each do |key, value|
              next if value.class != String
              truncated_body[locale][key] = value.truncate_words(4)
            end
          else
            next if translations.class != String
            truncated_body[locale] = translations.truncate_words(4)
          end
        end
        truncated_body
      end

      def editable_by?(user)
        user == author
      end

      def deleteable_by?(user)
        user == author || user.admin?
      end

      # Public: Overrides the `reported_content_url` Reportable concern method.
      def reported_content_url
        ResourceLocatorPresenter.new(self).url
      end

      # Public: Overrides the `reported_attributes` Reportable concern method.
      def reported_attributes
        [:body]
      end

      # Public: Overrides the `reported_searchable_content_extras` Reportable concern method.
      def reported_searchable_content_extras
        [author.name]
      end

      def survey_responses_count
        # questions.includes(answers: :user_answers).map(&:answers).flatten.map(&:user_answers).flatten.pluck(:decidim_user_id).uniq.count
        answer_ids = questions.includes(:answers).map(&:answers).flatten.pluck(:id)
        @survey_responses_count ||= UserAnswer.where(decidim_posts_answer_id: answer_ids).distinct.count(:decidim_user_id)
      end

      # Public: Overrides the `comments_have_alignment?` Commentable concern method.
      # Whether the object's comments can have alignment or not. It enables the
      # alignment selector in the add new comment form.
      def comments_have_alignment?
        false
      end

      # Public: Overrides the `comments_have_votes?` Commentable concern method.
      def comments_have_votes?
        true
      end

      def users_to_notify_on_comment_created
        [author]
      end      
    end
  end
end
