# frozen_string_literal: true

module Decidim
  module Posts
    class PostMetaCell < Decidim::ViewModel
      include Cell::ViewModel::Partial
      include Decidim::EndorsableHelper
      def show
        render :show
      end

      def post
        model
      end

      def edit_post_path
        if post.component.manifest_name == "meetings"
          Decidim::EngineRouter.main_proxy(post.component).edit_post_path(post)
        else
          Decidim::EngineRouter.main_proxy(post.component).edit_post_path(post)
        end
      end

      def delete_post_path
        if post.component.manifest_name == "meetings"
          Decidim::EngineRouter.main_proxy(post.component).withdraw_meeting_path(post)
        else
          Decidim::EngineRouter.main_proxy(post.component).post_path(post)
        end
      end

      def delete_method
        if post.component.manifest_name == "meetings"
          :put
        else
          :delete
        end
      end

      def post_editable_by?(user)
        if post.component.manifest_name == "meetings"
          post.authored_by?(user)
        else
          post.editable_by?(current_user)
        end
      end
    end
  end
end
