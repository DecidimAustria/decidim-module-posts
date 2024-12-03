# frozen_string_literal: true

module Decidim
  module Posts
    module ContentBlocks
      class PostsCell < Decidim::ViewModel
        include Cell::ViewModel::Partial
        include PostCellsHelper
        def show
          @posts = Decidim::Posts::Post
                   .where(decidim_component_id: component_id)
                   .filter_category(params[:filter_post_category])
                   .order(created_at: :desc)
                   .limit(6)
          extra_context = {
            current_component: component,
            current_organization: component.organization,
            current_user:,
            current_participatory_space: component.participatory_space
          }
          # @form = form(Decidim::Posts::PostForm).from_params(params, extra_context)
          render :show
        end

        def decidim_feeds
          Decidim::EngineRouter.main_proxy(component)
        end

        def posts_path
          decidim_feeds.posts_path
        end

        private

        def component_id
          @component_id ||= model.settings.try(:component_id)
        end

        def component
          @component ||= Decidim::Component.find(component_id)
        end

        # def post_creation_params
        #   params[:post]
        # end
      end
    end
  end
end
