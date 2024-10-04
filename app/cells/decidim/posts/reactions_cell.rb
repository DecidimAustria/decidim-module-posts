module Decidim
  module Posts
    class ReactionsCell < Decidim::ViewModel
      include PostCellsHelper
      include Cell::ViewModel::Partial

      def show
        render :show
      end

      def meta
        render :meta
      end

      def post
        model
      end

    end
  end
end