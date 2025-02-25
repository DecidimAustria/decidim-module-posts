# frozen_string_literal: true

module Decidim
  module Posts
    class MeetingCell < Decidim::ViewModel
      include PostCellsHelper
      include Decidim::Meetings::MeetingCellsHelper
      include Cell::ViewModel::Partial

      def show
        render :show
      end

      def meeting
        model
      end

      def meeting_author
        model.decidim_author_id
      end

      def meeting_title
        translated_attribute model.title
      end

      def meeting_description
        simple_format(meeting_presenter.description(links: true))
      end

      def meeting_presenter
        @meeting_presenter ||= present(model)
      end

      def meeting_address
        model.address
      end

      def meeting_location
        translated_attribute model.location
      end

      def comments_enabled
        model.comments_enabled?
      end

    end
  end
end
