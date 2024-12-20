# frozen_string_literal: true

module Decidim
  module Posts
    class PostHostCell < Decidim::ViewModel
      include Cell::ViewModel::Partial
      include ActiveModel::Conversion
      include PostCellsHelper

      delegate :allowed_to?, to: :controller, prefix: false

      def show
        render :show
      end

      def post
        model
      end

      def post_body
        translated_attribute model.body
      end

      def post_category
        model.category
      end

      # post status / for host post
      # 0 default
      # 1 bearbeitung
      # 2 erledigt

      def post_status
        model.status
      end

      def status_class
        case post_status
          when 0
            nil
          when 1
            'warning'
          when 2
            'success'
          else
            nil
          end
      end

      def post_status_text
        case post_status
          when 1
            I18n.t('decidim.posts.posts.host.status.processing')
          when 2
            I18n.t('decidim.posts.posts.host.status.done')
        end
      end

      def post_highlighted
        model.highlighted
      end

      def post_commentable?
        model.enable_comments?
      end

      def official_post
        participatory_space.admins.exists?(id: post.author.id)
      end

    end
  end
end
