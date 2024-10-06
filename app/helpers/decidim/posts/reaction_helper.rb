# frozen_string_literal: true

module Decidim
  module Posts
    module ReactionHelper
      def reaction_icon(icon_name)
        emojis = {
          "heart": "❤️",
          "laugh": "😂",
          "surprise": "😮",
          "sad": "😢",
          "angry": "😡",
          "like": "👍"
        }

        return "？" unless emojis.key?(icon_name.to_sym)

        emojis[icon_name.to_sym]
      end
    end
  end
end