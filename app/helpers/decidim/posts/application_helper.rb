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

      def posts_component_for_meeting(meeting)
        meeting.component.participatory_space.components.find_by(manifest_name: "posts")
      end

      def category_label(category, posts_settings)
        if category == :host
          translated_attribute(posts_settings.host_category_label_plural).presence || t("decidim.components.posts.filter.host")
        elsif category == :sharecare
          translated_attribute(posts_settings.sharecare_category_label_plural).presence || t("decidim.components.posts.filter.sharecare")
        else
          t("decidim.components.posts.filter.#{category}")
        end
      end

      def category_label_singular(category, posts_settings)
        if category == :host
          translated_attribute(posts_settings.host_category_label_singular).presence || t("decidim.components.posts.filter.host_singular")
        elsif category == :sharecare
          translated_attribute(posts_settings.sharecare_category_label_singular).presence || t("decidim.components.posts.filter.sharecare_singular")
        else
          t("decidim.components.posts.filter.#{category}_singular")
        end
      end
    end
  end
end
