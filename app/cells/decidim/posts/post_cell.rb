# frozen_string_literal: true

module Decidim
  module Posts
    class PostCell < Decidim::ViewModel
      include PostCellsHelper
      include Cell::ViewModel::Partial

      def show
        render :show
      end

      def post
        model
      end

      def post_body
        post_presenter.body
        # translated_attribute model.body
      end

      def post_presenter
        @post_presenter ||= present(model)
      end

      def post_category
        model.category
      end

      def post_commentable
        model.enable_comments?
      end

       def resource_image_path
        model.attachments.first&.url
      end

      def has_image?
        resource_image_path.present?
      end

    end
  end
end
