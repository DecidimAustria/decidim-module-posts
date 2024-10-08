module Decidim
  module Posts
    class ReactionsCell < Decidim::ViewModel
      include PostCellsHelper
      include ReactionHelper
      include Cell::ViewModel::Partial

      def show
        render :show
      end

      def post
        model
      end

      def grouped_reactions_for(resource)
        resource.reactions.group_by(&:reaction_type)
      end

    end
  end
end