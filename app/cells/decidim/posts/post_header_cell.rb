# frozen_string_literal: true

module Decidim
  module Posts
    class PostHeaderCell < Decidim::ViewModel
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
          # use MeetingsController from posts module
          Decidim::EngineRouter.main_proxy(posts_component_for_meeting(post)).edit_meeting_path(post)
        else
          Decidim::EngineRouter.main_proxy(post.component).edit_post_path(post)
        end
      end

      def delete_post_path
        if post.component.manifest_name == "meetings"
          # use MeetingsController from posts module
          Decidim::EngineRouter.main_proxy(posts_component_for_meeting(post)).withdraw_meeting_path(assembly_slug: post.component.participatory_space.slug, component_id: 1, id: post)
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

      def post_editable?
        if post.component.manifest_name == "meetings"
          post.authored_by?(current_user)
        else
          # Don't allow editing of survey posts
          return false if post.category == "survey"
          post.editable_by?(current_user)
        end
      end

      def post_deleteable?
        if post.component.manifest_name == "meetings"
          post.withdrawable_by?(current_user)
        else
          post.deleteable_by?(current_user)
        end
      end

      def show_report_button?
        post.author != current_user && post.class == Decidim::Posts::Post
      end

      def show_translate_button?
        false # disbled for now
      end

      def show_menu?
        show_report_button? || post_editable? || post_deleteable? || show_translate_button?
      end

      private

      def posts_component_for_meeting(meeting)
        @posts_component ||= meeting.component.participatory_space.components.find_by(manifest_name: "posts")
      end
    end
  end
end
