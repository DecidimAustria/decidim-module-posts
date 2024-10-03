# frozen_string_literal: true

module Decidim
  module Posts
    class PostMetadataCell < Decidim::ViewModel
      include Cell::ViewModel::Partial
      include Decidim::EndorsableHelper
      def show
        @time_since_update = time_since_update
        @category_info = category_info
        render :show
      end

      def post
        model
      end

      private

      def time_since_update
        time_difference = Time.now - post.updated_at
        minutes = (time_difference / 60).to_i
        hours = (time_difference / 3600).to_i
        days = (time_difference / 86400).to_i
        months = (time_difference / 2592000).to_i # Approximate month duration
        years = (time_difference / 31536000).to_i

        if minutes < 60
          "#{minutes} Min."
        elsif hours < 24
          "#{hours} St."
        elsif days < 30
          "#{days} Tag"
        elsif months < 12
          "#{months} Monat"
        else
          "#{years} Jahr"
        end
      end

      def category_info
        filters = [
          { filter: 'post', icon: 'home-5-line' },
          { filter: 'sharecare', icon: 'shake-hands-line' },
          { filter: 'calendar', icon: 'calendar-line' },
          { filter: 'survey', icon: 'draft-line' },
          { filter: 'host', icon: 'home-gear-line' }
        ]

        current_filter = filters.find { |f| f[:filter] == post.category }
        {
          icon: current_filter[:icon],
          label: t("decidim.components.posts.filter.#{current_filter[:filter]}")
        }
      end

    end
  end
end
