module Decidim
  module Posts
    class ReactionMenuCell < Decidim::ViewModel
      include PostCellsHelper
      include ReactionHelper
      include Cell::ViewModel::Partial

      def show
        render :show
      end

      def styles
        render :styles
      end
      
      def post
        model
      end

      def reaction_types
        ReactionType.order(:position)
      end

    end
  end
end